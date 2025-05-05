const { Router } = require("express");
const {
  createFeedback,
  getAllFeedbacks,
  getOneFeedback,
  deleteFeedback,
} = require("../../Controllers/feedbackController");
const {
  createFeedbackValidator,
  getAllFeedbacksValidator,
  getOneFeedbackValidator,
  deleteFeedbackValidator,
} = require("../../Validators/feedbackValidators");
const { verifyJWTOptional } = require("../../Middlewares/verifyJWTOptional");
const { allowTo } = require("../../Middlewares/allowTo");
const { verifyJWT } = require("../../Middlewares/verifyJWT");
const ROLES = require("../../Data/Roles");

const router = Router();

// Create feedback
router
  .route("/")
  .post(verifyJWTOptional, createFeedbackValidator, createFeedback)
  .get(
    // Get all feedbacks (Admin only)
    verifyJWT,
    allowTo(ROLES.ADMIN),
    getAllFeedbacksValidator,
    getAllFeedbacks
  );

// Get single feedback by ID (Admin only)
router
  .route("/:id")
  .get(verifyJWT, allowTo(ROLES.ADMIN), getOneFeedbackValidator, getOneFeedback)
  .delete(
    verifyJWT,
    allowTo(ROLES.ADMIN),
    deleteFeedbackValidator,
    deleteFeedback
  );

module.exports = router;
