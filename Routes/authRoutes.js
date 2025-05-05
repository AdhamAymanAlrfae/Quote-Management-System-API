const { Router } = require("express");
const {
  register,
  login,
  refresh,
  logout,
  forgetPassword,
  verifyResetCode,
  emailVerified,
  resendVerificationCode,
} = require("../Controllers/authController");

const {
  registerValidator,
  loginValidator,
  forgetPasswordValidator,
  verifyResetCodeValidator,
  verifyEmailValidator,
  resendVerificationCodeValidator,
} = require("../Validators/authValidators");

// Route              | Should validate
// forget-password    | Email field
// verify-code        | Reset code and maybe email
// verify-email       | Verification code and maybe user ID/email
// resend-verify-code | Email

const router = Router();
router.route("/register").post(registerValidator, register);
router.route("/login").post(loginValidator, login);
router.route("/refresh").get(refresh);
router.route("/logout").post(logout);
router.route("/forget-password").post(forgetPasswordValidator, forgetPassword);
router.route("/verify-code").post(verifyResetCodeValidator, verifyResetCode);
router.route("/verify-email").post(verifyEmailValidator, emailVerified);
router
  .route("/resend-verify-code")
  .post(resendVerificationCodeValidator, resendVerificationCode);

module.exports = router;
