const { body, param } = require("express-validator");
const validatorMiddlewares = require("../Middlewares/validatorMiddlewares");
const customError = require("../Utils/CustomError");
const User = require("../Models/userModel");
const Quote = require("../Models/quoteModel");
const Board = require("../Models/boardModel");

// Validator for creating a new board
exports.createBoardValidator = [
  body("name")
    .notEmpty()
    .withMessage("Board name is required.")
    .bail()
    .trim()
    .custom(async (value, { req }) => {
      req.body.user = req.user.id;
      const board = await Board.findOne({
        name: value,
        user: req.user.id,
      }).exec();
      if (board)
        return Promise.reject(new customError("Board already exists.", 400));
      return true;
    }),
  body("user")
    .notEmpty()
    .withMessage("User ID is required.")
    .bail()
    .isMongoId()
    .withMessage("Invalid User ID format.")
    .bail()
    .custom(async (value, { req }) => {
      const userExists = await User.findById(value).exec();
      if (req.body.user !== req.user.id) {
        throw new customError(
          "User ID does not match authenticated user.",
          400
        );
      }
      if (!userExists) {
        return Promise.reject(new customError("User does not exist.", 400));
      }
      return true;
    }),
  body("privacy")
    .optional()
    .isIn(["public", "private"])
    .withMessage("Privacy must be either 'public' or 'private'."),
  body("quotes")
    .optional()
    .isArray()
    .withMessage("Quotes should be an array of IDs.")
    .bail()
    .custom(async (quotes) => {
      const count = await Quote.countDocuments({ _id: { $in: quotes } });
      if (count !== quotes.length) {
        return Promise.reject(
          new customError("One or more quote IDs do not exist.", 400)
        );
      }
      return true;
    }),
  validatorMiddlewares,
];

// Validator for updating an existing board
exports.updateBoardValidator = [
  param("id")
    .isMongoId()
    .withMessage("Invalid Board ID.")
    .bail()
    .custom(async (value, { req }) => {
      const board = await Board.findOne({ _id: value, user: req.user.id });
      if (!board) {
        throw new customError(
          "Board not found.",
          404
        );
      }
      return true;
    }),
  body("name")
    .optional()
    .trim()
    .custom(async (value, { req }) => {
      const board = await Board.findOne({
        name: value,
        user: req.user.id,
        _id: { $ne: req.params.id },
      }).exec();
      if (board)
        return Promise.reject(new customError("Board already exists.", 400));
      return true;
    }),
  body("user").not().exists().withMessage("User field cannot be updated."),
  body("privacy")
    .optional()
    .isIn(["public", "private"])
    .withMessage("Privacy must be either 'public' or 'private'."),
  body("quotes")
    .optional()
    .isArray()
    .withMessage("Quotes should be an array of IDs.")
    .bail()
    .custom(async (quotes) => {
      const count = await Quote.countDocuments({ _id: { $in: quotes } });
      if (count !== quotes.length) {
        return Promise.reject(
          new customError("One or more quote IDs do not exist.", 400)
        );
      }
      return true;
    }),
  validatorMiddlewares,
];

// Validator for reading a board by ID
exports.getBoardValidator = [
  param("id")
    .isMongoId()
    .withMessage("Invalid Board ID.")
    .bail()
    .custom(async (value, { req }) => {
      const board = await Board.findOne({ _id: value, user: req.user.id });
      if (!board) {
        throw new customError(
          "Board not found or you do not have permission.",
          404
        );
      }
      return true;
    }),
  validatorMiddlewares,
];

// Validator for deleting a board by ID
exports.deleteBoardValidator = [
  param("id")
    .isMongoId()
    .withMessage("Invalid Board ID.")
    .bail()
    .custom(async (value, { req }) => {
      const board = await Board.findOne({ _id: value, user: req.user.id });
      if (!board) {
        throw new customError(
          "Board not found or you do not have permission.",
          404
        );
      }
      return true;
    }),
  validatorMiddlewares,
];

// Add Quotes Validation
exports.addQuotesValidator = [
  param("boardId")
    .notEmpty()
    .withMessage("Board ID required.")
    .bail()
    .isMongoId()
    .withMessage("Invalid Board ID."),
  body("quoteId")
    .notEmpty()
    .withMessage("Quote ID required.")
    .bail()
    .isMongoId()
    .withMessage("Invalid quote ID."),
  validatorMiddlewares,
];

//Remove Quotes Validation
exports.removeQuoteFromBoardValidator = [
  param("boardId")
    .notEmpty()
    .withMessage("Board ID required.")
    .bail()
    .isMongoId()
    .withMessage("Invalid Board ID."),
  body("quoteId")
    .notEmpty()
    .withMessage("Quote ID required.")
    .bail()
    .isMongoId()
    .withMessage("Invalid quote ID."),
  validatorMiddlewares,
];
