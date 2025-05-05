const mongoose = require("mongoose");

const feedbackSchema = new mongoose.Schema(
  {
    feedbackType: {
      type: String,
      enum: ["rating", "bug", "suggestion", "wrong-quote", "other"],
      required: true,
    },
    feedbackText: {
      type: String,
      required: true,
      trim: true,
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
    },
    pageUrl: {
      type: String,
      trim: true,
    }, // optional: the page where user submitted feedback
    userAgent: {
      type: String,
      trim: true,
    }, // optional: the user's browser/device info
    email: {
      type: String,
      trim: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    allowContact: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true, 
  }
);

const Feedback = mongoose.model("Feedback", feedbackSchema);

module.exports = Feedback;
