/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/app/**/*.{js,jsx}",
    "./src/components/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          pink: "#F43F5E",
          lightPink: "#FFF1F2",
          dark: "#1E293B",
          gray: "#64748B",
          bg: "#F8FAFC",
          purpleLight: "#F3E8FF",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "sans-serif"],
        serif: ["var(--font-playfair)", "serif"],
      },
      animation: {
        float: "float 4s ease-in-out infinite",
        "float-delayed": "float 4s ease-in-out 2s infinite",
        "pulse-glow": "pulseGlow 1.5s ease-in-out infinite",
        "pop-bounce": "popBounce 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) forwards",
        "ring-pulse": "ringPulse 1.8s ease-out infinite",
        'fade-in-up': 'fadeInUp 0.5s ease-out forwards',
        'fade-in': 'fadeIn 0.3s ease-out forwards',
        'slide-in-right': 'slideInRight 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards',
        'shake': 'shake 0.5s cubic-bezier(.36,.07,.19,.97) both',
        'pop-in': 'popIn 0.3s ease-out forwards',
        'error-slide': 'errorSlide 0.3s ease-out forwards',
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-8px)" },
        },
        pulseGlow: {
          "0%, 100%": { boxShadow: "0 0 0 0 rgba(244, 63, 94, 0.5)" },
          "50%": { boxShadow: "0 0 0 12px rgba(244, 63, 94, 0)" },
        },
        popBounce: {
          "0%": { opacity: "0", transform: "scale(0.5) translateY(-30px)" },
          "60%": { opacity: "1", transform: "scale(1.1) translateY(5px)" },
          "100%": { opacity: "1", transform: "scale(1) translateY(0)" },
        },
        ringPulse: {
          "0%": { transform: "scale(0.8)", opacity: "0.8" },
          "100%": { transform: "scale(2)", opacity: "0" },
        },
         fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideInRight: {
          '0%': { opacity: '0', transform: 'translateX(100%)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        shake: {
          '10%, 90%': { transform: 'translate3d(-1px, 0, 0)' },
          '20%, 80%': { transform: 'translate3d(2px, 0, 0)' },
          '30%, 50%, 70%': { transform: 'translate3d(-4px, 0, 0)' },
          '40%, 60%': { transform: 'translate3d(4px, 0, 0)' },
        },
        popIn: {
          '0%': { opacity: '0', transform: 'scale(0.9)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        errorSlide: {
          '0%': { opacity: '0', transform: 'translateY(-5px)', maxHeight: '0' },
          '100%': { opacity: '1', transform: 'translateY(0)', maxHeight: '30px' },
        },
      },
    },
  },
  plugins: [],
};
