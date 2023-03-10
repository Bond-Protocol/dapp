/** @type {import('tailwindcss').Config} */
const plugin = require("tailwindcss/plugin");
const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
  content: ["./src/**/*.{ts,tsx}", "../../packages/**/*.{ts,tsx}"],
  theme: {
    extend: {
      screens: {
        xs: "100px",
        fml: "600px",
      },
      colors: {
        light: {
          base: "#14182D",
          primary: {
            DEFAULT: "#40749B",
            50: "#9DBBC4",
            100: "#8CACBC",
            200: "#7799B0",
            300: "#6589A7",
            500: "#40749B",
            900: "#14182D",
          },
          secondary: {
            DEFAULT: "#E7AC5C",
            10: "#FCFAEC",
            30: "#F4DFAC",
            600: "#73562E",
          },
          black: "#090B15",
          danger: "#FF0606",
          alert: "#FF759A",
          success: "#88F6D7",
          tooltip: "#090B15",
          grey: {
            DEFAULT: "#A3A3A3",
            400: "#A3A3A3",
            500: "#737373",
          },
        },
      },
      fontFamily: {
        sans: ["PlusJakartaSans", ...defaultTheme.fontFamily.sans],
        mono: ["PPFraktionMono", "ComicSans", ...defaultTheme.fontFamily.mono],
        jakarta: ["PlusJakartaSans", ...defaultTheme.fontFamily.sans],
        fraktion: ["PPFraktionSans", ...defaultTheme.fontFamily.sans],
      },
      opacity: {
        15: ".15",
        20: ".20",
      },
    },
  },
  plugins: [
    plugin(function ({ addBase }) {
      //JAKARTA
      addBase({
        "@font-face": {
          fontFamily: "PlusJakartaSans",
          fontWeight: "200",
          src: "url(/fonts/PlusJakartaSans-ExtraLight.woff2) format('woff2')",
          fontDisplay: "swap",
        },
      });
      addBase({
        "@font-face": {
          fontFamily: "PlusJakartaSans",
          fontWeight: "300",
          src: "url(/fonts/PlusJakartaSans-Light.woff2) format('woff2')",
          fontDisplay: "swap",
        },
      });
      addBase({
        "@font-face": {
          fontFamily: "PlusJakartaSans",
          fontWeight: "400",
          src: "url(/fonts/PlusJakartaSans-Regular.woff2) format('woff2')",
          fontDisplay: "swap",
        },
      });
      addBase({
        "@font-face": {
          fontFamily: "PlusJakartaSans",
          fontWeight: "500",
          src: "url(/fonts/PlusJakartaSans-Medium.woff2) format('woff2')",
          fontDisplay: "swap",
        },
      });
      addBase({
        "@font-face": {
          fontFamily: "PlusJakartaSans",
          fontWeight: "600",
          src: "url(/fonts/PlusJakartaSans-SemiBold.woff2) format('woff2')",
          fontDisplay: "swap",
        },
      });
      addBase({
        "@font-face": {
          fontFamily: "PlusJakartaSans",
          fontWeight: "700",
          src: "url(/fonts/PlusJakartaSans-Bold.woff2) format('woff2')",
          fontDisplay: "swap",
        },
      });
      addBase({
        "@font-face": {
          fontFamily: "PlusJakartaSans",
          fontWeight: "800",
          src: "url(/fonts/PlusJakartaSans-ExtraBold.woff2) format('woff2')",
          fontDisplay: "swap",
        },
      });
      addBase({
        "@font-face": {
          fontFamily: "PPFraktionMono",
          fontWeight: "400",
          src: "url(/fonts/PPFraktionMono-Regular.woff2) format('woff2')",
          fontDisplay: "swap",
        },
      });
      addBase({
        "@font-face": {
          fontFamily: "PPFraktionMono",
          fontWeight: "700",
          src: "url(/fonts/PPFraktionMono-Bold.woff2) format('woff2')",
          fontDisplay: "swap",
        },
      });
      addBase({
        "@font-face": {
          fontFamily: "PPFraktionSans",
          fontWeight: "700",
          src: "url(/fonts/PPFraktionSans-Bold.woff2) format('woff2')",
          fontDisplay: "swap",
        },
      });
      addBase({
        "@font-face": {
          fontFamily: "PPFraktionSans",
          fontWeight: "400",
          src: "url(/fonts/PPFraktionSans-Light.woff2) format('woff2')",
          fontDisplay: "swap",
        },
      });
    }),

    function ({ addVariant }) {
      addVariant("child", "& > *");
      addVariant("child-hover", "& > *:hover");
    },
  ],
};
