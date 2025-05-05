const { Router } = require("express");
const { createFeedback } = require("../../Controllers/feedbackController");
const {
  createFeedbackValidator,
} = require("../../Validators/feedbackValidators");
const { verifyJWTOptional } = require("../../Middlewares/verifyJWTOptional");

const router = Router();


router.post("/", verifyJWTOptional, createFeedbackValidator, createFeedback);

module.exports = router;
