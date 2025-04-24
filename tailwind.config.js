/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: 'class',
    theme: {
      extend: {
        colors: {
          primary: '#10B981',
          'primary-dark': '#059669',
          secondary: '#3B82F6',
          'dark-bg': '#111827',
          'dark-panel': '#1F2937',
          critical: '#EF4444',
          warning: '#F59E0B'
        },
        fontFamily: { inter: ['Inter', 'sans-serif'] },
        boxShadow: { glow: '0 0 15px -3px rgba(16,185,129,0.3)' }
      }
    },
    plugins: []
  };
  