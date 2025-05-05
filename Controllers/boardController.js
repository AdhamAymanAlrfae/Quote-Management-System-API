const Board = require("../Models/boardModel");
const Quote = require("../Models/quoteModel");
const AsyncErrorHandler = require("../Middlewares/AsyncErrorHandler");
const CustomError = require("../Utils/CustomError");

const {
  createDoc,
  getOneDoc,
  getAllDoc,
  updateDoc,
  deleteDoc,
} = require("./index");

exports.createBoard = createDoc(Board);

exports.getOneBoard = getOneDoc(Board, "quotes");

exports.getAllBoards = getAllDoc(Board);

exports.updateBoard = updateDoc(Board);

exports.deleteBoard = deleteDoc(Board);

exports.addQuotesToBoard = AsyncErrorHandler(async (req, res, next) => {
  const { boardId } = req.params;
  const { quoteId } = req.body;

  // Validate board existence
  const board = await Board.findOne({ _id: boardId, user: req.user.id }).exec();
  if (!board) {
    return next(new CustomError("Board not found.", 404));
  }

  // Validate quote IDs
  const quote = await Quote.findById(quoteId);
  if (!quote) {
    return next(new CustomError("Quote do not exist.", 400));
  }

  // Check if the quoteId exists in the list
  const isDuplicate = board.quotes.includes(quoteId);
  if (isDuplicate) {
    return next(
      new CustomError("This quote is already added to the board.", 400)
    );
  }

  // Add only non-duplicate quote
  board.quotes.push(quote);

  // Save the updated board
  await board.save();

  res.status(200).json({
    status: "success",
    data: board,
  });
});

exports.removeQuoteFromBoard = AsyncErrorHandler(async (req, res, next) => {
  const { boardId } = req.params;
  const { quoteId } = req.body;

  // Find the board
  const board = await Board.findOne({ _id: boardId, user: req.user.id }).exec();
  if (!board) {
    return next(new CustomError("Board not found.", 404));
  }

  // Check if the quote exists in the board's quotes array
  const quoteIndex = board.quotes.indexOf(quoteId);
  if (quoteIndex === -1) {
    return next(new CustomError("Quote not found in this board.", 400));
  }

  // Remove the quote
  board.quotes.splice(quoteIndex, 1);

  // Save the updated board
  await board.save();

  res.status(200).json({
    status: "success",
    message: "Quote removed from the board successfully.",
    data: board,
  });
});
