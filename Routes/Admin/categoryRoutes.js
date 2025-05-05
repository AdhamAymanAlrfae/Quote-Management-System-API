const { Router } = require("express");
const {
  getOneCategory,
  getAllCategories,
  updateCategory,
  deleteCategory,
  approveCategory, // Added approveCategory
} = require("../../Controllers/categoryController");

const {
  getCategoryValidator,
  updateCategoryValidator,
  deleteCategoryValidator,
} = require("../../Validators/categoryValidators");

const { verifyJWT } = require("../../Middlewares/verifyJWT");
const { allowTo } = require("../../Middlewares/allowTo");
const {
  canModifyResource,
} = require("../../Middlewares/authorizationMiddlewares");
const {
  setAdminApprovedStatus,
} = require("../../Middlewares/contextInjectors");
const Category = require("../../Models/categoryModel");

const ROLES = require("../../Data/Roles");

const router = Router();

// Apply JWT verification globally
router.use(verifyJWT);

// Routes for creating and fetching all categories
router
  .route("/")
  .get(
    allowTo(ROLES.ADMIN, ROLES.CONTRIBUTOR),
    getAllCategories
  );

// Routes for fetching, updating, and deleting a specific category by ID
router
  .route("/:id")
  .get(
    allowTo(ROLES.ADMIN, ROLES.CONTRIBUTOR),
    getCategoryValidator,
    getOneCategory
  )
  .put(
    [
      allowTo(ROLES.ADMIN, ROLES.CONTRIBUTOR), // Restrict updates to admins and contributors
      updateCategoryValidator,
      canModifyResource(Category, "Category", "update"), // Authorization for updates
    ],
    updateCategory
  )
  .delete(
    [
      allowTo(ROLES.ADMIN), // Restrict deletions to admins only
      deleteCategoryValidator,
      canModifyResource(Category, "Category", "delete"), // Authorization for deletions
    ],
    deleteCategory
  );

// Route for approving a category by ID
router.route("/:id/approve").put(
  [
    allowTo(ROLES.ADMIN, ROLES.CONTRIBUTOR), // Restrict approval to admins and contributors
    setAdminApprovedStatus, // Middleware to set the approved status
  ],
  approveCategory
);

module.exports = router;
