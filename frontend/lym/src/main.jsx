import React from "react";
import ReactDOM from "react-dom/client";
import App from "@/App.jsx";

// Importa la configuración correcta de i18n
import i18n from "@/shared/config/i18n";
import { I18nextProvider } from "react-i18next";

import { Provider } from "react-redux";
import store from "@/store/store.js";

import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <I18nextProvider i18n={i18n}>
        <App />
      </I18nextProvider>
    </Provider>
  </React.StrictMode>
);
