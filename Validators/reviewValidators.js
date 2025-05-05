const { body, param } = require("express-validator");
const validatorMiddlewares = require("../Middlewares/validatorMiddlewares");
const User = require("../Models/userModel");
const Book = require("../Models/bookModel");
const Review = require("../Models/reviewModel");
const customError = require("../Utils/CustomError");

// Create Review Validator
exports.createReviewValidator = [
  body("book")
    .notEmpty()
    .withMessage("Book ID is required.")
    .bail()
    .isMongoId()
    .withMessage("Invalid Book ID .")
    .bail()
    .custom(async (value, { req }) => {
      
      req.body.user = req.user.id;
      const book = await Book.findById(value);
      if (!book) {
        throw new customError(`No book found with ID: ${value}.`, 404);
      }

      const existingReview = await Review.findOne({
        book: req.body.book,
        user: req.user.id,
      });
      if (existingReview) {
        throw new customError("You have already reviewed this book.", 400);
      }

      return true;
    }),

  body("rating")
    .notEmpty()
    .withMessage("Rating is required.")
    .bail()
    .isInt({ min: 1, max: 10 })
    .withMessage("Rating must be an integer between 1 and 10."),

  body("comment")
    .optional()
    .isString()
    .withMessage("Comment must be a string.")
    .trim()
    .isLength({ max: 500 })
    .withMessage("Comment should not exceed 500 characters."),
  validatorMiddlewares,
];

// Update Review Validator
exports.updateReviewValidator = [
  param("id")
    .isMongoId()
    .withMessage("Invalid Review ID.")
    .bail()
   ,

  body("rating")
    .optional()
    .isInt({ min: 1, max: 10 })
    .withMessage("Rating must be an integer between 1 and 10."),

  body("comment")
    .optional()
    .isString()
    .withMessage("Comment must be a string.")
    .trim()
    .isLength({ max: 500 })
    .withMessage("Comment should not exceed 500 characters."),

  validatorMiddlewares,
];

// Delete Review Validator
exports.deleteReviewValidator = [
  param("id")
    .isMongoId()
    .withMessage("Invalid Review ID.")
    .bail()
    ,

  validatorMiddlewares,
];

// Get Review Validator
exports.getReviewValidator = [
  param("id").isMongoId().withMessage("Invalid Review ID."),

  validatorMiddlewares,
];
