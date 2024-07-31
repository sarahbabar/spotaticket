/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {
      backgroundImage: {
        'paper': "url('paper.jpg')",
        'tmpattern': "url('ticketmaster_logo.svg')",
        'tm': "url('tm.svg')"
      },
      fontFamily: {
        'alata': ['Alata', 'sans-serif'],
        'dosis': ['Dosis', 'sans-serif'],
        'libre': ['"Libre Barcode 39"', 'serif'],
      }
    }
  },
  plugins: []
};
