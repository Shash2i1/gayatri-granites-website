/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#1a1a1a',
        accent: {
          DEFAULT: '#c9922e',
          light: '#e8b565',
          dark: '#a87620',
        },
        background: '#f7f5f2',
        surface: '#ffffff',
        border: '#e5e2dd',
        muted: '#6b6b6b',
        success: '#0a8a4c',
        danger: '#c0392b',
      },
    },
  },
  plugins: [],
}