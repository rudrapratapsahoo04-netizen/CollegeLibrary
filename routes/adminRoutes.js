const express = require("express");
const router = express.Router();
const isAdmin = require("../middleware/isAdmin");
const Book = require("../models/Book");
const upload = require("../config/multer");
const wrapAsync=require("../utils/wrapAsync");

const ExpressError=require("../utils/ExpressError");
const Notification = require("../models/Notification");
const cloudinary = require("../config/cloudinary");
const imagekit = require("../config/imagekit");
const fs = require("fs");

// Login Page
router.get("/login", (req, res) => {
    res.render("admin/login");
});

// Login
router.post("/login", (req, res) => {

    const { email, password } = req.body;

    if (
        email === process.env.ADMIN_EMAIL &&
        password === process.env.ADMIN_PASSWORD
    ) {

        req.session.admin = true;

        return res.redirect("/admin/dashboard");
    }

    res.send("Invalid Email or Password");

});
router.get("/logout", (req, res) => {

    req.session.destroy(() => {

        res.redirect("/admin/login");

    });

});
// Dashboard
router.get("/dashboard",isAdmin,wrapAsync(async (req, res) => {

    const books = await Book.find();

    const totalBooks = books.length;

    const availableBooks = books.filter(b => b.available).length;

    const unavailableBooks = totalBooks - availableBooks;

    const totalViews = books.reduce((sum, b) => sum + (b.views || 0), 0);

    const totalWishlist = books.reduce((sum, b) => sum + (b.wishlistCount || 0), 0);

    const totalRatings = books.reduce((sum, b) => sum + (b.totalRatings || 0), 0);

    const topRated = [...books]
        .sort((a,b)=>(b.rating||0)-(a.rating||0))
        .slice(0,5);

    const mostViewed = [...books]
        .sort((a,b)=>(b.views||0)-(a.views||0))
        .slice(0,5);

    const mostWishlisted = [...books]
        .sort((a,b)=>(b.wishlistCount||0)-(a.wishlistCount||0))
        .slice(0,5);

    res.render("admin/dashboard",{

        totalBooks,
        availableBooks,
        unavailableBooks,

        totalViews,
        totalWishlist,
        totalRatings,

        topRated,
        mostViewed,
        mostWishlisted

    });

}));

// Book List
router.get("/books",isAdmin,wrapAsync(async (req, res) => {

    const books = await Book.find();

    res.render("admin/books", { books });

}));

// Add Book Page
router.get("/books/new", isAdmin,wrapAsync(async (req, res) => {

    res.render("admin/addBook");

}));

// Save Book
router.post(
    "/books",
    isAdmin,
    upload.fields([
        { name: "image", maxCount: 1 },
        { name: "ebook", maxCount: 1 }
    ]),
    wrapAsync(async (req, res) => {

        try {

            let imageUrl = "";
            let imageFileId = "";

            let ebookUrl = "";
            let ebookPublicId = "";

            // ==========================
            // Upload Image to ImageKit
            // ==========================
            if (req.files?.image) {

                const imageResult = await imagekit.upload({

                    file: fs.readFileSync(req.files.image[0].path),

                    fileName: req.files.image[0].filename,

                    folder: "/college-library/images"

                });

                imageUrl = imageResult.url;
                imageFileId = imageResult.fileId;

                // Delete local temp image
                fs.unlinkSync(req.files.image[0].path);
            }

            // ==========================
            // Upload PDF to Cloudinary
            // ==========================
            if (req.files?.ebook) {

                const pdfResult = await cloudinary.uploader.upload(

                    req.files.ebook[0].path,

                    {

                        resource_type: "raw",

                        folder: "college-library/ebooks",
                        type: "upload"

                    }

                );

                ebookUrl = pdfResult.secure_url;
                ebookPublicId = pdfResult.public_id;

                // Delete local temp PDF
                fs.unlinkSync(req.files.ebook[0].path);
            }

            // ==========================
            // Save Book
            // ==========================
            const book = new Book({

                title: req.body.title,

                author: req.body.author,

                category: req.body.category,

                image: imageUrl,

                imageFileId: imageFileId,

                ebook: ebookUrl,

                ebookPublicId: ebookPublicId,

                available: req.body.available === "true"

            });

            await book.save();

            await Notification.create({

                title: "📚 New Book Added",

                message: `${book.title} has been added to the library.`

            });

            res.redirect("/admin/books");

        } catch (err) {

            console.error(err);

            res.status(500).send("Error uploading book.");

        }

    }
));

