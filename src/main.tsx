import { createRoot } from "react-dom/client";
import App from "./app/App";

// @ts-ignore
import "./styles/tailwind.css";

createRoot(document.getElementById("root")!).render(
  <App />
);