import type { Config } from "tailwindcss";
const plugin = require('tailwindcss/plugin')
const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        'primary': 'linear-gradient(114deg, #45CFE1 25.08%, #12A8DD 96.72%)',
        'secondary': 'linear-gradient(145deg, #9E87F1 16.96%, #796AF0 92.47%)',
        'tertiary': 'linear-gradient(255deg, #FED02B 6.76%, #FFBA37 60.42%)',
        "whiteFromBottom": "linear-gradient(0deg, rgba(255, 255, 255, 0.6) 0%, rgba(255, 255, 255, 0) 100%)",
      },
      boxShadow: {
        'primary': '0px 4px 12px 0px rgba(43, 181, 207, 0.42);',
        'tertiary': '0px 4px 4px 0px rgba(254, 208, 43, 0.54);',
        'heroImg': '4px 21px 43px -5px rgba(123, 117, 237, 0.48)',
        "third": '0px 9px 69px -5px rgba(49, 169, 220, 0.20)',
        "featuresLp": '0px 9px 69px -5px #31A9DC33',
        "HeaderSignUp": "0px 0px 8px #796AF0",
        "HeaderSignIn": "0px 0px 8px #12A8DD",
        "HeroBtn": "0px 0px 8px #FFBA37",

      },
      textShadow: {
        "TextShadow": "0px 0px 5px rgb(255, 255, 255)"
      },
      backdropBlur: {
        'heroImg': '25.5px',
      },
      colors: {
        'dark': "#0F1E42",
        'secondary': '#7459DF',
        'quaternary': '#753100',
        'darkBlue': '#0C4888',
        'hoverSecondary': "#F9F9FF",
        "hoverPrimary": "#D0F3FF"
      },
      fontFamily: {
        "shamel-book": ['var(--font-shamel-book)'],
        "shamel-bold": ['var(--font-shamel-bold)'],
        "shamel": ['var(--font-shamel)'],
        "poppins": ['var(--font-poppins)'],
        "tajawal": ['var(--font-tajawal)'],
      },

      animation: {
        'bounce-custom': 'bounce-custom 1.5s infinite',
        "pulse-custom": "pulse-custom 3s infinite ease-in-out",
        "btnBgImg": "btnBgImg 0.5s  ease-in-out"
      },
      keyframes: {
        'bounce-custom': {
          '0%, 100%': { transform: 'translateY(-25%)', animationTimingFunction: 'cubic-bezier(0.8, 0, 1, 1)' },
          '50%': { transform: 'translateY(0)', animationTimingFunction: 'cubic-bezier(0, 0, 0.2, 1)' },
        },
        "pulse-custom": {
          '50%': {
            opacity: '0.5'
          },

        },
        "btnBgImg": {
          '0%': {
            backgroundImage: "linear-gradient(114deg, #45CFE1 25.08%, #12A8DD 96.72%)"
          },
          '50%': {
            backgroundImage: "linear-gradient(50deg, #55CFE1 25.08%, #00A8DD 96.72%)"
          },
          '100%': {
            backgroundImage: "linear-gradient(114deg, #45CFE1 25.08%, #12A8DD 96.72%))"
          }
        }

      },
    },
  },
  plugins: [
    plugin(function ({ matchUtilities, theme }: any) {
      matchUtilities(
        {
          'text-shadow': (value: string) => ({
            textShadow: value,
          }),
        },
        { values: theme('textShadow') }
      )
    }),
  ],
};


export default config;
