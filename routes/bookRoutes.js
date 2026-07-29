const express = require("express");
const router = express.Router();

const wrapAsync = require("../utils/wrapAsync");
const ExpressError = require("../utils/ExpressError");

const Book = require("../models/Book");

// ======================
// All Books
// ======================

router.get("/books", wrapAsync(async (req, res) => {

    const { search, category } = req.query;

    let filter = {};

    if (search) {

        filter.$or = [

            { title: { $regex: search, $options: "i" } },

            { author: { $regex: search, $options: "i" } }

        ];

    }

    if (category && category !== "All") {

        filter.category = category;

    }

    const books = await Book.find(filter);

    const categories = await Book.distinct("category");

    res.render("book", {

        books,

        categories,

        search,

        category

    });

}));


// ======================
// Book Details
// ======================

router.get("/books/:id", wrapAsync(async (req, res) => {

    const book = await Book.findById(req.params.id);

    if (!book) {

        throw new ExpressError(404, "Book Not Found");

    }

    book.views = (book.views || 0) + 1;

    await book.save();

    const allBooks = await Book.find({

        _id: { $ne: book._id }

    });

    const relatedBooks = allBooks

        .map(b => {

            let score = 0;

            if (b.category === book.category) score += 50;

            if (b.author === book.author) score += 30;

            score += (b.rating || 0) * 10;

            score += (b.wishlistCount || 0) * 2;

            score += (b.views || 0) * 0.2;

            let explanation = [];

            if (b.category === book.category)
                explanation.push("Same Category");

            if (b.author === book.author)
                explanation.push("Same Author");

            if ((b.rating || 0) >= 4)
                explanation.push("Highly Rated");

            if ((b.views || 0) >= 10)
                explanation.push("Popular Book");

            if ((b.wishlistCount || 0) >= 5)
                explanation.push("Most Wishlisted");

            return {

                ...b.toObject(),

                score,

                explanation

            };

        })

        .sort((a, b) => b.score - a.score)

        .slice(0, 4);

    res.render("bookDetails", {

        book,

        relatedBooks

    });

}));


// ======================
// Rating
// ======================

router.post("/books/:id/rating", wrapAsync(async (req, res) => {

    const { rating } = req.body;

    const book = await Book.findById(req.params.id);

    if (!book) {

        throw new ExpressError(404, "Book Not Found");

    }

    book.ratings.push({

        value: Number(rating)

    });

    const total = book.ratings.reduce((sum, r) => sum + r.value, 0);

    book.rating = total / book.ratings.length;

    book.totalRatings = book.ratings.length;

    await book.save();

    res.redirect("/books/" + req.params.id);

}));


// ======================
// PDF Reader
// ======================

router.get("/books/:id/read", wrapAsync(async (req, res) => {

    const book = await Book.findById(req.params.id);

    if (!book) {

        throw new ExpressError(404, "Book Not Found");

    }

    res.render("reader", {

        book

    });

}));


module.exports = router;