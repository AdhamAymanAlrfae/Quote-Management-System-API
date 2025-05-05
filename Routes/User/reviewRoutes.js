const { Router } = require("express");
const {
  createReview,
  getOneReview,
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
const {
  canModifyReview,
} = require("../../Middlewares/authorizationMiddlewares");

const Review = require("../../Models/reviewModel");
const { handelBookReview } = require("../../Middlewares/contextInjectors");

const router = Router({mergeParams: true })

router.use(verifyJWT);

router
  .route("/")
  .post(handelBookReview, createReviewValidator, createReview);

router
  .route("/:id")
  .get(getReviewValidator, getOneReview)
  .put(
    [updateReviewValidator, canModifyReview(Review, "Review", "update")],
    updateReview
  )
  .delete(
    [deleteReviewValidator, canModifyReview(Review, "Review", "delete")],
    deleteReview
  );

module.exports = router;
