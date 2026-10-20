export function errorMessage(err: unknown, fallback: string) {
  return err instanceof Error ? err.message : fallback;
}

export function formatMoney(amount: number | null) {
  if (amount === null) return "—";
  return `$${amount.toLocaleString("es-UY")}`;
}

export function formatDate(iso: string | null) {
  if (!iso) return "—";
  const [year, month, day] = iso.split("-");
  return `${day}/${month}/${year}`;
}

// Numero uruguayo -> link de wa.me (mismo criterio usado en el resto del
// monorepo: sin 0 ni 15 inicial, con 598 adelante).
export function toWhatsAppHref(rawPhone: string) {
  let digits = rawPhone.replace(/\D/g, "");
  if (digits.startsWith("0")) digits = digits.slice(1);
  if (!digits.startsWith("598")) digits = `598${digits}`;
  return `https://wa.me/${digits}`;
}
