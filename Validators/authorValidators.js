const { body, param } = require("express-validator");
const slugify = require("slugify");

const validatorMiddlewares = require("../Middlewares/validatorMiddlewares");
const Book = require("../Models/bookModel");
const customError = require("../Utils/CustomError");

// Validator for creating a new author
exports.createAuthorValidator = [
  body("name")
    .notEmpty()
    .withMessage("The Author Name is required")
    .trim()
    .custom((value, { req }) => {
      req.body.slug = slugify(value);
      return true;
    }),
  body("job").optional().trim(),
  body("submittedBy").notEmpty().withMessage("submittedBy is required"),
  body("bio").optional().trim(),
  body("nationality").optional().trim(),
  body("books")
    .optional()
    .isArray()
    .withMessage("Books should be an array of IDs")
    .bail()
    .isMongoId()
    .withMessage("Invalid Book ID")
    .bail()
    .custom(async (books) => {
      const count = await Book.countDocuments({ _id: { $in: books } });

      if (count !== books.length) {
        return Promise.reject(
          new customError("One or more book IDs do not exist.", 400)
        );
      }

      return true;
    }),
  body("dateOfBirth")
    .optional()
    .isDate()
    .withMessage("Invalid date format"),
  body("dateOfDeath").optional().isDate().withMessage("Invalid date format"),
  body("socialLinks.website")
    .optional()
    .isURL()
    .withMessage("Invalid URL format"),
  body("socialLinks.twitter")
    .optional()
    .isURL()
    .withMessage("Invalid URL format"),
  body("socialLinks.instagram")
    .optional()
    .isURL()
    .withMessage("Invalid URL format"),
  body("socialLinks.other").optional().trim(),
  validatorMiddlewares,
];

// Validator for updating an existing author
exports.updateAuthorValidator = [
  param("id").isMongoId().withMessage("Invalid Author ID"),
  body("name")
    .optional()
    .notEmpty()
    .withMessage("The Author Name is required")
    .trim()
    .custom((value, { req }) => {
      req.body.slug = slugify(value);
      return true;
    }),
  body("job").optional().trim(),
  body("bio").optional().trim(),
  body("nationality").optional().trim(),
  body("books")
    .optional()
    .isArray()
    .withMessage("Books should be an array of IDs")
    .bail()
    .isMongoId()
    .withMessage("Invalid Book ID")
    .bail()
    .custom(async (books) => {
      const count = await Book.countDocuments({ _id: { $in: books } });

      if (count !== books.length) {
        return Promise.reject(
          new customError("One or more book IDs do not exist.", 400)
        );
      }

      return true;
    }),
  body("dateOfBirth").optional().isDate().withMessage("Invalid date format"),
  body("dateOfDeath").optional().isDate().withMessage("Invalid date format"),
  body("socialLinks.website")
    .optional()
    .isURL()
    .withMessage("Invalid URL format"),
  body("socialLinks.twitter")
    .optional()
    .isURL()
    .withMessage("Invalid URL format"),
  body("socialLinks.instagram")
    .optional()
    .isURL()
    .withMessage("Invalid URL format"),
  body("socialLinks.other").optional().trim(),
  validatorMiddlewares,
];

// Validator for reading an author by ID
exports.getAuthorValidator = [
  param("id").isMongoId().withMessage("Invalid Author ID"),
  validatorMiddlewares,
];

// Validator for deleting an author by ID
exports.deleteAuthorValidator = [
  param("id").isMongoId().withMessage("Invalid Author ID"),
  validatorMiddlewares,
];
