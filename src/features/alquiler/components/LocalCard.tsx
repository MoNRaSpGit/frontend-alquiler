import type { AlquilerLocal } from "../alquiler.types";
import { formatDate } from "../alquiler.shared";

export function LocalCard({ local, onClick }: { local: AlquilerLocal; onClick: () => void }) {
  return (
    <button type="button" className={`local-card local-card--${local.status}`} onClick={onClick}>
      {local.status === "vacio" && <span className="local-card__ribbon">Disponible</span>}
      <span className="local-card__number">Local {local.number}</span>

      {local.occupied ? (
        <>
          <strong className="local-card__tenant">{local.tenantName || "Sin nombre"}</strong>
          <span className="local-card__business">{local.businessType || "—"}</span>
          <span className="local-card__due">
            {local.dueDate ? `Vence ${formatDate(local.dueDate)}` : "Sin fecha de pago"}
          </span>
        </>
      ) : (
        <span className="local-card__empty-hint">Tocá para asignar inquilino</span>
      )}
    </button>
  );
}