// Edit Page
router.get("/books/:id/edit", isAdmin, wrapAsync(async (req, res) => {

    const book = await Book.findById(req.params.id);

    if (!book) {
        return res.send("Book Not Found");
    }

    res.render("admin/editBook", { book });

}));

// Update Book
router.post(
    "/books/:id",
    isAdmin,
    upload.fields([
        { name: "image", maxCount: 1 },
        { name: "ebook", maxCount: 1 }
    ]),
    wrapAsync(async (req, res) => {

        try {

            const book = await Book.findById(req.params.id);

            if (!book) {
                return res.send("Book Not Found");
            }

            const updateData = {

                title: req.body.title,

                author: req.body.author,

                category: req.body.category,

                available: req.body.available === "true"

            };

            // ==========================
            // Update Image (ImageKit)
            // ==========================

            if (req.files?.image) {

                // Delete old image from ImageKit
                if (book.imageFileId) {

                    await imagekit.deleteFile(book.imageFileId);

                }

                // Upload new image
                const imageResult = await imagekit.upload({

                    file: fs.readFileSync(req.files.image[0].path),

                    fileName: req.files.image[0].filename,

                    folder: "/college-library/images"

                });

                updateData.image = imageResult.url;

                updateData.imageFileId = imageResult.fileId;

                // Delete local temp image
                fs.unlinkSync(req.files.image[0].path);

            }

            // ==========================
            // Update PDF (Cloudinary)
            // ==========================

            if (req.files?.ebook) {

                // Delete old PDF
                if (book.ebookPublicId) {

                    await cloudinary.uploader.destroy(

                        book.ebookPublicId,

                        {

                            resource_type: "raw"

                        }

                    );

                }

                // Upload new PDF
                const pdfResult = await cloudinary.uploader.upload(

                    req.files.ebook[0].path,

                    {

                        resource_type: "raw",

                        folder: "college-library/ebooks"

                    }

                );

                updateData.ebook = pdfResult.secure_url;

                updateData.ebookPublicId = pdfResult.public_id;

                // Delete local temp PDF
                fs.unlinkSync(req.files.ebook[0].path);

            }

            await Book.findByIdAndUpdate(req.params.id, updateData);

            res.redirect("/admin/books");

        } catch (err) {

            console.error(err);

            res.status(500).send("Error Updating Book");

        }

    }
));

// Delete Book
router.delete("/books/:id", isAdmin, wrapAsync(async (req, res) => {

    try {

        const book = await Book.findById(req.params.id);

        if (!book) {

            return res.redirect("/admin/books");

        }

        // ==========================
        // Delete Image from ImageKit
        // ==========================

        if (book.imageFileId) {

            await imagekit.deleteFile(book.imageFileId);

        }

        // ==========================
        // Delete PDF from Cloudinary
        // ==========================

        if (book.ebookPublicId) {

            await cloudinary.uploader.destroy(

                book.ebookPublicId,

                {

                    resource_type: "raw"

                }

            );

        }

        // ==========================
        // Delete Book from MongoDB
        // ==========================

        await Book.findByIdAndDelete(req.params.id);

        res.redirect("/admin/books");

    } catch (err) {

        console.error(err);

        res.status(500).send("Error deleting book.");

    }

}));

module.exports = router;