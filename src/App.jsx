import { useEffect, useRef, useState } from "react";
import Testimonials from "./components/Testimonials.jsx";
import DiscoveryBooking from "./components/DiscoveryBooking.jsx";

const ecommerceImage = new URL("../pictures/E-commerce.png", import.meta.url).href;
const musicPlayerImage = new URL("../pictures/Music Player.png", import.meta.url).href;
const recipeSharingImage = new URL("../pictures/Recipe Sharing.png", import.meta.url).href;

const projects = [
  {
    name: "E-commerce",
    category: "Landing page",
    kind: "Product UI",
    image: ecommerceImage,
    description:
      "A responsive landing page focused on clear product presentation, thoughtful layout, and polished shopping experiences.",
    tools: ["HTML", "Tailwind CSS", "JavaScript"],
    demo: "https://product-card-eight.vercel.app/",
    source: "https://github.com/Olaide-FT/Product_Card",
  },
  {
    name: "Music Player",
    category: "Interactive",
    kind: "Web experience",
    image: musicPlayerImage,
    description:
      "A responsive music player with intuitive controls, a clean interface, and seamless playback functionality.",
    tools: ["HTML", "Tailwind CSS", "JavaScript"],
    demo: "https://code-alpha-musicplayer-mu.vercel.app/",
    source: "https://github.com/Olaide-FT/CodeAlpha_Musicplayer",
  },
  {
    name: "Recipe Sharing",
    category: "Personal brand",
    kind: "Community website",
    image: recipeSharingImage,
    description:
      "A welcoming recipe-sharing website with intuitive navigation and a responsive, user-friendly interface.",
    tools: ["HTML", "Tailwind CSS", "JavaScript", "CSS"],
    demo: "https://dish-share-p42u.vercel.app/",
    source: "https://github.com/Olaide-FT/Dish_Share",
  },
];

const filters = ["All work", "Landing page", "Interactive", "Personal brand"];

const codingTools = [
  { name: "HTML5", icon: "fa-brands fa-html5" },
  { name: "CSS3", icon: "fa-brands fa-css3-alt" },
  { name: "JavaScript", icon: "fa-brands fa-js" },
  { name: "React", icon: "fa-brands fa-react" },
  { name: "Tailwind CSS", icon: "fa-solid fa-wind" },
  { name: "Node.js", icon: "fa-brands fa-node-js" },
  { name: "MongoDB", icon: "fa-solid fa-database" },
  { name: "Express.js", icon: "fa-solid fa-server" },
  { name: "GitHub", icon: "fa-brands fa-github" },
  { name: "Figma", icon: "fa-brands fa-figma" },
];

const orbitTools = [
  { name: "HTML5", icon: "fa-brands fa-html5", position: "left-1/2 top-0 -translate-x-1/2 -translate-y-1/2" },
  { name: "CSS3", icon: "fa-brands fa-css3-alt", position: "right-[14%] top-[14%] translate-x-1/2 -translate-y-1/2" },
  { name: "JavaScript", icon: "fa-brands fa-js", position: "right-0 top-1/2 translate-x-1/2 -translate-y-1/2" },
  { name: "React", icon: "fa-brands fa-react", position: "right-[14%] bottom-[14%] translate-x-1/2 translate-y-1/2" },
  { name: "Tailwind CSS", icon: "fa-solid fa-wind", position: "left-1/2 bottom-0 -translate-x-1/2 translate-y-1/2" },
  { name: "GitHub", icon: "fa-brands fa-github", position: "left-[14%] bottom-[14%] -translate-x-1/2 translate-y-1/2" },
  { name: "Node.js", icon: "fa-brands fa-node-js", position: "left-0 top-1/2 -translate-x-1/2 -translate-y-1/2" },
  { name: "MongoDB", icon: "fa-solid fa-database", position: "left-[14%] top-[14%] -translate-x-1/2 -translate-y-1/2" },
  { name: "Express.js", icon: "fa-solid fa-server", position: "left-1/2 top-0 -translate-x-1/2 -translate-y-1/2" },
  { name: "Figma", icon: "fa-brands fa-figma", position: "right-0 top-1/2 translate-x-1/2 -translate-y-1/2" },
  { name: "npm", icon: "fa-brands fa-npm", position: "left-1/2 bottom-0 -translate-x-1/2 translate-y-1/2" },
  { name: "API development", icon: "fa-solid fa-code", position: "left-0 top-1/2 -translate-x-1/2 -translate-y-1/2" },
];

