import { Command } from './Command';
import { RefundInput, RefundResult } from '../payments/PaymentTypes';
import { PaymentStrategy } from '../payments/strategies/PaymentStrategy';
import { eventBus } from '../events/EventBus';

/**
 * Comando para reembolsar un pago
 * 
 * Patrón Command: Encapsula la operación de reembolso como un objeto
 * Permite ejecutar, encolar y deshacer operaciones de forma uniforme
 */
export class RefundPaymentCommand implements Command<RefundResult> {
  /**
   * Crea una instancia de RefundPaymentCommand
   * 
   * @param strategy - Estrategia de pago a utilizar
   * @param input - Datos del reembolso a realizar
   * @param provider - Proveedor de pago (para eventos)
   */
  constructor(
    private strategy: PaymentStrategy, 
    private input: RefundInput, 
    private provider: string
  ) {}

  /**
   * Ejecuta el comando de reembolso
   * 
   * Realiza el reembolso y emite eventos si es exitoso
   * 
   * @returns Promesa con el resultado del reembolso
   */
  async execute(): Promise<RefundResult> {
    const resultado = await this.strategy.refund(this.input);
    
    // Emitir evento solo si el reembolso fue exitoso
    if (resultado.status === 'refunded') {
      await eventBus.emit('PaymentRefunded', { 
        paymentId: resultado.id, 
        amount: this.input.amount ?? 0, 
        provider: this.provider 
      });
    }
    
    return resultado;
  }
}