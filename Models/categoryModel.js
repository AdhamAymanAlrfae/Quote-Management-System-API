const { default: mongoose } = require("mongoose");

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Category name is required."],
    unique: [true, "Category name must be unique."],
    trim: true,
  },
  slug: {
    type: String,
    required: [true, "Category slug is required."],
    unique: [true, "Category slug must be unique."],
    trim: true,
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
});

const Category = mongoose.model("Category", categorySchema);
module.exports = Category;