const timeline = [
  {
    date: "2026",
    title: "Growing as a MERN developer",
    description:
      "Building responsive interfaces and expanding my skills across the MongoDB, Express, React, and Node.js stack.",
  },
  {
    date: "2026",
    title: "Learning through real projects",
    description:
      "Practising JavaScript, responsive design, and collaborative workflows by taking projects from idea to deployment.",
  },
  {
    date: "The beginning",
    title: "A curiosity for the web",
    description:
      "Started with HTML and CSS, then discovered how thoughtful design and interactive code can make websites more useful.",
  },
];

function ArrowIcon() {
  return <i className="fa-solid fa-arrow-up-right-from-square" aria-hidden="true" />;
}

function OrbitIcon({ tool, counterAnimation }) {
  return (
    <span
      className={`absolute ${tool.position}`}
    >
      <span
        className={`grid h-11 w-11 place-items-center rounded-2xl  bg-white text-lg text-accent shadow-lg shadow-slate-900/10 transition hover:scale-110 hover:border-accent dark:border-slate-600 dark:bg-slate-900 dark:shadow-black/30 sm:h-14 sm:w-14 sm:text-xl ${counterAnimation}`}
        role="img"
        aria-label={tool.name}
      >
        <i className={tool.icon} aria-hidden="true" />
      </span>
    </span>
  );
}

function StatCounter({ target, decimals = 0, suffix, title, detail }) {
  const [count, setCount] = useState(0);
  const counterRef = useRef(null);

  useEffect(() => {
    const element = counterRef.current;
    if (!element) return undefined;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion || !("IntersectionObserver" in window)) {
      setCount(target);
      return undefined;
    }

    let frameId;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) {
        cancelAnimationFrame(frameId);
        setCount(0);
        return;
      }

      const startTime = performance.now();
      const duration = 1400;
      const updateCount = (now) => {
        const progress = Math.min((now - startTime) / duration, 1);
        setCount(target * (1 - (1 - progress) ** 3));
        if (progress < 1) frameId = requestAnimationFrame(updateCount);
      };

      cancelAnimationFrame(frameId);
      frameId = requestAnimationFrame(updateCount);
    }, { threshold: 0.55 });

    observer.observe(element);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frameId);
    };
  }, [target]);

  return (
    <article
      className="flex min-h-[130px] flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white/90 p-4 text-center shadow-sm dark:border-slate-800 dark:bg-slate-900/90 sm:min-h-[145px] sm:p-5"
      ref={counterRef}
      aria-label={`${target}${suffix} ${title}. ${detail}`}
    >
      <p className="font-display text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
        <span aria-hidden="true">{count.toFixed(decimals)}{suffix}</span>
      </p>
      <h3 className="mt-1 text-xs font-bold text-slate-800 dark:text-slate-100 sm:text-sm">{title}</h3>
      <p className="mt-1 text-[10px] leading-4 text-slate-500 dark:text-slate-400">{detail}</p>
    </article>
  );
}

const portfolioStats = [
  { target: 1, decimals: 1, suffix: "+ Years", title: "Production Experience", detail: "Python & React Architectures" },
  { target: 10, suffix: "+", title: "Live Apps", detail: "From SaaS to E-Commerce" },
  { target: 100, suffix: "%", title: "On-Time Completion", detail: "Zero Missed Deadlines" },
  { target: 300, suffix: "+", title: "Engineering Commits", detail: "Clean Modular Repositories" },
];

