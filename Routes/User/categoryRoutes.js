const { Router } = require("express");
const {
  createCategory,
  getOneCategory,
  getAllCategories,
} = require("../../Controllers/categoryController");

const {
  createCategoryValidator,
  getCategoryValidator,
} = require("../../Validators/categoryValidators");

const {
  handelSubmittedBy,
  statusFilter,
  userHandelStatus,
} = require("../../Middlewares/logeUserData");

const { verifyJWT } = require("../../Middlewares/verifyJWT");
const { allowTo } = require("../../Middlewares/allowTo");

const router = Router();

router
  .route("/")
  .post(
    verifyJWT,
    allowTo("user"),
    handelSubmittedBy,
    userHandelStatus,
    createCategoryValidator,
    createCategory
  )
  .get(statusFilter, getAllCategories);

router.route("/:id").get(statusFilter, getCategoryValidator, getOneCategory);

module.exports = router;
