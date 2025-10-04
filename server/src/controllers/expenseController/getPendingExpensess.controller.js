import { asyncHandler } from "../../utils/asyncHandler.js";
import { User } from "../../models/user.model.js";
import { Expense } from "../../models/expense.model.js";
import { apiResponse } from "../../utils/apiResponse.js";

const getPendingExpenses = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const user = await User.findById(userId);

  // Managers see pending of their direct employees
  let filter = {};

  if (user.role === "Manager" || user.role === "Admin") {
    filter = { status: "Pending" };
  } else {
    return res
      .status(403)
      .json(new apiResponse(403, { message: "Access denied" }));
  }

  const expenses = await Expense.find(filter)
    .populate("employee", "username email")
    .sort({ createdAt: -1 });

  return res
    .status(200)
    .json(
      new apiResponse(
        200,
        { expenses },
        "Pending Expenses retrieved successfully"
      )
    );
});

export { getPendingExpenses };
