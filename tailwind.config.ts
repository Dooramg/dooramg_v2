import type { Config } from 'tailwindcss'

export default <Partial<Config>>{
  theme: {
    extend: {
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
