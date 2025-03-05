const { authLimiter } = require("../Utils/rateLimiter");

// User
const authorRoutes = require("./User/authorRoutes");
const bookRoutes = require("./User/bookRoutes");
const categoryRoutes = require("./User/categoryRoutes");
const boardRoutes = require("./User/boardRoutes");
const userRoutes = require("./User/userRoutes");
const quoteRoutes = require("./User/quoteRoutes");
const reviewRoutes = require("./User/reviewRoutes");

// Admin
const adminAuthorRoutes = require("./Admin/authorRoutes");
const adminBookRoutes = require("./Admin/bookRoutes");
const adminCategoryRoutes = require("./Admin/categoryRoutes");
const adminUserRoutes = require("./Admin/userRoutes");
const adminReviewRoutes = require("./Admin/reviewRoutes");
const adminQuoteRoutes = require("./Admin/quoteRoutes");
const DailyQuoteRoutes = require("./Admin/DailyQuoteRoute");

const authRoutes = require("./authRoutes");
const providersRoute = require("../providers/providersRoute");

module.exports = mainRoutesHandler = (app) => {
  // Public/Shared Routes
  app.use("/api/v1/authors", authorRoutes);
  app.use("/api/v1/books", bookRoutes);
  app.use("/api/v1/categories", categoryRoutes);
  app.use("/api/v1/boards", boardRoutes);
  app.use("/api/v1/quotes", quoteRoutes);
  app.use("/api/v1/reviews", reviewRoutes);

  // Admin-only Routes
  app.use("/api/v1/admin/users", adminUserRoutes);
  app.use("/api/v1/admin/books", adminBookRoutes);
  app.use("/api/v1/admin/authors", adminAuthorRoutes);
  app.use("/api/v1/admin/quotes", adminQuoteRoutes);
  app.use("/api/v1/admin/reviews", adminReviewRoutes);
  app.use("/api/v1/admin/schedule-quotes", DailyQuoteRoutes);

  // User-specific Routes
  app.use("/api/v1/profile", userRoutes);

  // Auth Routes
  app.use("/api/v1/auth", authLimiter, authRoutes);
  app.use("/auth/providers", authLimiter, providersRoute);
};
