const defaultTheme = require('tailwindcss/defaultTheme')
const colors = require('tailwindcss/colors')

module.exports = {
  content: ['./app/**/*.{ts,tsx,jsx,js}'],
  theme: {
    fontFamily: {
      sans: ['Nunito', ...defaultTheme.fontFamily.sans],
    },
    colors: {
      // primary: { ...colors.indigo },
      ...colors,
      primary: {
        DEFAULT: '#407eb7',
        10: '#f3f6fb',
        50: '#f3f7fc',
        100: '#e7eef7',
        200: '#c9dbee',
        300: '#9abedf',
        400: '#649bcc',
        500: '#407eb7',
        600: '#2f649a',
        700: '#27507d',
        800: '#244568',
        900: '#223b58',
      },
      neutral: colors.stone,
    },
    extend: {},
  },
  plugins: [require('@tailwindcss/forms')],
}
