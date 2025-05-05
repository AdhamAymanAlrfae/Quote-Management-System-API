const { default: mongoose } = require("mongoose");
const Book = require("./bookModel");

const reviewSchema = new mongoose.Schema(
  {
    book: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Book",
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    rating: {
      type: Number,
      min: 1,
      max: 10,
      required: [true, "Rating is required."],
    },
    comment: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

// Pre-hook to populate user field when fetching reviews
reviewSchema.pre(/^find/, function (next) {
  this.populate({
    path: "user",
    select: "username",
  });
  next();
});

// Static method to calculate and update average reviews
reviewSchema.statics.handelReview = async function (bookId) {
  const result = await this.aggregate([
    { $match: { book: bookId } },
    {
      $group: {
        _id: "$book",
        avgReviews: { $avg: "$rating" },
        numberOfReviews: { $sum: 1 },
      },
    },
  ]);

  if (result.length > 0) {
    await Book.findByIdAndUpdate(bookId, {
      avgReviews: result[0].avgReviews,
      numberOfReviews: result[0].numberOfReviews,
    }).exec();
  } else {
    await Book.findByIdAndUpdate(bookId, {
      avgReviews: 0,
      numberOfReviews: 0,
    }).exec();
  }
};

// Post-save middleware to handle review updates after a new review is saved
reviewSchema.post("save", async function () {
  await this.constructor.handelReview(this.book);
});

// Post-findOneAndUpdate middleware to handle review updates after an update
reviewSchema.post("findOneAndUpdate", async function (doc) {
  if (doc) {
    await doc.constructor.handelReview(doc.book);
  }
});

// Post-delete middleware to handle review updates after a review is deleted
reviewSchema.post("findOneAndDelete", async function (doc) {
  if (doc) {
    await doc.constructor.handelReview(doc.book);
  }
});

const Review = mongoose.model("Review", reviewSchema);

module.exports = Review;
