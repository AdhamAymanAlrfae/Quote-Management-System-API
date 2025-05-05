const { Router } = require("express");
const {
  getTodayDailyQuote,
} = require("../../Controllers/dailyQuoteController");

const router = Router();

router.get("/", getTodayDailyQuote);

module.exports = router;
