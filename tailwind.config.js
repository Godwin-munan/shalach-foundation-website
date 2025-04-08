/** @type {import('tailwindcss').Config} */

module.exports = {
  content: ["./src/**/*.{html,ts,scss,css}"],
  theme: {
    screens: {
      sm: "370px",
      md: "540px",
      lg: "900px",
      xl: "1920px"
    },
    extend: {
      // keyframes: {
      //   rotate: {
      //     '0%': { transform: 'rotate(0deg)' },
      //     '100%': { transform: 'rotate(360deg)' },
      //   },
      //   beep: {
      //     '0%, 100%': { transform: 'scale(1)' },
      //     '50%': { transform: 'scale(1.2)' },
      //   },
      // },
      // animation: {
      //   rotate: 'rotate 2s linear infinite',
      //   beep: 'beep 1.5s ease-in-out infinite',
      // },
    },
    fontFamily: {
      Jost: ["Jost", "sans-serif"],
      Lobster: ["Lobster", "sans-serif"],
      Roboto: ["Roboto", "sans-serif"],
      Montserrat: ["Montserrat"]
    },
    // container: {
    //   center: true,
    //   padding: {
    //     DEFAULT: "12px",
    //     md: "32px"
    //   }
    // }
  },
  plugins: [],
  important: true,
};
