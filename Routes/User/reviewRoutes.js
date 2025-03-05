const { Router } = require("express");
const {
  createReview,
  getOneReview,
  getAllReviews,
  updateReview,
  deleteReview,
} = require("../../Controllers/reviewController");

const {
  createReviewValidator,
  getReviewValidator,
  updateReviewValidator,
  deleteReviewValidator,
} = require("../../Validators/reviewValidators");
const { verifyJWT } = require("../../Middlewares/verifyJWT");
const { allowTo } = require("../../Middlewares/allowTo");
const { statusFilter } = require("../../Middlewares/logeUserData");

const router = Router();

router
  .route("/")
  .post(verifyJWT, allowTo("user"), createReviewValidator, createReview)
  .get(statusFilter, getAllReviews);
router
  .route("/:id")
  .get(getReviewValidator, getOneReview)
  .put(verifyJWT, allowTo("user"), updateReviewValidator, updateReview)
  .delete(verifyJWT, allowTo("user"), deleteReviewValidator, deleteReview);

module.exports = router;
