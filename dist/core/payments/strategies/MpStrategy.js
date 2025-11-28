/**
 * Estrategia de pago para Mercado Pago
 *
 * Patrón Strategy: Implementa la interfaz PaymentStrategy para el proveedor Mercado Pago
 * Delega las operaciones en el MercadoPagoAdapter manteniendo una interfaz uniforme
 */
export class MpStrategy {
    adapter;
    /**
     * Crea una instancia de MpStrategy
     *
     * @param adapter - Adaptador de Mercado Pago para realizar operaciones
     */
    constructor(adapter) {
        this.adapter = adapter;
    }
    /**
     * Realiza un cargo mediante Mercado Pago
     *
     * @param input - Datos del cargo a realizar
     * @returns Promesa con el resultado del cargo
     */
    charge(input) {
        return this.adapter.pay(input);
    }
    /**
     * Realiza un reembolso mediante Mercado Pago
     *
     * @param input - Datos del reembolso a realizar
     * @returns Promesa con el resultado del reembolso
     */
    refund(input) {
        return this.adapter.refund(input);
    }
}
