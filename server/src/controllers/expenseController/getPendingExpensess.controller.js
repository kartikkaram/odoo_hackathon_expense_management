import { asyncHandler } from "../../utils/asyncHandler.js";
import User  from "../../models/user.model.js";
import { Expense } from "../../models/expense.model.js";
import { apiResponse } from "../../utils/apiResponse.js";
import { apiError } from "../../utils/apiError.js";

const getPendingExpenses = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const user = await User.findById(userId);

  if (!user) throw new apiError(404, "User not found");

  // Managers or Admins see pending expenses
  let filter = {};
  if (user.role === "Manager" || user.role === "Admin") {
    filter = { status: "Pending" };
  } else {
    throw new apiError(403, "Access denied");
  }

  const expenses = await Expense.find(filter)
    .populate("employee", "username email")
    .sort({ createdAt: -1 });

  return res.status(200).json(
    new apiResponse(
      200,
      { expenses },
      "Pending expenses retrieved successfully"
    )
  );
});

export { getPendingExpenses };
