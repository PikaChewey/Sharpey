/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  safelist: [
    'bg-primary-100',
    'bg-primary-900/20',
    'text-primary-600',
    'bg-secondary-100',
    'bg-secondary-900/20',
    'text-secondary-600',
    'from-primary-50',
    'to-secondary-50',
    'from-gray-900',
    'via-gray-800',
    'to-gray-900',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        },
        secondary: {
          50: '#f0fdfa',
          100: '#ccfbf1',
          200: '#99f6e4',
          300: '#5eead4',
          400: '#2dd4bf',
          500: '#14b8a6',
          600: '#0d9488',
          700: '#0f766e',
          800: '#115e59',
          900: '#134e4a',
        },
        notebook: {
          paper: '#f9f9f7',
          'dark-paper': '#19191b',
          line: '#c3e4ed',
          'dark-line': '#6c6c6c',
          blue: '#1A56DB',
          red: '#DC2626',
          gray: '#4B5563',
          highlight: '#FFEB3B',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)'],
        display: ['var(--font-inter)'],
        handwritten: ['Indie Flower', 'Architects Daughter', 'Shadows Into Light', 'Gochi Hand', 'cursive'],
      },
      animation: {
        'gradient-x': 'gradient-x 15s ease infinite',
        'blob': 'blob 7s infinite',
        'underline': 'underline 1s ease-in-out infinite',
        'page-flip': 'pageFlip 0.6s ease-in-out',
      },
      keyframes: {
        'gradient-x': {
          '0%, 100%': {
            'background-size': '200% 200%',
            'background-position': 'left center',
          },
          '50%': {
            'background-size': '200% 200%',
            'background-position': 'right center',
          },
        },
        'underline': {
          '0%': { 'width': '0%' },
          '100%': { 'width': '100%' },
        },
        'pageFlip': {
          '0%': { 'transform': 'rotateY(0deg)', 'transform-origin': 'left center' },
          '50%': { 'transform': 'rotateY(-90deg)', 'transform-origin': 'left center' },
          '51%': { 'transform': 'rotateY(-90deg)', 'transform-origin': 'left center' },
          '100%': { 'transform': 'rotateY(0deg)', 'transform-origin': 'left center' },
        },
      },
    },
  },
  plugins: [],
} 