const { nextui } = require("@nextui-org/react");
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      boxShadow: {
        "all-sides": "0 0 6px 0 #015f80",
        "all-sides-md": "0 0 15px 0 #00BEFF",
        "all-sides-lg": "0 0 20px 0 #00BEFF",
        // Add more custom shadows as needed
      },
      colors: {
        backgroundColor: "#021825",
        backgrounColor2: "#071B27",
        primaryColor: "#00BEFF",
        yellowColor: "#FEB60D",
        purpleColor: "#9771FF",
        irisBlueColor: "#48cae4",
        headingColor: "#48cae4",
        textColor: "#4E545F",
        hoverColor: "#42A5F5",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  darkMode: "class",
  plugins: [nextui()],
};
export default config;
