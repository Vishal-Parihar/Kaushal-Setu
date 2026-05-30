/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        saffron: { DEFAULT: '#E8650A', light: '#FF8C3A', dark: '#B84D00', 50: '#FFF4EC' },
        teal: { DEFAULT: '#0B4F6C', mid: '#1A7FA0', light: '#E8F4F8' },
        cream: { DEFAULT: '#FDF6EC', dark: '#F0E0C4' },
        charcoal: '#1C1C1E',
      },
      fontFamily: {
        sans: ['Sora', 'sans-serif'],
        display: ['"Noto Serif Devanagari"', 'serif'],
      },
      borderRadius: { xl2: '1rem', xl3: '1.5rem' },
      boxShadow: {
        soft: '0 2px 8px rgba(0,0,0,0.06)',
        card: '0 6px 24px rgba(0,0,0,0.09)',
        lift: '0 12px 48px rgba(0,0,0,0.14)',
      },
      animation: {
        'fade-up': 'fadeUp 0.45s ease forwards',
        'fade-in': 'fadeIn 0.3s ease forwards',
      },
      keyframes: {
        fadeUp: { from: { opacity: '0', transform: 'translateY(20px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        fadeIn: { from: { opacity: '0' }, to: { opacity: '1' } },
      },
    },
  },
  plugins: [],
}
