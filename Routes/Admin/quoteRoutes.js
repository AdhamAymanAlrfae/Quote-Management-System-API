const { Router } = require("express");
const {
  createQuote,
  getOneQuote,
  updateQuote,
  deleteQuote,
  getAllQuotes,
} = require("../../Controllers/quoteController");

const {
  createQuoteValidator,
  getQuoteValidator,
  updateQuoteValidator,
  deleteQuoteValidator,
} = require("../../Validators/quoteValidators");
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
  .post(handelSubmittedBy, adminHandelStatus, createQuoteValidator, createQuote)
  .get(getAllQuotes);

router
  .route("/:id")
  .get(getQuoteValidator, getOneQuote)
  .put(
    verifyJWT,
    allowTo("admin"),
    handelSubmittedBy,
    updateQuoteValidator,
    updateQuote
  )
  .delete(deleteQuoteValidator, deleteQuote);

router
  .route("/:id/approve")
  .put(updateQuoteValidator, adminHandelStatus, updateQuote);

module.exports = router;
