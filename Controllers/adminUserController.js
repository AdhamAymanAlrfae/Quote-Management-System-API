const AsyncErrorHandler = require("../Middlewares/AsyncErrorHandler");
const User = require("../Models/userModel");
const CustomError = require("../Utils/CustomError");
const Logger = require("../Utils/logger");
const { createHash } = require("../Utils/createHash");
const emailSender = require("../Utils/emailSender");
const { resetCodeHTML } = require("../Data/resetCodeHTML");

/**
 * Change user's role
 */
exports.changeUserRole = AsyncErrorHandler(async (req, res, next) => {
  const { id } = req.params;
  const { role } = req.body;

  const user = await User.findByIdAndUpdate(id, { role }, { new: true });

  if (!user) {
    throw new CustomError("User not found", 404);
  }

  Logger.info(
    `[ADMIN ACTION] => ${req.user.username} with id: ${req.user.id}, "change-role", targetUserId: ${id}, role: ${role}`
  );
  res.status(200).json({ message: "User role updated successfully", user });
});


/**
 * Force reset password (send reset email)
 */
exports.forceResetPassword = AsyncErrorHandler(async (req, res, next) => {
  const { id } = req.params;

  const user = await User.findById(id);
  if (!user) {
    throw new CustomError("User not found", 404);
  }

  const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
  const hashedCode = createHash(resetCode);

  const resetCodeExpiration =
    Date.now() + parseInt(process.env.RESET_CODE_EXPIRATION);

  user.resetCode = hashedCode;
  user.resetCodeExpiration = resetCodeExpiration;

  await user.save();

  const htmlContent = resetCodeHTML(resetCode);

  const success = await emailSender({
    subject: "Password Reset Code",
    userEmail: user.email,
    html: htmlContent,
  });

  if (!success) {
    throw new CustomError("Failed to send reset code. Please try again.", 500);
  }

  Logger.info(
    `[ADMIN ACTION] => ${req.user.username} with id: ${req.user.id}, "force-reset-password", targetUserId: ${id}`
  );
  res.status(200).json({ message: "Reset password email sent successfully" });
});

/**
 * Toggle email verification (Verify/Unverify)
 */
exports.toggleEmailVerification = AsyncErrorHandler(async (req, res, next) => {
  const { id } = req.params;
  const { isVerified } = req.body;

  const user = await User.findByIdAndUpdate(id, { isVerified }, { new: true });

  if (!user) {
    throw new CustomError("User not found", 404);
  }

  Logger.info(
    `[ADMIN ACTION] => ${req.user.username} with id: ${req.user.id}, "toggle-email-verification", targetUserId: ${id}, isVerified: ${isVerified}`
  );
  res.status(200).json({ message: "Email verification status updated", user });
});

/**
 * Update user's status (Suspend/Ban/Reactivate)
 */
exports.updateUserStatus = AsyncErrorHandler(async (req, res, next) => {
  const { id } = req.params;
  const { status } = req.body;

  const user = await User.findByIdAndUpdate(id, { status }, { new: true });

  if (!user) {
    throw new CustomError("User not found", 404);
  }

  Logger.info(
    `[ADMIN ACTION] => ${req.user.username} with id: ${req.user.id}, "update-status", targetUserId: ${id}, status: ${status}`
  );
  res.status(200).json({ message: "User status updated successfully", user });
});