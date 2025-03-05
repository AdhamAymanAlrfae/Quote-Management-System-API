const mongoose = require("mongoose");
const { nationalities } = require("../Data/Nationality");

const authorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "The Author Name is required"],
      trim: true,
    },
    slug: {
      type: String,
      required: [true, "The Slug is required"],
      trim: true,
    },
    avatar: {
      type: String,
    },
    jop: {
      type: String,
    },
    bio: {
      type: String,
      trim: true,
    },
    nationality: {
      type: String,
      enum: {
        values: nationalities,
        message: "The Nationality provided is not valid",
        default: "Unknown",
      },
    },
    books: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "Book",
      },
    ],
    dateOfBirth: {
      type: Date,
      required: [true, "The Date of Birth is required"],
    },
    dateOfDeath: {
      type: Date,
    },
    socialLinks: {
      website: {
        type: String,
        trim: true,
      },
      twitter: {
        type: String,
        trim: true,
      },
      instagram: {
        type: String,
        trim: true,
      },
      other: {
        type: String,
      },
    },
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
  { timestamps: true }
);

const Author = mongoose.model("Author", authorSchema);
module.exports = Author;
