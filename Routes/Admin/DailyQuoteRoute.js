const { Router } = require("express");
const { createDailyQuote } = require("../../Controllers/dailyQuoteController");
const { allowTo } = require("../../Middlewares/allowTo");
const { verifyJWT } = require("../../Middlewares/verifyJWT");
const {createDailyQuoteValidators} = require("../../Validators/DailyQuoteValidators");

const router = Router();

router.post(
  "/",
  verifyJWT,
  allowTo("admin"),
  createDailyQuoteValidators,
  createDailyQuote
);

module.exports = router;
