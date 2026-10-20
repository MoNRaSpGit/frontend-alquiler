import { useState } from "react";
import { HistorialScreen } from "./screens/HistorialScreen";
import { PanelScreen } from "./screens/PanelScreen";

type Tab = "panel" | "historial";

export function AlquilerApp() {
  const [tab, setTab] = useState<Tab>("panel");

  return (
    <div className="app">
      <header className="app-bar">
        <strong>Alquiler</strong>
        <nav className="app-tabs">
          <button type="button" className={tab === "panel" ? "is-active" : ""} onClick={() => setTab("panel")}>
            Panel
          </button>
          <button type="button" className={tab === "historial" ? "is-active" : ""} onClick={() => setTab("historial")}>
            Historial
          </button>
        </nav>
      </header>

      <main className="app-main">{tab === "panel" ? <PanelScreen /> : <HistorialScreen />}</main>
    </div>
  );
}
