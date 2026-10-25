/** @type {import('tailwindcss').Config} */

module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#1a5e63",
        secondary: "#ffc800",
        surface: {
          DEFAULT: "#ffffff",
          text: "#252525",
          container: "#f3f3f3",
          accent: "#dae5e6",
        },
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'sans-serif'],
      },
    },
  },
  plugins: [],
}