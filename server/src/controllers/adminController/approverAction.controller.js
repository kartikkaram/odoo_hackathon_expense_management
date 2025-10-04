// controllers/approval.controller.js (approverAction)
import { asyncHandler } from "../../utils/asyncHandler.js";
import { Approval } from "../../models/approval.model.js";
import Expense from "../../models/expense.model.js";
import { apiResponse } from "../../utils/apiResponse.js";

// Approver acts on the expense approval
const approverAction = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const expenseId = req.params.id;
  const { action, comment } = req.body; // action: 'Approve' or 'Reject'
  if (!["Approve", "Reject"].includes(action))
    return res.status(400).json(new apiResponse(400, null, "Invalid action"));

  // find approval doc by expense
  const approval = await Approval.findOne({ expense: expenseId });
  if (!approval)
    return res
      .status(404)
      .json(new apiResponse(404, null, "Approval not found for this expense"));
  if (approval.overallStatus !== "Pending")
    return res
      .status(400)
      .json(
        new apiResponse(400, null, `Approval already ${approval.overallStatus}`)
      );

  // find approver entry
  const idx = approval.mandatoryApprovers.findIndex(
    (a) => a.user.toString() === userId.toString()
  );
  if (idx === -1)
    return res
      .status(403)
      .json(
        new apiResponse(
          403,
          null,
          "You are not part of the mandatory approvers for this expense"
        )
      );

  const entry = approval.mandatoryApprovers[idx];

  // check whether approver is allowed to act now
  if (
    approval.enforceSequence &&
    entry.stepIndex !== approval.currentStepIndex
  ) {
    return res
      .status(403)
      .json(
        new apiResponse(
          403,
          null,
          "You cannot act now. Wait for your step to become active."
        )
      );
  }

  // update the entry
  entry.status = action === "Approve" ? "Approved" : "Rejected";
  entry.comment = comment;
  entry.decidedAt = new Date();

  // save the change
  await approval.save();

  // Evaluate the step's result
  // All approvers that have stepIndex === currentStepIndex
  const currentStepIndex = approval.currentStepIndex;
  const entriesOfCurrentStep = approval.mandatoryApprovers.filter(
    (a) => a.stepIndex === currentStepIndex
  );

  // If any 'Rejected' in current step -> reject overall (simple policy). You may change this to percentage-based rules.
  const anyRejected = entriesOfCurrentStep.some((e) => e.status === "Rejected");
  if (anyRejected) {
    approval.overallStatus = "Rejected";
    await approval.save();

    // mark expense rejected too
    const expense = await Expense.findById(expenseId);
    if (expense) {
      expense.status = "Rejected";
      await expense.save();
    }

    return res
      .status(200)
      .json(new apiResponse(200, { approval }, "Expense rejected by approver"));
  }

  // Check if all approvers in current step have Approved
  const allApproved = entriesOfCurrentStep.every(
    (e) => e.status === "Approved"
  );

  if (allApproved) {
    // Move to next step (if exists) or finalize as Approved
    const nextStepIndex = approval.currentStepIndex + 1;
    const maxStepIndex = Math.max(
      ...approval.mandatoryApprovers.map((a) => a.stepIndex)
    );

    if (nextStepIndex <= maxStepIndex) {
      approval.currentStepIndex = nextStepIndex;
      await approval.save();

      // notify next step approvers (those with stepIndex === nextStepIndex)
      // TODO: call notification function here to ping users

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
      // final step completed -> overall approved
      approval.overallStatus = "Approved";
      await approval.save();

      // mark expense as Approved
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

  // Not all have approved yet, but the action was recorded
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
