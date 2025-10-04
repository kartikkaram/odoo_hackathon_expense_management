import { asyncHandler } from "../../utils/asyncHandler.js";
import { Expense } from "../../models/expense.model.js";
import { apiResponse } from "../../utils/apiResponse.js";
import { apiError } from "../../utils/apiError.js";

const getAllExpenses = asyncHandler(async (req, res) => {
  const companyId = req.params.id;

  if (!companyId) throw new apiError(400, "Company ID is required");

  const expenses = await Expense.find({ company: companyId })
    .populate("employee", "username email role")
    .sort({ createdAt: -1 });

  return res.status(200).json(
    new apiResponse(200, { expenses }, "Expenses retrieved successfully")
  );
});

export { getAllExpenses };
