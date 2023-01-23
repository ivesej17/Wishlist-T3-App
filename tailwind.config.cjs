/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      screens: {
        'xs': {max: '450px'},
      },
    },
  },
  plugins: [],
  corePlugins: {
    preflight: false,
  },
  important: '#__next',
  important: true
};
