import Company from "../../models/company.model.js";
import User from "../../models/user.model.js";

import { apiError } from "../../utils/apiError.js";
import { apiResponse } from "../../utils/apiResponse.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

/**
 * Admin Registration Controller
 * - Only used for creating Admin users
 * - Automatically creates a Company document
 */
const userRegistration = asyncHandler(async (req, res) => {
  if (!req.body || Object.keys(req.body).length === 0) {
    throw new apiError(400, "Request body cannot be empty");
  }

  const { username, email, password, companyName, currency, country, role } = req.body;

  if ([username, email, password, companyName, currency, country].some(field => !field || field.trim() === "")) {
    throw new apiError(400, "All fields are required");
  }

  if (role !== "Admin") {
    throw new apiError(403, "This registration is only for Admin users");
  }

  // Check if user already exists
  const existingUser = await User.findOne({
    $or: [{ username: username.toLowerCase() }, { email }],
  });

  if (existingUser) {
    throw new apiError(401, "User with same email or username already exists");
  }

  // Check if company already exists
  let company = await Company.findOne({ name: companyName });
  if (!company) {
    company = await Company.create({
      name: companyName,
      country,
      currency,
    });
  }


  // Create the admin user
  const user = await User.create({
    username: username.toLowerCase(),
    email,
    password: password,
    role: "Admin",
    company: company._id,
  });

  const createdUser = await User.findById(user._id).select("-password -refreshToken");

  if (!createdUser) {
    throw new apiError(400, "Something went wrong while registering");
  }

  return res
    .status(201)
    .json(new apiResponse(201, createdUser, "Admin user registered successfully with company"));
});

export { userRegistration };
