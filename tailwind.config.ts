import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: { DEFAULT: "#101311", light: "#171C1A", card: "#202622", hover: "#283029" },
        gold: { DEFAULT: "#D5AB57", dark: "#B8923E", light: "#F0D18A" },
        cream: "#F5EEE2",
        muted: "#A9AFA8",
        border: { DEFAULT: "#2A3028", gold: "#D5AB5733" },
        whatsapp: "#25D366",
        facebook: "#1877F2",
        instagram: "#bc1888",
      },
      fontFamily: {
        display: ["Cairo", "Amiri", "serif"],
        body: ["Tajawal", "Cairo", "Tahoma", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
