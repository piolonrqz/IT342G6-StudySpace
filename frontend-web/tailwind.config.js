/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // Scans all JS/JSX/TS/TSX files in src folder
  ],
  theme: {
    extend: {
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
      },
      colors: {
        primary: 'var(--primary-color)',
        secondary: 'var(--secondary-color)',
        'light-bg': 'var(--light-bg)',
        'text-color': 'var(--text-color)',
        'light-text': 'var(--light-text)',
      },
      borderRadius: {
        DEFAULT: '4px',
      },
      boxShadow: {
        DEFAULT: '0 2px 5px rgba(0, 0, 0, 0.1)',
      },
    },
  },
  plugins: [],
};
