/** @type {import('tailwindcss').Config} */
const defaultTheme = require("tailwindcss/defaultTheme");
const withMT = require("@material-tailwind/react/utils/withMT");

module.exports = withMT({
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        "brand-covenant": "#12172B",
        "brand-bond-blue": "#40749B",
        "brand-texas-rose": "#F2A94A",
        "brand-champagne": "#F0DEC4",
        "brand-opal": "#9CC1C7",
      },
      fontFamily: {
        sans: ["PP Fraktion Sans", ...defaultTheme.fontFamily.sans],
        circular: ["Circular Std", ...defaultTheme.fontFamily.serif],
      },
    },
  },
  plugins: [],
});
