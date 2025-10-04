// controllers/approval.controller.js (approverAction)
import { asyncHandler } from "../../utils/asyncHandler.js";
import  Approval  from "../../models/approval.model.js";
import {Expense} from "../../models/expense.model.js";
import { apiResponse } from "../../utils/apiResponse.js";
import { apiError } from "../../utils/apiError.js";

// Approver acts on the expense approval
const approverAction = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const expenseId = req.params.id;
  const { action, comment } = req.body; // action: 'Approve' or 'Reject'

  if (!["Approve", "Reject"].includes(action)) {
    return res.status(400).json(new apiError(400, "Invalid action"));
  }

  // find approval doc by expense
  const approval = await Approval.findOne({ expense: expenseId });
  if (!approval) {
    return res
      .status(404)
      .json(new apiError(404, "Approval not found for this expense"));
  }

  if (approval.overallStatus !== "Pending") {
    return res
      .status(400)
      .json(new apiError(400, `Approval already ${approval.overallStatus}`));
  }

  // find approver entry
  const idx = approval.mandatoryApprovers.findIndex(
    (a) => a.user.toString() === userId.toString()
  );
  if (idx === -1) {
    return res
      .status(403)
      .json(new apiError(403, "You are not part of the mandatory approvers"));
  }

  const entry = approval.mandatoryApprovers[idx];

  // check whether approver is allowed to act now
  if (approval.enforceSequence && entry.stepIndex !== approval.currentStepIndex) {
    return res
      .status(403)
      .json(new apiError(403, "You cannot act now. Wait for your step."));
  }

  // update the entry
  entry.status = action === "Approve" ? "Approved" : "Rejected";
  entry.comment = comment;
  entry.decidedAt = new Date();
  await approval.save();

  // Step evaluation
  const currentStepIndex = approval.currentStepIndex;
  const entriesOfCurrentStep = approval.mandatoryApprovers.filter(
    (a) => a.stepIndex === currentStepIndex
  );

  // If any rejected → reject overall
  if (entriesOfCurrentStep.some((e) => e.status === "Rejected")) {
    approval.overallStatus = "Rejected";
    await approval.save();

    const expense = await Expense.findById(expenseId);
    if (expense) {
      expense.status = "Rejected";
      await expense.save();
    }

    return res
      .status(200)
      .json(new apiResponse(200, { approval }, "Expense rejected by approver"));
  }

  // If all approved in current step
  if (entriesOfCurrentStep.every((e) => e.status === "Approved")) {
    const nextStepIndex = approval.currentStepIndex + 1;
    const maxStepIndex = Math.max(...approval.mandatoryApprovers.map((a) => a.stepIndex));

    if (nextStepIndex <= maxStepIndex) {
      approval.currentStepIndex = nextStepIndex;
      await approval.save();
      return res
        .status(200)
        .json(
          new apiResponse(
            200,
            { approval },
            `Step ${currentStepIndex} completed; moved to step ${nextStepIndex}`
          )
        );
    } else {
      approval.overallStatus = "Approved";
      await approval.save();

      const expense = await Expense.findById(expenseId);
      if (expense) {
        expense.status = "Approved";
        await expense.save();
      }

      return res
        .status(200)
        .json(new apiResponse(200, { approval }, "Expense fully approved"));
    }
  }

  // Not all approved yet
  return res
    .status(200)
    .json(
      new apiResponse(
        200,
        { approval },
        "Decision recorded; waiting for other approvers in this step"
      )
    );
});

export { approverAction };
