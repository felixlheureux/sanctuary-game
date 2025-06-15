module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        krona: ["Krona One", "sans-serif"]
      }
    }
  },
  plugins: [require("@tailwindcss/forms")]
};
