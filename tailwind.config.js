/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [require("daisyui")],
  // MODIFIE OU AJOUTE CETTE SECTION :
  daisyui: {
    themes: ["dark", "corporate"], // Mets bien ici les thèmes que tu utilises
    logs: false, // Bloque les injections de logs complexes de couleurs
  },
};
