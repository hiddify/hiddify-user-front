// eslint-disable-next-line no-undef
module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
    'node_modules/flowbite-react/**/*.{js,jsx,ts,tsx}'
  ],
  theme: {
    screens: {
      sm: '500px',
      md: '768px',
      lg: '1200px',
      lgx: '1400px',
      xl: '1600px',
      '2xl': '1840px',
      '3xl': '2400px',
    },
    /* fontSize: {
      xs: ['0.75rem', '1.125rem'],    //    ['12px', '18px'],
      sm: ['0.875rem', '1.5rem'],     //    ['14px', '24px'],
      base: ['1rem', '1.75rem'],      //    ['16px', '28px'],
      md: ['1rem', '1.75rem'],        //    ['16px', '28px'],
      lg: ['1.125rem', '2rem'],       //    ['18px', '32px'],
      xl: ['1.25rem', '2rem'],        //    ['20px', '32px'],
      '2xl': ['1.5rem', '2.5rem'],    //    ['24px', '40px'],
      '3xl': ['1.75rem', '3rem'],     //    ['28px', '48px'],
      '4xl': ['2rem', '3.733rem'],    //    ['32px', '56px'],
      '5xl': ['2.5rem', '4.5rem'],    //    ['40px', '72px'],
      '6xl': ['3.125rem', '5.312rem'] //    ['50px', '88px'] // font-size: 3.125rem, line-height: 5.312rem
    }, */
    /* fontWeight: {
      thin: 100,
      extraLight: 200,
      light: 300,
      regular: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
      extrabold: 800,
      black: 900,
    }, */

    extend: {
      fontWeight: {
        regular: 400, // equal to medium in tailwind - because other guys use this weight, I need to extend this here
        heavy: 700, // equal to bold in tailwind 
        black: 700
      },

      lineHeight: {
        0: 0,
        1: '0.25rem',
        2: '0.5rem',
        12: '3rem',
        14: '3.5rem',
        16: '4rem',
        18: '4.5rem',
        20: '5rem',
        22: '5.5rem',
        24: '6rem',
        26: '6.6rem',
        28: '7rem',
        30: '7.5rem',
        32: '8rem'
      }
    },
  },
  plugins: [
    // eslint-disable-next-line no-undef
    require('flowbite/plugin'),
  ],
}