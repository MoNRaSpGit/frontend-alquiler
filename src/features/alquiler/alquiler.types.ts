export type AlquilerLocalStatus = "blanco" | "amarillo" | "rojo" | "vacio";

export type AlquilerLocal = {
  id: number;
  number: number;
  occupied: boolean;
  businessType: string | null;
  tenantName: string | null;
  phone: string | null;
  paymentDay: number | null;
  rentAmount: number | null;
  note: string | null;
  lastPaidThrough: string | null;
  dueDate: string | null;
  daysUntilDue: number | null;
  status: AlquilerLocalStatus;
  contractEndDate: string | null;
  daysUntilContractEnd: number | null;
};

export type AlquilerPayment = {
  id: number;
  localId: number;
  localNumber: number;
  tenantName: string | null;
  periodDue: string;
  amount: number | null;
  note: string | null;
  paidAt: string;
};

export type UpdateAlquilerLocalInput = Partial<{
  occupied: boolean;
  businessType: string;
  tenantName: string;
  phone: string;
  paymentDay: number;
  rentAmount: number;
  note: string;
  contractEndDate: string;
}>;
