import { eventBus } from "../events/EventBus";
/**
 * Comando para capturar un pago
 *
 * Patrón Command: Encapsula la operación de captura de pago como un objeto
 * Permite ejecutar, encolar y deshacer operaciones de forma uniforme
 */
export class CapturePaymentCommand {
    strategy;
    input;
    provider;
    /**
     * Crea una instancia de CapturePaymentCommand
     *
     * @param strategy - Estrategia de pago a utilizar
     * @param input - Datos del cargo a realizar
     * @param provider - Proveedor de pago (para eventos)
     */
    constructor(strategy, input, provider) {
        this.strategy = strategy;
        this.input = input;
        this.provider = provider;
    }
    /**
     * Ejecuta el comando de captura de pago
     *
     * Realiza el cargo y emite eventos según el resultado
     *
     * @returns Promesa con el resultado del cargo
     */
    async execute() {
        const resultado = await this.strategy.charge(this.input);
        // Emitir eventos según el resultado del pago
        if (resultado.status === "approved") {
            await eventBus.emit("PaymentCaptured", {
                paymentId: resultado.id,
                amount: this.input.amount,
                provider: this.provider,
            });
        }
        else {
            await eventBus.emit("PaymentFailed", {
                reason: "declined",
                provider: this.provider,
            });
        }
        return resultado;
    }
}
