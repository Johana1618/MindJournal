// src/main.tsx
import React from "react";
import ReactDOM from "react-dom/client";
import { setupIonicReact } from "@ionic/react";
import App from "./App";

// importa variables de tema de Ionic (colores, etc.)
import "./theme/variables.css";

setupIonicReact();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
