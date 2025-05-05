const { body, param } = require("express-validator");
const validatorMiddlewares = require("../Middlewares/validatorMiddlewares");

// Validator for changing a user's role
exports.changeUserRoleValidator = [
  param("id").isMongoId().withMessage("Invalid User ID").bail(),
  body("role")
    .notEmpty()
    .withMessage("Role is required")
    .bail()
    .isString()
    .withMessage("Role must be a string")
    .bail()
    .isIn(["admin", "contributor", "creator", "user"])
    .withMessage("Invalid role value")
    .bail(),
  validatorMiddlewares,
];
 

// Validator for forcing a password reset
exports.forceResetPasswordValidator = [
  param("id").isMongoId().withMessage("Invalid User ID").bail(),
  validatorMiddlewares,
];

// Validator for toggling email verification
exports.toggleEmailVerificationValidator = [
  param("id").isMongoId().withMessage("Invalid User ID").bail(),
  body("isVerified")
    .notEmpty()
    .withMessage("isVerified is required")
    .bail()
    .isBoolean()
    .withMessage("isVerified must be a boolean value")
    .bail(),
  validatorMiddlewares,
];

// Validator for updating a user's status
exports.updateUserStatusValidator = [
  param("id").isMongoId().withMessage("Invalid User ID").bail(),
  body("status")
    .notEmpty()
    .withMessage("Status is required")
    .bail()
    .isString()
    .withMessage("Status must be a string")
    .bail()
    .isIn(["active", "suspended", "banned"])
    .withMessage("Invalid status value")
    .bail(),
  validatorMiddlewares,
];
