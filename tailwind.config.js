/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      animation: {
        "task-fade": "task-fade 320ms ease",
        "modal-fade": "modal-fade 180ms ease",
        "modal-rise": "modal-rise 220ms ease",
      },
      fontFamily: {
        manrope: ["Manrope", '"Segoe UI"', "sans-serif"],
        space: ['"Space Grotesk"', '"Segoe UI"', "sans-serif"],
      },
      keyframes: {
        "task-fade": {
          from: {
            opacity: "0",
            transform: "translateY(8px)",
          },
          to: {
            opacity: "1",
            transform: "translateY(0)",
          },
        },
        "modal-fade": {
          from: {
            opacity: "0",
          },
          to: {
            opacity: "1",
          },
        },
        "modal-rise": {
          from: {
            opacity: "0",
            transform: "translateY(10px) scale(0.98)",
          },
          to: {
            opacity: "1",
            transform: "translateY(0) scale(1)",
          },
        },
      },
    },
  },
  plugins: [],
};
