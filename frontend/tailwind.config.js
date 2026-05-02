/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Space Grotesk', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        base: '#0A0A0F',
        surface: '#12121A',
        elevated: '#1A1A26',
        border: '#2A2A3D',
        accent: '#7C6EFF',
        teal: '#4ECDC4',
        danger: '#FF6B6B',
        'text-primary': '#F0F0FF',
        'text-secondary': '#8A8AA8',
        'text-dim': '#4A4A6A',
      }
    }
  },
  plugins: []
}
