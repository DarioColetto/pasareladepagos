export class DummyPaymentProvider {
    /**
     * Simula un cargo pero no realiza ninguna acción.
     *
     * @param input - Datos del cargo (no utilizados)
     * @returns Promesa rechazada porque es un dummy
     * @throws Error indicando que es un dummy
     */
    async pay(input) {
        throw new Error('Método no implementado: este es un objeto Dummy');
    }
    /**
     * Simula un reembolso pero no realiza ninguna acción.
     *
     * @param input - Datos del reembolso (no utilizados)
     * @returns Promesa rechazada porque es un dummy
     * @throws Error indicando que es un dummy
     */
    async refund(input) {
        throw new Error('Método no implementado: este es un objeto Dummy');
    }
}
