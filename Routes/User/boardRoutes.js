const { Router } = require("express");
const {
  createBoard,
  getOneBoard,
  getAllBoards,
  updateBoard,
  deleteBoard,
  addQuotesToBoard,
  removeQuoteFromBoard,
} = require("../../Controllers/boardController");

const {
  createBoardValidator,
  getBoardValidator,
  updateBoardValidator,
  deleteBoardValidator,
  addQuotesValidator,
  removeQuoteFromBoardValidator,
} = require("../../Validators/boardValidators");

const { verifyJWT } = require("../../Middlewares/verifyJWT");
const { allowTo } = require("../../Middlewares/allowTo");
const { userFilter } = require("../../Middlewares/logeUserData");

const router = Router();

router.use(verifyJWT, allowTo("user"));

router
  .route("/")
  .post(createBoardValidator, createBoard)
  .get(userFilter, getAllBoards);

router
  .route("/:id")
  .get(userFilter, getBoardValidator, getOneBoard)
  .put(updateBoardValidator, updateBoard)
  .delete(deleteBoardValidator, deleteBoard);

// Quote Management
router.post("/:boardId/quotes", addQuotesValidator, addQuotesToBoard);
router.delete(
  "/:boardId/remove-quote/:quoteId",
  removeQuoteFromBoardValidator,
  removeQuoteFromBoard
);

module.exports = router;
