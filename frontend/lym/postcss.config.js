// Antes (Tailwind v3)
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};

// Después (Tailwind v4+)
module.exports = {
  plugins: {
    "@tailwindcss/postcss": {},
    autoprefixer: {},
  },
};
