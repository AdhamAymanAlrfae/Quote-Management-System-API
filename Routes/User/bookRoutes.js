const { Router } = require("express");
const {
  createBook,
  getOneBook,
  getAllBooks,
} = require("../../Controllers/bookController");

const {
  createBookValidator,
  getBookValidator,
} = require("../../Validators/bookValidators");
const { verifyJWT } = require("../../Middlewares/verifyJWT");
const { allowTo } = require("../../Middlewares/allowTo");
const {
  handelSubmittedBy,
  statusFilter,
  userHandelStatus,
} = require("../../Middlewares/logeUserData");

const router = Router();

router
  .route("/")
  .post(
    verifyJWT,
    allowTo("user"),
    handelSubmittedBy,
    userHandelStatus,
    createBookValidator,
    createBook
  )
  .get(statusFilter, getAllBooks);
router.route("/:id").get(statusFilter,getBookValidator, getOneBook);

module.exports = router;
