const { Router } = require("express");
const { createDailyQuote } = require("../../Controllers/dailyQuoteController");
const { allowTo } = require("../../Middlewares/allowTo");
const { verifyJWT } = require("../../Middlewares/verifyJWT");
const {
  createDailyQuoteValidators,
} = require("../../Validators/DailyQuoteValidators");

const ROLE = require("../../Data/Roles");

const router = Router();

router.post(
  "/",
  verifyJWT,
  allowTo(ROLE.ADMIN, ROLE.CONTRIBUTOR),
  createDailyQuoteValidators,
  createDailyQuote
);

module.exports = router;
