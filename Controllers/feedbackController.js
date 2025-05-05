const AsyncErrorHandler = require("../Middlewares/AsyncErrorHandler");
const Feedback = require("../Models/feedbackModel");
const Logger = require("../Utils/logger"); 
const {getAllDoc,getOneDoc,deleteDoc} = require("./index")

exports.createFeedback = AsyncErrorHandler(async (req, res, next) => {
  const feedbackData = {
    feedbackType: req.body.feedbackType,
    feedbackText: req.body.feedbackText,
    rating: req.body.rating,
    pageUrl: req.body.pageUrl,
    userAgent: req.headers["user-agent"],
    allowContact: req.body.allowContact,
  };

  // If user is logged in
  if (req.user) {
    feedbackData.userId = req.user.id;
    if (!feedbackData.email && req.user.email) {
      feedbackData.email = req.user.email;
    }
  } else if (req.body.email) {
    feedbackData.email = req.body.email;
  }

  const feedback = await Feedback.create(feedbackData);

  // Log the feedback creation
  Logger.info(
    `[FEEDBACK RECEIVED] => FeedbackType:[ ${
      feedback.feedbackType
    } ] ,[ Rating: ${feedback.rating} ] ,[ User: ${
      req.user ? req.user.id : "Guest"
    } ] ,[ Email: ${feedback.email || "N/A"} ]`
  );

  res.status(201).json({
    status: "success",
    data: feedback,
  });
});

exports.getAllFeedbacks = getAllDoc(Feedback);

exports.getOneFeedback = getOneDoc(Feedback);

exports.deleteFeedback = deleteDoc(Feedback);
