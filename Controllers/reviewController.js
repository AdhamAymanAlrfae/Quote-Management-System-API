const Review = require("../Models/reviewModel");

const {
  createDoc,
  getOneDoc,
  getAllDoc,
  updateDoc,
  deleteDoc,
  approveDoc,
} = require("./index");

// POST Review
exports.createReview = createDoc(Review);

// GET Review
exports.getOneReview = getOneDoc(Review);

// GET all Review
exports.getAllReviews = getAllDoc(Review);

// PUT Review
exports.updateReview = updateDoc(Review);

// DELETE Review
exports.deleteReview = deleteDoc(Review);

// APPROVE Review
exports.approveReview = approveDoc(Review);
