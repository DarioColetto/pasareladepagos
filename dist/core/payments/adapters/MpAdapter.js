/**
 * Adaptador para Mercado Pago que implementa la interfaz PaymentProvider
 *
 * Patrón Adapter: Adapta la API específica de Mercado Pago a nuestra interfaz uniforme
 * Permite que el sistema trabaje con diferentes proveedores de forma transparente
 */
export class MercadoPagoAdapter {
    sdk;
    constructor(sdk) {
        this.sdk = sdk;
    }
    /**
     * Realiza un cargo mediante Mercado Pago
     *
     * @param input - Datos del cargo a realizar
     * @returns Promesa con el resultado del cargo
     */
    async pay(input) {
        const respuesta = await this.sdk.payments.create({
            transaction_amount: input.amount,
            token: input.token,
            description: "Cargo realizado",
            metadata: input.metadata,
        });
        return {
            id: respuesta.id,
            status: respuesta.status === "approved" ? "approved" : "declined",
            raw: respuesta,
        };
    }
    /**
     * Realiza un reembolso mediante Mercado Pago
     *
     * @param input - Datos del reembolso a realizar
     * @returns Promesa con el resultado del reembolso
     */
    async refund(input) {
        const respuesta = await this.sdk.payments.refund(input.paymentId, {
            amount: input.amount,
        });
        return {
            id: respuesta.id,
            status: respuesta.status === "approved" ? "refunded" : "failed",
            raw: respuesta,
        };
    }
}
