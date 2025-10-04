// controllers/approval.controller.js (fixed adminSubmit)
import { asyncHandler } from "../../utils/asyncHandler.js";
import User from "../../models/user.model.js";
import {Expense} from "../../models/expense.model.js";
import { ApprovalFlow, Approval } from "../../models/approval.model.js";
import { apiResponse } from "../../utils/apiResponse.js";
import { apiError } from "../../utils/apiError.js";
import mongoose from "mongoose";

const toObjectId = (val) => {
  // If already an ObjectId (or BSON type), return as-is
  if (val && typeof val === "object" && val._bsontype === "ObjectID") return val;
  // If string and valid, create a new ObjectId instance
  if (typeof val === "string" && mongoose.isValidObjectId(val)) return new mongoose.Types.ObjectId(val);
  // otherwise return null (invalid)
  return null;
};

const adminSubmit = asyncHandler(async (req, res) => {
  if (req.user.role !== "Admin") throw new apiError(403, "Access denied");

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
      // Two accepted shapes:
      // 1) ["u1","u2"] -> turns into steps: step0: [u1], step1: [u2] ...
      // 2) [{ approvers: ["u1","u2"]}, { approvers: ["u3"]}] -> each element is a step
      if (typeof mandatoryApprovers[0] === "string" || mongoose.isValidObjectId(mandatoryApprovers[0])) {
        steps = mandatoryApprovers.map((uid, idx) => {
          const oid = toObjectId(uid);
          if (!oid) throw new apiError(400, `Invalid user id provided: ${uid}`);
          return { stepNumber: idx + 1, approvers: [oid] };
        });
      } else {
        steps = mandatoryApprovers.map((s, idx) => {
          const arr = Array.isArray(s.approvers) ? s.approvers : [];
          const approverOids = arr.map((u) => {
            const oid = toObjectId(u);
            if (!oid) throw new apiError(400, `Invalid user id provided in step ${idx + 1}: ${u}`);
            return oid;
          });
          return { stepNumber: idx + 1, approvers: approverOids };
        });
      }

      // Validate that all user ids belong to the same company
      const allUserIds = steps.flatMap((s) => s.approvers);
      const validatedUsers = await User.find({ _id: { $in: allUserIds }, company: expense.company });
      if (validatedUsers.length !== allUserIds.length) {
        throw new apiError(400, "Some provided approvers are invalid or belong to another company");
      }
    } else {
      // fallback to managers
      const managers = await User.find({ company: expense.company, role: "Manager" });
      if (!managers || managers.length === 0) {
        throw new apiError(400, "No Managers found for company. Provide mandatoryApprovers.");
      }
      steps = [{ stepNumber: 1, approvers: managers.map((m) => m._id) }];
    }
  } else {
    // Specific -> assign CFO
    const cfo = await User.findOne({ company: expense.company, role: "CFO" });
    if (!cfo) {
      throw new apiError(400, "No CFO found for company. Cannot assign Specific approver");
    }
    steps = [{ stepNumber: 1, approvers: [cfo._id] }];
  }

  // create flow
  const flow = await ApprovalFlow.create({
    company: expense.company,
    name,
    steps,
    ruleType,
    ruleConfig,
    enforceSequence,
  });

  // build approval entries
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

  // attach to expense (ensure your Expense schema has approvalId or adapt)
  expense.approvalFlow = flow._id;
  expense.approvalId = approvalDoc._id;
  expense.status = "Pending";
  await expense.save();

  return res.status(200).json(new apiResponse(200, { expense, flow, approval: approvalDoc }, "Approval flow created"));
});

export { adminSubmit };
