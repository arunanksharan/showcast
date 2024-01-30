/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',

    // Or if using `src` directory:
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'back-brown': '#2A2929',
        'start-border': '#191919',
        'start-bg': '#FFD12C',
        'hero-bg': '#855DCD',
        'signin-content-bg': '#F3F3F4',
      },
      fontFamily: {
        urbanist: ['Urbanist', 'sans-serif'],
        mona: ['"Mona Sans Condensed"', 'sans-serif'],
        manrope: ['Manrope', 'sans-serif'],
      },
      lineHeight: {
        custom: '86.40px',
      },
      borderWidth: {
        '0.5': '0.5px'
      }
    },
  },
  plugins: [],
};