function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [lightTheme, setLightTheme] = useState(
    () => window.localStorage.getItem("portfolio-theme") !== "dark",
  );
  const [activeFilter, setActiveFilter] = useState("All work");
  const [formErrors, setFormErrors] = useState({});
  const [formStatus, setFormStatus] = useState("");

  useEffect(() => {
    const revealElements = document.querySelectorAll("[data-reveal]");
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReducedMotion || !("IntersectionObserver" in window)) {
      revealElements.forEach((element) => element.classList.add("is-visible"));
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          entry.target.classList.toggle("is-visible", entry.isIntersecting);
        });
      },
      { threshold: 0.08, rootMargin: "0px 0px -24px 0px" },
    );

    revealElements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, []);

  const toggleTheme = () => {
    const nextIsLight = !lightTheme;
    setLightTheme(nextIsLight);
    window.localStorage.setItem("portfolio-theme", nextIsLight ? "light" : "dark");
  };

  const closeMenu = () => setMenuOpen(false);

  const handleContactSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const name = formData.get("name").trim();
    const email = formData.get("email").trim();
    const message = formData.get("message").trim();
    const errors = {};

    if (!name) errors.name = "Please enter your name.";
    if (!email) {
      errors.email = "Please enter your email.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = "Please enter a valid email address.";
    }
    if (!message) errors.message = "Please enter a message.";

    setFormErrors(errors);
    setFormStatus("");
    if (Object.keys(errors).length > 0) return;

    const whatsappMessage = [
      `Hello, my name is ${name}.`,
      `Email: ${email}`,
      "",
      `Message: ${message}`,
    ].join("\n");
    const whatsappUrl = `https://wa.me/2349159885788?${new URLSearchParams({ text: whatsappMessage })}`;

    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
    setFormStatus("Opening WhatsApp with your message.");
    event.currentTarget.reset();
  };

  const visibleProjects =
    activeFilter === "All work"
      ? projects
      : projects.filter((project) => project.category === activeFilter);

  return (
    <div className={lightTheme ? "" : "dark"}>
      <div className="min-h-screen overflow-x-clip bg-white font-sans text-slate-900 transition-colors duration-300 dark:bg-slate-950 dark:text-slate-100">
        <a
          className="fixed left-3 top-3 z-50 -translate-y-20 rounded-lg bg-accent px-4 py-3 text-white focus:translate-y-0"
          href="#main"
        >
          Skip to content
        </a>

        <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/90 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/90">
          <div className="mx-auto flex min-h-[72px] w-full max-w-6xl items-center justify-between px-5 sm:px-8 lg:px-12">
            <a className="flex items-center gap-0 sm:gap-3" href="#hero" onClick={closeMenu} aria-label="Fareedah Olaide, home">
              <span className="grid h-10 w-10 place-items-center rounded-xl border border-slate-200 bg-slate-50 font-display text-sm font-extrabold tracking-tighter text-accent dark:border-slate-700 dark:bg-slate-900">
                FO
              </span>
              <span className="hidden font-display text-sm font-bold tracking-tight sm:inline">
                Fareedah Olaide
              </span>
            </a>

            <nav
              className={`${menuOpen ? "flex" : "hidden"} absolute left-0 right-0 top-full flex-col gap-1 border-b border-slate-200 bg-white px-5 py-3 text-sm text-slate-600 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300 md:static md:flex md:flex-row md:items-center md:gap-8 md:border-0 md:bg-transparent md:p-0`}
              aria-label="Main navigation"
            >
              <a className="rounded-lg px-3 py-3 transition hover:text-accent md:px-0" href="#about" onClick={closeMenu}>About</a>
              <a className="rounded-lg px-3 py-3 transition hover:text-accent md:px-0" href="#work" onClick={closeMenu}>Selected work</a>
              <a className="rounded-lg px-3 py-3 transition hover:text-accent md:px-0" href="#testimonials" onClick={closeMenu}>Testimonials</a>
              <a className="rounded-lg px-3 py-3 transition hover:text-accent md:px-0" href="#booking" onClick={closeMenu}>Book a call</a>
              <a className="rounded-lg px-3 py-3 transition hover:text-accent md:px-0" href="#contact" onClick={closeMenu}>Contact</a>
            </nav>

            <div className="flex items-center gap-2">
              <button
                className="grid h-10 w-10 place-items-center rounded-full border border-slate-200 text-slate-600 transition hover:border-accent hover:text-accent dark:border-slate-700 dark:text-slate-300"
                type="button"
                onClick={toggleTheme}
                aria-label={`Switch to ${lightTheme ? "dark" : "light"} theme`}
              >
                <i className={`fa-solid ${lightTheme ? "fa-moon" : "fa-sun"}`} aria-hidden="true" />
              </button>
              <a
                className="grid h-10 w-10 place-items-center rounded-full bg-accent text-sm text-white transition hover:-translate-y-0.5 hover:bg-[#e84c3c]"
                href="/Fareedah-Olaide-CV.pdf"
                download="Fareedah-Olaide-CV.pdf"
                aria-label="Download Fareedah Olaide's CV"
                title="Download CV"
              >
                <i className="fa-solid fa-download" aria-hidden="true" />
              </a>
              <button
                className="grid h-10 w-10 place-items-center rounded-full border border-slate-200 text-slate-600 dark:border-slate-700 dark:text-slate-300 md:hidden"
                type="button"
                onClick={() => setMenuOpen(!menuOpen)}
                aria-expanded={menuOpen}
                aria-label={menuOpen ? "Close menu" : "Open menu"}
              >
                <i className={`fa-solid ${menuOpen ? "fa-xmark" : "fa-bars"}`} aria-hidden="true" />
              </button>
            </div>
          </div>
        </header>

        <main id="main">
          <section
            className="relative mx-auto grid min-h-[calc(100svh-72px)] w-full  max-w-6xl grid-cols-1 items-center gap-10 px-5 py-14 sm:px-8 sm:py-16 md:grid-cols-[1fr_0.9fr] md:gap-8 lg:px-12"
            id="hero"
          >
            <div className="relative z-10" data-reveal>
              <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-accent/20 bg-accent/5 px-4 py-2 text-[10px] font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-300">
                <span className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.5)]" />
                Open to MERN developer opportunities
              </p>
              <h1 className="reveal-text mb-5 font-display text-4xl font-bold leading-[0.98] tracking-[-0.08em] sm:text-4xl lg:text-6xl xl:text-7xl">
                I&apos;m Fareedah
                <br />
                Olaide
              </h1>
              <p className="mb-7 max-w-xl text-base leading-7 text-slate-600 dark:text-slate-400 sm:text-lg sm:leading-8">
                MERN developer crafting thoughtful, responsive digital experiences
                that make the web feel a little more human.
              </p>
              <div className="flex flex-wrap gap-3">
                <a
                  className="inline-flex min-h-12 items-center justify-center gap-3 rounded-xl bg-accent px-5 text-xs font-semibold text-white transition hover:-translate-y-0.5 hover:bg-[#e84c3c]"
                  href="#work"
                >
                  Explore my work <ArrowIcon />
                </a>
                <a
                  className="inline-flex min-h-12 items-center justify-center gap-3 rounded-xl border border-slate-300 px-5 text-xs font-semibold text-slate-800 transition hover:-translate-y-0.5 hover:border-accent hover:text-accent dark:border-slate-700 dark:text-slate-100"
                  href="#about"
                >
                  A little about me <i className="fa-solid fa-arrow-down" aria-hidden="true" />
                </a>
              </div>
              <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-[11px] text-slate-500 dark:text-slate-400">
                <span className="inline-flex items-center gap-2"><i className="fa-solid fa-location-dot text-accent" aria-hidden="true" /> Nigeria</span>
                <span className="inline-flex items-center gap-2"><i className="fa-solid fa-layer-group text-accent" aria-hidden="true" /> MongoDB · Express · React · Node</span>
              </div>
            </div>

            <div
              className="relative mx-auto aspect-square w-full max-w-[500px] overflow-hidden rounded-2xl bg-[radial-gradient(ellipse_at_center,rgba(249,94,77,0.12),transparent_58%)] dark:border-slate-800 dark:bg-[radial-gradient(ellipse_at_center,rgba(249,94,77,0.18),transparent_58%)]"
              data-reveal
              id="expertise"
              role="group"
              aria-label="Orbiting tools and technologies"
            >
              <div className="absolute left-1/2 top-1/2 h-[78%] w-[78%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-slate-300/70 animate-orbit-slow motion-reduce:animate-none dark:border-slate-700/70">
                {orbitTools.slice(0, 8).map((tool) => (
                  <OrbitIcon key={tool.name} tool={tool} counterAnimation="animate-counter-orbit-slow motion-reduce:animate-none" />
                ))}
              </div>
              <div className="absolute left-1/2 top-1/2 h-[54%] w-[54%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-slate-300/60 animate-orbit-reverse motion-reduce:animate-none dark:border-slate-700/70">
                {orbitTools.slice(8).map((tool) => (
                  <OrbitIcon key={tool.name} tool={tool} counterAnimation="animate-counter-orbit-clockwise motion-reduce:animate-none" />
                ))}
              </div>
              <div className="absolute left-1/2 top-1/2 grid h-[30%] w-[30%] -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-accent/40 bg-white text-accent shadow-[0_0_0_10px_rgba(249,94,77,0.06),0_0_45px_rgba(249,94,77,0.16)] dark:bg-slate-900">
                <span className="text-center">
                  <span className="block font-display text-3xl font-extrabold tracking-[-0.1em] sm:text-4xl">FO</span>
                  
                </span>
              </div>
              
            </div>

            <div className="grid grid-cols-2 gap-3 md:col-span-2 md:grid-cols-4 md:gap-4" data-reveal="stagger">
              {portfolioStats.map((stat) => <StatCounter key={stat.title} {...stat} />)}
            </div>

            <a
              className="absolute bottom-5 left-5 inline-flex items-center gap-3 text-[10px] uppercase tracking-widest text-slate-500 sm:left-8 lg:left-12"
              href="#about"
            >
              Scroll to explore <i className="fa-solid fa-arrow-down text-accent" aria-hidden="true" />
            </a>
          </section>

          <section className="mx-auto w-full max-w-6xl border-slate-200 px-5 py-14 dark:border-slate-800 sm:px-8 sm:py-16 lg:px-12" id="about">
            <div className="mb-8 text-center sm:mb-10" data-reveal>
              <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.18em] text-accent">About me</p>
              <h2 className="reveal-text font-display text-4xl font-semibold tracking-[-0.06em] sm:text-5xl">Engineering Foundation</h2>
            </div>
            <div className="grid gap-5 md:grid-cols-2" data-reveal="stagger">
              <article className="flex min-h-[300px] flex-col items-start rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-9">
                <span className="grid h-10 w-10 place-items-center text-2xl text-accent" aria-hidden="true">✦</span>
                <h3 className="mb-3 mt-4 font-display text-xl font-bold tracking-tight">MERN foundations</h3>
                <p className="mb-6 text-sm leading-7 text-slate-600 dark:text-slate-400">
                  I&apos;m <strong className="text-slate-900 dark:text-white">Fareedah Olaide</strong>, a MERN developer who enjoys
                  bringing ideas to life through clean code and considered design.
                  I build responsive websites and interactive experiences, learning
                  with every project and paying attention to the details that make
                  an interface feel easy to use.
                </p>
                <div className="mt-auto flex flex-wrap gap-2">
                  <span className="grid h-9 w-9 place-items-center rounded-full border border-slate-200 bg-slate-50 text-accent dark:border-slate-700 dark:bg-slate-950" role="img" aria-label="React"><i className="fa-brands fa-react" aria-hidden="true" /></span>
                  <span className="grid h-9 w-9 place-items-center rounded-full border border-slate-200 bg-slate-50 text-accent dark:border-slate-700 dark:bg-slate-950" role="img" aria-label="Node.js"><i className="fa-brands fa-node-js" aria-hidden="true" /></span>
                </div>
              </article>
              <article className="flex min-h-[300px] flex-col items-start rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-9">
                <span className="grid h-10 w-10 place-items-center text-2xl text-accent" aria-hidden="true">◈</span>
                <h3 className="mb-3 mt-4 font-display text-xl font-bold tracking-tight">Thoughtful interfaces</h3>
                <p className="mb-6 text-sm leading-7 text-slate-600 dark:text-slate-400">
                  I care about how a website works for the people using it. My focus
                  is on clear layouts, responsive design, and useful interactions —
                  bringing structure and style together to make the experience feel
                  natural across screen sizes.
                </p>
                <div className="mt-auto grid w-full gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-950">
                  <div className="flex items-center justify-between gap-4 text-xs"><span className="text-slate-500 dark:text-slate-400">Design approach</span><strong>Clear &amp; considered</strong></div>
                  <div className="flex items-center justify-between gap-4 text-xs"><span className="text-slate-500 dark:text-slate-400">Build approach</span><strong>Responsive by default</strong></div>
                </div>
              </article>
            </div>
            <div className="relative mt-8 overflow-hidden border-y border-slate-200 py-5 dark:border-slate-800" aria-label="Tools I use to code" data-reveal>
              <div className="flex w-max animate-tools-marquee motion-reduce:animate-none">
                {[0, 1].map((copy) => (
                  <ul
                    className="flex shrink-0 items-center gap-8 pr-8 sm:gap-12 sm:pr-12"
                    key={copy}
                    aria-hidden={copy === 1}
                  >
                    {codingTools.map((tool) => (
                      <li className="flex items-center gap-2 whitespace-nowrap text-xs font-medium text-slate-600 dark:text-slate-300" key={tool.name}>
                        <i className={`${tool.icon} text-base text-accent`} aria-hidden="true" />
                        {tool.name}
                      </li>
                    ))}
                  </ul>
                ))}
              </div>
            </div>
          </section>

          <section className="mx-auto w-full max-w-6xl border-slate-200 px-5 py-14 dark:border-slate-800 sm:px-8 sm:py-16 lg:px-12" id="work">
            <div className="mb-7 text-center sm:mb-9" data-reveal>
              <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.18em] text-accent">Featured projects</p>
              <h2 className="reveal-text font-display text-4xl font-semibold tracking-[-0.06em] sm:text-5xl">Selected Works</h2>
              <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-slate-600 dark:text-slate-400">
                A selection of projects where I bring thoughtful design and development together.
              </p>
            </div>

            <div className="mb-8 flex justify-start overflow-x-auto pb-2 sm:justify-center" aria-label="Filter projects">
              <div className="flex min-w-max items-center gap-2 sm:gap-4">
                {filters.map((filter) => (
                  <button
                    className={`rounded-full px-5 py-3 text-xs font-semibold transition ${activeFilter === filter ? "bg-accent text-white shadow-md shadow-accent/20" : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"}`}
                    key={filter}
                    type="button"
                    onClick={() => setActiveFilter(filter)}
                    aria-pressed={activeFilter === filter}
                  >
                    {filter}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3" data-reveal="stagger">
              {visibleProjects.map((project, index) => (
                <article className="group overflow-hidden rounded-2xl border border-slate-200 bg-white transition hover:-translate-y-1 hover:border-accent/50 dark:border-slate-800 dark:bg-slate-900" key={project.name}>
                  <a
                    className="relative block aspect-[1.42] overflow-hidden bg-slate-100 dark:bg-slate-800"
                    href={project.demo}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Open ${project.name} live demo`}
                  >
                    <img className="h-full w-full object-cover transition duration-500 group-hover:scale-105" src={project.image} alt={`${project.name} project preview`} />
                    <span className="absolute left-3 top-3 grid h-8 min-w-9 place-items-center rounded-full border border-white/30 bg-slate-950/60 px-2 text-[10px] text-white">0{index + 1}</span>
                    <span className="absolute right-3 top-3 grid h-8 w-8 place-items-center rounded-full border border-white/30 bg-slate-950/60 text-xs text-white"><ArrowIcon /></span>
                  </a>
                  <div className="p-5">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="mb-1 text-[9px] font-bold uppercase tracking-widest text-slate-500">{project.kind}</p>
                        <h3 className="font-display text-lg font-semibold">{project.name}</h3>
                      </div>
                      <span className="rounded-full border border-slate-200 px-3 py-1 text-[9px] text-slate-500 dark:border-slate-700 dark:text-slate-400">{project.category}</span>
                    </div>
                    <p className="my-4 min-h-[3.5rem] text-xs leading-6 text-slate-600 dark:text-slate-400">{project.description}</p>
                    <div className="flex items-end justify-between gap-3  border-slate-200 pt-4 dark:border-slate-800">
                      <div className="flex flex-wrap gap-1.5">
                        {project.tools.map((tool) => <span className="rounded bg-slate-100 px-2 py-1 text-[9px] text-slate-600 dark:bg-slate-800 dark:text-slate-300" key={tool}>{tool}</span>)}
                      </div>
                      <div className="flex gap-2">
                        <a className="grid h-8 w-8 place-items-center rounded-full border border-slate-200 text-xs text-slate-500 hover:border-accent hover:text-accent dark:border-slate-700" href={project.demo} target="_blank" rel="noopener noreferrer" aria-label={`${project.name} live demo`}><ArrowIcon /></a>
                        <a className="grid h-8 w-8 place-items-center rounded-full border border-slate-200 text-xs text-slate-500 hover:border-accent hover:text-accent dark:border-slate-700" href={project.source} target="_blank" rel="noopener noreferrer" aria-label={`${project.name} source code`}><i className="fa-brands fa-github" aria-hidden="true" /></a>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
            <div className="mt-8 text-center" data-reveal>
              <a
                className="inline-flex min-h-12 items-center justify-center gap-3 rounded-full border border-slate-300 px-6 text-xs font-semibold text-slate-800 transition hover:border-accent hover:text-accent dark:border-slate-700 dark:text-slate-100"
                href="https://github.com/Olaide-FT?tab=repositories"
                target="_blank"
                rel="noopener noreferrer"
              >
                View all projects <ArrowIcon />
              </a>
            </div>
          </section>

          <Testimonials />

          <DiscoveryBooking />

          <section className="mx-auto w-full max-w-6xl px-5 pb-12 pt-4 sm:px-8 sm:pb-16 lg:px-12" id="contact">
            <div className="mb-7 text-center sm:mb-8" data-reveal>
              <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.18em] text-accent">Get in touch</p>
              <h2 className="reveal-text font-display text-3xl font-semibold tracking-[-0.055em] sm:text-5xl">Let&apos;s Build Something Meaningful</h2>
            </div>
            <div className="grid items-start gap-5 md:grid-cols-2" data-reveal="stagger">
              <div className="flex flex-col gap-3">
                <a className="flex min-h-[74px] items-center gap-4 rounded-2xl border border-slate-200 bg-white p-4 transition hover:-translate-y-0.5 hover:border-accent/50 dark:border-slate-800 dark:bg-slate-900" href="mailto:olaidefaridat@gmail.com">
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-slate-200 bg-slate-50 text-accent dark:border-slate-700 dark:bg-slate-950"><i className="fa-solid fa-envelope" aria-hidden="true" /></span>
                  <span className="min-w-0"><small className="block text-[10px] font-bold uppercase tracking-widest text-slate-500">Email</small><strong className="break-all text-sm">olaidefaridat@gmail.com</strong></span>
                </a>
                <a className="flex min-h-[74px] items-center gap-4 rounded-2xl border border-slate-200 bg-white p-4 transition hover:-translate-y-0.5 hover:border-accent/50 dark:border-slate-800 dark:bg-slate-900" href="tel:+2349159885788">
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-slate-200 bg-slate-50 text-accent dark:border-slate-700 dark:bg-slate-950"><i className="fa-brands fa-whatsapp" aria-hidden="true" /></span>
                  <span><small className="block text-[10px] font-bold uppercase tracking-widest text-slate-500">WhatsApp / Phone</small><strong className="text-sm">+234 915 988 5788</strong></span>
                </a>
                <a className="flex min-h-[74px] items-center gap-4 rounded-2xl border border-slate-200 bg-white p-4 transition hover:-translate-y-0.5 hover:border-accent/50 dark:border-slate-800 dark:bg-slate-900" href="https://github.com/Olaide-FT" target="_blank" rel="noopener noreferrer">
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-slate-200 bg-slate-50 text-accent dark:border-slate-700 dark:bg-slate-950"><i className="fa-brands fa-github" aria-hidden="true" /></span>
                  <span><small className="block text-[10px] font-bold uppercase tracking-widest text-slate-500">GitHub</small><strong className="text-sm">github.com/Olaide-FT</strong></span>
                </a>
                <a className="flex min-h-[74px] items-center gap-4 rounded-2xl border border-slate-200 bg-white p-4 transition hover:-translate-y-0.5 hover:border-accent/50 dark:border-slate-800 dark:bg-slate-900" href="https://www.linkedin.com/in/olaide-faridat-43286928a?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=ios_app" target="_blank" rel="noopener noreferrer">
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-slate-200 bg-slate-50 text-accent dark:border-slate-700 dark:bg-slate-950"><i className="fa-brands fa-linkedin-in" aria-hidden="true" /></span>
                  <span><small className="block text-[10px] font-bold uppercase tracking-widest text-slate-500">LinkedIn</small><strong className="text-sm">Fareedah Olaide</strong></span>
                </a>
                <div className="flex min-h-[74px] items-center gap-4 rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-slate-200 bg-slate-50 text-accent dark:border-slate-700 dark:bg-slate-950"><i className="fa-solid fa-location-dot" aria-hidden="true" /></span>
                  <span><small className="block text-[10px] font-bold uppercase tracking-widest text-slate-500">Location</small><strong className="text-sm">Nigeria</strong></span>
                </div>
              </div>

              <form className="flex flex-col gap-3 rounded-3xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900 sm:p-7" onSubmit={handleContactSubmit} noValidate>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <label className="sr-only" htmlFor="name">Your name</label>
                    <input className={`min-h-[52px] w-full rounded-xl border bg-slate-50 px-4 text-sm outline-none transition placeholder:text-slate-500 focus:border-accent dark:bg-slate-950 ${formErrors.name ? "border-red-500" : "border-slate-200 dark:border-slate-700"}`} id="name" name="name" placeholder="Your name *" aria-invalid={Boolean(formErrors.name)} aria-describedby={formErrors.name ? "name-error" : undefined} />
                    {formErrors.name && <span className="mt-1 block text-xs text-red-500" id="name-error">{formErrors.name}</span>}
                  </div>
                  <div>
                    <label className="sr-only" htmlFor="email">Your email</label>
                    <input className={`min-h-[52px] w-full rounded-xl border bg-slate-50 px-4 text-sm outline-none transition placeholder:text-slate-500 focus:border-accent dark:bg-slate-950 ${formErrors.email ? "border-red-500" : "border-slate-200 dark:border-slate-700"}`} id="email" name="email" type="email" placeholder="Your email *" aria-invalid={Boolean(formErrors.email)} aria-describedby={formErrors.email ? "email-error" : undefined} />
                    {formErrors.email && <span className="mt-1 block text-xs text-red-500" id="email-error">{formErrors.email}</span>}
                  </div>
                </div>
                <div>
                  <label className="sr-only" htmlFor="message">Tell me about your message</label>
                  <textarea className={`min-h-36 w-full resize-y rounded-xl border bg-slate-50 px-4 py-3 text-sm outline-none transition placeholder:text-slate-500 focus:border-accent dark:bg-slate-950 ${formErrors.message ? "border-red-500" : "border-slate-200 dark:border-slate-700"}`} id="message" name="message" rows="5" placeholder="Tell me about your project, timeline, and goals..." aria-invalid={Boolean(formErrors.message)} aria-describedby={formErrors.message ? "message-error" : undefined} />
                  {formErrors.message && <span className="mt-1 block text-xs text-red-500" id="message-error">{formErrors.message}</span>}
                </div>
                <button className="inline-flex min-h-14 w-full items-center justify-center gap-3 rounded-full bg-accent px-5 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-[#e84c3c]" type="submit">
                  Send Message <ArrowIcon />
                </button>
                <p className="min-h-4 text-xs text-slate-500" role="status">{formStatus}</p>
              </form>
            </div>
          </section>
        </main>

        <footer className="mx-auto grid w-full max-w67xl grid-cols-2 items-center gap-4  border-slate-200 px-5 py-6 dark:border-slate-800 sm:grid-cols-3 sm:px-8 lg:px-12">
          <a className="flex items-center gap-2 font-display text-xs font-bold" href="#hero">
            <span className="grid h-8 w-8 place-items-center rounded-lg  text-accent dark:border-slate-700">FO</span>
            Fareedah Olaide
          </a>
          <p className="col-span-2 m-0 text-[10px]  pt-4 text-slate-500 sm:col-span-1 sm:text-center">Designed with intention. Built with care.</p>
          <a className="justify-self-end text-[10px] text-slate-600 transition hover:text-accent dark:text-slate-400" href="#hero">Back to top ↑</a>
          
        </footer>
      </div>
    </div>
  );
}

export default App;
