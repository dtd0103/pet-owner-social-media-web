/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      margin: {
        custom_left: '26rem'
      },
      height: {
        custom_height: '9999px'
      },
      colors: {
        'custom-primary': 'var(--color-custom-primary)',
        'custom-second': '#4d58d1',
        'custom-grey': '#242526',
        'custom-grey-1': '#eff0f5',
        'custom-black': '#2e2d2d',
        'custom-transparent': '#ffffff2c',
        'custom-blue': '#e8f2fd'
      },
      fontFamily: {
        nunito: ['Nunito', 'sans-serif'],
        sora: ['Sora', 'sans-serif']
      },
      fontSize: {
        custom: '0.78rem'
      },
      fontWeight: {
        custom: '500'
      },
      lineHeight: {
        header_search: '2rem'
      },
      inset: {
        custom: '72px',
        custom_header_right: '0.37rem',
        custom_header_right_1: '9.12rem',
        custom_header_right_2: '12.6rem',
        custom_header_top: '1.8rem',
        custom_leftside_right: '9.2rem'
      },
      boxShadow: {
        left: '-5px 0 10px rgba(0, 0, 0, 0.1)',
        right: '10px 0 5px rgba(0, 0, 0, 0.1)'
      }
    }
  },
  plugins: []
}
