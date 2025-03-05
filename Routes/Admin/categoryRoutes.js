const { Router } = require("express");
const {
  createCategory,
  getOneCategory,
  getAllCategories,
  updateCategory,
  deleteCategory,
} = require("../../Controllers/categoryController");

const {
  createCategoryValidator,
  getCategoryValidator,
  updateCategoryValidator,
  deleteCategoryValidator,
} = require("../../Validators/categoryValidators");

const router = Router();

router
  .route("/")
  .post(createCategoryValidator, createCategory)
  .get(getAllCategories);

router
  .route("/:id")
  .get(getCategoryValidator, getOneCategory)
  .put(updateCategoryValidator, updateCategory)
  .delete(deleteCategoryValidator, deleteCategory);

module.exports = router;
