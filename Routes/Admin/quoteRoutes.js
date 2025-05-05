const { Router } = require("express");
const {
  getOneQuote,
  updateQuote,
  deleteQuote,
  getAllQuotes,
  approveQuote,
} = require("../../Controllers/quoteController");

const {
  getQuoteValidator,
  updateQuoteValidator,
  deleteQuoteValidator,
} = require("../../Validators/quoteValidators");

const { verifyJWT } = require("../../Middlewares/verifyJWT");
const { allowTo } = require("../../Middlewares/allowTo");
const {
  setAdminApprovedStatus,
} = require("../../Middlewares/contextInjectors");

const {
  canModifyResource,
} = require("../../Middlewares/authorizationMiddlewares");
const Quote = require("../../Models/quoteModel");

const ROLE = require("../../Data/Roles");

const router = Router();

// Apply JWT verification globally
router.use(verifyJWT);

// Routes for creating and fetching all quotes
router
  .route("/")
  .get(
    allowTo(ROLE.ADMIN, ROLE.CONTRIBUTOR), // Allow admins, contributors
    getAllQuotes
  );

// Routes for fetching, updating, and deleting a specific quote by ID
router
  .route("/:id")
  .get(
    allowTo(ROLE.ADMIN, ROLE.CONTRIBUTOR), // Allow admins, contributors
    getQuoteValidator,
    getOneQuote
  )
  .put(
    [
      allowTo(ROLE.ADMIN, ROLE.CONTRIBUTOR), // Restrict updates to admins and contributors
      updateQuoteValidator,
      canModifyResource(Quote, "Quote", "update"), // Authorization for updates
    ],
    updateQuote
  )
  .delete(
    [
      allowTo(ROLE.ADMIN), // Restrict deletions to admins only
      deleteQuoteValidator,
      canModifyResource(Quote, "Quote", "delete"), // Authorization for deletions
    ],
    deleteQuote
  );

// Route for approving a quote by ID
router.route("/:id/approve").put(
  [
    allowTo(ROLE.ADMIN, ROLE.CONTRIBUTOR), // Restrict approval to admins and contributors only
    updateQuoteValidator,
    setAdminApprovedStatus,
  ],
  approveQuote
);

module.exports = router;
