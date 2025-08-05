import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";

import "./i18n";
import { Provider } from "react-redux";
import { store } from "./store/store.js";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { es } from "./locales/es";

i18n.use(initReactI18next).init({
  resources: {
    es,
  },
  lng: "es",
  fallbackLng: "es",
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);
