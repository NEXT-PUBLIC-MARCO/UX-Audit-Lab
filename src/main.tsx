import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import { App } from "./App";
import { ThemeProvider } from "./context/ThemeContext";
import { AuditProvider } from "./context/AuditContext";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider>
      <AuditProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </AuditProvider>
    </ThemeProvider>
  </StrictMode>,
);
