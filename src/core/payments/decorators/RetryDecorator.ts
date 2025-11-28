import { PaymentStrategy } from "../strategies/PaymentStrategy";
import {
  ChargeInput,
  ChargeResult,
  RefundInput,
  RefundResult,
} from "../PaymentTypes";

/**
 * Decorador que implementa reintentos automáticos para operaciones de pago
 * @implements {PaymentStrategy}
 */
export class RetryDecorator implements PaymentStrategy {
  /**
   * Crea una instancia del decorador de reintentos
   * @param {PaymentStrategy} inner - Estrategia de pago original a decorar
   * @param {number} [times=2] - Número de reintentos (sin incluir el intento inicial)
   * @param {number} [delayMs=100] - Tiempo de espera entre reintentos en milisegundos
   */
  constructor(
    private inner: PaymentStrategy,
    private times = 2,
    private delayMs = 100
  ) {}

  /**
   * Ejecuta una función con reintentos automáticos
   * @template T
   * @param {() => Promise<T>} fn - Función a ejecutar con reintentos
   * @returns {Promise<T>} Resultado de la función ejecutada
   * @throws {any} Último error ocurrido después de agotar los reintentos
   * @private
   */
  private async retry<T>(fn: () => Promise<T>): Promise<T> {
    let lastErr: any;
    for (let i = 0; i <= this.times; i++) {
      try {
        return await fn();
      } catch (e) {
        lastErr = e;
        if (i < this.times)
          await new Promise((r) => setTimeout(r, this.delayMs));
      }
    }
    throw lastErr;
  }

  /**
   * Realiza un cargo con reintentos automáticos
   * @param {ChargeInput} i - Datos de entrada para el cargo
   * @returns {Promise<ChargeResult>} Resultado del cargo
   */
  charge(i: ChargeInput): Promise<ChargeResult> {
    return this.retry(() => this.inner.charge(i));
  }

  /**
   * Realiza un reembolso con reintentos automáticos
   * @param {RefundInput} i - Datos de entrada para el reembolso
   * @returns {Promise<RefundResult>} Resultado del reembolso
   */
  refund(i: RefundInput): Promise<RefundResult> {
    return this.retry(() => this.inner.refund(i));
  }
}