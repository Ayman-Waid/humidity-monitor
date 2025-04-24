module.exports = {
  content: ['./index.html', './src/**/*.js'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: { DEFAULT: '#10B981', dark: '#059669' },
        secondary: '#3B82F6',
        critical: '#EF4444',
        warning: '#F59E0B',
        'dark-bg': '#111827',
        'dark-panel': '#1F2937'
      },
      fontFamily: {
        inter: ['Inter', 'sans-serif']
      },
      boxShadow: {
        glow: '0 0 15px -3px rgba(16,185,129,0.3)'
      }
    },
  },
  plugins: [
    require('@tailwindcss/container-queries')
  ],
}