/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'space-dark': '#0a0a1a',
        'space-mid': '#12122a',
        'space-card': '#1a1a35',
        'star-gold': '#fbbf24',
        'star-gold-light': '#fde68a',
        'nebula-purple': '#7c3aed',
        'nebula-blue': '#2563eb',
        'success-green': '#10b981',
        'danger-red': '#ef4444',
      },
      fontFamily: {
        orbitron: ['Orbitron', 'sans-serif'],
        inter: ['Inter', 'sans-serif'],
      },
      animation: {
        'star-pulse': 'starPulse 1.5s ease-in-out infinite',
        'float': 'float 3s ease-in-out infinite',
        'twinkle': 'twinkle 2s ease-in-out infinite',
        'spin-slow': 'spin 3s linear infinite',
        'fade-in': 'fadeIn 0.4s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'glow-pulse': 'glowPulse 2s ease-in-out infinite',
      },
      keyframes: {
        starPulse: {
          '0%, 100%': { transform: 'scale(1)', filter: 'drop-shadow(0 0 8px #fbbf24)' },
          '50%': { transform: 'scale(1.3)', filter: 'drop-shadow(0 0 20px #fbbf24)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        twinkle: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.3' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        glowPulse: {
          '0%, 100%': { boxShadow: '0 0 10px rgba(251, 191, 36, 0.3)' },
          '50%': { boxShadow: '0 0 30px rgba(251, 191, 36, 0.8)' },
        },
      },
      backgroundImage: {
        'space-gradient': 'radial-gradient(ellipse at center, #1a1a35 0%, #0a0a1a 100%)',
        'gold-gradient': 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
        'purple-gradient': 'linear-gradient(135deg, #7c3aed 0%, #2563eb 100%)',
      },
    },
  },
  plugins: [],
}
