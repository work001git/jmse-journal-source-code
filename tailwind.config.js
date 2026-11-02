/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#0F3D75",
        secondary: "#15803D",
        accent: "#D4A017",
        background: "#F8FAFC",
        darkGray: "#334155",
      },
      fontFamily: {
        heading: ["Poppins", "sans-serif"],
        body: ["Inter", "sans-serif"],
      },
      boxShadow: {
        'premium': '0 10px 30px -10px rgba(15, 61, 117, 0.1)',
        'premium-hover': '0 20px 40px -15px rgba(15, 61, 117, 0.2)',
      }
    },
  },
  plugins: [],
}
