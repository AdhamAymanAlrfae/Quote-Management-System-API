const { body, param } = require("express-validator");
const bcrypt = require("bcryptjs");

const validatorMiddlewares = require("../Middlewares/validatorMiddlewares");
const customError = require("../Utils/CustomError");
const User = require("../Models/userModel");

// Validator for creating a new user
exports.createUserValidator = [
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
      const username = await User.findOne({ username: value });
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
  body("submittedQuotes")
    .optional()
    .isArray()
    .withMessage("Submitted Quotes should be an array")
    .bail()
    .custom((quotes) =>
      quotes.every((quote) => mongoose.Types.ObjectId.isValid(quote))
    )
    .withMessage("Each submitted quote ID should be a valid ObjectId"),
  body("boards")
    .optional()
    .isArray()
    .withMessage("Boards should be an array")
    .bail()
    .custom((boards) =>
      boards.every((board) => mongoose.Types.ObjectId.isValid(board))
    )
    .withMessage("Each board ID should be a valid ObjectId"),
  body("role")
    .optional()
    .isIn(["admin", "contributor", "user", "creator"])
    .withMessage("Role is NOT valid"),
  validatorMiddlewares,
];

// Validator for updating an existing user
exports.updateUserValidator = [
  param("id").isMongoId().withMessage("Invalid User ID"),
  body("username")
    .optional()
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
    .optional()
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
  body("submittedQuotes")
    .optional()
    .isArray()
    .withMessage("Submitted Quotes should be an array")
    .bail()
    .custom((quotes) =>
      quotes.every((quote) => mongoose.Types.ObjectId.isValid(quote))
    )
    .withMessage("Each submitted quote ID should be a valid ObjectId"),
  body("boards")
    .optional()
    .isArray()
    .withMessage("Boards should be an array")
    .bail()
    .custom((boards) =>
      boards.every((board) => mongoose.Types.ObjectId.isValid(board))
    )
    .withMessage("Each board ID should be a valid ObjectId"),
  body("role")
    .optional()
    .isIn(["admin", "contributor", "user", "creator"])
    .withMessage("Role is NOT valid"),
  validatorMiddlewares,
];

// Validator for reading a user by ID
exports.getUserValidator = [
  param("id").isMongoId().withMessage("Invalid User ID"),
  validatorMiddlewares,
];

// Validator for deleting a user by ID
exports.deleteUserValidator = [
  param("id").isMongoId().withMessage("Invalid User ID"),
  validatorMiddlewares,
];

// Validator for change password a user
exports.changePasswordValidator = [
  param("id").isMongoId().withMessage("Invalid User ID"),
  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 6 })
    .withMessage("Password should be at least 6 characters long")
    .custom(async (value, { req }) => {
      const user = await User.findById(req.params.id).exec();
      const confirmPassword = req.body.confirmPassword;
      const currentPassword = req.body.currentPassword;

      if (!currentPassword) {
        return Promise.reject(
          new customError("The current passwords is required", 400)
        );
      }

      const checker = await bcrypt.compare(currentPassword, user.password);

      if (!checker) {
        return Promise.reject(
          new customError(
            "The current password is incorrect. Please try again.",
            400
          )
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

exports.updateLogeUserValidator = [
  param("id").isMongoId().withMessage("Invalid User ID"),
  body("username")
    .optional()
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
    .optional()
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
  validatorMiddlewares,
];
