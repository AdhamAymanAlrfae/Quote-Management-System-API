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
  handleStatusByRole,
} = require("../../Middlewares/contextInjectors");

const { verifyJWT } = require("../../Middlewares/verifyJWT");

const router = Router();

router
  .route("/")
  .post(
    verifyJWT,
    handelSubmittedBy,
    handleStatusByRole,
    createCategoryValidator,
    createCategory
  )
  .get(statusFilter, getAllCategories);

router.route("/:id").get(statusFilter, getCategoryValidator, getOneCategory);

module.exports = router;
