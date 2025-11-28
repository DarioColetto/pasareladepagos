import { log } from '../../../infra/logger';
/**
 * Decorador que agrega telemetría y logging a las operaciones de pago
 * @implements {PaymentStrategy}
 */
export class TelemetryDecorator {
    inner;
    provider;
    /**
     * Crea una instancia del decorador de telemetría
     * @param {PaymentStrategy} inner - Estrategia de pago original a decorar
     * @param {string} provider - Identificador del proveedor de pagos para logging
     */
    constructor(inner, provider) {
        this.inner = inner;
        this.provider = provider;
    }
    /**
     * Realiza un cargo con medición de tiempo y logging
     * @param {ChargeInput} i - Datos de entrada para el cargo
     * @returns {Promise<ChargeResult>} Resultado del cargo
     */
    async charge(i) {
        const t0 = Date.now();
        const out = await this.inner.charge(i);
        log.info({ op: 'charge', provider: this.provider, ms: Date.now() - t0, status: out.status });
        return out;
    }
    /**
     * Realiza un reembolso con medición de tiempo y logging
     * @param {RefundInput} i - Datos de entrada para el reembolso
     * @returns {Promise<RefundResult>} Resultado del reembolso
     */
    async refund(i) {
        const t0 = Date.now();
        const out = await this.inner.refund(i);
        log.info({ op: 'refund', provider: this.provider, ms: Date.now() - t0, status: out.status });
        return out;
    }
}
