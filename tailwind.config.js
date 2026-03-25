/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        bg:        '#04040a',
        'glow-blue': '#4a8fff',
        'glow-red':  '#ff3060',
        'muted':     'rgba(212,216,240,0.35)',
      },
      fontFamily: {
        berliner: ['"Berliner Condensed"', '"Arial Narrow"', 'sans-serif'],
      },
      screens: {
        sm:  '640px',
        md:  '768px',
        lg:  '1024px',
        xl:  '1280px',
        '2xl': '1536px',
      },
    },
  },
  plugins: [],
}

