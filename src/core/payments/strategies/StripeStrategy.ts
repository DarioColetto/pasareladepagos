import { PaymentStrategy } from './PaymentStrategy';
import { ChargeInput, ChargeResult, RefundInput, RefundResult } from '../PaymentTypes';
import { StripeAdapter } from '../adapters/StripeAdapter';

/**
 * Estrategia de pago para Stripe
 * 
 * Patrón Strategy: Implementa la interfaz PaymentStrategy para el proveedor Stripe
 * Delega las operaciones en el StripeAdapter manteniendo una interfaz uniforme
 */
export class StripeStrategy implements PaymentStrategy {
  /**
   * Crea una instancia de StripeStrategy
   * 
   * @param adapter - Adaptador de Stripe para realizar operaciones
   */
  constructor(private adapter: StripeAdapter) {}

  /**
   * Realiza un cargo mediante Stripe
   * 
   * @param input - Datos del cargo a realizar
   * @returns Promesa con el resultado del cargo
   */
  charge(input: ChargeInput): Promise<ChargeResult> { 
    return this.adapter.pay(input); 
  }

  /**
   * Realiza un reembolso mediante Stripe
   * 
   * @param input - Datos del reembolso a realizar
   * @returns Promesa con el resultado del reembolso
   */
  refund(input: RefundInput): Promise<RefundResult> { 
    return this.adapter.refund(input); 
  }
}