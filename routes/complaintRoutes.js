const express = require("express");
const router = express.Router();

const Complaint = require("../models/Complaint");

// Complaint Form
router.get("/complain", (req, res) => {
    res.render("complain");
});

// Save Complaint
router.post("/complain", async (req, res) => {

    const { name, email, subject, message } = req.body;

    await Complaint.create({
        name,
        email,
        subject,
        message
    });

    res.redirect("/complain");

});

// Admin Complaint List
router.get("/admin/complaints", async (req, res) => {

    const complaints = await Complaint.find().sort({
        createdAt: -1
    });

    res.render("admin/complaints", { complaints });

});

// Mark as Resolved
router.put("/admin/complaints/:id", async (req, res) => {

    await Complaint.findByIdAndUpdate(req.params.id, {
        status: "Resolved"
    });

    res.redirect("/admin/complaints");

});

// Delete Complaint
router.delete("/admin/complaints/:id", async (req, res) => {

    await Complaint.findByIdAndDelete(req.params.id);

    res.redirect("/admin/complaints");

});

module.exports = router;