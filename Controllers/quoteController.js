const Quote = require("../Models/quoteModel");
const AsyncErrorHandler = require("../Middlewares/AsyncErrorHandler");

const {
  createDoc,
  getOneDoc,
  getAllDoc,
  updateDoc,
  deleteDoc,
  approveDoc,
} = require("./index");

exports.createQuote = createDoc(Quote);

exports.getOneQuote = getOneDoc(Quote, [
  { path: "author", select: "name" },
  { path: "categories", select: "name" },
  { path: "book", select: "title" },
  { path: "submittedBy", select: "username" },
]);

exports.getAllQuotes = getAllDoc(Quote, [
  { path: "author", select: "name" },
  { path: "categories", select: "name" },
]);

exports.updateQuote = updateDoc(Quote);

exports.deleteQuote = deleteDoc(Quote);

exports.approveQuote = approveDoc(Quote);

exports.randomQuote = AsyncErrorHandler(async (req, res, next) => {
  const count = await Quote.countDocuments();
  const random = Math.floor(Math.random() * count);

  const randomQuote = await Quote.findOne()
    .skip(random)
    .populate({ path: "author", select: "name" })
    .populate({ path: "categories", select: "name" })
    .populate({ path: "book", select: "title" });

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

exports.getHallOfFame = AsyncErrorHandler(async (req, res) => {
  const hallOfFame = await Quote.aggregate([
    { $group: { _id: "$submittedBy", quoteCount: { $sum: 1 } } },
    { $sort: { quoteCount: -1 } },
    { $limit: 10 },
    {
      $lookup: {
        from: "users",
        localField: "_id",
        foreignField: "_id",
        as: "userInfo",
      },
    },
    { $unwind: "$userInfo" },
    {
      $project: {
        _id: 0,
        userId: "$userInfo._id",
        username: "$userInfo.username",
        email: "$userInfo.email",
        quoteCount: 1,
      },
    },
  ]);

  res.status(200).json({
    status: "success",
    results: hallOfFame.length,
    data: hallOfFame,
  });
});
