import "./index.css";

import React from "react";
import ReactDOM from "react-dom/client";

import App from "./App.tsx";
import { LogRocket } from "./lib/logrocket.ts";

console.log(import.meta.env.VITE_VERCEL_ENV);
console.log(import.meta.env.VITE_VERCEL_ENV === "production");
console.log(import.meta.env.VITE_VERCEL_ENV === "preview");

LogRocket.init("2tcix6/forecasting-whiteboard");

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
