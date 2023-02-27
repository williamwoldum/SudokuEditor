module.exports = {
  content: [
    './src/client/index.html',
    './src/**/*.{js,ts}',
    './public/*.{js,ts}'
  ],
  darkMode: 'class',
  theme: {
    extend: {}
  },
  plugins: [require('tailwind-scrollbar')]
}
