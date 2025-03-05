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
