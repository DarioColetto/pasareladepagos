import { describe, it, expect, vi } from 'vitest';
import { PaymentContext } from '../core/payments/strategies/PaymentContext';
/**
 * Suite de pruebas para PaymentContext
 */
describe('PaymentContext', () => {
    /**
     * Prueba: Uso de estrategia pasada en constructor
     */
    it('usa la estrategia pasada en el constructor', async () => {
        const chargeInput = {};
        const refundInput = {};
        const chargeResult = { id: 'c1' };
        const refundResult = { id: 'r1' };
        const strategy = {
            charge: vi.fn().mockResolvedValue(chargeResult),
            refund: vi.fn().mockResolvedValue(refundResult),
        };
        const ctx = new PaymentContext(strategy);
        const resultCharge = await ctx.charge(chargeInput);
        const resultRefund = await ctx.refund(refundInput);
        expect(strategy.charge).toHaveBeenCalledWith(chargeInput);
        expect(strategy.refund).toHaveBeenCalledWith(refundInput);
        expect(resultCharge).toBe(chargeResult);
        expect(resultRefund).toBe(refundResult);
    });
    /**
     * Prueba: Cambio de estrategia con setStrategy
     */
    it('permite cambiar de estrategia con setStrategy', async () => {
        const chargeInput = {};
        const firstStrategy = {
            charge: vi.fn().mockResolvedValue({ id: 'first' }),
            refund: vi.fn().mockResolvedValue({}),
        };
        const secondStrategy = {
            charge: vi.fn().mockResolvedValue({ id: 'second' }),
            refund: vi.fn().mockResolvedValue({}),
        };
        const ctx = new PaymentContext(firstStrategy);
        await ctx.charge(chargeInput);
        ctx.setStrategy(secondStrategy);
        const result = await ctx.charge(chargeInput);
        expect(firstStrategy.charge).toHaveBeenCalledTimes(1);
        expect(secondStrategy.charge).toHaveBeenCalledTimes(1);
        expect(result.id).toBe('second');
    });
});
