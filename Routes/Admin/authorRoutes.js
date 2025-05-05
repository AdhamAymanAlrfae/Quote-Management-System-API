const { Router } = require("express");

const {
  getOneAuthor,
  updateAuthor,
  deleteAuthor,
  getAllAuthors,
} = require("../../Controllers/authorController");

const { 
  getAuthorValidator,
  updateAuthorValidator,
  deleteAuthorValidator,
} = require("../../Validators/authorValidators");

const { verifyJWT } = require("../../Middlewares/verifyJWT");
const { allowTo } = require("../../Middlewares/allowTo");
const {
  setAdminApprovedStatus,
} = require("../../Middlewares/contextInjectors");

const {
  canModifyResource,
} = require("../../Middlewares/authorizationMiddlewares");
const Author = require("../../Models/authorModel");

const ROLES = require("../../Data/Roles");

const router = Router();

// Apply JWT verification globally
router.use(verifyJWT);

// Routes for fetching all authors
router
  .route("/")
  .get(
    allowTo(ROLES.ADMIN, ROLES.CONTRIBUTOR), 
    getAllAuthors
  );

// Routes for fetching, updating, and deleting a specific author by ID
router
  .route("/:id")
  .get(
    allowTo(ROLES.ADMIN, ROLES.CONTRIBUTOR),
    getAuthorValidator,
    getOneAuthor
  )
  .put(
    [
      allowTo(ROLES.ADMIN, ROLES.CONTRIBUTOR), 
      updateAuthorValidator,
      canModifyResource(Author, "Author", "update"),
    ],
    updateAuthor
  )
  .delete(
    [
      allowTo(ROLES.ADMIN), // Allow only admins
      deleteAuthorValidator,
      canModifyResource(Author, "Author", "delete"),
    ],
    deleteAuthor
  );

// Route for approving an author by ID
router.route("/:id/approve").put(
  [
    allowTo(ROLES.ADMIN, ROLES.CONTRIBUTOR), 
    updateAuthorValidator,
    setAdminApprovedStatus,
  ],
  updateAuthor
);

module.exports = router;
