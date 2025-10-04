import { asyncHandler } from "../../utils/asyncHandler.js";
import { Expense } from "../../models/expense.model.js";
import { apiResponse } from "../../utils/apiResponse.js";

const getMyExpenses = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  if (!userId) {
    return res
      .status(400)
      .json(new apiResponse(400, { message: "User ID is required" }));
  }

  const expenses = await Expense.find({ employee: userId }).sort({
    createdAt: -1,
  });
  return res
    .status(200)
    .json(
      new apiResponse(200, { expenses }, "Expenses retrieved successfully")
    );
});

export { getMyExpenses };
