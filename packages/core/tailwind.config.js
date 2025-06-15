const withAnimations = require("animated-tailwindcss");

module.exports = withAnimations({
  content: ["./src/**/*.{html,js,jsx,ts,tsx}"],
  presets: [
    require("./tailwind.preset.js")
  ],
  theme: {
    extend: {}
  },
  plugins: [require("@tailwindcss/forms")],
  corePlugins: {
    preflight: false
  }
});