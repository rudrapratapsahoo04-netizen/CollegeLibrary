const express = require("express");
const router = express.Router();

const Rating = require("../models/Rating");

// Rating Page
router.get("/rating", async (req, res) => {

    const ratings = await Rating.find().sort({ createdAt: -1 });

    let average = 0;

    if (ratings.length > 0) {

        const total = ratings.reduce((sum, item) => sum + item.rating, 0);

        average = (total / ratings.length).toFixed(1);

    }

    res.render("rating", {
        ratings,
        average
    });

});

// Save Rating
router.post("/rating", async (req, res) => {

    const { name, rating, message } = req.body;

    await Rating.create({
        name,
        rating,
        message
    });

    res.redirect("/rating");

});

module.exports = router;