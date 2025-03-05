const { Router } = require("express");
const {
  createBook,
  getOneBook,
  getAllBooks,
  updateBook,
  deleteBook,
  approveBook,
} = require("../../Controllers/bookController");

const {
  createBookValidator,
  getBookValidator,
  updateBookValidator,
  deleteBookValidator,
} = require("../../Validators/BookValidators");
const { verifyJWT } = require("../../Middlewares/verifyJWT");
const { allowTo } = require("../../Middlewares/allowTo");
const {
  handelSubmittedBy,
  adminHandelStatus,
} = require("../../Middlewares/logeUserData");

const router = Router();
router.use(verifyJWT, allowTo("admin"));

router
  .route("/")
  .post(handelSubmittedBy, adminHandelStatus, createBookValidator, createBook)
  .get( getAllBooks);

router
  .route("/:id")
  .get(getBookValidator, getOneBook)
  .put(
    handelSubmittedBy,
    updateBookValidator,
    updateBook
  )
  .delete(deleteBookValidator, deleteBook);

router
  .route("/:id/approve")
  .put(updateBookValidator,adminHandelStatus, updateBook);

module.exports = router;
