/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}'
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: '#6C47FF',
        'primary-dark': '#5535E0',
        accent: '#FF6B35',
        'accent-dark': '#E5541F',
        navy: {
          900: '#0D0E21',
          800: '#14152E',
          700: '#1C1D3A'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif']
      }
    }
  },
  plugins: [
    require('@tailwindcss/forms')
  ]
};
