import { asyncHandler } from "../../utils/asyncHandler.js";
import { Expense } from "../../models/expense.model.js";
import { apiResponse } from "../../utils/apiResponse.js";

const approveExpense = asyncHandler(async (req, res) => {
  const expenseId = req.params.id;
  const approverId = req.user.id;
  const approverRole = req.user.role;

  // Load expense + approval flow
  const expense = await Expense.findById(expenseId)
    .populate("approvalFlow")
    .populate("employee", "username email");

  if (!expense)
    return res
      .status(404)
      .json(new apiResponse(404, { message: "Expense not found" }));

  if (expense.status !== "Pending")
    return res
      .status(400)
      .json(new apiResponse(400, { message: "Expense already processed" }));

  const flow = expense.approvalFlow;
  if (!flow)
    return res
      .status(400)
      .json(new apiResponse(400, { message: "No approval flow assigned" }));

  //  Get current step info
  const currentStepInfo = flow.steps.find(
    (s) => s.stepNumber === expense.currentStep
  );
  if (!currentStepInfo)
    return res
      .status(400)
      .json(new apiResponse(400, { message: "Invalid current step in flow" }));

  //  Check permission (does this approver match the current step role?)
  if (
    approverRole !== currentStepInfo.approverRole &&
    approverRole !== "Admin"
  ) {
    return res.status(403).json(
      new apiResponse(403, {
        message: "You are not authorized to approve this step",
      })
    );
  }

  expense.status = "Approved";
  expense.approvals.push({
    approver: approverId,
    step: expense.currentStep,
    status: "Approved",
    decidedAt: new Date(),
  });

  await expense.save();

  // Check if there is a next step
  const nextStepExists = flow.steps.some(
    (s) => s.stepNumber === expense.currentStep + 1
  );

  if (nextStepExists) {
    expense.currentStep += 1;
    expense.status = "Pending"; // Still pending overall
    await expense.save();

    return res.status(200).json(
      new apiResponse(200, {
        message: `Approved. Moved to step ${expense.currentStep}`,
        expense,
      })
    );
  } else {
    expense.status = "Approved";
    await expense.save();
  }
  return res
    .status(200)
    .json(new apiResponse(200, { expense }, "Expense fully approved"));
});

export { approveExpense };
