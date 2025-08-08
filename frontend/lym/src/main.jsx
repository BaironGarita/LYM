import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";

// i18n (una sola instancia)
import i18n from "./i18n/index.js";
import { I18nextProvider } from "react-i18next";

// Redux
import { Provider } from "react-redux";
import store from "./store/store.js"; // ajusta a ./store/index.js si tu store se exporta allí

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
