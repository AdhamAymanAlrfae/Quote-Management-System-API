const bcrypt = require("bcryptjs");

const User = require("../Models/userModel");
const AsyncErrorHandler = require("../Middlewares/AsyncErrorHandler");
const CustomError = require("../Utils/CustomError");
const { createHash } = require("../Utils/createHash");
const {
  jwtAccessTokenGenerator,
  jwtRefreshTokenGenerator,
} = require("../Utils/jwtTokenGenerator");
const jwt = require("jsonwebtoken");
const emailSender = require("../Utils/emailSender");
const { resetCodeHTML } = require("../Data/resetCodeHTML");
const { registrationCodeHTML } = require("../Data/registrationCodeHTML");
const sanitizeUser = require("../Utils/sanitizeUser");

exports.login = AsyncErrorHandler(async (req, res, next) => {

  const { password, username } = req.body;

  const user = await User.findOne({ username: username }).exec();

  if (!user) {
    return next(
      new CustomError("The Username or Password is Incorrect. Try again.", 401)
    );
  }

  if (!user.password) {
    return next(
      new CustomError(
        "This account was created using a provider. Use that provider to login.",
        401
      )
    );
  }

  // Verify password if the user has one
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return next(
      new CustomError("The Username or Password is Incorrect. Try again.", 401)
    );
  }

  // const refreshToken = jwtRefreshTokenGenerator({ userId: user._id });
  const accessToken = jwtAccessTokenGenerator({
    userId: user._id,
    username: user.username,
    role: user.role,
  });

  const isProduction = process.env.ENV === "production";

  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "Lax" : "Lax",
    maxAge: 30 * 24 * 60 * 60 * 1000,
  });
  // res.cookie("refresh_token", refreshToken, {
  //   httpOnly: true,
  //   secure: isProduction,
  //   sameSite: isProduction ? "None" : "Lax",
  //   maxAge: 7 * 24 * 60 * 60 * 1000,
  // });

  res.status(201).json({
    status: "success",
    data: sanitizeUser(user),
  });
});

exports.register = AsyncErrorHandler(async (req, res, next) => {
  const user = await User.create({
    username: req.body.username,
    email: req.body.email,
    password: req.body.password,
    provider: "credential",
    isVerified: false,
  });
  await user.save();

  const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();
  const hashedCode = createHash(verifyCode);

  const verifyExpiration =
    Date.now() + parseInt(process.env.VERIFY_CODE_EXPIRATION);

  user.verificationCode = hashedCode;
  user.verifyExpiration = verifyExpiration;
  user.isVerified = false;

  await user.save();

  const htmlContent = registrationCodeHTML(verifyCode);

  const success = await emailSender({
    subject: "Verify Email",
    userEmail: user.email,
    html: htmlContent,
  });

  if (!success) {
    return next(
      new CustomError(
        "Failed to send verification email. Please try again.",
        500
      )
    );
  }

  res.status(201).json({
    status: "success",
    message: "Verification email sent successfully!",
  });
});

exports.refresh = AsyncErrorHandler(async (req, res, next) => {
  const refreshToken = req.cookies.refreshToken;

  if (!cookies.refreshToken) {
    return next(
      new CustomError("Refresh token is missing or invalid. Please login again")
    );
  }

  await jwt.verify(
    refreshToken,
    process.env.JWT_REFRESH_TOKEN,
    async (error, decode) => {
      if (error) return next(new CustomError(error.message, 403));
      const user = await User.findById(decode.userId).exec();
      if (!user)
        return next(
          new CustomError("The user for this token is NOT found", 403)
        );
      const accessToken = jwtAccessTokenGenerator({
        userId: user._id,
        username: user.username,
        role: user.role,
      });
      // const isProduction = process.env.ENV === "production";

      // res.cookie("userRole", user.role, {
      //   httpOnly: true,
      //   secure: isProduction,
      //   sameSite: isProduction ? "None" : "Lax",
      //   maxAge: 7 * 24 * 60 * 60 * 1000,
      // });
      res.status(200).json({ status: "success", token: accessToken });
    }
  );
});

exports.logout = AsyncErrorHandler(async (req, res, next) => {
  const cookies = req.cookies;
  if (!cookies.accessToken) {
    return next(new CustomError("You are already logged out", 400));
  }
  res.clearCookie("accessToken");
  res.json({ message: "Cookie cleared successfully" });
});

exports.forgetPassword = AsyncErrorHandler(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email }).exec();

  if (!user) {
    return res.status(200).json({
      status: "success",
      message: "Reset link sent to email!",
    });
  }

  const resetCode = Math.floor(100000 + Math.random() * 900000).toString();

  const hashedCode = createHash(resetCode);

  const resetCodeExpiration =
    Date.now() + parseInt(process.env.RESET_CODE_EXPIRATION);

  user.resetCode = hashedCode;
  user.resetCodeExpiration = resetCodeExpiration;
  user.isVerified = false;

  await user.save();

  const htmlContent = resetCodeHTML(resetCode);

  const success = await emailSender({
    subject: "Password Reset Code",
    userEmail: user.email,
    html: htmlContent,
  });
  if (!success) {
    return next(
      new CustomError("Failed to send email. Please try again.", 500)
    );
  }
  res.status(200).json({
    status: "success",
    message: "Reset link sent to email!",
  });
});

exports.verifyResetCode = AsyncErrorHandler(async (req, res, next) => {
  const { email, resetCode } = req.body;
  const hashedCode = createHash(resetCode);

  const user = await User.findOne({
    email,
    resetCode: hashedCode,
    resetCodeExpiration: { $gt: Date.now() },
  }).exec();

  if (!user) {
    return next(new CustomError("Invalid or expired reset code.", 400));
  }

  user.password = req.body.newPassword;
  user.resetCode = undefined;
  user.resetCodeExpiration = undefined;
  user.isVerified = true;
  await user.save();

  res.status(200).json({
    status: "success",
    message: "Password has been reset successfully",
  });
});

exports.emailVerified = AsyncErrorHandler(async (req, res, next) => {
  const { email, code } = req.body;

  const user = await User.findOne({ email });

  const hashedCode = createHash(code);

  if (!user) return next(new CustomError("User not found.", 404));
  if (user.activeEmail)
    return next(new CustomError("Email is already Verified.", 400));
  if (user.verificationCode !== hashedCode)
    return next(new CustomError("Invalid verification code.", 400));
  if (user.codeExpires < Date.now())
    return next(
      new CustomError(
        "Verification code expired. Please request a new one.",
        400
      )
    );

  // Update user status to isVerified
  user.isVerified = true;
  user.verificationCode = null;
  user.verifyExpiration = null;
  await user.save();

  res.json({
    status: "success",
    message: "Email Verified successfully, you can login now!",
  });
});

exports.resendVerificationCode = AsyncErrorHandler(async (req, res, next) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (!user) return next(new CustomError("User not found.", 404));
  if (user.isVerified)
    return next(new CustomError("Email is already Verified.", 400));

  const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();
  const hashedCode = createHash(verifyCode);

  const verifyExpiration =
    Date.now() + parseInt(process.env.VERIFY_CODE_EXPIRATION);

  user.verificationCode = hashedCode;
  user.verifyExpiration = verifyExpiration;

  await user.save();

  const htmlContent = resetCodeHTML(verifyCode);

  const success = await emailSender({
    subject: "Verify Email",
    userEmail: user.email,
    html: htmlContent,
  });

  if (!success) {
    return next(
      new CustomError(
        "Failed to resend verification email. Please try again.",
        500
      )
    );
  }

  res.json({
    status: "success",
    message: "Verification email sent successfully!",
  });
});
