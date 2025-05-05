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
const {
  handelSubmittedBy,
  statusFilter,
  handleStatusByRole,
} = require("../../Middlewares/contextInjectors");

const reviewRoutes = require("./reviewRoutes"); 

const router = Router(); 

router
  .route("/")
  .post(
    verifyJWT,
    handelSubmittedBy,
    handleStatusByRole,
    createBookValidator,
    createBook
  )
  .get(statusFilter, getAllBooks);

router.route("/:id").get(statusFilter, getBookValidator, getOneBook);

router.use("/:bookId/reviews", reviewRoutes);

module.exports = router;
