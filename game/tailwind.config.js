const withAnimations = require("animated-tailwindcss");

module.exports = withAnimations({
  content: ["./src/**/*.{html,js,jsx,tsx,ts}"],
  theme: {
    extend: {
      screens: {
        "tall": { "raw": "(min-height: 800px)" }
      },
      fontFamily: {
        "space-grotesk": ["Space Grotesk", "sans-serif"],
        bangers: ["Bangers", "sans-serif"]
      },
      colors: {
        primary: "#fcd34d",
        pink: "#ee569f",
        teal: "#38e9de"
      }
    }
  },
  plugins: []
});
