/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,js}"
  ],
  theme: {
    extend: {
      colors: {
        primary: '#3490dc', // Example primary color
        secondary: '#6574cd', // Example secondary color
        // Add more custom colors as needed
      },
    },
  },
  plugins: [],
}
