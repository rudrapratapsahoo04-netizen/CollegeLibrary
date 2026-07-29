// ==============================
// NAVBAR SCROLL EFFECT
// ==============================

window.addEventListener("scroll", () => {

    const navbar = document.querySelector(".custom-navbar");

    if (!navbar) return;

    if (window.scrollY > 50) {

        navbar.classList.add("navbar-scrolled");

    } else {

        navbar.classList.remove("navbar-scrolled");

    }

});


// ==============================
// AI CHATBOT
// ==============================

const chatbotBtn = document.getElementById("chatbot-btn");
const chatbotBox = document.getElementById("chatbot-box");
const closeChatBtn = document.getElementById("closeChat");

const sendBtn = document.getElementById("sendBtn");
const input = document.getElementById("userMessage");
const chatBody = document.getElementById("chat-body");


// Open Chat

if (chatbotBtn && chatbotBox) {

    chatbotBtn.addEventListener("click", () => {

        chatbotBox.style.display = "flex";

        if (input) input.focus();

    });

}


// Close Chat

if (closeChatBtn && chatbotBox) {

    closeChatBtn.addEventListener("click", () => {

        chatbotBox.style.display = "none";

    });

}


// Function to Send Message

async function sendMessage() {

    if (!input || !chatBody) return;

    const message = input.value.trim();

    if (message === "") return;

    // User Message

    chatBody.innerHTML += `

        <div class="user-msg">

            <b>🧑 You</b><br>

            ${message}

        </div>

    `;

    chatBody.scrollTop = chatBody.scrollHeight;

    input.value = "";

    try {

        const res = await fetch("/chat", {

            method: "POST",

            headers: {

                "Content-Type": "application/json"

            },

            body: JSON.stringify({

                message

            })

        });

        const data = await res.json();

        chatBody.innerHTML += `

            <div class="bot-msg">

                <b>🤖 AI Librarian</b><br><br>

                ${data.reply}

            </div>

        `;

    } catch (err) {

        console.log(err);

        chatBody.innerHTML += `

            <div class="bot-msg">

                ❌ Unable to connect to AI.

            </div>

        `;

    }

    chatBody.scrollTop = chatBody.scrollHeight;

}


// Send Button

if (sendBtn) {

    sendBtn.addEventListener("click", sendMessage);

}


// Press Enter

if (input) {

    input.addEventListener("keypress", function (e) {

        if (e.key === "Enter") {

            e.preventDefault();

            sendMessage();

        }

    });

}


// ==============================
// PWA INSTALL
// ==============================

let deferredPrompt;

window.addEventListener("beforeinstallprompt", (e) => {

    e.preventDefault();

    deferredPrompt = e;

    // Sirf ek baar popup dikhana
    if (!localStorage.getItem("installPromptShown")) {

        localStorage.setItem("installPromptShown", "true");

        setTimeout(() => {

            const modal = new bootstrap.Modal(
                document.getElementById("installModal")
            );

            modal.show();

        }, 3000);

    }

});

const installNow = document.getElementById("installNow");

if (installNow) {

    installNow.addEventListener("click", async () => {

        if (!deferredPrompt) return;

        deferredPrompt.prompt();

        const choice = await deferredPrompt.userChoice;

        if (choice.outcome === "accepted") {

            console.log("App Installed");

        } else {

            console.log("Installation Cancelled");

        }

        deferredPrompt = null;

        bootstrap.Modal.getInstance(
            document.getElementById("installModal")
        ).hide();

    });

}


// ==============================
// SERVICE WORKER
// ==============================

if ("serviceWorker" in navigator) {

    window.addEventListener("load", () => {

        navigator.serviceWorker.register("/sw.js")

            .then(() => {

                console.log("✅ PWA Installed");

            })

            .catch(err => {

                console.log(err);

            });

    });

}
/*===========================
      SHARE APP
===========================*/

const shareBtn = document.getElementById("shareBtn");

const copyBtn = document.getElementById("copyBtn");

shareBtn?.addEventListener("click", async () => {

    const shareData = {

        title: "📚 College Library",

        text: "Explore thousands of books with AI Librarian, PDF Reader & Smart Features.",

        url: window.location.origin

    };

    if (navigator.share) {

        try {

            await navigator.share(shareData);

        } catch (err) {

            console.log(err);

        }

    } else {

        navigator.clipboard.writeText(window.location.origin);

        alert("✅ Website link copied successfully!");

    }

});

copyBtn?.addEventListener("click", () => {

    navigator.clipboard.writeText(window.location.origin);

    copyBtn.innerHTML = "✅ Copied";

    setTimeout(() => {

        copyBtn.innerHTML = "📋 Copy Link";

    }, 2000);

});

/*=========================
        PRELOADER
=========================*/

window.addEventListener("load",()=>{

const loader=document.getElementById("preloader");

setTimeout(()=>{

loader.classList.add("hide-loader");

},1500);

});



const search=document.getElementById("searchBook");

if(search){

search.addEventListener("keyup",()=>{

const value=search.value.toLowerCase();

document.querySelectorAll(".admin-table tbody tr").forEach(row=>{

row.style.display=row.innerText.toLowerCase().includes(value)

? ""

: "none";

});

});

}