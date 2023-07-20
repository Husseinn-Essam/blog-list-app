import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { NotifContextProvider } from "./components/NotifContext";
ReactDOM.createRoot(document.getElementById("root")).render(
  <NotifContextProvider>
    <App />
  </NotifContextProvider>
);
