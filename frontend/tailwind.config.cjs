module.exports = {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#eef2ff",
          100: "#e0e7ff",
          200: "#c7d2fe",
          300: "#a5b4fc",
          400: "#818cf8",
          500: "#6366f1",
          600: "#4f46e5",
          700: "#4338ca",
          800: "#3730a3",
          900: "#312e81"
        }
      },
      boxShadow: {
        soft: "0 20px 45px -20px rgba(79, 70, 229, 0.45)",
        card: "0 18px 35px -12px rgba(15, 23, 42, 0.25)"
      }
    }
  },
  plugins: []
};
