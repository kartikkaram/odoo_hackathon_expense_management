import { apiError } from "../../utils/apiError";
import { apiResponse } from "../../utils/apiResponse";
import { asyncHandler } from "../../utils/asyncHandler";




export const verifyEmail = asyncHandler(async (req, res) => {
  const { token } = req.query;

  if (!token) {
    throw new apiError(400, "Token is missing");
  }

  const user = await User.findOne({
    verifyToken: token,
    verifyTokenExpiry: { $gt: Date.now() },
  });

  if (!user) {
    throw new apiError(400, "Token is invalid or expired");
  }

  user.isVerified = true; // 👈 make sure you have this field in schema
  user.verifyToken = undefined;
  user.verifyTokenExpiry = undefined;
  await user.save();

  return res
    .status(200)
    .json(new apiResponse(200, {}, "Email verified successfully"));
});
