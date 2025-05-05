const { body } = require("express-validator");
const validatorMiddlewares = require("../Middlewares/validatorMiddlewares");
const User = require("../Models/userModel");
const customError = require("../Utils/CustomError");

exports.registerValidator = [
  body("username")
    .notEmpty()
    .withMessage("Username is required")
    .bail()
    .trim()
    .matches(/^[a-zA-Z0-9_]+$/) // Regex to allow letters, numbers, and underscores
    .withMessage(
      "Username should be alphanumeric and can include underscores (_)."
    )
    .custom(async (value) => {
      const username = await User.findOne({ username: value }).exec();
      if (username) {
        return Promise.reject(
          new customError("The user name is already taken.", 400)
        );
      }
    }),
  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .bail()
    .isEmail()
    .withMessage("Invalid email format")
    .normalizeEmail()
    .custom(async (value) => {
      const email = await User.findOne({ email: value }).exec();
      if (email) {
        return Promise.reject(
          new customError("The email is already used.", 400)
        );
      }
    }),
  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .bail()
    .isLength({ min: 6 })
    .withMessage("Password should be at least 6 characters long")
    .custom((value, { req }) => {
      const confirmPassword = req.body.confirmPassword;
      if (!confirmPassword) {
        return Promise.reject(
          new customError("The confirm passwords is required", 400)
        );
      }
      if (confirmPassword !== value) {
        return Promise.reject(
          new customError("The passwords do not match. Please try again.", 400)
        );
      }
      return true;
    }),
  validatorMiddlewares,
];

exports.loginValidator = [
  body("username")
    .notEmpty()
    .withMessage("Username is required")
    .bail()
    .trim()
    .matches(/^[a-zA-Z0-9_]+$/) // Regex to allow letters, numbers, and underscores
    .withMessage(
      "Username should be alphanumeric and can include underscores (_)."
    ),
  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .bail()
    .isLength({ min: 6 })
    .withMessage("Password should be at least 6 characters long"),
  validatorMiddlewares,
];

// Validator for forget-password (validate email field)
exports.forgetPasswordValidator = [
  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .bail()
    .isEmail()
    .withMessage("Invalid email format")
    .bail(),
  validatorMiddlewares,
];

// Validator for verify-code (validate reset code and maybe email)
exports.verifyResetCodeValidator = [
  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .bail()
    .isEmail()
    .withMessage("Invalid email format")
    .bail(),
  body("resetCode")
    .notEmpty()
    .withMessage("Reset code is required")
    .bail()
    .isNumeric()
    .withMessage("Reset code must be numeric")
    .bail()
    .isLength({ min: 6, max: 6 })
    .withMessage("Reset code must be 6 digits long")
    .bail(),
  validatorMiddlewares,
];

// Validator for verify-email (validate verification code and maybe user ID/email)
exports.verifyEmailValidator = [
  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .bail()
    .isEmail()
    .withMessage("Invalid email format")
    .bail(),
  body("verificationCode")
    .notEmpty()
    .withMessage("Verification code is required")
    .bail()
    .isNumeric()
    .withMessage("Verification code must be numeric")
    .bail()
    .isLength({ min: 6, max: 6 })
    .withMessage("Verification code must be 6 digits long")
    .bail(),
  validatorMiddlewares,
];

// Validator for resend-verify-code (validate email field)
exports.resendVerificationCodeValidator = [
  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .bail()
    .isEmail()
    .withMessage("Invalid email format")
    .bail(),
  validatorMiddlewares,
];
