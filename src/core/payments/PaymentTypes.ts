export type ChargeInput = {
  amount: number;
  currency: "ARS" | "USD";
  token: string;
  metadata?: Record<string, string>;
};
export type ChargeResult = {
  id: string;
  status: "approved" | "declined";
  raw?: unknown;
};
export type RefundInput = { paymentId: string; amount?: number };
export type RefundResult = {
  id: string;
  status: "refunded" | "failed";
  raw?: unknown;
};
