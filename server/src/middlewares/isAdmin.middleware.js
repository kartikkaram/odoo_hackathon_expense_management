import { asyncHandler } from "../utils/asyncHandler.js";
import { apiError } from "../utils/apiError.js";

// Middleware to allow only Admins
const isAdmin = asyncHandler(async (req, res, next) => {
  if (!req.user) {
    throw new apiError(401, "Unauthorized: user not found");
  }

  if (req.user.role !== "Admin") {
    throw new apiError(403, "Forbidden: Admin access required");
  }

  next();
});

export { isAdmin };
