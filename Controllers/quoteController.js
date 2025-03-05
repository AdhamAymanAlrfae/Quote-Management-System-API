const { Query } = require("mongoose");
const Quote = require("../Models/quoteModel");
const AsyncErrorHandler = require("../Utils/AsyncErrorHandler");

const {
  createDoc,
  getOneDoc,
  getAllDoc,
  updateDoc,
  deleteDoc,
  approveDoc,
} = require("./index");

exports.createQuote = createDoc(Quote);

exports.getOneQuote = getOneDoc(Quote);

exports.getAllQuotes = getAllDoc(Quote);

exports.updateQuote = updateDoc(Quote);

exports.deleteQuote = deleteDoc(Quote);

exports.approveQuote = approveDoc(Quote);

exports.randomQuote = AsyncErrorHandler(async (req, res, next) => {
  const randomQuote = await Quote.aggregate([{ $sample: { size: 1 } }]);


  // If no quotes are found
  if (!randomQuote) {
    return res.status(404).json({
      status: "error",
      message: "No quotes available.",
    });
  }

  res.status(200).json({
    status: "success",
    data: randomQuote,
  });
});
