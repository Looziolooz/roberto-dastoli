import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "brand-bg": "#F5F0EB",
        "brand-card": "#FFFFFF",
        "brand-text": "#2C2C2E",
        "brand-muted": "#8E8E93",
        "brand-accent": "#8B7355",
        "brand-accent-light": "#B8A88A",
        "brand-accent-soft": "rgba(139,115,85,0.08)",
        "brand-border": "#E5DFD7",
        "brand-success": "#5B8C5A",
        "brand-danger": "#B05050",
      },
    },
  },
  plugins: [],
};

export default config;
