import { useEffect, useState } from "react";
import { LocalCard } from "../components/LocalCard";
import { LocalDetailModal } from "../components/LocalDetailModal";
import { fetchLocales } from "../alquiler.client";
import { errorMessage } from "../alquiler.shared";
import type { AlquilerLocal } from "../alquiler.types";

const REFRESH_MS = 60000;

export function PanelScreen() {
  const [locales, setLocales] = useState<AlquilerLocal[] | null>(null);
  const [error, setError] = useState("");
  const [selected, setSelected] = useState<AlquilerLocal | null>(null);

  function load() {
    fetchLocales()
      .then((result) => {
        setLocales(result);
        setError("");
      })
      .catch((err) => setError(errorMessage(err, "No se pudieron cargar los locales.")));
  }

  useEffect(() => {
    load();
    const intervalId = window.setInterval(load, REFRESH_MS);
    return () => window.clearInterval(intervalId);
  }, []);

  const ocupados = locales?.filter((local) => local.occupied) ?? [];
  const alDia = ocupados.filter((local) => local.status === "blanco").length;
  const porVencer = ocupados.filter((local) => local.status === "amarillo").length;
  const vencidos = ocupados.filter((local) => local.status === "rojo").length;
  const disponibles = locales?.filter((local) => !local.occupied).length ?? 0;

  return (
    <section className="panel-screen">
      {error && <p className="message message-error">{error}</p>}

      {locales && (
        <div className="summary-bar">
          <span className="summary-chip">
            <strong>{alDia}</strong> al día
          </span>
          <span className="summary-chip summary-chip--amarillo">
            <strong>{porVencer}</strong> por vencer
          </span>
          <span className="summary-chip summary-chip--rojo">
            <strong>{vencidos}</strong> vencido(s)
          </span>
          <span className="summary-chip summary-chip--muted">
            <strong>{disponibles}</strong> disponible(s)
          </span>
        </div>
      )}

      {locales === null && !error && <p className="message">Cargando…</p>}

      {locales && (
        <div className="local-grid">
          {locales.map((local) => (
            <LocalCard key={local.id} local={local} onClick={() => setSelected(local)} />
          ))}
        </div>
      )}

      {selected && (
        <LocalDetailModal
          local={selected}
          onClose={() => setSelected(null)}
          onSaved={(updated) => {
            setLocales((current) => current?.map((local) => (local.id === updated.id ? updated : local)) ?? current);
            setSelected(updated);
          }}
        />
      )}
    </section>
  );
}
