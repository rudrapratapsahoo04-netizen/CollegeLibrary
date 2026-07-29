const express = require("express");
console.log("App Started");
const path = require("path");
const dotenv = require("dotenv");
const ejsMate = require("ejs-mate");
const methodOverride = require("method-override");
const Book = require("./models/Book");
const session = require("express-session");
const ExpressError=require("./utils/ExpressError");

dotenv.config();

const connectDB = require("./config/db");

const pageRoutes = require("./routes/pageRoutes");
const bookRoutes = require("./routes/bookRoutes");
const adminRoutes = require("./routes/adminRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const wishlistRoutes = require("./routes/wishlistRoutes");
const ratingRoutes = require("./routes/ratingRoutes");
const complaintRoutes = require("./routes/complaintRoutes");
const contactRoutes = require("./routes/contactRoutes");
const feedbackRoutes = require("./routes/feedbackRoutes");
const chatRoutes = require("./routes/chatRoutes");

const app = express();

connectDB();

app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(methodOverride("_method"));

app.use(express.static(path.join(__dirname, "public")));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use((req, res, next) => {
    res.locals.currentPath = req.path;
    next();
});
app.use(session({

    secret: "college_library_secret",

    resave: false,

    saveUninitialized: false

}));

// Routes
app.use("/", pageRoutes);
app.use("/", bookRoutes);
app.use("/admin", adminRoutes);
app.use("/", notificationRoutes);
app.use("/", wishlistRoutes);
app.use("/", ratingRoutes);
app.use("/", complaintRoutes);
app.use("/", contactRoutes);
app.use("/", feedbackRoutes);
app.use(chatRoutes);
// 404 Error

app.all("*",(req,res,next)=>{

    next(new ExpressError(404,"Page Not Found"));

});
// Global Error Handler

app.use((err,req,res,next)=>{

    let{

        statusCode=500,

        message="Something Went Wrong"

    }=err;

    res.status(statusCode);

    res.render("error",{

        statusCode,

        message

    });

});





const PORT = process.env.PORT || 3000;


app.listen(PORT, () => {
    console.log(`Server Running on Port ${PORT}`);
});

