// document.addEventListener("DOMContentLoaded", () => {

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

function updateActiveNav() {
    const currentId = "";

    sections.forEach((section) => {
        const sectionTop = section.offsetTop - 120;
        const sectionHeight = section.offsetHeight;

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


const revealItems = document.querySelectorAll(".reveal");

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

const backToTop = document.getElementById("backToTop");

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


const contactForm = document.getElementById("contactForm");
const formStatus = document.getElementById("formStatus");

function showError(fieldName, message) {
    const errorEl = document.querySelector(`[data-error-for="${fieldName}"]`);
    if (!errorEl) return;
    errorEl.textContent = message;
    errorEl.classList.remove("hidden");
}

function clearError(fieldName) {
    const errorEl = document.querySelector(`[data-error-for="${fieldName}"]`);
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
