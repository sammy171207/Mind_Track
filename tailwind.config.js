/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // Watch all relevant files
  ],
  theme: {
    extend: {
      colors: {
        primary: "#4F46E5",     // Indigo-600
        secondary: "#6366F1",   // Indigo-500
        accent: "#06B6D4",      // Cyan-400
        background: "#F9FAFB",  // Gray-50
        surface: "#FFFFFF",     // White
        muted: "#9CA3AF",       // Gray-400
        danger: "#EF4444",      // Red-500
        success: "#10B981",     // Green-500
        warning: "#F59E0B",     // Amber-500
        focus: "#9333EA",       // Purple-600
        stress: "#F87171",      // Red-400
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        mono: ["Fira Code", "monospace"],
      },
      borderRadius: {
        xl: "1rem",
        '2xl': "1.5rem",
      },
    },
  },
  plugins: [
 require('@tailwindcss/forms')
  ],
}
