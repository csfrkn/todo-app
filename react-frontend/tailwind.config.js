/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      keyframes: {
        shine: {
          '0%': { transform: 'translateX(-200%)' },
          '100%': { transform: 'translateX(200%)' }
        }
      },
      animation: {
        'shine': 'shine 2s infinite linear'
      }
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
