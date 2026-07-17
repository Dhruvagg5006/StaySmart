/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'void': '#09090B',
        'deep-indigo': '#1E1332',
        'violet': {
          DEFAULT: '#8B5CF6',
          dim: '#6D28D9',
          glow: '#A78BFA',
          faint: 'rgba(139,92,246,0.12)',
        },
        'phosphor': {
          DEFAULT: '#EEEEF0',
          dim: '#9898A0',
          faint: '#3A3A45',
        },
      },
      fontFamily: {
        sans: ['DM Sans', 'sans-serif'],
        display: ['Fraunces', 'serif'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-void': 'linear-gradient(135deg, #09090B 0%, #1E1332 50%, #09090B 100%)',
      },
      animation: {
        'conveyor': 'conveyor 32s linear infinite',
        'blink': 'blink 1.1s ease-in-out infinite',
        'blob-1': 'blob-drift-1 18s ease-in-out infinite',
        'blob-2': 'blob-drift-2 24s ease-in-out infinite',
      },
      keyframes: {
        conveyor: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        blink: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0' },
        },
      },
    },
  },
  plugins: [],
};