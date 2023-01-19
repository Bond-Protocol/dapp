/** @type {import('tailwindcss').Config} */
const config = require("tailwindconfig");

module.exports = {
  ...config,
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "../../packages/**/*.{ts,tsx}",
  ],
};
