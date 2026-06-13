/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Apple-inspired light palette
        ink: '#1d1d1f',
        subtle: '#6e6e73',
        canvas: '#ffffff',
        mist: '#f5f5f7',
        line: '#d2d2d7',
        accent: {
          DEFAULT: '#0071e3',
          hover: '#0077ed',
        },
        success: '#34c759',
      },
      fontFamily: {
        sans: [
          '-apple-system',
          'BlinkMacSystemFont',
          'SF Pro Display',
          'SF Pro Text',
          'Inter',
          'Segoe UI',
          'Roboto',
          'Helvetica Neue',
          'Arial',
          'sans-serif',
        ],
      },
      borderRadius: {
        '2xl': '1.25rem',
        '3xl': '1.75rem',
      },
      boxShadow: {
        soft: '0 4px 24px rgba(0,0,0,0.06)',
        lift: '0 12px 40px rgba(0,0,0,0.10)',
      },
      maxWidth: {
        content: '1120px',
      },
    },
  },
  plugins: [],
};
