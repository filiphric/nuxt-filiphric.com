const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
  purge: [
    "./components/**/*.{vue,js}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}",
    "./nuxt.config.{js,ts}",
  ],
  theme: {
    container: {
      center: true,
    },
    screens: {
      sm: "480px",
      ms: "600px",
      md: "768px",
      lg: "976px",
      xl: "1440px",
    },
    fontWeight: {
      hairline: 100,
      thin: 200,
      light: 300,
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
      extrabold: 800,
      black: 900,
     },
    fontFamily: {
      sans: ["Inter", "sans-serif"],
      mono: ["JetBrains Mono", "monospace"],
    },
    extend: {
      height: {
        400: "400px",
        450: "450px"
      },
      width: {
        350: "350px"
      },
      maxWidth: {
        350: "350px"
      },
      minHeight: {
        400: "400px",
        450: "450px"
      },
      spacing: {
        128: "32rem",
        144: "36rem",
      },
      margin: {
        '-400': "-400px"
      },
      borderRadius: {
        "4xl": "2rem",
      },
      outline: {
        red: '2px solid #ff657a',
      },
      colors: {
        black: {
          light: '#2b2c37',
          DEFAULT: "#282a3a",
          dark: "#1c1d29",
        },
        teal: {
          DEFAULT: "#9cd1bb",
        },
        purple: {
          DEFAULT: "#c39ac9",
        },
        green: {
          DEFAULT: "#bad761",
        },
        orange: {
          DEFAULT: "#ff9b5e",
        },
        red: {
          light: "#ffb2bd",
          lightest: "#fff0f2",
          DEFAULT: "#ff657a",
          dark: "#cc5162",
          darkest: '#80333d'
        },
        yellow: {
          DEFAULT: "#ffd76d",
        },
      },
    },
  },
};
