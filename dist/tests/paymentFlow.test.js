import { describe, it, expect, vi } from 'vitest';
/**
 * Crea un servicio de pago mock para testing
 * @returns {Object} Servicio de pago mock
 */
const createPaymentService = () => ({
    processCharge: vi.fn().mockImplementation(async (input) => {
        if (input.amount <= 0) {
            return {
                id: `pay_${Date.now()}`,
                status: 'declined',
                raw: { error: 'Invalid amount' }
            };
        }
        if (input.amount > 100000) {
            return {
                id: `pay_${Date.now()}`,
                status: 'declined',
                raw: { error: 'Amount exceeds limit' }
            };
        }
        return {
            id: `pay_${Date.now()}`,
            status: 'approved',
            raw: {
                provider: 'mock',
                amount: input.amount,
                currency: input.currency
            }
        };
    }),
    onPaymentEvent: vi.fn()
});
/**
 * Suite de pruebas para el flujo de pagos con tipos reales
 */
describe('Payment Flow with Real Types', () => {
    /**
     * Prueba: Aprobación de pago válido en ARS
     */
    it('should approve valid ARS payment', async () => {
        const paymentService = createPaymentService();
        const chargeInput = {
            amount: 15000,
            currency: 'ARS',
            token: 'tok_ars_123',
            metadata: { order_id: 'ORD-123' }
        };
        const result = await paymentService.processCharge(chargeInput);
        expect(result.status).toBe('approved');
        expect(result.id).toContain('pay_');
        expect(result.raw).toMatchObject({
            amount: 15000,
            currency: 'ARS'
        });
    });
    /**
     * Prueba: Aprobación de pago válido en USD
     */
    it('should approve valid USD payment', async () => {
        const paymentService = createPaymentService();
        const chargeInput = {
            amount: 100,
            currency: 'USD',
            token: 'tok_usd_456'
        };
        const result = await paymentService.processCharge(chargeInput);
        expect(result.status).toBe('approved');
        expect(result.raw).toMatchObject({
            currency: 'USD'
        });
    });
    /**
     * Prueba: Rechazo de pago con monto cero
     */
    it('should decline zero amount payment', async () => {
        const paymentService = createPaymentService();
        const chargeInput = {
            amount: 0,
            currency: 'ARS',
            token: 'tok_test_123'
        };
        const result = await paymentService.processCharge(chargeInput);
        expect(result.status).toBe('declined');
        expect(result.raw).toHaveProperty('error', 'Invalid amount');
    });
    /**
     * Prueba: Rechazo de pago que excede límite
     */
    it('should decline payment over limit', async () => {
        const paymentService = createPaymentService();
        const chargeInput = {
            amount: 200000,
            currency: 'ARS',
            token: 'tok_test_789'
        };
        const result = await paymentService.processCharge(chargeInput);
        expect(result.status).toBe('declined');
        expect(result.raw).toHaveProperty('error', 'Amount exceeds limit');
    });
    /**
     * Prueba: Manejo de pago con metadata
     */
    it('should handle payment with metadata', async () => {
        const paymentService = createPaymentService();
        const chargeInput = {
            amount: 5000,
            currency: 'ARS',
            token: 'tok_test_999',
            metadata: {
                order_id: '12345',
                user_id: 'user_678',
                description: 'Test purchase'
            }
        };
        const result = await paymentService.processCharge(chargeInput);
        expect(result.status).toBe('approved');
        expect(paymentService.processCharge).toHaveBeenCalledWith(expect.objectContaining({
            metadata: {
                order_id: '12345',
                user_id: 'user_678',
                description: 'Test purchase'
            }
        }));
    });
});
