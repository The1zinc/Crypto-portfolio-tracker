/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#0B0B0F',
        surface: '#1A1A24',
        primary: '#6366f1',
        secondary: '#a855f7',
        accent: '#14b8a6',
        text: '#f8fafc',
        muted: '#94a3b8'
      }
    },
  },
  plugins: [],
}
