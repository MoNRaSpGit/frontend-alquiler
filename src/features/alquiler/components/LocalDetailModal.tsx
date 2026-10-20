import { useState } from "react";
import { registerPayment, updateLocal } from "../alquiler.client";
import { errorMessage, formatDate, formatMoney, toWhatsAppHref } from "../alquiler.shared";
import type { AlquilerLocal } from "../alquiler.types";

export function LocalDetailModal({
  local,
  onClose,
  onSaved
}: {
  local: AlquilerLocal;
  onClose: () => void;
  onSaved: (local: AlquilerLocal) => void;
}) {
  const [occupied, setOccupied] = useState(local.occupied);
  const [businessType, setBusinessType] = useState(local.businessType ?? "");
  const [tenantName, setTenantName] = useState(local.tenantName ?? "");
  const [phone, setPhone] = useState(local.phone ?? "");
  const [paymentDay, setPaymentDay] = useState(local.paymentDay ? String(local.paymentDay) : "");
  const [rentAmount, setRentAmount] = useState(local.rentAmount !== null ? String(local.rentAmount) : "");
  const [note, setNote] = useState(local.note ?? "");
  const [contractEndDate, setContractEndDate] = useState(local.contractEndDate ?? "");
  const [saving, setSaving] = useState(false);
  const [markingPaid, setMarkingPaid] = useState(false);
  const [error, setError] = useState("");

  async function handleSave() {
    setSaving(true);
    setError("");
    try {
      const saved = await updateLocal(local.id, {
        occupied,
        businessType: businessType.trim(),
        tenantName: tenantName.trim(),
        phone: phone.trim(),
        paymentDay: paymentDay ? Number(paymentDay) : undefined,
        rentAmount: rentAmount ? Number(rentAmount) : undefined,
        note: note.trim(),
        contractEndDate: contractEndDate.trim()
      });
      onSaved(saved);
    } catch (err) {
      setError(errorMessage(err, "No se pudo guardar."));
    } finally {
      setSaving(false);
    }
  }

  async function handleMarkPaid() {
    setMarkingPaid(true);
    setError("");
    try {
      const saved = await registerPayment(local.id, { amount: rentAmount ? Number(rentAmount) : undefined });
      onSaved(saved);
    } catch (err) {
      setError(errorMessage(err, "No se pudo registrar el pago."));
    } finally {
      setMarkingPaid(false);
    }
  }

  const canMarkPaid = occupied && Boolean(local.paymentDay) && local.status !== "blanco";

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={(event) => event.stopPropagation()}>
        <div className="modal-header">
          <h2>Local {local.number}</h2>
          <button type="button" className="modal-close" onClick={onClose}>
            ✕
          </button>
        </div>

        <label className="field field--checkbox">
          <input type="checkbox" checked={occupied} onChange={(event) => setOccupied(event.target.checked)} />
          <span>Ocupado</span>
        </label>

        {occupied && (
          <>
            <label className="field">
              <span>Rubro</span>
              <input value={businessType} onChange={(event) => setBusinessType(event.target.value)} placeholder="Peluquería, kiosco…" maxLength={80} />
            </label>
            <label className="field">
              <span>Inquilino</span>
              <input value={tenantName} onChange={(event) => setTenantName(event.target.value)} maxLength={120} />
            </label>
            <label className="field">
              <span>Teléfono</span>
              <div className="field-with-action">
                <input value={phone} onChange={(event) => setPhone(event.target.value)} maxLength={40} inputMode="tel" />
                {phone.trim() && (
                  <a className="whatsapp-link" href={toWhatsAppHref(phone)} target="_blank" rel="noreferrer" title="Abrir WhatsApp">
                    WhatsApp
                  </a>
                )}
              </div>
            </label>
            <div className="field-row">
              <label className="field">
                <span>Día de pago</span>
                <input
                  value={paymentDay}
                  onChange={(event) => setPaymentDay(event.target.value.replace(/\D/g, ""))}
                  inputMode="numeric"
                  maxLength={2}
                  placeholder="1-31"
                />
              </label>
              <label className="field">
                <span>Monto mensual</span>
                <input
                  value={rentAmount}
                  onChange={(event) => setRentAmount(event.target.value.replace(/[^\d.]/g, ""))}
                  inputMode="decimal"
                  placeholder="$"
                />
              </label>
            </div>
            <label className="field">
              <span>Fin de contrato (opcional)</span>
              <input type="date" value={contractEndDate} onChange={(event) => setContractEndDate(event.target.value)} />
            </label>
            <label className="field">
              <span>Nota (opcional)</span>
              <textarea value={note} onChange={(event) => setNote(event.target.value)} maxLength={500} rows={2} />
            </label>

            {local.dueDate && (
              <p className="local-detail-due">
                Próximo vencimiento: <strong>{formatDate(local.dueDate)}</strong>
                {local.rentAmount !== null && <> · {formatMoney(local.rentAmount)}</>}
              </p>
            )}
            {local.contractEndDate && local.daysUntilContractEnd !== null && (
              <p className="local-detail-due">
                Fin de contrato: <strong>{formatDate(local.contractEndDate)}</strong>
                {local.daysUntilContractEnd >= 0 ? ` (en ${local.daysUntilContractEnd} días)` : ` (vencido hace ${-local.daysUntilContractEnd} días)`}
              </p>
            )}
          </>
        )}

        {error && <p className="message message-error">{error}</p>}

        <div className="modal-actions">
          {canMarkPaid && (
            <button type="button" className="button button-accent" onClick={handleMarkPaid} disabled={markingPaid || saving}>
              {markingPaid ? "Registrando…" : "Marcar pagado"}
            </button>
          )}
          <button type="button" className="button button-primary" onClick={handleSave} disabled={saving || markingPaid}>
            {saving ? "Guardando…" : "Guardar"}
          </button>
        </div>
      </div>
    </div>
  );
}
