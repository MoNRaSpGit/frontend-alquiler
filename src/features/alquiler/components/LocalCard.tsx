import type { AlquilerLocal } from "../alquiler.types";
import { formatDate } from "../alquiler.shared";

// Aviso de fin de contrato, aparte del color de blanco/amarillo/rojo (que
// es solo del pago mensual) -- aparece cuando falta un mes o menos, o si
// ya venció. Umbral a criterio: 30 dias.
const CONTRACT_WARNING_DAYS = 30;

export function LocalCard({ local, onClick }: { local: AlquilerLocal; onClick: () => void }) {
  const showContractAlert = local.occupied && local.daysUntilContractEnd !== null && local.daysUntilContractEnd <= CONTRACT_WARNING_DAYS;

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
          {showContractAlert && (
            <span className="local-card__contract-alert">
              ⚠{" "}
              {local.daysUntilContractEnd! >= 0
                ? `Contrato vence en ${local.daysUntilContractEnd} días`
                : `Contrato vencido hace ${-local.daysUntilContractEnd!} días`}
            </span>
          )}
        </>
      ) : (
        <span className="local-card__empty-hint">Tocá para asignar inquilino</span>
      )}
    </button>
  );
}
