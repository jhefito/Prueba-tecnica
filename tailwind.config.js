/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          main: '#1976d2',
          dark: '#1565c0',
          light: '#42a5f5'
        },
        secondary: {
          main: '#dc004e',
          dark: '#c51162',
          light: '#ff4081'
        }
      }
    },
  },
  plugins: [],
}

