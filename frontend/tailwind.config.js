module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#10b981',
          strong: '#059669',
          soft: '#34d399',
        },
        ink: {
          900: '#0b0b10',
          800: '#111118',
          700: '#1a1a24',
          600: '#252533',
        },
      },
      fontFamily: {
        sans: ['var(--font-sans)'],
        display: ['var(--font-display)'],
      },
      boxShadow: {
        glow: '0 0 40px rgba(16,185,129,0.2)',
      },
      borderRadius: {
        xl: '18px',
        '2xl': '24px',
      },
    },
  },
  plugins: [],
}
