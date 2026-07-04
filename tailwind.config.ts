import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./features/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // ── Teal #1CABB4 ──
        teal: {
          DEFAULT:  "#1CABB4",
          50:       "#F0FAFB",
          100:      "#E8F8F9",
          200:      "#C4EDF0",
          300:      "#8DD9DE",
          400:      "#1CABB4",
          500:      "#178E96",
          600:      "#127178",
          700:      "#0D545A",
          800:      "#08373C",
          900:      "#041A1E",
        },
        // ── Green #DBEBC9 ──
        green: {
          DEFAULT:  "#DBEBC9",
          50:       "#FAFDF7",
          100:      "#F5FAF0",
          200:      "#EAF5E4",
          300:      "#DBEBC9",
          400:      "#C1DC9E",
          500:      "#A7CC73",
          600:      "#8DBD48",
          700:      "#6FA034",
          800:      "#4F7325",
          900:      "#2F4716",
        },
        // Alias utama
        primary:   "#1CABB4",
        secondary: "#DBEBC9",
        background:"#F7FDFB",
        card:      "#FFFFFF",
        border:    "#D4EAC8",
        // Text — turunan teal gelap
        "text-primary":   "#1A3A3C",
        "text-secondary": "#4A7A6D",
        "text-muted":     "#8ABDB5",
        // Status — tetap pakai warna fungsional tapi diselaraskan
        success: "#22C55E",
        warning: "#F59E0B",
        danger:  "#EF4444",
      },
      fontFamily: {
        sans:    ["Inter", "system-ui", "sans-serif"],
        display: ["Plus Jakarta Sans", "sans-serif"],
      },
      borderRadius: {
        lg:   "16px",
        xl:   "20px",
        "2xl":"24px",
        "3xl":"32px",
      },
      boxShadow: {
        card:       "0 2px 12px rgba(28,171,180,0.08)",
        "card-hover":"0 8px 32px rgba(28,171,180,0.18)",
        teal:       "0 4px 20px rgba(28,171,180,0.25)",
        green:      "0 4px 20px rgba(219,235,201,0.6)",
      },
      backgroundImage: {
        "brand-gradient":  "linear-gradient(135deg, #1CABB4 0%, #DBEBC9 100%)",
        "brand-gradient-r":"linear-gradient(135deg, #DBEBC9 0%, #1CABB4 100%)",
        "teal-gradient":   "linear-gradient(135deg, #1CABB4 0%, #178E96 100%)",
        "green-gradient":  "linear-gradient(135deg, #DBEBC9 0%, #C1DC9E 100%)",
        "hero-gradient":   "linear-gradient(135deg, #0D545A 0%, #1CABB4 50%, #DBEBC9 100%)",
        "card-gradient":   "linear-gradient(135deg, #E8F8F9 0%, #F5FAF0 100%)",
        "soft-gradient":   "linear-gradient(180deg, #F0FAFB 0%, #FAFDF7 100%)",
      },
      animation: {
        "fade-in":  "fadeIn 0.4s ease-out",
        "slide-up": "slideUp 0.4s ease-out",
        float:      "float 3s ease-in-out infinite",
        shimmer:    "shimmer 1.5s infinite",
      },
      keyframes: {
        fadeIn:  { from: { opacity: "0" },                              to: { opacity: "1" } },
        slideUp: { from: { transform: "translateY(20px)", opacity: "0" }, to: { transform: "translateY(0)", opacity: "1" } },
        float:   { "0%,100%": { transform: "translateY(0)" },           "50%": { transform: "translateY(-6px)" } },
        shimmer: { "0%": { backgroundPosition: "-200% 0" },             "100%": { backgroundPosition: "200% 0" } },
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;