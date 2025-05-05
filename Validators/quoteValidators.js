const { body, param } = require("express-validator");

const validatorMiddlewares = require("../Middlewares/validatorMiddlewares");
const CustomError = require("../Utils/CustomError");
const Author = require("../Models/authorModel");
const Book = require("../Models/bookModel");
const Category = require("../Models/categoryModel");

// Validator for creating a new quote
exports.createQuoteValidator = [
  body("quote")
    .notEmpty()
    .withMessage("Quote text is required")
    .trim()
    .custom((value, { req }) => {
      if (value) {
        req.body.length = value.length;
      }
      return true;
    }),

  body("author")
    .notEmpty()
    .withMessage("Author ID is required")
    .isMongoId()
    .withMessage("Invalid Author ID format")
    .bail()
    .custom(async (value) => {
      const author = await Author.findById(value);
      if (!author) throw new CustomError("Invalid Author ID", 400);
    }),

  body("book")
    .optional()
    .isMongoId()
    .withMessage("Invalid Book ID format")
    .bail()
    .custom(async (value) => {
      const book = await Book.findById(value);
      if (!book) throw new CustomError("Invalid Book ID", 400);
    }),

  body("media")
    .optional()
    .isArray()
    .withMessage("Media should be an array")
    .bail()
    .custom((mediaItems) =>
      mediaItems.every((item) =>
        ["video", "podcast", "song", "article"].includes(item.type)
      )
    )
    .withMessage(
      "Each media item must have a type of 'video', 'podcast', or 'song'"
    ),

  body("media.*.link")
    .optional()
    .isURL()
    .withMessage("Media link should be a valid URL"),

  body("categories")
    .optional()
    .isArray()
    .withMessage("Categories should be a list of categories"),

  body("categories.*")
    .isMongoId()
    .withMessage("Each category must be a valid MongoDB ID")
    .bail()
    .custom(async (value) => {
      const category = await Category.findById(value);
      if (!category) throw new CustomError("Invalid Category ID", 400);
    }),

  body("tags")
    .optional()
    .isArray()
    .withMessage("Tags should be an array of strings"),

  body("arabicTransliteration").optional().trim(),

  body("length")
    .optional()
    .isInt({ gt: 0 })
    .withMessage("Length should be a positive integer"),

  body("status")
    .optional()
    .isIn(["pending", "approved", "rejected"])
    .withMessage("Status must be 'pending', 'approved', or 'rejected'"),
  body("submittedBy").isMongoId().withMessage("Invalid User ID format"),
  validatorMiddlewares,
];

// Validator for updating an existing quote
exports.updateQuoteValidator = [
  body("quote")
    .optional()
    .notEmpty()
    .withMessage("Quote text cannot be empty")
    .trim()
    .custom((value, { req }) => {
      if (value) {
        req.body.length = value.length;
      }
      return true;
    }),

  body("author")
    .optional()
    .isMongoId()
    .withMessage("Invalid Author ID format")
    .bail()
    .custom(async (value) => {
      const author = await Author.findById(value);
      if (!author) throw new CustomError("Invalid Author ID", 400);
    }),

  body("book")
    .optional()
    .isMongoId()
    .withMessage("Invalid Book ID format")
    .bail()
    .custom(async (value) => {
      const book = await Book.findById(value);
      if (!book) throw new CustomError("Invalid Book ID", 400);
    }),

  body("media")
    .optional()
    .isArray()
    .withMessage("Media should be an array")
    .bail()
    .custom((mediaItems) =>
      mediaItems.every((item) =>
        ["video", "podcast", "song", "article"].includes(item.type)
      )
    )
    .withMessage(
      "Each media item must have a type of 'video', 'podcast', or 'song'"
    ),

  body("media.*.link")
    .optional()
    .isURL()
    .withMessage("Media link should be a valid URL"),

  body("categories")
    .optional()
    .isArray()
    .withMessage("Categories should be a list of categories"),

  body("categories.*")
    .isMongoId()
    .withMessage("Each category must be a valid MongoDB ID")
    .custom(async (value) => {
      const category = await Category.findById(value);
      if (!category) throw new CustomError("Invalid Category ID", 400);
    }),

  body("tags")
    .optional()
    .isArray()
    .withMessage("Tags should be an array of strings"),

  body("arabicTransliteration").optional().trim(),

  body("length")
    .optional()
    .isInt({ gt: 0 })
    .withMessage("Length should be a positive integer"),

  body("status")
    .optional()
    .isIn(["pending", "approved", "rejected"])
    .withMessage("Status must be 'pending', 'approved', or 'rejected'"),

  body("submittedBy")
    .optional()
    .isMongoId()
    .withMessage("Invalid User ID format"),

  validatorMiddlewares,
];

// Validator for reading a quote by ID
exports.getQuoteValidator = [
  param("id").isMongoId().withMessage("Invalid Quote ID format"),
  validatorMiddlewares,
];

// Validator for deleting a quote by ID
exports.deleteQuoteValidator = [
  param("id").isMongoId().withMessage("Invalid Quote ID format"),
  validatorMiddlewares,
];
