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
        background: "var(--background)",
        foreground: "var(--foreground)",
        // Medical-grade color palette
        medical: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        },
        // Matrix colors for 7 dimensions
        matrix: {
          assimilation: '#10b981',     // Green
          defense: '#ef4444',          // Red
          energy: '#f59e0b',           // Amber
          biotransformation: '#8b5cf6', // Violet
          transport: '#06b6d4',        // Cyan
          communication: '#ec4899',     // Pink
          structural: '#6366f1',        // Indigo
        }
      },
    },
  },
  plugins: [],
};
export default config;
