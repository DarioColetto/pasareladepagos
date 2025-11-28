import { vi } from 'vitest';
/**
 * Mock de MercadoPago para pruebas unitarias
 * @namespace MercadoPagoMock
 */
export const MercadoPagoMock = {
    payment: {
        /**
         * Mock de la función create para simular la creación de pagos
         * @type {import('vitest').Mock}
         */
        create: vi.fn().mockResolvedValue({
            id: 123456789,
            status: 'approved',
            transaction_amount: 1000
        })
    }
};
/**
 * Reinicia todos los mocks de MercadoPago
 * @returns {void}
 */
export const resetMercadoPagoMocks = () => {
    MercadoPagoMock.payment.create.mockClear();
};
