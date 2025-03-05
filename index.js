require("dotenv").config();
const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const helmet = require("helmet");
const hpp = require("hpp");
const xss = require("xss-clean")
const mongoSanitize = require("express-mongo-sanitize");

const databaseConnect = require("./Config/database");
const CustomError = require("./Utils/CustomError");
const globalErrorMiddlewares = require("./Middlewares/globalErrorMiddlewares");
const mainRoutesHandler = require("./Routes/index");
const passport = require("passport");
const Logger = require("./Utils/logger");
const {globalLimiter} = require("./Utils/rateLimiter")
require("./providers/discord/discord");
require("./providers/github/github");
require("./providers/google/google");

process.on("uncaughtException", (err) => {
  Logger.error(`${err.name} ==> "${err.message}"`);
  Logger.error("Rejection Error happened: ");
  Logger.error("Shutting Down The app ...");
  process.exit(1);
});

const app = express();

app.use(helmet());

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

app.use(hpp({ whitelist: ["fields", "tags"] }));


databaseConnect();

/**  Content-Type Validation Middleware - Place Before Body Parsers */
const allowedContentTypes = [
  "application/json",
  "application/x-www-form-urlencoded",
  "multipart/form-data",
];

app.use((req, res, next) => {
  const contentType = req.headers["content-type"]?.split(";")[0];

  if (contentType && !allowedContentTypes.includes(contentType)) {
    return res.status(415).json({ error: "Unsupported Media Type" });
  }

  next();
});

/** Apply Global Rate Limiter */
app.use(globalLimiter); 

/**  Body Parsers (After Content-Type Validation) */
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));
app.use(cookieParser());
app.use(passport.initialize());

app.use(xss()); 
app.use(mongoSanitize());

/**  Routes */
mainRoutesHandler(app);

/**  Handle Unmatched Routes */
app.all("*", (req, res, next) => {
  const err = new CustomError(`There is no route to ${req.originalUrl}`, 404);
  next(err);
});

/**  Start Server */
const server = app.listen(process.env.PORT, () =>
  Logger.info(`App is launched`)
);
/**  Global Error Handler */
app.use(globalErrorMiddlewares);

/**  Handle Unhandled Promise Rejections */
process.on("unhandledRejection", (err) => {
  Logger.error(err.name, err.message);
  Logger.error("Rejection Error happened: ");
  Logger.error("Shutting Down The app ...");

  server.close(() => {
    process.exit(1);
  });
});

/** Handle SIGINT (Ctrl + C) and SIGTERM (Docker, Kubernetes) */
process.on("SIGINT", () => {
  Logger.info("SIGINT received. Closing server gracefully...");
  server.close(() => process.exit(0)); // Finish requests, then exit
});

process.on("SIGTERM", () => {
  Logger.info("SIGTERM received. Closing server gracefully...");
  server.close(() => process.exit(0)); // Finish requests, then exit
});
