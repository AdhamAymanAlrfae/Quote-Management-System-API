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
const { userFilter } = require("../../Middlewares/contextInjectors");

const router = Router();

router.use(verifyJWT);

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
router
  .route("/:boardId/quotes")
  .post(addQuotesValidator, addQuotesToBoard)
  .delete(removeQuoteFromBoardValidator, removeQuoteFromBoard);

module.exports = router;
