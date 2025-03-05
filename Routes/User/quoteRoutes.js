const { Router } = require("express");
const {
  createQuote,
  getOneQuote,
  getAllQuotes,
  randomQuote,
} = require("../../Controllers/quoteController");

const {
  createQuoteValidator,
  getQuoteValidator,
} = require("../../Validators/quoteValidators");
const { verifyJWT } = require("../../Middlewares/verifyJWT");
const { allowTo } = require("../../Middlewares/allowTo");
const {
  handelSubmittedBy,
  statusFilter,
  userHandelStatus,
} = require("../../Middlewares/logeUserData");

const { toggleLike } = require("../../Controllers/likeController");

const router = Router();

router
  .route("/")
  .post(
    verifyJWT,
    allowTo("user"),
    handelSubmittedBy,
    userHandelStatus,
    createQuoteValidator,
    createQuote
  )
  .get(statusFilter, getAllQuotes);

router.route("/random").get(randomQuote);

router.route("/:id").get(statusFilter, getQuoteValidator, getOneQuote);

router.route("/:id/like").put(verifyJWT, allowTo("user"), toggleLike);

module.exports = router;
