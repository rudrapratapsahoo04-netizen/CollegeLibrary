const mongoose = require("mongoose");

const ratingSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true
    },

    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },

    message: {
        type: String
    },

    createdAt: {
        type: Date,
        default: Date.now
    }

});

module.exports = mongoose.model("Rating", ratingSchema);