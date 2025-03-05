const { default: mongoose } = require("mongoose");

const bookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required."],
      trim: true,
    },
    slug: {
      type: String,
      required: [true, "Slug is required."],
    },
    author: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "Author",
        required: [true, "Author is required."],
      },
    ],
    publicationDate: {
      type: Date,
    },
    genre: [
      {
        type: String,
        required: [true, "Genre is required."],
      },
    ],
    language: {
      type: String, // Original language of the book
    },
    pages: {
      type: Number,
      min: [1, "Pages must be a positive integer."],
    },
    isbn: {
      type: String,
      unique: true,
      required: [true, "ISBN is required."],
    },
    downloadLinks: [
      {
        type: String,
        trim: true,
      },
    ],
    avgReviews: Number,
    numberOfReviews: Number,
    submittedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    rejectionReason: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

bookSchema.virtual("reviews", {
  ref: "Review",
  localField: "_id",
  foreignField: "book",
});

const Book = mongoose.model("Book", bookSchema);

module.exports = Book;
