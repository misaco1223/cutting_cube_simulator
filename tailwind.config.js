/** @type {import('tailwindcss').Config} */
import { defineConfig } from 'tailwindcss'
import lineClamp from '@tailwindcss/line-clamp'

export default {
  content: [
    "./app/javascript/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {},
  },
  plugins: [lineClamp],
}
