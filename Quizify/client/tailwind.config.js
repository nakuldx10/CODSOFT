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
          DEFAULT: '#2D6A4F',
          light:   '#40916C',
          dark:    '#1B4332',
          pale:    '#D8F3DC',
          faint:   '#F0FAF2',
        },
        cream: {
          DEFAULT: '#FDFBF7',
          alt:     '#F5F0E8',
          border:  '#E5E0D8',
          divider: '#EDE8E0',
        },
        accent: {
          orange: '#E76F51',
          yellow: '#F4A261',
        },
        text: {
          primary:   '#1A1A1A',
          secondary: '#3D3D3D',
          muted:     '#6B7280',
        }
      },
      fontFamily: {
        sans: ['Poppins', 'sans-serif'],
      },
      borderRadius: {
        'none': '0',
        'sm':   '4px',
        DEFAULT: '6px',
        'md':   '8px',
        'lg':   '10px',
        'xl':   '12px',
        '2xl':  '14px',
        '3xl':  '16px',
        'full': '9999px',
      },
      boxShadow: {
        'card': '0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.04)',
        'card-hover': '0 4px 12px rgba(45,106,79,0.15)',
        'btn': '0 1px 2px rgba(0,0,0,0.08)',
        'modal': '0 20px 60px rgba(0,0,0,0.12)',
        'focus': '0 0 0 3px rgba(45,106,79,0.15)',
      },
      animation: {
        'float': 'float 3s ease-in-out infinite',
        'float-delay': 'float 3s ease-in-out 1.5s infinite',
        'slide-up': 'slideUp 0.4s ease-out',
        'fade-in': 'fadeIn 0.4s ease-out',
        'scale-in': 'scaleIn 0.3s ease-out',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
    },
  },
  plugins: [],
}
