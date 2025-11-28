/**
 * Decorador que implementa reintentos automáticos para operaciones de pago
 * @implements {PaymentStrategy}
 */
export class RetryDecorator {
    inner;
    times;
    delayMs;
    /**
     * Crea una instancia del decorador de reintentos
     * @param {PaymentStrategy} inner - Estrategia de pago original a decorar
     * @param {number} [times=2] - Número de reintentos (sin incluir el intento inicial)
     * @param {number} [delayMs=100] - Tiempo de espera entre reintentos en milisegundos
     */
    constructor(inner, times = 2, delayMs = 100) {
        this.inner = inner;
        this.times = times;
        this.delayMs = delayMs;
    }
    /**
     * Ejecuta una función con reintentos automáticos
     * @template T
     * @param {() => Promise<T>} fn - Función a ejecutar con reintentos
     * @returns {Promise<T>} Resultado de la función ejecutada
     * @throws {any} Último error ocurrido después de agotar los reintentos
     * @private
     */
    async retry(fn) {
        let lastErr;
        for (let i = 0; i <= this.times; i++) {
            try {
                return await fn();
            }
            catch (e) {
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
    charge(i) {
        return this.retry(() => this.inner.charge(i));
    }
    /**
     * Realiza un reembolso con reintentos automáticos
     * @param {RefundInput} i - Datos de entrada para el reembolso
     * @returns {Promise<RefundResult>} Resultado del reembolso
     */
    refund(i) {
        return this.retry(() => this.inner.refund(i));
    }
}
