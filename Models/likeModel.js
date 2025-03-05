const mongoose = require("mongoose");

const likeSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },
  quote: {
    type: mongoose.Schema.ObjectId,
    ref: "Quote",
    required: true,
  },
});

const like = mongoose.model("like", likeSchema);
module.exports = like;
