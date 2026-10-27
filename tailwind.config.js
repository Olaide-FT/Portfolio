/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        accent: "#f95e4d",
      },
      fontFamily: {
        sans: ["Instrument Sans", "sans-serif"],
        display: ["Syne", "sans-serif"],
      },
      keyframes: {
        orbit: {
          from: { transform: "translate(-50%, -50%) rotate(0deg)" },
          to: { transform: "translate(-50%, -50%) rotate(360deg)" },
        },
        "counter-orbit-clockwise": {
          from: { transform: "rotate(0deg)" },
          to: { transform: "rotate(360deg)" },
        },
        "counter-orbit": {
          from: { transform: "rotate(0deg)" },
          to: { transform: "rotate(-360deg)" },
        },
      },
      animation: {
        "orbit-slow": "orbit 48s linear infinite",
        "orbit-reverse": "orbit 40s linear infinite reverse",
        "counter-orbit-slow": "counter-orbit 48s linear infinite",
        "counter-orbit-clockwise": "counter-orbit-clockwise 40s linear infinite",
      },
    },
  },
  plugins: [],
};
