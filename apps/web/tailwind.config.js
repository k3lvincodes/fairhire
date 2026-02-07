/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {
      colors: {
        'brand-black': '#0A0D10',
        'brand-white': '#FFFFFF',
        'brand-purple': '#6C3BAA',
        'brand-purple-hover': '#5a308f'
      },
      fontFamily: {
        sans: ['Manrope', 'sans-serif'],
        display: ['Space Grotesk', 'sans-serif']
      }
    }
  },
  plugins: []
};
