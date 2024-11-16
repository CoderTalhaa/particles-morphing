/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        funnel: ['"Funnel Display"', "sans-serif"],
        gummy: ['"Sour Gummy"', "sans-serif"],
        doodle: ["Rubik Doodle Shadow", "sans-serif"],
      },
    },
  },
  plugins: [],
};
