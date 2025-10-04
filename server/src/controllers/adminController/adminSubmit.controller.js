// controllers/approval.controller.js (adminSubmit)
import { asyncHandler } from "../../utils/asyncHandler.js";
import { User } from "../../models/user.model.js";
import Expense from "../../models/expense.model.js";
import { ApprovalFlow, Approval } from "../../models/approval.model.js";
import { apiResponse } from "../../utils/apiResponse.js";
import mongoose from "mongoose";

const adminSubmit = asyncHandler(async (req, res) => {
  if (req.user.role !== "Admin")
    return res.status(403).json(new apiResponse(403, null, "Access denied"));

  const expenseId = req.params.id;
  if (!expenseId)
    return res
      .status(400)
      .json(new apiResponse(400, null, "Expense ID required"));

  const expense = await Expense.findById(expenseId);
  if (!expense)
    return res
      .status(404)
      .json(new apiResponse(404, null, "Expense not found"));

  // Allowed body inputs:
  // - mandatoryApprovers: array (either simple array of userIds OR array of { approvers: [userIds] })
  // - enforceSequence: boolean (default true)
  // - name, ruleType, ruleConfig (optional)
  const {
    mandatoryApprovers = null, // optional
    enforceSequence = true,
    name = `Flow for expense ${expenseId}`,
    ruleType = "Percentage", // "Percentage" | "Hybrid" | "Specific"
    ruleConfig = {},
  } = req.body;

  let steps = [];

  if (ruleType === "Percentage" || ruleType === "Hybrid") {
    // follow mandatoryApprovers or fallback to Managers for step 0
    if (Array.isArray(mandatoryApprovers) && mandatoryApprovers.length > 0) {
      // two accepted shapes:
      // ["u1","u2"] -> sequential single-user steps
      // [{ approvers: ["u1","u2"] }, ...] -> multi-approver steps
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

      // validate all provided users belong to the company
      const allUserIds = steps.flatMap((s) => s.approvers);
      const validatedUsers = await User.find({
        _id: { $in: allUserIds },
        company: expense.company,
      });
      if (validatedUsers.length !== allUserIds.length) {
        return res
          .status(400)
          .json(
            new apiResponse(
              400,
              null,
              "Some provided approvers are invalid or belong to another company"
            )
          );
      }
    } else {
      // no mandatory provided -> fallback to company Managers for step 1
      const managers = await User.find({
        company: expense.company,
        role: "Manager",
      });
      if (!managers || managers.length === 0) {
        return res
          .status(400)
          .json(
            new apiResponse(
              400,
              null,
              "No Managers found for company. Provide mandatoryApprovers."
            )
          );
      }
      steps = [{ stepNumber: 1, approvers: managers.map((m) => m._id) }];
    }
  } else {
    // ruleType === "Specific" (or any other non-percentage/hybrid)
    // Assign CFO of the company as the sole approver
    const cfo = await User.findOne({ company: expense.company, role: "CFO" });
    if (!cfo) {
      return res
        .status(400)
        .json(
          new apiResponse(
            400,
            null,
            "No CFO found for company. Cannot assign Specific approver"
          )
        );
    }
    steps = [{ stepNumber: 1, approvers: [cfo._id] }];

    // (Optional) override ruleConfig to reflect Specific behavior
    // ruleConfig.specificRole = "CFO";
  }

  // Create ApprovalFlow & Approval instance (same as previous pattern)
  const flow = await ApprovalFlow.create({
    company: expense.company,
    name,
    steps,
    ruleType,
    ruleConfig,
    enforceSequence,
  });

  // Build Approval.mandatoryApprovers entries with stepIndex
  const approvalEntries = [];
  for (let i = 0; i < steps.length; i++) {
    for (const approverId of steps[i].approvers) {
      approvalEntries.push({
        user: approverId,
        stepIndex: i, // zero-based
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

  // link back to expense (ensure your Expense schema has approvalId or adapt)
  expense.approvalFlow = flow._id;
  expense.approvalId = approvalDoc._id;
  expense.status = "Pending";
  await expense.save();

  // notify initial approvers (those with stepIndex === 0)
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
