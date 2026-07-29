const express = require("express");
const router = express.Router();

const Notification = require("../models/Notification");

router.get("/notification", async (req, res) => {

    const notifications = await Notification
        .find()
        .sort({ createdAt: -1 });

    res.render("notification", { notifications });

});

module.exports = router;