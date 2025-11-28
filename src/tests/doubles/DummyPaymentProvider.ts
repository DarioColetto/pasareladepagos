/**
 * Proveedor de pago Dummy que no realiza ninguna operación real.
 * 
 * Patrón Dummy: Objeto que se pasa como parámetro pero no se usa realmente.
 * Útil para completar dependencias en tests donde el comportamiento del proveedor no es relevante.
 */
import { PaymentProvider } from '../../core/payments/adapters/PaymentProvider';
import { ChargeInput, ChargeResult, RefundInput, RefundResult } from '../../core/payments/PaymentTypes';

export class DummyPaymentProvider implements PaymentProvider {
  /**
   * Simula un cargo pero no realiza ninguna acción.
   * 
   * @param input - Datos del cargo (no utilizados)
   * @returns Promesa rechazada porque es un dummy
   * @throws Error indicando que es un dummy
   */
  async pay(input: ChargeInput): Promise<ChargeResult> {
    throw new Error('Método no implementado: este es un objeto Dummy');
  }

  /**
   * Simula un reembolso pero no realiza ninguna acción.
   * 
   * @param input - Datos del reembolso (no utilizados)
   * @returns Promesa rechazada porque es un dummy
   * @throws Error indicando que es un dummy
   */
  async refund(input: RefundInput): Promise<RefundResult> {
    throw new Error('Método no implementado: este es un objeto Dummy');
  }
}