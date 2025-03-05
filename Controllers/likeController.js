// controllers/quoteController.js
const Quote = require("../Models/quoteModel");
const Like = require("../Models/likeModel");

const toggleLike = async (req, res) => {
  try {
    const userId = req.user.id; 
    const quoteId = req.params.id;

    // Check if a like already exists for this user and quote
    const existingLike = await Like.findOne({ user: userId, quote: quoteId });

    if (existingLike) {
      // Unlike the quote if a like exists
      await Like.findByIdAndDelete(existingLike._id);
      await Quote.findByIdAndUpdate(quoteId, { $inc: { likes: -1 } });

      return res.status(200).json({ message: "Quote unliked!" });
    } else {
      // Like the quote if no like exists
      const newLike = await Like.create({ user: userId, quote: quoteId });
      await newLike.save();
      await Quote.findByIdAndUpdate(quoteId, { $inc: { likes: 1 } });

      return res.status(200).json({ message: "Quote liked!" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error toggling like", error });
  }
};

module.exports = { toggleLike };
