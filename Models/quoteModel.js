const { default: mongoose } = require("mongoose");

const quoteSchema = new mongoose.Schema(
  {
    quote: {
      type: String,
      required: true,
      trim: true,
    },

    author: {
      type: mongoose.Schema.ObjectId,
      ref: "Author",
      required: true,
    },

    book: {
      type: mongoose.Schema.ObjectId,
      ref: "Book",
    },

    media: [
      {
        type: {
          type: String,
          enum: ["video", "podcast", "song", "article"],
        },
        link: {
          type: String,
          trim: true,
        },
      },
    ],

    categories: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "Category",
      },
    ],

    tags: [String],

    arabicTransliteration: String,

    length: Number,

    likes: { type: Number, default: 0 },

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

const Quote = mongoose.model("Quote", quoteSchema);
module.exports = Quote;
