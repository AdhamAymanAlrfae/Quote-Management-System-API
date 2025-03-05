const { Router } = require("express");
const {
  createBoard,
  getOneBoard,
  getAllBoards,
  updateBoard,
  deleteBoard,
} = require("../../Controllers/boardController");

const {
  createBoardValidator,
  getBoardValidator,
  updateBoardValidator,
  deleteBoardValidator,
} = require("../../Validators/boardValidators");

const router = Router();

router.route("/").post(createBoardValidator, createBoard).get(getAllBoards);

router
  .route("/:id")
  .get(getBoardValidator, getOneBoard)
  .put(updateBoardValidator, updateBoard)
  .delete(deleteBoardValidator, deleteBoard);

module.exports = router;
