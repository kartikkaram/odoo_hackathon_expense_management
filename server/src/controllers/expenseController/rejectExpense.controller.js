import { asyncHandler } from "../../utils/asyncHandler.js";
import { Expense } from "../../models/expense.model.js";
import { apiResponse } from "../../utils/apiResponse.js";
import { apiError } from "../../utils/apiError.js";

const rejectExpense = asyncHandler(async (req, res) => {
  const expenseId = req.params.id;
  const approverId = req.user.id;
  const { comment } = req.body;

  const expense = await Expense.findById(expenseId);

  if (!expense) throw new apiError(404, "Expense not found");

  if (expense.status !== "Pending")
    throw new apiError(400, "Expense already processed");

  expense.status = "Rejected";
  expense.approvals.push({
    approver: approverId,
    step: expense.currentStep,
    status: "Rejected",
    comment,
    decidedAt: new Date(),
  });

  await expense.save();

  return res.status(200).json(
    new apiResponse(200, { expense }, "Expense rejected")
  );
});

export { rejectExpense };
