const defaultTheme = require('tailwindcss/defaultTheme')
const colors = require('tailwindcss/colors')

module.exports = {
  content: ['./app/**/*.{ts,tsx,jsx,js}'],
  theme: {
    fontFamily: {
      sans: ['Open Sans', ...defaultTheme.fontFamily.sans],
    },
    colors: {
      primary: { ...colors.indigo },
      ...colors,
    },
    extend: {},
  },
  plugins: [require('@tailwindcss/forms')],
}
