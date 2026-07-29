const express = require("express");
const router = express.Router();

const Book = require("../models/Book");

router.post("/chat", async (req, res) => {

    try {

        const message = req.body.message.toLowerCase();

        let books = [];
        // Basic AI Replies

if (message.includes("hello") || message.includes("hi")) {

    return res.json({
        reply: "👋 Hello! Welcome to College Library. How can I help you today?"
    });

}

if (message.includes("who are you")) {

    return res.json({
        reply: "🤖 I am your AI Library Assistant. I can help you find books and answer library-related questions."
    });

}

if (message.includes("library timing")) {

    return res.json({
        reply: "🕘 Our library is open from 9:00 AM to 6:00 PM."
    });

}

if (message.includes("thank")) {

    return res.json({
        reply: "😊 You're welcome! Happy Reading 📚"
    });

}
// =========================
// Smart AI Replies
// =========================

// Greeting
if (
    message.includes("hi") ||
    message.includes("hello") ||
    message.includes("hey")
) {
    return res.json({
        reply: "👋 Hello! Welcome to College Library. How can I help you today?"
    });
}

// Good Morning
if (message.includes("good morning")) {
    return res.json({
        reply: "🌞 Good Morning! Have a great day. Which book are you looking for?"
    });
}

// Good Evening
if (message.includes("good evening")) {
    return res.json({
        reply: "🌆 Good Evening! Welcome to the College Library."
    });
}

// How are you
if (message.includes("how are you")) {
    return res.json({
        reply: "😊 I'm doing great! I'm ready to help you find books."
    });
}

// Who are you
if (message.includes("who are you")) {
    return res.json({
        reply: "🤖 I am your AI Library Assistant. I can help you search books, recommend books, and answer library-related questions."
    });
}

// Help
if (message.includes("help")) {
    return res.json({
        reply: `
📚 I can help you with:

• Search books
• Find books by author
• Find books by category
• Recommend books
• Library timing
• Library rules
• Feedback
• Complaint
• Contact information
`
    });
}

// Library Timing
if (
    message.includes("timing") ||
    message.includes("library timing")
) {
    return res.json({
        reply: `
🕘 Library Timing

Monday - Friday : 9:00 AM - 6:00 PM

Saturday : 9:00 AM - 2:00 PM

Sunday : Closed
`
    });
}

// Library Rules
if (
    message.includes("rules") ||
    message.includes("library rules")
) {
    return res.json({
        reply: `
📖 Library Rules

✅ Keep silence

✅ Handle books carefully

✅ Return books on time

✅ Don't damage books

✅ Maintain cleanliness
`
    });
}

// Recommendation
if (
    message.includes("recommend") ||
    message.includes("suggest")
) {
    return res.json({
        reply: "📚 Please tell me the subject (Java, Python, DBMS, AI, Web Development etc.) and I'll recommend the best books."
    });
}

// Best Book
if (message.includes("best book")) {
    const books = await Book.find().sort({ rating: -1 }).limit(5);

    let reply = "⭐ Top Rated Books<br><br>";

    books.forEach(book => {
        reply += `
📚 <b>${book.title}</b><br>
⭐ ${book.rating || 0}<br><br>
`;
    });

    return res.json({ reply });
}

// Most Viewed
if (
    message.includes("most viewed") ||
    message.includes("popular")
) {
    const books = await Book.find().sort({ views: -1 }).limit(5);

    let reply = "👀 Most Viewed Books<br><br>";

    books.forEach(book => {
        reply += `
📚 ${book.title}<br>
Views : ${book.views || 0}<br><br>
`;
    });

    return res.json({ reply });
}

// Wishlist
if (
    message.includes("wishlist") ||
    message.includes("wishlisted")
) {
    const books = await Book.find()
        .sort({ wishlistCount: -1 })
        .limit(5);

    let reply = "❤️ Most Wishlisted Books<br><br>";

    books.forEach(book => {
        reply += `
📚 ${book.title}<br>
❤️ ${book.wishlistCount || 0}<br><br>
`;
    });

    return res.json({ reply });
}

// Contact
if (message.includes("contact")) {
    return res.json({
        reply: "📞 You can contact the librarian using the Contact page available in the website."
    });
}

// Complaint
if (
    message.includes("complaint") ||
    message.includes("complain")
) {
    return res.json({
        reply: "📢 Please open the Complaint page from Settings to submit your complaint."
    });
}

// Feedback
if (message.includes("feedback")) {
    return res.json({
        reply: "⭐ We'd love your feedback! Please visit the Feedback page."
    });
}

// Thanks
if (
    message.includes("thanks") ||
    message.includes("thank you")
) {
    return res.json({
        reply: "😊 You're welcome! Happy Reading 📚"
    });
}

// Bye
if (
    message.includes("bye") ||
    message.includes("goodbye")
) {
    return res.json({
        reply: "👋 Goodbye! Have a wonderful day."
    });
}
// =============================
// STUDENT YEAR
// =============================

if (
    message.includes("first year") ||
    message.includes("1st year")
) {

    return res.json({

        reply: `
🎓 First Year Students ke liye Recommended Subjects

📘 C Programming

📘 Mathematics

📘 Computer Fundamentals

📘 Digital Electronics

📘 Communication Skills

Type kisi bhi subject ka naam aur mai books recommend kar dunga.
`

    });

}


// =============================
// SECOND YEAR
// =============================

if(message.includes("second year")){

return res.json({

reply:`

🎓 Second Year

📚 Data Structures

📚 Java

📚 DBMS

📚 Operating System

📚 Computer Network

`

});

}


// =============================
// THIRD YEAR
// =============================

if(message.includes("third year")){

return res.json({

reply:`

🎓 Third Year

📚 Machine Learning

📚 AI

📚 Cloud Computing

📚 Cyber Security

📚 Web Development

`

});

}


// =============================
// I WANT TO LEARN CODING
// =============================

if(

message.includes("coding") ||

message.includes("programming")

){

return res.json({

reply:`

💻 Coding Roadmap

1️⃣ C Language

2️⃣ C++

3️⃣ Java

4️⃣ Python

5️⃣ Data Structures

6️⃣ DBMS

7️⃣ Web Development

8️⃣ Projects

Type any language name.

`

});

}


// =============================
// EASY BOOK
// =============================

if(

message.includes("easy") ||

message.includes("simple")

){

const books=await Book.find()

.sort({rating:-1})

.limit(5);

let reply="😊 Easy Books<hr>";

books.forEach(book=>{

reply+=`

📚 ${book.title}<br>

⭐ ${book.rating||0}<hr>

`;

});

return res.json({reply});

}


// =============================
// HARDEST BOOK
// =============================

if(message.includes("advanced")){

const books=await Book.find()

.sort({rating:-1})

.limit(5);

let reply="🚀 Advanced Books<hr>";

books.forEach(book=>{

reply+=`

📚 ${book.title}<br>

<hr>

`;

});

return res.json({reply});

}


// =============================
// ROADMAP
// =============================

if(message.includes("roadmap")){

return res.json({

reply:`

🛣 Computer Science Roadmap

📌 C

↓

📌 C++

↓

📌 Java

↓

📌 Python

↓

📌 DBMS

↓

📌 Data Structure

↓

📌 OS

↓

📌 Networking

↓

📌 Web Development

↓

📌 Projects

`

});

}


// =============================
// MOTIVATION
// =============================

if(

message.includes("motivate") ||

message.includes("motivation")

){

return res.json({

reply:`

💙 Never stop learning.

Every expert was once a beginner.

Keep coding every day.

🚀

`

});

}


// =============================
// EXAM
// =============================

if(message.includes("exam")){

return res.json({

reply:`

📝 Exam Tips

✔ Practice Daily

✔ Read Notes

✔ Solve Previous Year Questions

✔ Revise Regularly

✔ Sleep Well

`

});

}


// =============================
// SEMESTER
// =============================

if(message.includes("semester")){

return res.json({

reply:`

📚 Tell me your semester.

Example:

Semester 1

Semester 2

Semester 3

Semester 4

`

});

}

        // Search by Title
        books = await Book.find({
            title: {
                $regex: message,
                $options: "i"
            }
        });

        // If not found search by Category
        if (books.length === 0) {

            books = await Book.find({
                category: {
                    $regex: message,
                    $options: "i"
                }
            });

        }

        // If not found search by Author
        if (books.length === 0) {

            books = await Book.find({
                author: {
                    $regex: message,
                    $options: "i"
                }
            });

        }

        // Default Recommendation
        if (books.length === 0) {

            books = await Book.find()
                .sort({ rating: -1 })
                .limit(5);

        }

        let reply = "";

        books.forEach(book => {

            reply += `
📚 <b>${book.title}</b><br>

👨 Author : ${book.author}<br>

⭐ Rating : ${book.rating || 0}<br>

${book.available ? "✅ Available" : "❌ Unavailable"}

<hr>
`;

        });

        res.json({ reply });

    } catch (err) {

        console.log(err);

        res.json({

            reply: "Sorry, I couldn't find any books."

        });

    }

});

module.exports = router;