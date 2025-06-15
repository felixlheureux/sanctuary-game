module.exports = {
  theme: {
    extend: {
      colors: {
        primary: "#72F5F1",
        beige: {
          50: "#fdf8f6",
          100: "#f2e8e5",
          200: "#eaddd7",
          300: "#e0cec7",
          400: "#d2bab0",
          500: "#EFEADB",
          600: "#a18072",
          700: "#977669",
          800: "#846358",
          900: "#43302b"
        }
      },
      animation: {
        "fade-in": "fade-in 250ms ease-in-out",
        "fade-out": "fade-out 250ms ease-in-out"
      },
      keyframes: {
        "fade-in": {
          "0%": { opacity: 0 },
          "100%": { opacity: 1 }
        },
        "fade-out": {
          "0%": { opacity: 1 },
          "100%": { opacity: 0 }
        }
      }
    }
  }
};