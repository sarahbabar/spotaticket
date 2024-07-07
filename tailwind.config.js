/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {
      backgroundImage: {
        'paper': "url('paper.jpg')"
      },
      fontFamily: {
        'alata': ['Alata', 'sans-serif'],
        'dosis': ['Dosis', 'sans-serif']
      }
    }
  },
  plugins: []
};
