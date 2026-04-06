const menuBtn = document.getElementById("menuBtn");
const mobileMenu = document.getElementById("mobileMenu");
const mobileLinks = document.querySelectorAll(".mobile-link");

menuBtn.addEventListener("click", () => {
    mobileMenu.classList.toggle("hidden");
});

mobileLinks.forEach((link) => {
    link.addEventListener("click", () => {
        mobileMenu.classList.add("hidden");
    });
});


let themeToggle = document.getElementById("themeToggle");
let themeIcon = document.getElementById("themeIcon");
let root = document.documentElement;

let savedTheme = localStorage.getItem("portfolio-theme");

if (savedTheme === "dark") {
    root.classList.add("dark");
    themeIcon.className = "fa-solid fa-sun";
} else {
    root.classList.remove("dark");
    themeIcon.className = "fa-solid fa-moon";
}

themeToggle.addEventListener("click", () => {
    root.classList.toggle("dark");

    let isDark = root.classList.contains("dark");
    localStorage.setItem("portfolio-theme", isDark ? "light" : "dark");
    themeIcon.className = isDark ? "fa-solid fa-sun" : "fa-solid fa-moon";
});


let sections = document.querySelectorAll("#main");
let navLinks = document.querySelectorAll(".nav-link");

function updateActiveNav() {
    let currentId = "";

    sections.forEach((section) => {
        let sectionTop = section.offsetTop - 120;
        let sectionHeight = section.offsetHeight;

        if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
            currentId = section.getAttribute("id");
        }
    });

    navLinks.forEach((link) => {
        link.classList.remove("text-accent");

        if (link.getAttribute("href") === `#${currentId}`) {
            link.classList.add("text-accent");
        }
    });
}

window.addEventListener("scroll", updateActiveNav);
updateActiveNav();


let revealItems = document.querySelectorAll(".reveal");

revealItems.forEach((item) => {
    item.classList.add(
        "opacity-0",
        "translate-y-6",
        "transition",
        "duration-700",
        "ease-out"
    );
});

const revealObserver = new IntersectionObserver(
    (entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.remove("opacity-0", "translate-y-6");
                entry.target.classList.add("opacity-100", "translate-y-0");
                revealObserver.unobserve(entry.target);
            }
        });
    },
    {
        threshold: 0.12,
    }
);

revealItems.forEach((item) => revealObserver.observe(item));

let backToTop = document.getElementById("backToTop");

window.addEventListener("scroll", () => {
    if (window.scrollY > 500) {
        backToTop.classList.remove("hidden");
        backToTop.classList.add("flex");
    } else {
        backToTop.classList.add("hidden");
        backToTop.classList.remove("flex");
    }
});

backToTop.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
});


let contactForm = document.getElementById("contactForm");
let formStatus = document.getElementById("formStatus");

function showError(fieldName, message) {
    let errorEl = document.querySelector(`[data-error-for="${fieldName}"]`);
    if (!errorEl) return;
    errorEl.textContent = message;
    errorEl.classList.remove("hidden");
}

function clearError(fieldName) {
    let errorEl = document.querySelector(`[data-error-for="${fieldName}"]`);
    if (!errorEl) return;
    errorEl.textContent = "";
    errorEl.classList.add("hidden");
}

function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

contactForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const formData = new FormData(contactForm);
    const name = formData.get("name").trim();
    const email = formData.get("email").trim();
    const subject = formData.get("subject").trim();
    const message = formData.get("message").trim();

    let isValid = true;
    formStatus.textContent = "";

    ["name", "email", "subject", "message"].forEach(clearError);

    if (!name) {
        showError("name", "Please enter your name.");
        isValid = false;
    }

    if (!email) {
        showError("email", "Please enter your email.");
        isValid = false;
    } else if (!validateEmail(email)) {
        showError("email", "Please enter a valid email address.");
        isValid = false;
    }

    if (!subject) {
        showError("subject", "Please add a subject.");
        isValid = false;
    }

    if (!message) {
        showError("message", "Please enter your message.");
        isValid = false;
    } else if (message.length < 10) {
        showError("message", "Your message should be at least 10 characters.");
        isValid = false;
    }

    if (!isValid) {
        formStatus.textContent = "Please fix the highlighted fields.";
        formStatus.className = "text-sm text-red-500";
        return;
    }

    formStatus.textContent = "Message ready. Connect this form to Formspree, EmailJS, or a backend endpoint.";
    formStatus.className = "text-sm text-green-600 dark:text-green-400";

    contactForm.reset();
});