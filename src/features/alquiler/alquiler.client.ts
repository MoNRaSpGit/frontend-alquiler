import { API_BASE_URL } from "../../shared/config/api";
import type { AlquilerLocal, AlquilerPayment, UpdateAlquilerLocalInput } from "./alquiler.types";

function buildUrl(path: string) {
  return `${API_BASE_URL}/api/v1/alquiler${path}`;
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(buildUrl(path), {
    ...init,
    headers: {
      ...(init?.body ? { "Content-Type": "application/json" } : {}),
      ...init?.headers
    }
  });

  if (!response.ok) {
    const body = await response.json().catch(() => null);
    throw new Error(body?.message || "No se pudo completar la operación.");
  }
  return response.json() as Promise<T>;
}

export function fetchLocales() {
  return request<AlquilerLocal[]>("/locales");
}

export function updateLocal(localId: number, input: UpdateAlquilerLocalInput) {
  return request<AlquilerLocal>(`/locales/${localId}`, { method: "PATCH", body: JSON.stringify(input) });
}

export function registerPayment(localId: number, input: { amount?: number; note?: string }) {
  return request<AlquilerLocal>(`/locales/${localId}/payments`, { method: "POST", body: JSON.stringify(input) });
}

export function fetchPayments(localId?: number) {
  const query = localId ? `?localId=${localId}` : "";
  return request<AlquilerPayment[]>(`/payments${query}`);
}
