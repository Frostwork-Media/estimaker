/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@quri/ui/dist/**/*.js",
    "./node_modules/@quri/squiggle-components/dist/**/*.js",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
      colors: {
        background: "#fcfcfc",
        foreground: "#212325",
        neutral: {
          50: "#fafafa",
          100: "#f1f2f2",
          200: "#e0e1e1",
          300: "#cccdce",
          400: "#9a9b9c",
          500: "#6a6c6d",
          600: "#4c4d4f",
          700: "#393b3c",
          800: "#212325",
          900: "#17181a",
        },
        blue: {
          DEFAULT: "#358cfd",
          50: "#eff6ff",
          100: "#ddedff",
          200: "#c4e0ff",
          300: "#98ccff",
          400: "#61aeff",
          500: "#358cfd",
          600: "#116bef",
          700: "#0254db",
          800: "#1044b0",
          900: "#153c8a",
        },
        green: {
          DEFAULT: "#76d3bd",
          50: "#f0fdf9",
          100: "#d2fcf0",
          200: "#adf7e2",
          300: "#8aead1",
          400: "#76d3bd",
          500: "#5ab7a3",
          600: "#3f9384",
          700: "#2b766a",
          800: "#1d5e56",
          900: "#154e47",
        },
        orange: {
          DEFAULT: "#ed742e",
          50: "#fff7ed",
          100: "#feecd4",
          200: "#fbd5aa",
          300: "#f7b777",
          400: "#f29146",
          500: "#ed742e",
          600: "#e15a22",
          700: "#bd4319",
          800: "#983417",
          900: "#7c2d14",
        },
      },
      keyframes: {
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
