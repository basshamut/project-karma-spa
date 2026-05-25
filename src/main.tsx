import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import "./lib/i18n";

try {
  const stored = localStorage.getItem("karma-theme");
  if (stored === "day") {
    document.documentElement.classList.add("day");
  }
} catch {}

createRoot(document.getElementById("root")!).render(<App />);
