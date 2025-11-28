/**
 * Contexto para utilizar una estrategia de pago
 *
 * Patrón Strategy: Permite cambiar dinámicamente entre diferentes estrategias de pago
 * Mantiene una referencia a la estrategia actual y delega las operaciones en ella
 */
export class PaymentContext {
    strategy;
    /**
     * Crea una instancia de PaymentContext
     *
     * @param strategy - Estrategia de pago inicial a utilizar
     */
    constructor(strategy) {
        this.strategy = strategy;
    }
    /**
     * Cambia la estrategia de pago actual
     *
     * @param strategy - Nueva estrategia de pago a utilizar
     */
    setStrategy(strategy) {
        this.strategy = strategy;
    }
    /**
     * Realiza un cargo utilizando la estrategia actual
     *
     * @param input - Datos del cargo a realizar
     * @returns Promesa con el resultado del cargo
     */
    charge(input) {
        return this.strategy.charge(input);
    }
    /**
     * Realiza un reembolso utilizando la estrategia actual
     *
     * @param input - Datos del reembolso a realizar
     * @returns Promesa con el resultado del reembolso
     */
    refund(input) {
        return this.strategy.refund(input);
    }
}
