/** @type {import('tailwindcss').Config} */
const config = require("tailwindconfig");

module.exports = {
  ...config,
  content: [...config.content, "./public/**"],
};
