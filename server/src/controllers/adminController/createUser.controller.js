import User from "../../models/user.model.js";
import { apiError } from "../../utils/apiError.js";
import { apiResponse } from "../../utils/apiResponse.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { generateRandomPassword } from "../../utils/generatePassword.js";
import { sendAccountCreationEmail } from "../../utils/mailer.js";


const createUser = asyncHandler(async (req, res) => {
  const { username, email, role = "Employee", manager = null, fromEmail } = req.body;
  const adminId = req.user._id;

  const admin = await User.findById(adminId);

  if (![username, email].every(Boolean)) {
    throw new apiError(400, "Username and email are required");
  }

  // Check for existing user
  const existingUser = await User.findOne({
    $or: [{ username: username.toLowerCase() }, { email: email.toLowerCase() }],
  });

  if (existingUser) {
    throw new apiError(400, "User with same email or username already exists");
  }

  // Generate random password
  const password = generateRandomPassword();

  // Create user
  const user = await User.create({
    username: username.toLowerCase(),
    email: email.toLowerCase(),
    password, // hashed automatically by schema
    role,
    manager,
    company: admin.company,
  });

  // Send password email
  try {
    await sendAccountCreationEmail(email, fromEmail, password);
  } catch (error) {
    // Optional: delete user if email fails
    await User.findByIdAndDelete(user._id);
    throw new apiError(500, "User created but failed to send email. User deleted.");
  }

  const createdUser = await User.findById(user._id).select("-password -refreshToken");

  return res
    .status(201)
    .json(new apiResponse(201, createdUser, "User created successfully and email sent"));
});

export { createUser };
