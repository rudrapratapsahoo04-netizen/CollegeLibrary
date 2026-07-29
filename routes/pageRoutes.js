const express = require("express");
const router = express.Router();
const wrapAsync=require("../utils/wrapAsync");

router.get("/", (req, res) => {
    res.render("home");
});

router.get("/settings", (req, res) => {
    res.render("settings");
});

router.get("/about", (req, res) => {
    res.render("about");
});

router.get("/contact", (req, res) => {
    res.render("contact");
});

router.get("/complain", (req, res) => {
    res.render("complain");
});

router.get("/share", (req, res) => {
    res.render("share");
});




module.exports = router;