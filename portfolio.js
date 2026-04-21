const menuBtn = document.getElementById("menuBtn");
const mobileMenu = document.getElementById("mobileMenu");
const mobileLinks = document.querySelectorAll(".mobile-link");

if (menuBtn && mobileMenu) {
    menuBtn.addEventListener("click", () => {
        mobileMenu.classList.toggle("hidden");
    });
}

mobileLinks.forEach((link) => {
    link.addEventListener("click", () => {
        mobileMenu.classList.add("hidden");
    });
});

const themeToggle = document.getElementById("themeToggle");
const themeIcon = document.getElementById("themeIcon");
const root = document.documentElement;

const savedTheme = localStorage.getItem("portfolio-theme");

if (savedTheme === "dark") {
    root.classList.add("dark");
    if (themeIcon) themeIcon.className = "fa-solid fa-sun";
} else {
    root.classList.remove("dark");
    if (themeIcon) themeIcon.className = "fa-solid fa-moon";
}

if (themeToggle) {
    themeToggle.addEventListener("click", () => {
        root.classList.toggle("dark");

        const isDark = root.classList.contains("dark");
        localStorage.setItem("portfolio-theme", isDark ? "dark" : "light");

        if (themeIcon) {
            themeIcon.className = isDark ? "fa-solid fa-sun" : "fa-solid fa-moon";
        }
    });
}


const sections = document.querySelectorAll("#main");
const navLinks = document.querySelectorAll(".nav-link");

if (navLinks) {
    navLinks.forEach((link) => {
        link.addEventListener("click", () => {
            sections.forEach((section) => {
                section.classList.remove("active");
            });
            link.classList.add("active");
        });
    });
}


const form = document.getElementById("contactForm");
const nameInput = document.getElementById("name");
const emailInput = document.getElementById("email");
const messageInput = document.getElementById("message");
const formStatus = document.getElementById("formStatus");

function showError(fieldName, message) {
    const errorEl = document.getElementById(`${fieldName}Error`);
    if (!errorEl) return;
    errorEl.textContent = message;
    errorEl.classList.remove("hidden");
}

function clearError(fieldName) {
    const errorEl = document.getElementById(`${fieldName}Error`);
    if (!errorEl) return;
    errorEl.textContent = "";
    errorEl.classList.add("hidden");
}

function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

if (form) {
    form.addEventListener("submit", function (e) {
        e.preventDefault();

        // clear previous errors
        clearError("name");
        clearError("email");
        clearError("message");
        formStatus.textContent = "";

        const number = "2349159885788";
        const name = nameInput.value.trim();
        const email = emailInput.value.trim();
        const message = messageInput.value.trim();

        // validate step-by-step (early return)
        if (!name) {
            showError("name", "Please enter your name");
            return;
        }

        if (!email) {
            showError("email", "Please enter your email");
            return;
        }

        if (!validateEmail(email)) {
            showError("email", "Please enter a valid email");
            return;
        }

        if (!message) {
            showError("message", "Please enter your message");
            return;
        }

        // build WhatsApp message
        const whatsappMessage =
            `Hello, my name is ${name}.%0A` +
            `Email: ${email}%0A%0A` +
            `Message: ${message}`;

        const whatsappURL = `https://wa.me/${number}?text=${whatsappMessage}`;

        window.open(whatsappURL, "_blank");

        formStatus.textContent = "Redirecting to WhatsApp...";
    });
}



