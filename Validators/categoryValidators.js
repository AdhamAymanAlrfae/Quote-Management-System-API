const { body, param } = require("express-validator");
const validatorMiddlewares = require("../Middlewares/validatorMiddlewares");
const slugify = require("slugify");

// Validator for creating a new book
exports.createCategoryValidator = [
  body("name")
    .notEmpty()
    .withMessage("The category name is required")
    .trim()
    .custom((value, { req }) => {
      req.body.slug = slugify(value);
      return true;
    }),
  body("slug").notEmpty().withMessage("Slug is required").trim(),
  validatorMiddlewares,
];

// Validator for updating an existing book
exports.updateCategoryValidator = [
  param("id").isMongoId().withMessage("Invalid Category ID"),
  body("name")
    .optional()
    .trim()
    .custom((value, { req }) => {
      req.body.slug = slugify(value);
      return true;
    }),
  body("slug").optional().trim(),
  validatorMiddlewares,
];

// Validator for reading a book by ID
exports.getCategoryValidator = [
  param("id").isMongoId().withMessage("Invalid Category ID"),
  validatorMiddlewares,
];

// Validator for deleting a book by ID
exports.deleteCategoryValidator = [
  param("id").isMongoId().withMessage("Invalid Category ID"),
  validatorMiddlewares,
];
