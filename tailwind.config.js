const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
  theme: {
    extend: {
      colors: {
        blue: {
          DEFAULT: '#3A80B5',
          50: '#f3f8fb',
          100: '#ecf3f9',
          300: '#aecee5',
          200: '#d5e5f1',
          500: '#5296c7',
          400: '#84b4d7',
          700: '#2a5e83',
          600: '#3677a6',
          900: '#204864',
          800: '#234d6c'
        }
      }
    }
  },
  plugins: [require("@tailwindcss/forms")]
}
