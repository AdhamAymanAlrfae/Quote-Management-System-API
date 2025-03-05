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
const { allowTo } = require("../../Middlewares/allowTo");
const {
  handelSubmittedBy,
  statusFilter,
} = require("../../Middlewares/logeUserData");

const router = Router();

router
  .route("/")
  .post(
    verifyJWT,
    allowTo("user"),
    handelSubmittedBy,
    createAuthorValidator,
    createAuthor
  )
  .get( statusFilter, getAllAuthors);
router.route("/:id").get(getAuthorValidator, getOneAuthor);

module.exports = router;
