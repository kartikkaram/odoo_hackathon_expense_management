import { asyncHandler } from "../../utils/asyncHandler.js";
import { Expense } from "../../models/expense.model.js";
import { apiResponse } from "../../utils/apiResponse.js";

const deleteExpense = asyncHandler(async (req, res) => {
  const expenseId = req.params.id;
  const userId = req.user.id;

  const expense = await Expense.findById(expenseId);
  if (!expense)
    return res
      .status(404)
      .json(new apiResponse(404, { message: "Expense not found" }));

  if (expense.employee.toString() !== userId && req.user.role !== "Admin") {
    return res.status(403).json(
      new apiResponse(403, {
        message: "Not authorized to delete this expense",
      })
    );
  }

  if (expense.status !== "Pending") {
    return res.status(400).json(
      new apiResponse(400, {
        message: "Only pending expenses can be deleted",
      })
    );
  }
  await expense.deleteOne();
  return res
    .status(200)
    .json(
      new apiResponse(200, `Expense deleted successfully`)
    );
});

export { deleteExpense };
