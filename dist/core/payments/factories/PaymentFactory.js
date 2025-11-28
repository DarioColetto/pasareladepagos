import { StripeStrategy } from '../strategies/StripeStrategy';
import { MpStrategy } from '../strategies/MpStrategy';
import { StripeAdapter } from '../adapters/StripeAdapter';
import { MercadoPagoAdapter } from '../adapters/MpAdapter';
import { createMockMpSdk, createMockStripeSdk } from '../../../mocks/paymentSdks';
/**
 * Factory para crear estrategias de pago
 *
 * Patrón Factory: Centraliza la creación de objetos complejos
 * Permite cambiar fácilmente entre diferentes proveedores
 */
export class PaymentFactory {
    /**
     * Crea una estrategia de pago para el proveedor especificado
     *
     * @param provider - Proveedor de pago ('stripe' | 'mp')
     * @param deps - Dependencias opcionales para inyección de SDKs
     * @returns Instancia de PaymentStrategy configurada
     * @throws Error si el proveedor no es soportado
     */
    static create(provider, deps) {
        switch (provider) {
            case 'stripe':
                return new StripeStrategy(new StripeAdapter(deps?.stripeSdk ?? createMockStripeSdk()));
            case 'mp':
                return new MpStrategy(new MercadoPagoAdapter(deps?.mpSdk ?? createMockMpSdk()));
            default:
                throw new Error(`Proveedor no soportado: ${provider}`);
        }
    }
}
