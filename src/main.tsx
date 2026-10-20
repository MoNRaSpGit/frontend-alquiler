import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { AlquilerApp } from "./features/alquiler/AlquilerApp";
import "./styles/global.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AlquilerApp />
  </StrictMode>
);
