/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ['./src/**/*.{js,ts,jsx,tsx}'],
    theme: {
        extend: {
            screens: {
                xs: { max: '450px' },
                'max-lg': { max: '850px' },
            },
        },
    },
    plugins: [],
};
