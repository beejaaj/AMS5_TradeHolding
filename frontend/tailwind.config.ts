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
        background: "#0B0E11", 
        surface: "#181A20",    
        surfaceHover: "#2B3139", 
        
        primary: "#8B5CF6",   
        primaryHover: "#7C3AED", 
        
        // Textos
        textPrimary: "#EAECEF", 
        textSecondary: "#848E9C", 

        success: "#0ECB81", 
        danger: "#F6465D",  
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'], 
      },
    },
  },
  plugins: [],
};
export default config;