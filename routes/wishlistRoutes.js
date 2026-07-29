const express = require("express");
const router = express.Router();

const Wishlist = require("../models/Wishlist");
const Book = require("../models/Book");

// Wishlist Page
router.get("/wishlist", async (req, res) => {

    const wishlist = await Wishlist.find().populate("book");

    res.render("wishlist", { wishlist });

});


// Add Wishlist
router.post("/wishlist/:id", async (req, res) => {

    console.log("Book ID:", req.params.id);

    const bookId = req.params.id;

    const exists = await Wishlist.findOne({ book: bookId });

    if (!exists) {

        await Wishlist.create({
            book: bookId
        });

        console.log("Wishlist Saved");

    } else {

        console.log("Already Exists");

    }

    res.redirect("/wishlist");

});

// Remove Wishlist
router.delete("/wishlist/:id", async (req, res) => {

    await Wishlist.findByIdAndDelete(req.params.id);

    res.redirect("/wishlist");

});

module.exports = router;