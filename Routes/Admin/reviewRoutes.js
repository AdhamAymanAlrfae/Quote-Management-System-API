const { Router } = require("express");
const {
  getOneReview,
  getAllReviews,
  updateReview,
  deleteReview,
} = require("../../Controllers/reviewController");

const {
  getReviewValidator,
  updateReviewValidator,
  deleteReviewValidator,
} = require("../../Validators/reviewValidators");
const { verifyJWT } = require("../../Middlewares/verifyJWT");
const { allowTo } = require("../../Middlewares/allowTo");
const { statusFilter } = require("../../Middlewares/contextInjectors");

const router = Router();

// Apply JWT verification globally
router.use(verifyJWT);

router.route("/").get(
  allowTo("admin"), // Allow only admins to view all reviews
  getAllReviews
);

router
  .route("/:id")
  .get(
    allowTo("admin"), // Allow only admins to view a specific review
    getReviewValidator,
    getOneReview
  )
  .put(
    [
      allowTo("admin"), 
      updateReviewValidator,
    ],
    updateReview
  )
  .delete(
    [
      allowTo("admin"),
      deleteReviewValidator,
    ],
    deleteReview
  );

module.exports = router;
