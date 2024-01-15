import "./index.css";

import React from "react";
import ReactDOM from "react-dom/client";

import App from "./App.tsx";
import { LogRocket } from "./lib/logrocket.ts";

if (__VERCEL_ENV__ === "production") {
  LogRocket.init("2tcix6/forecasting-whiteboard");
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
