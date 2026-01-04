import type { Config } from "tailwindcss";

export default {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "hsl(150, 30%, 98%)",
        foreground: "hsl(160, 50%, 10%)",
        primary: {
          DEFAULT: "hsl(155, 75%, 40%)",
          foreground: "hsl(0, 0%, 100%)",
        },
        accent: {
          DEFAULT: "hsl(38, 95%, 58%)",
          foreground: "hsl(0, 0%, 100%)",
        },
        secondary: {
          DEFAULT: "hsl(150, 20%, 90%)",
          foreground: "hsl(160, 50%, 15%)",
        },
        muted: {
          DEFAULT: "hsl(150, 15%, 94%)",
          foreground: "hsl(160, 20%, 45%)",
        },
        border: "hsl(150, 20%, 88%)",
      },
      fontFamily: {
        sans: ["var(--font-dm-sans)", "sans-serif"],
        display: ["var(--font-outfit)", "sans-serif"],
      },
    },
  },
  plugins: [],
} satisfies Config;
