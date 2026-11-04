/** Paleta tomada del piso del gimnasio y de los discos olímpicos. */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        rubber: {
          DEFAULT: '#1B2220',
          2: '#232B28',
          3: '#2D3733',
          4: '#3A4641',
        },
        chalk: '#E7ECEE',
        mute: '#93A09B',
        plate: {
          blue: '#2F6BF0',
          bluelight: '#8AAEFF',
          green: '#3FB26B',
          yellow: '#E8C23A',
          red: '#E5484D',
        },
      },
      fontFamily: {
        display: ['"Barlow Condensed"', 'Impact', 'sans-serif'],
        sans: ['"IBM Plex Sans"', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
