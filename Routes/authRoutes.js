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
} = require("../Validators/authValidators");

const router = Router();

router.route("/register").post(registerValidator, register);
router.route("/login").post(loginValidator, login);
router.route("/refresh").post(refresh);
router.route("/logout").post(logout);
router.route("/forget-password").post(forgetPassword);
router.route("/verify-code").post(verifyResetCode);
router.route("/verify-email").post(emailVerified);
router.route("/resend-verify-code").post(resendVerificationCode);

module.exports = router;
