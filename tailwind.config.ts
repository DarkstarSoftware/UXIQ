import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          300: '#7DD3FC',
          400: '#38BDF8',
          500: '#0EA5E9',
          600: '#0284C7',
        },
        ui: {
          bg: '#0B0F19',
          sidebar: '#0F172A',
          card: '#111827',
          surface: '#1F2937',
          border: '#334155',
          muted: '#94A3B8',
        },
        success: '#22C55E',
        warning: '#F59E0B',
      },
    },
  },
  plugins: [],
};

export default config;