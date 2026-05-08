import React, { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import router from "./app/router";
import { AuthProvider } from "./context/AuthContext.jsx";
import "./index.css";
import { registerSW } from "virtual:pwa-register";

// Register service worker with update prompt
registerSW({
  onNeedRefresh() {
    if (confirm("A new version is available! Reload to update?")) {
      location.reload();
    }
  },
  onOfflineReady() {
    console.log("App is ready to work offline");
  },
});

ReactDOM.createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </StrictMode>,
);
