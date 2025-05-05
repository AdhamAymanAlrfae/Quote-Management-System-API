const { Router } = require("express");
const {
  getOneBook,
  getAllBooks,
  updateBook,
  deleteBook,
  approveBook,
} = require("../../Controllers/bookController");

const {
  getBookValidator,
  updateBookValidator,
  deleteBookValidator,
} = require("../../Validators/bookValidators");

const { verifyJWT } = require("../../Middlewares/verifyJWT");
const { allowTo } = require("../../Middlewares/allowTo");
const {
  setAdminApprovedStatus,
} = require("../../Middlewares/contextInjectors");

const {
  canModifyResource,
} = require("../../Middlewares/authorizationMiddlewares");

const Book = require("../../Models/bookModel");

const ROLES = require("../../Data/Roles");

const router = Router();

// Apply JWT verification globally
router.use(verifyJWT);

// Routes for fetching all books
router.route("/").get(
  allowTo(ROLES.ADMIN, ROLES.CONTRIBUTOR), // Allow admins and contributors
  getAllBooks
);

// Routes for fetching, updating, and deleting a specific book by ID
router
  .route("/:id")
  .get(
    allowTo(ROLES.ADMIN, ROLES.CONTRIBUTOR), // Allow admins and contributors
    getBookValidator,
    getOneBook
  )
  .put(
    [
      allowTo(ROLES.ADMIN, ROLES.CONTRIBUTOR), // Restrict updates to admins and contributors
      updateBookValidator,
      canModifyResource(Book, "Book", "update"), // Authorization for updates
    ],
    updateBook
  )
  .delete(
    [
      allowTo(ROLES.ADMIN), // Restrict deletions to admins only
      deleteBookValidator,
      canModifyResource(Book, "Book", "delete"), // Authorization for deletions
    ],
    deleteBook
  );

// Route for approving a book by ID
router.route("/:id/approve").put(
  [
    allowTo(ROLES.ADMIN, ROLES.CONTRIBUTOR), // Restrict approval to admins and contributors only
    updateBookValidator,
    setAdminApprovedStatus,
  ],
  approveBook
);

module.exports = router;
