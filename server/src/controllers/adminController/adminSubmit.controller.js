// controllers/approval.controller.js (adminSubmit)
import { asyncHandler } from "../../utils/asyncHandler.js";
import { User } from "../../models/user.model.js";
import Expense from "../../models/expense.model.js";
import { ApprovalFlow, Approval } from "../../models/approval.model.js";
import { apiResponse } from "../../utils/apiResponse.js";
import { apiError } from "../../utils/apiError.js";
import mongoose from "mongoose";

const adminSubmit = asyncHandler(async (req, res) => {
  if (req.user.role !== "Admin")
    throw new apiError(403, "Access denied");

  const expenseId = req.params.id;
  if (!expenseId) throw new apiError(400, "Expense ID required");

  const expense = await Expense.findById(expenseId);
  if (!expense) throw new apiError(404, "Expense not found");

  const {
    mandatoryApprovers = null,
    enforceSequence = true,
    name = `Flow for expense ${expenseId}`,
    ruleType = "Percentage",
    ruleConfig = {},
  } = req.body;

  let steps = [];

  if (ruleType === "Percentage" || ruleType === "Hybrid") {
    if (Array.isArray(mandatoryApprovers) && mandatoryApprovers.length > 0) {
      if (
        typeof mandatoryApprovers[0] === "string" ||
        mongoose.isValidObjectId(mandatoryApprovers[0])
      ) {
        steps = mandatoryApprovers.map((uid, idx) => ({
          stepNumber: idx + 1,
          approvers: [mongoose.Types.ObjectId(uid)],
        }));
      } else {
        steps = mandatoryApprovers.map((s, idx) => ({
          stepNumber: idx + 1,
          approvers: (Array.isArray(s.approvers) ? s.approvers : []).map((u) =>
            mongoose.Types.ObjectId(u)
          ),
        }));
      }

      const allUserIds = steps.flatMap((s) => s.approvers);
      const validatedUsers = await User.find({
        _id: { $in: allUserIds },
        company: expense.company,
      });
      if (validatedUsers.length !== allUserIds.length) {
        throw new apiError(
          400,
          "Some provided approvers are invalid or belong to another company"
        );
      }
    } else {
      const managers = await User.find({
        company: expense.company,
        role: "Manager",
      });
      if (!managers || managers.length === 0) {
        throw new apiError(
          400,
          "No Managers found for company. Provide mandatoryApprovers."
        );
      }
      steps = [{ stepNumber: 1, approvers: managers.map((m) => m._id) }];
    }
  } else {
    const cfo = await User.findOne({ company: expense.company, role: "CFO" });
    if (!cfo) {
      throw new apiError(
        400,
        "No CFO found for company. Cannot assign Specific approver"
      );
    }
    steps = [{ stepNumber: 1, approvers: [cfo._id] }];
  }

  const flow = await ApprovalFlow.create({
    company: expense.company,
    name,
    steps,
    ruleType,
    ruleConfig,
    enforceSequence,
  });

  const approvalEntries = [];
  for (let i = 0; i < steps.length; i++) {
    for (const approverId of steps[i].approvers) {
      approvalEntries.push({
        user: approverId,
        stepIndex: i,
        status: "Pending",
      });
    }
  }

  const approvalDoc = await Approval.create({
    expense: expense._id,
    approvalFlow: flow._id,
    primaryManager: req.user.id,
    mandatoryApprovers: approvalEntries,
    enforceSequence,
    currentStepIndex: 0,
    overallStatus: "Pending",
  });

  expense.approvalFlow = flow._id;
  expense.approvalId = approvalDoc._id;
  expense.status = "Pending";
  await expense.save();

  return res
    .status(200)
    .json(
      new apiResponse(
        200,
        { expense, flow, approval: approvalDoc },
        "Approval flow created"
      )
    );
});

export { adminSubmit };
