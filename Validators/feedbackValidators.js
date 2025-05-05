const { body, query, param } = require("express-validator");
const validatorMiddlewares = require("../Middlewares/validatorMiddlewares");

exports.createFeedbackValidator = [
  body("feedbackType")
    .isIn(["rating", "bug", "suggestion", "wrong-quote", "other"])
    .withMessage("Invalid feedback type"),
  body("feedbackText")
    .isLength({ min: 5 })
    .withMessage("Feedback text must be at least 5 characters long"),
  body("rating")
    .optional()
    .isInt({ min: 1, max: 5 })
    .withMessage("Rating must be between 1 and 5"),
  body("email").optional().isEmail().withMessage("Email must be valid"),
  body("allowContact")
    .optional()
    .isBoolean()
    .withMessage("AllowContact must be true or false"),
  validatorMiddlewares,
];

exports.getAllFeedbacksValidator = [
  query("feedbackType")
    .optional()
    .isIn(["rating", "bug", "suggestion", "wrong-quote", "other"])
    .withMessage("Invalid feedback type"),
  query("allowContact")
    .optional()
    .isBoolean()
    .withMessage("AllowContact must be true or false"),
  query("rating")
    .optional()
    .isInt({ min: 1, max: 5 })
    .withMessage("Rating must be between 1 and 5"),
  query("startDate")
    .optional()
    .isISO8601()
    .withMessage("Start date must be a valid ISO 8601 date"),
  query("endDate")
    .optional()
    .isISO8601()
    .withMessage("End date must be a valid ISO 8601 date"),
  query("search")
    .optional()
    .isString()
    .withMessage("Search must be a valid string"),
  query("limit")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Limit must be a positive integer"),
  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Page must be a positive integer"),
  validatorMiddlewares,
];

exports.getOneFeedbackValidator = [
  param("id").isMongoId().withMessage("Invalid feedback ID"),
  validatorMiddlewares,
];

exports.deleteFeedbackValidator = [
  param("id").isMongoId().withMessage("Invalid feedback ID"),
  validatorMiddlewares,
];
