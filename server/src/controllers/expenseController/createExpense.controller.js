import { asyncHandler } from "../../utils/asyncHandler.js";
import User  from "../../models/user.model.js";
import { Expense } from "../../models/expense.model.js";
import { apiResponse } from "../../utils/apiResponse.js";
import { apiError } from "../../utils/apiError.js";

const createExpense = asyncHandler(async (req, res) => {
  const user = req.user
  const { amount, currency, category, description, date } = req.body;

  if (!user || !amount || !currency || !category || !date) {
    throw new apiError(400, "All fields are required");
  }


  const newExpense = await Expense.create({
    company: user.company,
    employee: user._id,
    amountOriginal: amount,
    currencyOriginal: currency,
    description,
    category,
    date,
  });

  return res.status(201).json(
    new apiResponse(
      201,
      { expense: newExpense },
      "Expense created successfully"
    )
  );
});

export { createExpense };
