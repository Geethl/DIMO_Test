/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'dimo-blue': '#0033A0', // Typical corporate blue
        'dimo-red': '#E31837', // Typical corporate red
        'dimo-dark': '#1a1a1a',
      },
      fontFamily: {
        'sans': ['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
