const { body, param } = require("express-validator");
const slugify = require("slugify");

const validatorMiddlewares = require("../Middlewares/validatorMiddlewares");
const customError = require("../Utils/CustomError");
const Author = require("../Models/authorModel");
const Book = require("../Models/bookModel");

// Validator for creating a new book
exports.createBookValidator = [
  body("title")
    .notEmpty()
    .withMessage("The Book Title is required")
    .trim()
    .bail()
    .custom((value, { req }) => {
      req.body.slug = slugify(value);
      return true;
    }),
  body("slug").notEmpty().withMessage("Slug is required").trim(),
  body("author")
    .notEmpty()
    .withMessage("Author ID is required")
    .isArray()
    .withMessage("Authors should be an array of IDs")
    .bail()
    .isMongoId()
    .withMessage("Invalid Author ID format")
    .bail()
    .custom(async (authors) => {
      const count = await Author.countDocuments({ _id: { $in: authors } });

      if (count !== authors.length) {
        return Promise.reject(
          new customError("One or more authors IDs do not exist.", 400)
        );
      }
      return true;
    }),
  body("publicationDate")
    .notEmpty()
    .withMessage("Publication date is required")
    .isDate()
    .withMessage("Invalid date format"),
  body("genre")
    .isArray()
    .withMessage("Genre is required and should be an array of strings")
    .bail()
    .custom((genres) => genres.every((genre) => typeof genre === "string"))
    .withMessage("Each genre should be a string"),
  body("language").optional().isString().trim(),
  body("pages")
    .optional()
    .isInt({ gt: 0 })
    .withMessage("Pages should be a positive integer"),
  body("isbn")
    .notEmpty()
    .withMessage("ISBN is required")
    .bail()
    .custom(async (value) => {
      const existingBook = await Book.findOne({ isbn: value }).exec();
      if (existingBook) {
        return Promise.reject(new customError("ISBN already exists.", 400));
      }
      return true;
    }),
  body("downloadLinks")
    .optional()
    .isArray()
    .withMessage("Download links should be an array")
    .isURL()
    .withMessage("Download links should be an URL"),
  validatorMiddlewares,
];

// Validator for updating an existing book
exports.updateBookValidator = [
  param("id").isMongoId().withMessage("Invalid Book ID"),
  body("title")
    .optional()
    .trim()
    .bail()
    .custom((value, { req }) => {
      req.body.slug = slugify(value);
      return true;
    }),
  body("slug").optional().trim(),
  body("author")
    .optional()
    .isArray({ min: 1 })
    .withMessage("Authors should be an array of IDs")
    .isArray({ min: 1 })
    .withMessage("Authors should be an array of IDs")
    .isMongoId()
    .withMessage("Invalid Author ID format")
    .bail()
    .custom(async (value) => {
      const count = await Author.countDocuments({ _id: { $in: value } });
      if (count !== value.length) {
        return Promise.reject(
          new customError("One or more authors IDs do not exist.", 400)
        );
      }
    }),
  body("publicationDate")
    .optional()
    .isDate()
    .withMessage("Invalid date format"),
  body("genre")
    .optional()
    .isArray()
    .withMessage("Genre should be an array of strings")
    .bail()
    .custom((genres) => genres.every((genre) => typeof genre === "string"))
    .withMessage("Each genre should be a string"),
  body("language").optional().isString().trim(),
  body("pages")
    .optional()
    .isInt({ gt: 0 })
    .withMessage("Pages should be a positive integer"),
  body("isbn")
    .optional()
    .custom(async (value, { req }) => {
      if (value) {
        const existingBook = await Book.findOne({
          isbn: value,
          _id: { $ne: req.params.id },
        }).exec();
        if (existingBook) {
          return Promise.reject(new customError("ISBN already exists.", 400));
        }
      }
      return true;
    }),
  body("downloadLinks")
    .optional()
    .isArray()
    .withMessage("Download links should be an array")
    .isURL()
    .withMessage("Download links should be an URL"),
  validatorMiddlewares,
];

// Validator for reading a book by ID
exports.getBookValidator = [
  param("id").isMongoId().withMessage("Invalid Book ID"),
  validatorMiddlewares,
];

// Validator for deleting a book by ID
exports.deleteBookValidator = [
  param("id").isMongoId().withMessage("Invalid Book ID"),
  validatorMiddlewares,
];
