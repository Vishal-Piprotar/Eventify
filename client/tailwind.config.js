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
        gray: {
          900: '#111827',
          800: '#1F2A44',
          700: '#374151',
          600: '#4B5563',
          300: '#D1D5DB',
          200: '#E5E7EB',
          100: '#F3F4F6',
          50: '#F9FAFB',
        },
        blue: {
          900: '#1E3A8A',
          600: '#2563EB',
          500: '#3B82F6',
          400: '#60A5FA',
          300: '#93C5FD',
          100: '#DBEAFE',
          50: '#EFF6FF',
        },
        red: {
          900: '#7F1D1D',
          700: '#B91C1C',
          600: '#DC2626',
          500: '#EF4444',
          400: '#F87171',
          200: '#FECACA',
          100: '#FEE2E2',
          50: '#FEF2F2',
        },
        green: {
          900: '#14532D',
          700: '#15803D',
          600: '#16A34A',
          500: '#22C55E',
          400: '#4ADE80',
          200: '#BBF7D0',
          100: '#DCFCE7',
          50: '#F0FDF4',
        },
      },
    },
  },
  plugins: [],
};