const mongoose = require("mongoose")

const dailyQuoteSchema = new mongoose.Schema({
    quote: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "Quote",
        required: true,
        trim: true,
    },
    date: {
        type: Date,
        required: true,
    },
})

const DailyQuote = mongoose.model("DailyQuote", dailyQuoteSchema)
module.exports = DailyQuote