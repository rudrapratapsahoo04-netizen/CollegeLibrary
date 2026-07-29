const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema({

    title: {
        type: String,
        required: true
    },

    author: {
        type: String,
        required: true
    },

    category: String,

    description: String,

    image: String,
    imageFileId: String,

    ebook: String,
    ebookPublicId: String,

    available: {
        type: Boolean,
        default: true
    },

    rating: {
        type: Number,
        default: 0
    },

    totalRatings: {
        type: Number,
        default: 0
    },

    ratings: [
        {
            value: {
                type: Number,
                min: 1,
                max: 5
            }
        }
    ],
    views: {
            type: Number,
            default: 0
          },

    wishlistCount: {
         type: Number,
         default: 0
        },

});

module.exports = mongoose.model("Book", bookSchema);