/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        indigo: {
          50: '#EEF0FF', // active nav pill, user chat bubble, soft fills
          100: '#E0E3FF',
          500: '#6366F1',
          600: '#4F46E5', // PRIMARY — buttons, active nav text, links, logo
          700: '#4338CA', // hover
        },
        ink: {
          DEFAULT: '#1E1E2D',
          muted: '#6B7280',
          faint: '#9CA3AF',
        },
        line: '#EEF0F6', // all card borders
        canvas: '#F7F8FC', // page background
        // Pastel category tints (50-weight fill / 500-600 icon pairs)
        tint: {
          nutrition: '#ECFDF5',
          videos: '#FEF2F2',
          schemes: '#FFFBEB',
          campaigns: '#F5F3FF',
          hospitals: '#EFF6FF',
          reports: '#F0FDFA',
          pink: '#FDF2F8',
        },
        emergency: '#DC2626', // RESERVED — 108 button + red-flag screen only
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        '2xl': '16px',
        xl: '12px',
      },
      boxShadow: {
        card: '0 1px 3px rgba(16,24,40,0.04)',
      },
      maxWidth: {
        main: '1180px',
      },
    },
  },
  plugins: [],
}
