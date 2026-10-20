import { useEffect, useMemo, useState } from "react";
import { fetchLocales, fetchPayments } from "../alquiler.client";
import { errorMessage, formatDate, formatMoney } from "../alquiler.shared";
import type { AlquilerLocal, AlquilerPayment } from "../alquiler.types";

function formatPaidAt(iso: string) {
  return new Date(iso).toLocaleString("es-UY", { timeZone: "America/Montevideo", day: "2-digit", month: "2-digit", year: "numeric" });
}

export function HistorialScreen() {
  const [payments, setPayments] = useState<AlquilerPayment[] | null>(null);
  const [locales, setLocales] = useState<AlquilerLocal[]>([]);
  const [error, setError] = useState("");
  const [localFilter, setLocalFilter] = useState("todos");
  const [monthFilter, setMonthFilter] = useState("todos");

  useEffect(() => {
    Promise.all([fetchPayments(), fetchLocales()])
      .then(([paymentsResult, localesResult]) => {
        setPayments(paymentsResult);
        setLocales(localesResult);
      })
      .catch((err) => setError(errorMessage(err, "No se pudo cargar el historial.")));
  }, []);

  const months = useMemo(() => {
    const set = new Set((payments ?? []).map((payment) => payment.periodDue.slice(0, 7)));
    return Array.from(set).sort().reverse();
  }, [payments]);

  const filtered = useMemo(() => {
    return (payments ?? []).filter((payment) => {
      if (localFilter !== "todos" && String(payment.localId) !== localFilter) return false;
      if (monthFilter !== "todos" && payment.periodDue.slice(0, 7) !== monthFilter) return false;
      return true;
    });
  }, [payments, localFilter, monthFilter]);

  const totalFiltered = filtered.reduce((sum, payment) => sum + (payment.amount ?? 0), 0);

  return (
    <section className="historial-screen">
      <div className="historial-filters">
        <select value={localFilter} onChange={(event) => setLocalFilter(event.target.value)}>
          <option value="todos">Todos los locales</option>
          {locales.map((local) => (
            <option key={local.id} value={local.id}>
              Local {local.number} {local.tenantName ? `· ${local.tenantName}` : ""}
            </option>
          ))}
        </select>
        <select value={monthFilter} onChange={(event) => setMonthFilter(event.target.value)}>
          <option value="todos">Todos los meses</option>
          {months.map((month) => (
            <option key={month} value={month}>
              {month}
            </option>
          ))}
        </select>
      </div>

      {error && <p className="message message-error">{error}</p>}
      {payments === null && !error && <p className="message">Cargando…</p>}

      {payments !== null && (
        <>
          <p className="historial-total">
            {filtered.length} pago(s) · total {formatMoney(totalFiltered)}
          </p>

          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Fecha de pago</th>
                  <th>Local</th>
                  <th>Inquilino</th>
                  <th>Período</th>
                  <th>Monto</th>
                  <th>Nota</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((payment) => (
                  <tr key={payment.id}>
                    <td>{formatPaidAt(payment.paidAt)}</td>
                    <td>Local {payment.localNumber}</td>
                    <td>{payment.tenantName ?? "—"}</td>
                    <td>{formatDate(payment.periodDue)}</td>
                    <td>{formatMoney(payment.amount)}</td>
                    <td>{payment.note ?? "—"}</td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={6} className="table-empty">
                      No hay pagos que coincidan con el filtro.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      )}
    </section>
  );
}
