import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { ModelContextProvider } from "./contexts/ModelContext.jsx";

createRoot(document.getElementById("root")).render(
  <ModelContextProvider>
    <App />
  </ModelContextProvider>
);
