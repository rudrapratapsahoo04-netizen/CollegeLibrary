const mongoose = require("mongoose");

const wishlistSchema = new mongoose.Schema({

    book: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Book",
        required: true
    },

    createdAt: {
        type: Date,
        default: Date.now
    }

});

module.exports = mongoose.model("Wishlist", wishlistSchema);