import { vi } from 'vitest';

/**
 * Mock de Stripe para pruebas unitarias
 * @namespace StripeMock
 */
export const StripeMock = {
  paymentIntents: {
    /**
     * Mock de la función create para simular la creación de intenciones de pago
     * @type {import('vitest').Mock}
     */
    create: vi.fn().mockResolvedValue({
      id: 'pi_mock_123',
      status: 'succeeded',
      amount: 1000
    })
  }
};

/**
 * Reinicia todos los mocks de Stripe
 * @returns {void}
 */
export const resetStripeMocks = () => {
  StripeMock.paymentIntents.create.mockClear();
};