import type { Config } from 'tailwindcss'

export default <Partial<Config>>{
  theme: {
    extend: {
      fontFamily: {
        suit: ['SUIT Variable', 'Roboto', '-apple-system', 'sans-serif'],
        pretendard: ['Pretendard Variable', 'Pretendard', 'Roboto', '-apple-system', 'BlinkMacSystemFont', 'system-ui', 'Helvetica Neue', 'Segoe UI', 'Apple SD Gothic Neo', 'Noto Sans KR', 'Malgun Gothic', 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'sans-serif'],
      },
      colors: {
        amber:
        { 50: '#f1a977',
          100: '#d49569',
          200: '#b7815b',
          300: '#9a6c4c',
          400: '#7d583e',
          500: '#6f4e37',
          600: '#644632',
          700: '#4e3727',
          800: '#38271c',
          900: '#211711',
          950: '#0b0805',
        },
      },
    },
  },
}
