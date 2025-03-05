const { CronJob } = require("cron");
const AsyncErrorHandler = require("../Utils/AsyncErrorHandler");
const DailyQuote = require("../Models/dailyQuoteModel");
const Quote = require("../Models/quoteModel");
const CustomError = require("../Utils/CustomError");
const { randomQuote } = require("./quoteController");

exports.createDailyQuote = AsyncErrorHandler(async (req, res, next) => {
  const { quoteId, date } = req.body;
  const quote = await Quote.findById(quoteId);
  if (!quote) return next(new CustomError("Quote not found", 404));
  const dailyQuote = await DailyQuote.create({ quote, date });
  res.status(201).json({
    status: "success",
    data: {
      dailyQuote,
    },
  });
});

new CronJob(
  "0 0 * * *", // Runs every day at midnight
  async function () {
    try {
      const today = new Date().toISOString().split("T")[0];

      // Check if a daily quote is already scheduled
      let dailyQuote = await DailyQuote.findOne({ date: today }).populate(
        "quote"
      );


      if (!dailyQuote) {
        // Pick a single random quote if none are scheduled
        const quotes = await Quote.find({}, "_id");

        if (quotes.length > 0) {
          const randomQuote =
            quotes[Math.floor(Math.random() * quotes.length)]._id;

          dailyQuote = await DailyQuote.create({
            date: today,
            quote: randomQuote,
          });
        } else {
          console.log("No quotes available in the database!");
        }
      }
    } catch (error) {
      console.error("Error in cron job:", error);
    }
  }, // onTick
  null, // onComplete
  true, // start
  "UTC+2" // timeZone
);
