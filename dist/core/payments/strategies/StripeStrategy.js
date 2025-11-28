/**
 * Estrategia de pago para Stripe
 *
 * Patrón Strategy: Implementa la interfaz PaymentStrategy para el proveedor Stripe
 * Delega las operaciones en el StripeAdapter manteniendo una interfaz uniforme
 */
export class StripeStrategy {
    adapter;
    /**
     * Crea una instancia de StripeStrategy
     *
     * @param adapter - Adaptador de Stripe para realizar operaciones
     */
    constructor(adapter) {
        this.adapter = adapter;
    }
    /**
     * Realiza un cargo mediante Stripe
     *
     * @param input - Datos del cargo a realizar
     * @returns Promesa con el resultado del cargo
     */
    charge(input) {
        return this.adapter.pay(input);
    }
    /**
     * Realiza un reembolso mediante Stripe
     *
     * @param input - Datos del reembolso a realizar
     * @returns Promesa con el resultado del reembolso
     */
    refund(input) {
        return this.adapter.refund(input);
    }
}
