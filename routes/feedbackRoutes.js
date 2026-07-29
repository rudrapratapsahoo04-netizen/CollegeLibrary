const express = require("express");
const router = express.Router();

const Feedback = require("../models/Feedback");

// Feedback Page
router.get("/feedback", (req, res) => {

    res.render("feedback");

});

// Save Feedback
router.post("/feedback", async (req, res) => {

    const { name, email, rating, message } = req.body;

    await Feedback.create({
        name,
        email,
        rating,
        message
    });

    res.redirect("/feedback");

});

// Admin Feedback List
router.get("/admin/feedbacks", async (req, res) => {

    const feedbacks = await Feedback.find().sort({
        createdAt: -1
    });

    res.render("admin/feedbacks", {
        feedbacks
    });

});

// Delete Feedback
router.delete("/admin/feedbacks/:id", async (req, res) => {

    await Feedback.findByIdAndDelete(req.params.id);

    res.redirect("/admin/feedbacks");

});

module.exports = router;