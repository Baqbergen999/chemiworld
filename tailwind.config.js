/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "dark-bg": "var(--color-dark-bg)",
        "neon-cyan": "var(--color-neon-cyan)",
        "neon-purple": "var(--color-neon-purple)",
      },
    },
  },
  plugins: [],
};
