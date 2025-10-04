import { asyncHandler } from "../../utils/asyncHandler.js";
import { Expense } from "../../models/expense.model.js";
import { apiResponse } from "../../utils/apiResponse.js";

const overrideExpense = asyncHandler(async (req, res) => {
  if (req.user.role !== "Admin")
    return res
      .status(403)
      .json(new apiResponse(403, { message: "Access denied" }));

  const expenseId = req.params.id;
  const { newStatus, comment } = req.body;

  const expense = await Expense.findById(expenseId);
  if (!expense)
    return res
      .status(404)
      .json(new apiResponse(404, { message: "Expense not found" }));

  expense.status = newStatus;
  expense.approvals.push({
    approver: req.user.id,
    step: expense.currentStep,
    status: newStatus,
    comment,
    decidedAt: new Date(),
  });

  await expense.save();
  return res
    .status(200)
    .json(
      new apiResponse(200, { expense }, `Expense overridden to ${newStatus}`)
    );
});

export { overrideExpense };
