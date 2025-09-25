/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        'spin-slow': 'spin 3s linear infinite',
        'bounce-in': 'bounceIn 0.6s ease-out',
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'grow-circle': 'growCircle 0.8s ease-out forwards',
      },
      keyframes: {
        bounceIn: {
          '0%': { transform: 'scale(0.3)', opacity: '0' },
          '50%': { transform: 'scale(1.31)', opacity: '1' },
          '70%': { transform: 'scale(1.125)' },
          '100%': { transform: 'scale(1.25)' },
        },
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        growCircle: {
          '0%': { transform: 'scale(1)' },
          '60%': { transform: 'scale(1.4)' },
          '100%': { transform: 'scale(1.33)' },
        },
      },
    },
  },
  plugins: [],
}