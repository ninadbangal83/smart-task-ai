/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f5f7ff',
          100: '#ebf0ff',
          200: '#dae2ff',
          300: '#becaff',
          400: '#9aa8ff',
          500: '#707cff',
          600: '#4d52f5',
          700: '#3e41de',
          800: '#3335b3',
          900: '#2e308f',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
