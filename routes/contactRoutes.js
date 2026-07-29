const express = require("express");
const router = express.Router();

const Contact = require("../models/Contact");

// Contact Page
router.get("/contact", (req, res) => {

    res.render("contact");

});

// Save Contact Message
router.post("/contact", async (req, res) => {

    const { name, email, subject, message } = req.body;

    await Contact.create({
        name,
        email,
        subject,
        message
    });

    res.redirect("/contact");

});

// Admin Contact Messages
router.get("/admin/contact-messages", async (req, res) => {

    const contacts = await Contact.find().sort({
        createdAt: -1
    });

    res.render("admin/contactMessages", {
        contacts
    });

});

// Delete Contact Message
router.delete("/admin/contact-messages/:id", async (req, res) => {

    await Contact.findByIdAndDelete(req.params.id);

    res.redirect("/admin/contact-messages");

});

module.exports = router;