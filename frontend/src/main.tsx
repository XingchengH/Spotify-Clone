import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import App from "./App.tsx";
import { Provider } from "react-redux";
import AppWrapper from "./AppWrapper.tsx";
import store from "./store/store.ts";
import { updateApiToken } from "./lib/axios.ts";

const token = localStorage.getItem("token");
if (token) updateApiToken(token);
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <AppWrapper>
        <App />
      </AppWrapper>
    </Provider>
  </StrictMode>
);
