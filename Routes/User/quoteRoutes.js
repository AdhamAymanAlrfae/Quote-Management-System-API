const { Router } = require("express");
const {
  createQuote,
  getOneQuote,
  getAllQuotes,
  randomQuote,
  getHallOfFame
} = require("../../Controllers/quoteController");

const {
  createQuoteValidator,
  getQuoteValidator,
} = require("../../Validators/quoteValidators");
const { verifyJWT } = require("../../Middlewares/verifyJWT");
const {
  handelSubmittedBy,
  statusFilter,
  handleStatusByRole,
} = require("../../Middlewares/contextInjectors");

const { toggleLike } = require("../../Controllers/likeController");

const router = Router();

router
  .route("/")
  .post(
    verifyJWT,
    handelSubmittedBy,
    handleStatusByRole,
    createQuoteValidator,
    createQuote
  )
  .get(statusFilter, getAllQuotes);

router.route("/random").get(randomQuote);
router.route("/top-submitters").get(getHallOfFame);

router.route("/:id").get(statusFilter, getQuoteValidator, getOneQuote);

router.route("/:id/like").put(verifyJWT, toggleLike);

module.exports = router;
