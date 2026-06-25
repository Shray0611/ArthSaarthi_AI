/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'tangerine': '#f69251',
        'midnight-ink': '#181825',
        'graphite': '#484758',
        'deep-slate': '#242433',
        'stone': '#636363',
        'pebble': '#949494',
        'ash': '#8b8b8b',
        'fog': '#f7f7f7',
        'snow': '#ffffff',
        'dusty-rose': '#c97b84',
      },
      fontFamily: {
        display: ['Satoshi', 'Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        'cards': '24px',
        'buttons': '28px',
        'overlays': '32px',
        'badges': '100px',
      },
    },
  },
  plugins: [],
}
