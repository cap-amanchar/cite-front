module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Main palette
        primary: "#ffd803",
        secondary: "#ff8e3c",
        tertiary: "#0075ff",

        // UI colors
        success: "#00ebc7",
        warning: "#ffbb00",
        danger: "#ff5470",
        info: "#6a7fdb",

        // Status colors
        "status-pending": "#ffbb00",
        "status-approved": "#00ebc7",
        "status-rejected": "#ff5470",
        "status-cancelled": "#858585",

        // Absence type colors
        "absence-vacation": "#baedff",
        "absence-sick": "#f2c4ce",
        "absence-personal": "#d8bbff",
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "-apple-system", "BlinkMacSystemFont", "sans-serif"],
        heading: ["Syne", "ui-sans-serif", "system-ui", "-apple-system", "BlinkMacSystemFont", "sans-serif"],
      },
      borderWidth: {
        '3': '3px',
      },
      boxShadow: {
        'neubrutalism': '4px 4px 0 0 rgba(0, 0, 0, 1)',
        'neubrutalism-sm': '2px 2px 0 0 rgba(0, 0, 0, 1)',
        'neubrutalism-lg': '6px 6px 0 0 rgba(0, 0, 0, 1)',
      },
      animation: {
        'pop': 'pop 0.3s ease-in-out',
      },
      keyframes: {
        pop: {
          '0%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.05)' },
          '100%': { transform: 'scale(1)' },
        },
      },
    },
  },
  plugins: [],
}