const winston = require("winston");
const TelegramLogger = require("winston-telegram");

const logger = winston.createLogger({
  level: "info", 
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      ),
    }),
  ],
});

if (process.env.ENV === "production") {
  console.log("production log active");
  logger.add(
    new TelegramLogger({
      token: process.env.TELEGRAM_TOKEN,
      chatId: process.env.CHAT_ID,
      level: "info",
    })
  );
}

module.exports = logger;
