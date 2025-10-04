import User from "../../models/user.model.js";
import { apiResponse } from "../../utils/apiResponse.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

const getCompanyManagers = asyncHandler(async (req, res) => {
  const admin = req.user;

  const managers = await User.find({
    company: admin.company,
    role: "Manager",
  }).select("-password -refreshToken -accessToken");

  return res
    .status(200)
    .json(new apiResponse(200, managers, "All managers of your company fetched successfully"));
});

export { getCompanyManagers };
