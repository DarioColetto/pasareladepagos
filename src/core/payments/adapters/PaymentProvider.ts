import { ChargeInput, ChargeResult, RefundInput, RefundResult } from "../PaymentTypes";

/**
 * Interfaz para proveedores de pago
 * 
 * Patrón Adapter: Define la interfaz común que deben implementar todos los adaptadores
 * Permite que el sistema trabaje con diferentes proveedores de forma uniforme
 */
export interface PaymentProvider {
  /**
   * Realiza un pago (charge)
   * 
   * @param input - Datos del pago a realizar
   * @returns Promesa con el resultado del pago
   */
  pay(input: ChargeInput): Promise<ChargeResult>;
  
  /**
   * Realiza un reembolso (refund)
   * 
   * @param input - Datos del reembolso a realizar
   * @returns Promesa con el resultado del reembolso
   */
  refund(input: RefundInput): Promise<RefundResult>;
}