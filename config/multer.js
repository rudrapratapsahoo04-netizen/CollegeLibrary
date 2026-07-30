const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Create folders automatically
const imageDir = path.join(__dirname, "../uploads/images");
const ebookDir = path.join(__dirname, "../uploads/ebooks");

fs.mkdirSync(imageDir, { recursive: true });
fs.mkdirSync(ebookDir, { recursive: true });

const storage = multer.diskStorage({

    destination: (req, file, cb) => {

        if (file.fieldname === "image") {

            cb(null, imageDir);

        } else if (file.fieldname === "ebook") {

            cb(null, ebookDir);

        }

    },

    filename: (req, file, cb) => {

        cb(null, Date.now() + path.extname(file.originalname));

    }

});

module.exports = multer({ storage });