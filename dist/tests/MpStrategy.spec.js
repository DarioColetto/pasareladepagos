import { describe, it, expect, vi } from 'vitest';
import { MpStrategy } from '../core/payments/strategies/MpStrategy';
/**
 * Suite de pruebas para MpStrategy
 */
describe('MpStrategy', () => {
    /**
     * Prueba: Charge delega correctamente en el adapter
     */
    it('charge delega en adapter.pay y devuelve su resultado', async () => {
        const adapter = {
            pay: vi.fn().mockResolvedValue({
                id: 'mp_ch_123',
                status: 'approved',
            }),
            refund: vi.fn(),
        };
        const strategy = new MpStrategy(adapter);
        const input = {
            amount: 1000,
            currency: 'ARS',
            token: 'tok_mp_123',
            metadata: { orderId: 'o1' },
        };
        const result = await strategy.charge(input);
        expect(adapter.pay).toHaveBeenCalledTimes(1);
        expect(adapter.pay).toHaveBeenCalledWith(input);
        expect(result.id).toBe('mp_ch_123');
        expect(result.status).toBe('approved');
    });
    /**
     * Prueba: Refund delega correctamente en el adapter
     */
    it('refund delega en adapter.refund y devuelve su resultado', async () => {
        const adapter = {
            pay: vi.fn(),
            refund: vi.fn().mockResolvedValue({
                id: 'mp_re_123',
                status: 'refunded',
            }),
        };
        const strategy = new MpStrategy(adapter);
        const input = {
            paymentId: 'mp_ch_123',
            amount: 500,
        };
        const result = await strategy.refund(input);
        expect(adapter.refund).toHaveBeenCalledTimes(1);
        expect(adapter.refund).toHaveBeenCalledWith(input);
        expect(result.id).toBe('mp_re_123');
        expect(result.status).toBe('refunded');
    });
});
