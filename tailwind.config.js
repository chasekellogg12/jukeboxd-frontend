/** @type {import('tailwindcss').Config} */

const defaultTheme = require("tailwindcss/defaultTheme");
const colors = require("tailwindcss/colors");
const flattenColorPalette = require("tailwindcss/lib/util/flattenColorPalette").default;

module.exports = {
  content: [
    './src/pages/**/*.{html,js}',
    './src/components/**/*.{html,js}',
    './src/**/*.{html,js}',
    './src/*.{html,js}'
  ],
  theme: {
    extend: {
      colors: {
        "h-blue": "#14181C",
        "b-blue": "#070c1b",
        //"#1E252C",
        "l-white": "#99AABB",
        "p-white": "#def",
  
        "h-grey": "#C6AEF2",
        // "#91A0AF"
        // bg dropdown menu
        "drop-grey": "#89a",
        //text dropdown menu
        "drop-black": "#2c3440",
        //dropdown hover color
        "dd-blue": "#667788",
        //used on hover links on homepage
        "hov-blue": "#40bcf4",
        //used on borders on homepage
        "b-grey": "#456",
        //subheadings in home
        "sh-grey": "#C6AEF2", // light purple
        //"#9ab",
        // poster border color
        "pb-grey": "#def",
        "si-black": "#14181c",
        //input field
        "if-blue": "#2c3440",
        //card blue
        "c-blue": "#202830",
        //signout poster hover,
        "p-green": "#00e054",
        "b-green": "#00c030",
        "b-h-green": "#00B020",
        // cast bg color
        'cast-grey': '#283038',
        // main background
        //'c-grey': '#14181cfa',
        'c-grey': '#070c1b',
        'dark-purple': '#4950D5',
      },
      animation: {
        scroll:
          "scroll var(--animation-duration, 40s) var(--animation-direction, forwards) linear infinite",
      },
      keyframes: {
        scroll: {
          to: {
            transform: "translate(calc(-50% - 0.5rem))",
          },
        },
      },
    },
  },
  plugins: [addVariablesForColors],
};

function addVariablesForColors({ addBase, theme }) {
  let allColors = flattenColorPalette(theme("colors"));
  let newVars = Object.fromEntries(
    Object.entries(allColors).map(([key, val]) => [`--${key}`, val])
  );

  addBase({
    ":root": newVars,
  });
}

