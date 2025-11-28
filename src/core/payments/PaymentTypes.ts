/**
 * Tipos principales para el sistema de pagos
 * Define las interfaces y tipos de datos para operaciones de pago
 */

/**
 * Datos de entrada para un cargo (charge)
 */
export type ChargeInput = {
  amount: number;
  currency: "ARS" | "USD";
  token: string;
  metadata?: Record<string, string>;
};

/**
 * Resultado de un cargo exitoso o fallido
 */
export type ChargeResult = {
  id: string;
  status: "approved" | "declined";
  raw?: unknown;
};

/**
 * Datos de entrada para un reembolso (refund)
 */
export type RefundInput = { 
  paymentId: string; 
  amount?: number;
};

/**
 * Resultado de un reembolso exitoso o fallido
 */
export type RefundResult = {
  id: string;
  status: "refunded" | "failed";
  raw?: unknown;
};

/**
 * Resultado genérico de una operación de pago
 */
export interface PaymentResult {
  success: boolean;
  transactionId?: string;
  error?: string;
  amount: number;
  timestamp: Date;
}

/**
 * Proveedores de pago soportados
 */
export enum PaymentProviders {
  STRIPE = 'stripe',
  MERCADOPAGO = 'mp'
}

/**
 * Eventos del sistema de pagos
 */
export enum PaymentEvents {
  PAYMENT_CREATED = 'payment:created',
  PAYMENT_PROCESSED = 'payment:processed',
  PAYMENT_FAILED = 'payment:failed',
  PAYMENT_REFUNDED = 'payment:refunded'
}

/**
 * Datos para eventos de pago
 */
export type PaymentEventData = {
  paymentId: string;
  amount: number;
  currency: string;
  provider: PaymentProviders;
  status: string;
  timestamp: Date;
};

/**
 * Comandos del sistema de pagos
 */
export type ProcessPaymentCommand = {
  type: 'PROCESS_PAYMENT';
  payload: ChargeInput & { provider: PaymentProviders };
};

export type RefundPaymentCommand = {
  type: 'REFUND_PAYMENT';
  payload: RefundInput;
};

export type PaymentCommand = ProcessPaymentCommand | RefundPaymentCommand;

/**
 * Configuración para proveedores de pago
 */
export type PaymentConfig = {
  apiKey: string;
  environment: 'sandbox' | 'production';
  timeout?: number;
};