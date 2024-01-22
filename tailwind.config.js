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
      },
      fontFamily: {
        urbanist: ['Urbanist', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
