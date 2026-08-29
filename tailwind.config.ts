import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        canvas: "#F6F3ED",
        ink: "#1C1917",
        wood: {
          DEFAULT: "#5B4433",
          light: "#785B45",
          dark: "#3E2E22",
        },
        stone: {
          DEFAULT: "#DCD5C8",
          light: "#EFECE6",
          dark: "#B8AF9F",
        },
      },
      fontFamily: {
        serif: ["Fraunces", "Georgia", "Cambria", "Times New Roman", "serif"],
        sans: ["Switzer", "system-ui", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "sans-serif"],
        mono: ["JetBrains Mono", "SFMono-Regular", "Menlo", "Monaco", "Consolas", "monospace"],
      },
    },
  },
  plugins: [],
};
export default config;
