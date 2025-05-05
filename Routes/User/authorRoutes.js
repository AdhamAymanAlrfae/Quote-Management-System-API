const { Router } = require("express");
const {
  createAuthor,
  getOneAuthor,
  getAllAuthors,
} = require("../../Controllers/authorController");

const {
  createAuthorValidator,
  getAuthorValidator,
} = require("../../Validators/authorValidators");
const { verifyJWT } = require("../../Middlewares/verifyJWT");
const {
  handelSubmittedBy,
  statusFilter,
  handleStatusByRole,
} = require("../../Middlewares/contextInjectors");


const router = Router();

router
  .route("/")
  .post(
    verifyJWT,
    handelSubmittedBy,
    handleStatusByRole,
    createAuthorValidator,
    createAuthor
  )
  .get(statusFilter, getAllAuthors);
  
router.route("/:id").get(statusFilter, getAuthorValidator, getOneAuthor);

module.exports = router;
