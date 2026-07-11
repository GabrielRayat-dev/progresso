/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#0F1117',
        surface: '#1A1D27',
        border: '#2A2D3E',
        primary: '#6C63FF',
        secondary: '#4ECDC4',
        success: '#2ECC71',
        warning: '#F39C12',
        danger: '#E74C3C',
        textprimary: '#FFFFFF',
        textsecondary: '#8B8FA8',
      }
    },
  },
  plugins: [],
}