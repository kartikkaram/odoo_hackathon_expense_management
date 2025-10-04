import { asyncHandler } from "../../utils/asyncHandler.js";
import { Expense } from "../../models/expense.model.js";
import { apiResponse } from "../../utils/apiResponse.js";

const rejectExpense = asyncHandler(async (req, res) => {
  const expenseId = req.params.id;
  const approverId = req.user.id;
  const { comment } = req.body;
 
  const expense = await Expense.findById(expenseId);
  
  if (!expense)
    return res
      .status(404)
      .json(new apiResponse(404, { message: "Expense not found" }));

  if (expense.status !== "Pending")
    return res
      .status(400)
      .json(new apiResponse(400, { message: "Expense already processed" }));

  expense.status = "Rejected";
  expense.approvals.push({
    approver: approverId,
    step: expense.currentStep,
    status: "Rejected",
    comment,
    decidedAt: new Date(),
  });

  await expense.save();
  return res.status(200).json(new apiResponse(200, {expense}, "Expense rejected"));
});

export { rejectExpense };
