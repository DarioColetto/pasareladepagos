import { PaymentStrategy } from "./PaymentStrategy";
import {
  ChargeInput,
  ChargeResult,
  RefundInput,
  RefundResult,
} from "../PaymentTypes";
import { MercadoPagoAdapter } from "../adapters/MpAdapter";

/**
 * Estrategia de pago para Mercado Pago
 * 
 * Patrón Strategy: Implementa la interfaz PaymentStrategy para el proveedor Mercado Pago
 * Delega las operaciones en el MercadoPagoAdapter manteniendo una interfaz uniforme
 */
export class MpStrategy implements PaymentStrategy {
  /**
   * Crea una instancia de MpStrategy
   * 
   * @param adapter - Adaptador de Mercado Pago para realizar operaciones
   */
  constructor(private adapter: MercadoPagoAdapter) {}

  /**
   * Realiza un cargo mediante Mercado Pago
   * 
   * @param input - Datos del cargo a realizar
   * @returns Promesa con el resultado del cargo
   */
  charge(input: ChargeInput): Promise<ChargeResult> {
    return this.adapter.pay(input);
  }

  /**
   * Realiza un reembolso mediante Mercado Pago
   * 
   * @param input - Datos del reembolso a realizar
   * @returns Promesa con el resultado del reembolso
   */
  refund(input: RefundInput): Promise<RefundResult> {
    return this.adapter.refund(input);
  }
}