import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          50: "#f8f9fc",
          100: "#edf0f7",
          200: "#d8deeb",
          300: "#b8c3d7",
          400: "#8a9cb8",
          500: "#62779a",
          600: "#4b5c7c",
          700: "#3d4a62",
          800: "#333d50",
          900: "#2c3543",
          950: "#1c2230"
        }
      }
    }
  },
  plugins: []
};

export default config;
