import { ChargeInput, ChargeResult, RefundInput, RefundResult } from '../PaymentTypes';

/**
 * Interfaz para estrategias de pago
 * 
 * Patrón Strategy: Define la interfaz común para todas las estrategias de pago
 * Permite intercambiar diferentes algoritmos de pago de forma transparente
 */
export interface PaymentStrategy {
  /**
   * Realiza un cargo (charge)
   * 
   * @param input - Datos del cargo a realizar
   * @returns Promesa con el resultado del cargo
   */
  charge(input: ChargeInput): Promise<ChargeResult>;
  
  /**
   * Realiza un reembolso (refund)
   * 
   * @param input - Datos del reembolso a realizar
   * @returns Promesa con el resultado del reembolso
   */
  refund(input: RefundInput): Promise<RefundResult>;
}