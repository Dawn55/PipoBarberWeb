/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#000000',       // Siyah
        secondary: '#1a1a1a',     // Koyu gri
        accent: '#e5e7eb',        // Gümüş rengi
        light: '#f3f4f6',         // Açık gri/beyaz
        dark: '#0a0a0a',          // Çok koyu gri
      },
      gradientColorStops: {
        'dark-start': '#0d0d0d',
        'dark-end': '#1a1a1a',
      },
    },
  },
  plugins: [],
}