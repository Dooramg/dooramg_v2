import type { Config } from 'tailwindcss'

export default <Partial<Config>>{
  theme: {
    extend: {
      colors: {
        amber: {
          50: '#ed883a',
          100: '#c87331',
          200: '#a45e28',
          300: '#80491f',
          400: '#5b3416',
          500: '#492a12',
          600: '#422610',
          700: '#331d0d',
          800: '#241509',
          900: '#160d05',
          950: '#070402',
        },
      },
    },
  },
}
