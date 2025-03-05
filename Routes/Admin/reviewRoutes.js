const { Router } = require("express");
const {
  getOneReview,
  getAllReviews,
  deleteReview,
} = require("../../Controllers/reviewController");

const {
  getReviewValidator,

  deleteReviewValidator,
} = require("../../Validators/reviewValidators");
const { verifyJWT } = require("../../Middlewares/verifyJWT");
const { allowTo } = require("../../Middlewares/allowTo");
const { statusFilter } = require("../../Middlewares/logeUserData");

const router = Router();

router
  .route("/")
  .get(statusFilter, getAllReviews);

router
  .route("/:id")
  .get(getReviewValidator, getOneReview)
  .delete(verifyJWT, allowTo("admin"), deleteReviewValidator, deleteReview);

module.exports = router;
