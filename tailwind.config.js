/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      animation: {
        "text-reveal": "text-reveal 1.5s cubic-bezier(0.77, 0, 0.175, 1) 0.5s",
      },
      keyframes: {
        "text-reveal": {
          "0%": {
            transform: "translate(0, 100%)",
          },
          "100%": {
            transform: "translate(0, 0)",
          },
        },
      },
      colors: {
        purple: {
          50: "#f4f0ff",
          200: "#dccdff",
          400: "#a872ff",
          600: "#8712ff",
          800: "#6900db",
          950: "#330078",
        },
        green: {
          white: "#e9f7f1",
          1: "#b4dec1",
          10: "#80bf94",
          100: "#74c476",
          150: "#3a8d54",
          200: "#005a32",
          300: "#001c10",
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
        black: {
          light: "#1a1a1a", // Slightly lighter black
          lighter: "#2a2a2a", // Lighter shade for accents
          dark: "#000000", // Pure black
          text: "#e5e5e5", // Soft white for text
          muted: "#888888", // Muted gray for secondary text
          highlight: "#3d3d3d", // Highlight areas
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
