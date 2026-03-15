const { gluestackColors } = require('@panther-expo/theme/colors');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx,ts,tsx}',
    './src/**/*.{js,jsx,ts,tsx}',
    './node_modules/@panther-expo/ui/dist/**/*.{js,jsx,ts,tsx}',
  ],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: gluestackColors({
        primary: '#f38b32',
        secondary: '#4A5568',
        success: '#52C41A',
        error: '#FF4D4F',
        warning: '#FAAD14',
        info: '#1890FF',
      }),
    },
  },
  plugins: [],
};
