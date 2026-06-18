import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: 'hsl(var(--brand-50) / <alpha-value>)',
          100: 'hsl(var(--brand-100) / <alpha-value>)',
          150: 'hsl(var(--brand-150) / <alpha-value>)',
          200: 'hsl(var(--brand-200) / <alpha-value>)',
          250: 'hsl(var(--brand-250) / <alpha-value>)',
          300: 'hsl(var(--brand-300) / <alpha-value>)',
          350: 'hsl(var(--brand-350) / <alpha-value>)',
          400: 'hsl(var(--brand-400) / <alpha-value>)',
          450: 'hsl(var(--brand-450) / <alpha-value>)',
          500: 'hsl(var(--brand-500) / <alpha-value>)',
          550: 'hsl(var(--brand-550) / <alpha-value>)',
          600: 'hsl(var(--brand-600) / <alpha-value>)',
          650: 'hsl(var(--brand-650) / <alpha-value>)',
          700: 'hsl(var(--brand-700) / <alpha-value>)',
          750: 'hsl(var(--brand-750) / <alpha-value>)',
          800: 'hsl(var(--brand-800) / <alpha-value>)',
          850: 'hsl(var(--brand-850) / <alpha-value>)',
          900: 'hsl(var(--brand-900) / <alpha-value>)',
        },
      },
      fontFamily: {
        sans: ['var(--font-sans)'],
        display: ['var(--font-display)'],
        mono: ['var(--font-mono)'],
      },
      animation: {
        'spin-slow': 'spin 20s linear infinite',
        'pulse-glow': 'pulse-glow 3s ease-in-out infinite',
        marquee: 'marquee 30s linear infinite',
        'marquee-reverse': 'marquee-reverse 30s linear infinite',
        shimmer: 'shimmer 3s ease-in-out infinite',
      },
      keyframes: {
        'pulse-glow': {
          '0%, 100%': { opacity: '0.4' },
          '50%': { opacity: '0.8' },
        },
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        'marquee-reverse': {
          '0%': { transform: 'translateX(-50%)' },
          '100%': { transform: 'translateX(0%)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '200% 0' },
          '100%': { backgroundPosition: '-200% 0' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
