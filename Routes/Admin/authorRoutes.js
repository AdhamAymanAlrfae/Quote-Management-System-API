const { Router } = require("express");
const {
  createAuthor,
  getOneAuthor,
  updateAuthor,
  deleteAuthor,
  getAllAuthors,
} = require("../../Controllers/authorController");

const {
  createAuthorValidator,
  getAuthorValidator,
  updateAuthorValidator,
  deleteAuthorValidator,
} = require("../../Validators/authorValidators");
const { verifyJWT } = require("../../Middlewares/verifyJWT");
const { allowTo } = require("../../Middlewares/allowTo");
const {
  handelSubmittedBy,
  adminHandelStatus,
  statusFilter,
} = require("../../Middlewares/logeUserData");

const router = Router();
router.use(verifyJWT, allowTo("admin"));
router
  .route("/")
  .post(
    handelSubmittedBy,
    adminHandelStatus,
    createAuthorValidator,
    createAuthor
  )
  .get(getAllAuthors);

router
  .route("/:id")
  .get(getAuthorValidator, getOneAuthor)
  .put(
    verifyJWT,
    allowTo("admin"),
    handelSubmittedBy,
    updateAuthorValidator,
    updateAuthor
  )
  .delete(deleteAuthorValidator, deleteAuthor);

router
  .route("/:id/approve")
  .put(updateAuthorValidator, adminHandelStatus, updateAuthor);

module.exports = router;
