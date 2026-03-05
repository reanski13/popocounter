/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        // Montserrat for headings/display, Inter for body
        sans: ['Montserrat', 'system-ui', 'sans-serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        // Light mode palette — warm beige & cream
        cream:   '#faf6f0',
        parchment: '#f2ebe0',
        sand:    '#e8ddd0',
        // Brand browns
        poop: {
          50:  '#fdf8f0',
          100: '#f7edd8',
          200: '#edd5b0',
          300: '#ddb87d',
          400: '#cc9850',
          500: '#b8782a',
          600: '#9a5e1f',
          700: '#7d4a18',
          800: '#5e3612',
          900: '#3d220b',
          950: '#1e0f04',
        },
        // Dark mode — espresso palette
        espresso: {
          50:  '#f5f0eb',
          100: '#e8ddd0',
          200: '#d0b89a',
          300: '#b5906a',
          400: '#976849',
          500: '#7a4f30',
          600: '#5e3b22',
          700: '#3d2614',
          800: '#26180b',
          900: '#140c05',
          950: '#0a0603',
        },
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
      boxShadow: {
        'poop': '0 4px 24px rgba(124, 74, 24, 0.12)',
        'poop-lg': '0 8px 40px rgba(124, 74, 24, 0.2)',
      },
      animation: {
        'float': 'float 3s ease-in-out infinite',
        'wiggle': 'wiggle 0.5s ease-in-out',
        'pop': 'pop 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        wiggle: {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        },
        pop: {
          '0%': { transform: 'scale(0.8)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}