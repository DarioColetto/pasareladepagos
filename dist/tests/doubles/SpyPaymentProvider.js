export class SpyPaymentProvider {
    payCallCount = 0;
    refundCallCount = 0;
    lastPayInput = null;
    lastRefundInput = null;
    allPayInputs = [];
    allRefundInputs = [];
    /**
     * Simula un cargo y registra la llamada.
     *
     * @param input - Datos del cargo
     * @returns Promesa resuelta con un cargo aprobado
     */
    async pay(input) {
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
    async refund(input) {
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
    wasPayCalledWith(input) {
        return this.allPayInputs.some(call => Object.keys(input).every(key => call[key] === input[key]));
    }
    /**
     * Verifica si se llamó al método refund con los parámetros especificados.
     *
     * @param input - Parámetros esperados (parciales)
     * @returns true si se encontró una llamada coincidente
     */
    wasRefundCalledWith(input) {
        return this.allRefundInputs.some(call => Object.keys(input).every(key => call[key] === input[key]));
    }
    /**
     * Reinicia los contadores y registros del spy.
     */
    reset() {
        this.payCallCount = 0;
        this.refundCallCount = 0;
        this.lastPayInput = null;
        this.lastRefundInput = null;
        this.allPayInputs = [];
        this.allRefundInputs = [];
    }
}
