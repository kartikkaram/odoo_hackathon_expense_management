import { asyncHandler } from "../../utils/asyncHandler.js";
import { User } from "../../models/user.model.js";
import { apiResponse } from "../../utils/apiResponse.js";

const createExpense = asyncHandler(async (req, res) => {
  const userId = req.user.id; // from JWT
  const { amount, currency, category, description, date } = req.body;

  if (!userId || !amount || !currency || !category || !date) {
    return res
      .status(400)
      .json(new apiResponse(400, { message: "All Fields are required" }));
  }

  const user = await User.findById(userId);
  if (!user) {
    return res
      .status(404)
      .json(new apiResponse(404, { message: "User not found" }));
  }

  const newExpense = await Expense.create({
    companyId: user.company,
    employee: userId,
    amountOriginal: amount,
    currencyOriginal: currency,
    description,
    category,
    date,
  });

  return res
    .status(201)
    .json(
      new apiResponse(
        201,
        { expense: newExpense },
        "Expense created successfully"
      )
    );
});

export { createExpense };
