import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./global.css";
import { NotifContextProvider } from "./components/NotifContext";
import { UserContextProvider } from "./components/UserContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter as Router } from "react-router-dom";
import { InitializerProvider } from "./components/initializerContext";
const queryClient = new QueryClient();
ReactDOM.createRoot(document.getElementById("root")).render(
  <QueryClientProvider client={queryClient}>
    <UserContextProvider>
      <NotifContextProvider>
        <InitializerProvider>
          <Router>
            <App />
          </Router>
        </InitializerProvider>
      </NotifContextProvider>
    </UserContextProvider>
  </QueryClientProvider>
);
