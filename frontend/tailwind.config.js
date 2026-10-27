/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brandCream: {
          light: '#FCFBF7',
          DEFAULT: '#FAF8F5',
          dark: '#F3EFE9'
        },
        brandCoral: {
          light: '#FFAB91',
          DEFAULT: '#FF7043',
          dark: '#E64A19'
        },
        brandSky: {
          light: '#B3E5FC',
          DEFAULT: '#4FC3F7',
          dark: '#0288D1'
        },
        brandMint: {
          light: '#C8E6C9',
          DEFAULT: '#81C784',
          dark: '#388E3C'
        },
        brandYellow: {
          light: '#FFF9C4',
          DEFAULT: '#FFF176',
          dark: '#FBC02D'
        },
        brandLavender: {
          light: '#E1BEE7',
          DEFAULT: '#B39DDB',
          dark: '#7B1FA2'
        },
        brandNavy: {
          DEFAULT: '#1E293B',
          dark: '#0F172A'
        }
      },
      fontFamily: {
        quicksand: ['Quicksand', 'sans-serif'],
        inter: ['Inter', 'sans-serif']
      },
      borderRadius: {
        '2xl': '1.5rem',
        '3xl': '2rem',
        '4xl': '2.5rem'
      }
    },
  },
  plugins: [],
}
