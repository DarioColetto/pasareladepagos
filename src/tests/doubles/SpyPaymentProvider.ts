/**
 * Proveedor de pago Spy que registra las llamadas a sus métodos.
 * 
 * Patrón Spy: Objeto que registra información sobre cómo se utilizan sus métodos.
 * Útil para verificar interacciones en los tests.
 */
import { PaymentProvider } from '../../core/payments/adapters/PaymentProvider';
import { ChargeInput, ChargeResult, RefundInput, RefundResult } from '../../core/payments/PaymentTypes';

export class SpyPaymentProvider implements PaymentProvider {
  public payCallCount: number = 0;
  public refundCallCount: number = 0;
  public lastPayInput: ChargeInput | null = null;
  public lastRefundInput: RefundInput | null = null;
  public allPayInputs: ChargeInput[] = [];
  public allRefundInputs: RefundInput[] = [];

  /**
   * Simula un cargo y registra la llamada.
   * 
   * @param input - Datos del cargo
   * @returns Promesa resuelta con un cargo aprobado
   */
  async pay(input: ChargeInput): Promise<ChargeResult> {
    this.payCallCount++;
    this.lastPayInput = input;
    this.allPayInputs.push(input);

    return {
      id: `spy_${Date.now()}`,
      status: 'approved',
      raw: { spy: true, input, callCount: this.payCallCount }
    };
  }

  /**
   * Simula un reembolso y registra la llamada.
   * 
   * @param input - Datos del reembolso
   * @returns Promesa resuelta con un reembolso exitoso
   */
  async refund(input: RefundInput): Promise<RefundResult> {
    this.refundCallCount++;
    this.lastRefundInput = input;
    this.allRefundInputs.push(input);

    return {
      id: `spy_refund_${Date.now()}`,
      status: 'refunded',
      raw: { spy: true, input, callCount: this.refundCallCount }
    };
  }

  /**
   * Verifica si se llamó al método pay con los parámetros especificados.
   * 
   * @param input - Parámetros esperados (parciales)
   * @returns true si se encontró una llamada coincidente
   */
  wasPayCalledWith(input: Partial<ChargeInput>): boolean {
    return this.allPayInputs.some(call => 
      Object.keys(input).every(key => 
        call[key as keyof ChargeInput] === input[key as keyof ChargeInput]
      )
    );
  }

  /**
   * Verifica si se llamó al método refund con los parámetros especificados.
   * 
   * @param input - Parámetros esperados (parciales)
   * @returns true si se encontró una llamada coincidente
   */
  wasRefundCalledWith(input: Partial<RefundInput>): boolean {
    return this.allRefundInputs.some(call => 
      Object.keys(input).every(key => 
        call[key as keyof RefundInput] === input[key as keyof RefundInput]
      )
    );
  }

  /**
   * Reinicia los contadores y registros del spy.
   */
  reset(): void {
    this.payCallCount = 0;
    this.refundCallCount = 0;
    this.lastPayInput = null;
    this.lastRefundInput = null;
    this.allPayInputs = [];
    this.allRefundInputs = [];
  }
}