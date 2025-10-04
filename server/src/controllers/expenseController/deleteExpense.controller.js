import { asyncHandler } from "../../utils/asyncHandler.js";
import { Expense } from "../../models/expense.model.js";
import { apiResponse } from "../../utils/apiResponse.js";
import { apiError } from "../../utils/apiError.js";

const deleteExpense = asyncHandler(async (req, res) => {
  const expenseId = req.params.id;
  const userId = req.user.id;

  const expense = await Expense.findById(expenseId);
  if (!expense) throw new apiError(404, "Expense not found");

  if (expense.employee.toString() !== userId && req.user.role !== "Admin") {
    throw new apiError(403, "Not authorized to delete this expense");
  }

  if (expense.status !== "Pending") {
    throw new apiError(400, "Only pending expenses can be deleted");
  }

  await expense.deleteOne();

  return res.status(200).json(
    new apiResponse(200, "Expense deleted successfully")
  );
});

export { deleteExpense };
