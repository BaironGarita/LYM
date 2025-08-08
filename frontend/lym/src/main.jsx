import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";

// Importa la instancia única de i18n (ajusta la ruta si es necesario)
import i18n from "./i18n/index.js";
import { I18nextProvider } from "react-i18next";

import "./index.css";

import { Provider } from "react-redux";
import { store } from "./store/store.js";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <I18nextProvider i18n={i18n}>
      <App />
    </I18nextProvider>
  </React.StrictMode>
);
