/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        purple: {
          50: "#f4f0ff",
          200: "#dccdff",
          400: "#a872ff",
          600: "#8712ff",
          800: "#6900db",
          950: "#330078",
        },
        blue: {
          50: "#f0f1ff",
          200: "#cdcfff",
          400: "#7a72ff",
          600: "#3b12ff",
          800: "#2200db",
          950: "#0c0078",
        },
        pink: {
          50: "#fff2fc",
          200: "#ffc7f1",
          400: "#ff61ce",
          600: "#f405bd",
          800: "#a5037a",
          950: "#5c0042",
        },
      },
      fontFamily: {
        bebas: ["bebas", "sans-serif"],
        sans: ["geist", "sans-serif"],
      },
    },
  },
  plugins: [],
};
