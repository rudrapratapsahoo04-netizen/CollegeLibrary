const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {

        if (file.fieldname === "image") {
            cb(null, path.join(__dirname, "../uploads/images"));
        } else if (file.fieldname === "ebook") {
            cb(null, path.join(__dirname, "../uploads/ebooks"));
        }

    },

    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

module.exports = multer({ storage });