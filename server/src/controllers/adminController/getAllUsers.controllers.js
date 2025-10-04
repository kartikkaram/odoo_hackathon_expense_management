import User from "../../models/user.model.js";
import { apiResponse } from "../../utils/apiResponse.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

const getCompanyUsers = asyncHandler(async (req, res) => {
    
  const admin = req.user;

  const users = await User.find({ company: admin.company }).select(
    "-password -refreshToken -accessToken"
  );

  return res
    .status(200)
    .json(new apiResponse(200, users, "All users of your company fetched successfully"));
});

export { getCompanyUsers };
