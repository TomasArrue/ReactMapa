/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./components/**/*.{js,ts,jsx,tsx,mdx}",

    // Or if using `src` directory:
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary:'#D98218',
        secondary:'#BF8A49',
        success:'#18D942',
        danger:'#ED502D',
        white: '#fff',
        black: '#0D0D0D',
      }
    },
  },
  plugins: [],
}

