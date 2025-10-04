import User from "../models/user.model.js";
import { apiError } from "./apiError.js";

const GenerateAccessAndRefreshTokens = async function (userId) {
  try {
    const user = await User.findById(userId);

    if (!user) {
      throw new apiError(404, "incorrect user_id");
    }

    const accessToken = await user.generateAccessToken();
    const refreshToken = await user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    console.error("Error while generating tokens:", error);
    throw new apiError(
      406,
      "Error while generating access token and refresh token"
    );
  }
};

export { GenerateAccessAndRefreshTokens };
