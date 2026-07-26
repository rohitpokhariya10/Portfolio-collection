import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("The application root element is missing from index.html.");
}

// StrictMode intentionally replays effects in development. Components that own
// global listeners, scroll state, or WebGL resources must therefore clean up fully.
createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
