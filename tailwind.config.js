// tailwind.config.js
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./app/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        fadeIn: {
          "0%": { opacity: 0, transform: "translateY(20px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
        bubbleSize: {
          "0%, 75%": {
            width: "var(--size, 4rem)",
            height: "var(--size, 4rem)",
          },
          "100%": { width: "0rem", height: "0rem" },
        },
        bubbleMove: {
          "0%": { bottom: "-4rem" },
          "100%": { bottom: "var(--distance, 10rem)" },
        },
      },
      animation: {
        fadeIn: "fadeIn 1s ease-out",
        fadeInDelay: "fadeIn 1.2s ease-out",
        fadeInDelay2: "fadeIn 1.4s ease-out",
        fadeInDelay3: "fadeIn 1.6s ease-out",
        fadeInDelay4: "fadeIn 1.8s ease-out",
        bubbleSize:
          "bubbleSize var(--time, 4s) ease-in infinite var(--delay, 0s)",
        bubbleMove:
          "bubbleMove var(--time, 4s) ease-in infinite var(--delay, 0s)",
      },
    },
  },
  plugins: [],
};
