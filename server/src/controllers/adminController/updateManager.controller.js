import User from "../../models/user.model.js";
import { apiError } from "../../utils/apiError.js";
import { apiResponse } from "../../utils/apiResponse.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

const updateUserManager = asyncHandler(async (req, res) => {
  const { userId, managerId } = req.body;

  if (!userId || !managerId) {
    throw new apiError(400, "Both userId and managerId are required");
  }

  const user = await User.findById(userId);
  if (!user) {
    throw new apiError(404, "User not found");
  }

  const manager = await User.findById(managerId);
  if (!manager || manager.role !== "Manager") {
    throw new apiError(400, "Manager not found or not a valid manager");
  }

  if (user.company.toString() !== manager.company.toString()) {
    throw new apiError(400, "User and manager must belong to the same company");
  }

  user.manager = managerId;
  await user.save();

  const updatedUser = await User.findById(user._id).select("-password -refreshToken -accessToken");

  return res
    .status(200)
    .json(new apiResponse(200, updatedUser, "User manager updated successfully"));
});

export { updateUserManager };
