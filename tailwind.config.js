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
        neon: {
          green: '#00E676',
          emerald: '#10B981',
          dark: '#0A0E14',
          card: '#131923',
          cardBorder: '#1F2937',
          cardHover: '#1A2332'
        },
        paper: {
          bg: '#FAF6EE',
          card: '#FFFDF9',
          border: '#3D3835',
          ink: '#262422',
          subtle: '#8C827A',
          stamp: '#16A34A',
          accent: '#E5D9C5'
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
        handwritten: ['Caveat', 'Patrick Hand', 'Comic Sans MS', 'cursive'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace']
      },
      boxShadow: {
        'neon-glow': '0 0 15px -3px rgba(0, 230, 118, 0.35), 0 0 6px -2px rgba(0, 230, 118, 0.2)',
        'neon-glow-strong': '0 0 25px 0px rgba(0, 230, 118, 0.5)',
        'paper-pressed': 'inset 2px 2px 4px rgba(0,0,0,0.15)',
        'paper-elevated': '3px 4px 0px #2D2B2A',
      }
    },
  },
  plugins: [],
}
