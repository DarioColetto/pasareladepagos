/**
 * Proveedor de pago Stub que siempre devuelve resultados predefinidos.
 * 
 * Patrón Stub: Objeto que devuelve respuestas predefinidas para pruebas.
 * Útil para simular comportamientos específicos sin depender de implementaciones reales.
 */
import { PaymentProvider } from '../../core/payments/adapters/PaymentProvider';
import { ChargeInput, ChargeResult, RefundInput, RefundResult } from '../../core/payments/PaymentTypes';

export class AlwaysApprovedStub implements PaymentProvider {
  /**
   * Simula un cargo siempre aprobado.
   * 
   * @param input - Datos del cargo
   * @returns Promesa resuelta con un cargo aprobado
   */
  async pay(input: ChargeInput): Promise<ChargeResult> {
    return {
      id: `stub_${Date.now()}`,
      status: 'approved',
      raw: { stub: true, input }
    };
  }

  /**
   * Simula un reembolso siempre exitoso.
   * 
   * @param input - Datos del reembolso
   * @returns Promesa resuelta con un reembolso exitoso
   */
  async refund(input: RefundInput): Promise<RefundResult> {
    return {
      id: `stub_refund_${Date.now()}`,
      status: 'refunded',
      raw: { stub: true, input }
    };
  }
}

export class AlwaysDeclinedStub implements PaymentProvider {
  /**
   * Simula un cargo siempre rechazado.
   * 
   * @param input - Datos del cargo
   * @returns Promesa resuelta con un cargo rechazado
   */
  async pay(input: ChargeInput): Promise<ChargeResult> {
    return {
      id: `stub_${Date.now()}`,
      status: 'declined',
      raw: { stub: true, input }
    };
  }

  /**
   * Simula un reembolso siempre fallido.
   * 
   * @param input - Datos del reembolso
   * @returns Promesa resuelta con un reembolso fallido
   */
  async refund(input: RefundInput): Promise<RefundResult> {
    return {
      id: `stub_refund_${Date.now()}`,
      status: 'failed',
      raw: { stub: true, input }
    };
  }
}

export class FlakyPaymentStub implements PaymentProvider {
  private callCount = 0;

  /**
   * Simula un proveedor inestable que falla en los primeros intentos.
   * 
   * @param input - Datos del cargo
   * @returns Promesa resuelta o rechazada según el conteo de llamadas
   * @throws Error en las primeras llamadas, luego éxito
   */
  async pay(input: ChargeInput): Promise<ChargeResult> {
    this.callCount++;
    
    if (this.callCount <= 2) {
      throw new Error('Proveedor temporalmente no disponible');
    }

    return {
      id: `stub_${Date.now()}`,
      status: 'approved',
      raw: { stub: true, input, callCount: this.callCount }
    };
  }

  /**
   * Simula un reembolso con comportamiento variable.
   * 
   * @param input - Datos del reembolso
   * @returns Promesa resuelta con resultado variable
   */
  async refund(input: RefundInput): Promise<RefundResult> {
    this.callCount++;
    
    const success = this.callCount % 2 === 0;
    
    return {
      id: `stub_refund_${Date.now()}`,
      status: success ? 'refunded' : 'failed',
      raw: { stub: true, input, callCount: this.callCount, success }
    };
  }

  /**
   * Reinicia el contador de llamadas del stub.
   */
  reset(): void {
    this.callCount = 0;
  }
}