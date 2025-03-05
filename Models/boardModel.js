const { default: mongoose } = require("mongoose");

const boardSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "A board must have a name"],
      maxlength: [100, "Board name must not exceed 100 characters"],
    },
    description: {
      type: String,
      maxlength: [500, "Description must not exceed 500 characters"],
    },
    privacy: {
      type: String,
      enum: ["public", "private"],
      default: "private",
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "A board must belong to a user"],
    },
    quotes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Quote",
      },
    ],
  },
  { timestamps: true }
);

const Board = mongoose.model("Board", boardSchema);
module.exports = Board;
