const bcrypt = require("bcryptjs");

const User = require("../Models/userModel");
const AsyncErrorHandler = require("../Utils/AsyncErrorHandler");
const CustomError = require("../Utils/CustomError");
const { createHash } = require("../Utils/createHash");
const {
  jwtAccessTokenGenerator,
  jwtRefreshTokenGenerator,
} = require("../Utils/jwtTokenGenerator");
const jwt = require("jsonwebtoken");
const emailSender = require("../Utils/emailSender");
const { resetCodeHTML } = require("../Data/resetCodeHTML");

exports.register = AsyncErrorHandler(async (req, res, next) => {
  delete req.body.role;
  delete req.body.active;

  const user = await User.create({
    ...req.body,
    provider: "credential",
    emailVerified: false,
  });
  await user.save();

  const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();

  const hashedCode = createHash(verifyCode);

  const verifyExpiration =
    Date.now() + parseInt(process.env.VERIFY_CODE_EXPIRATION);

  user.verificationCode = hashedCode;
  user.verifyExpiration = verifyExpiration;
  user.emailVerified = false;

  await user.save();

  const htmlContent = resetCodeHTML(verifyCode);

  await emailSender({
    subject: "Verify Email",
    userEmail: user.email,
    html: htmlContent,
  }).catch(console.error);

  res.status(201).json({ status: "success", message: "Email send successes" });
});

exports.login = AsyncErrorHandler(async (req, res, next) => {
  const { password, username } = req.body;

  const user = await User.findOne({ username: username }).exec();

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return next(
      new CustomError("The Username or Password is Incorrect. Try again.", 401)
    );
  }
  const refreshToken = jwtRefreshTokenGenerator({ userId: user._id });

  const accessToken = jwtAccessTokenGenerator({
    userId: user._id,
    username: user.username,
    role: user.role,
  });

  res.cookie("jwt", refreshToken, {
    httpOnly: true,
    secure: process.env.ENV == "production",
    sameSite: "None",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.status(201).json({ status: "success", data: user, token: accessToken });
});

exports.refresh = AsyncErrorHandler(async (req, res, next) => {
  const cookies = req.cookies;
  if (!cookies.jwt) {
    return next(
      new CustomError("Refresh token is missing or invalid. Please login again")
    );
  }
  jwt.verify(
    cookies.jwt,
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
      res.status(200).json({ status: "success", token: accessToken });
    }
  );
});

exports.logout = AsyncErrorHandler(async (req, res, next) => {
  const cookies = req.cookies;
  if (!cookies.jwt) {
    return next(new CustomError("You are already logged out", 400));
  }
  res.clearCookie("jwt", {
    httpOnly: true,
    sameSite: "None",
    secure: process.env.ENV == "production",
  });
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
  user.verified = false;

  await user.save();

  const htmlContent = resetCodeHTML(resetCode);

  emailSender({
    subject: "Password Reset Code",
    userEmail: user.email,
    html: htmlContent,
  }).catch(console.error);

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
  user.verified = true;
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
    return next(new CustomError("Email is already verified.", 400));
  if (user.verificationCode !== hashedCode)
    return next(new CustomError("Invalid verification code.", 400));
  if (user.codeExpires < Date.now())
    return next(
      new CustomError(
        "Verification code expired. Please request a new one.",
        400
      )
    );

  // Update user status to verified
  user.emailVerified = true;
  user.verificationCode = null;
  user.verifyExpiration = null;
  await user.save();

  res.json({
    status: "success",
    message: "Email verified successfully, you can login now!",
  });
});

exports.resendVerificationCode = AsyncErrorHandler(async (req, res, next) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (!user) return next(new CustomError("User not found.", 404));
  if (user.emailVerified)
    return next(new CustomError("Email is already verified.", 400));

  const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();
  const hashedCode = createHash(verifyCode);
  const verifyExpiration =
    Date.now() + parseInt(process.env.VERIFY_CODE_EXPIRATION);

  user.verificationCode = hashedCode;
  user.verifyExpiration = verifyExpiration;
  await user.save();

  const htmlContent = resetCodeHTML(verifyCode);

  await emailSender({
    subject: "Verify Email",
    userEmail: user.email,
    html: htmlContent,
  }).catch(console.error);

  res.json({
    status: "success",
    message: "Verification code sent successfully",
  });
});
