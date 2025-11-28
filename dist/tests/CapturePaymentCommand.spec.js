import { describe, it, expect, vi, beforeEach } from 'vitest';
import { CapturePaymentCommand } from '../core/commands/CapturePaymentCommand';
import { eventBus } from '../core/events/EventBus';
/**
 * Suite de pruebas para CapturePaymentCommand
 */
describe('CapturePaymentCommand', () => {
    const provider = 'stripe';
    beforeEach(() => {
        vi.restoreAllMocks();
        vi.spyOn(eventBus, 'emit').mockResolvedValue();
    });
    /**
     * Prueba: Pago aprobado emite evento PaymentCaptured
     */
    it('cuando el pago es aprobado debe llamar a strategy.charge y emitir PaymentCaptured', async () => {
        const input = {
            amount: 100,
            currency: "USD",
            token: 'chi_1224'
        };
        const chargeResult = {
            id: 'pay_123',
            status: 'approved',
        };
        const strategy = {
            charge: vi.fn().mockResolvedValue(chargeResult),
        };
        const command = new CapturePaymentCommand(strategy, input, provider);
        const result = await command.execute();
        expect(strategy.charge).toHaveBeenCalledTimes(1);
        expect(strategy.charge).toHaveBeenCalledWith(input);
        expect(eventBus.emit).toHaveBeenCalledTimes(1);
        expect(eventBus.emit).toHaveBeenCalledWith('PaymentCaptured', {
            paymentId: chargeResult.id,
            amount: input.amount,
            provider,
        });
        expect(result).toBe(chargeResult);
    });
    /**
     * Prueba: Pago rechazado emite evento PaymentFailed
     */
    it('cuando el pago es rechazado debe emitir PaymentFailed', async () => {
        const input = {
            amount: 100,
            currency: "USD",
            token: 'chi_1224'
        };
        const chargeResult = {
            id: 'pay_456',
            status: 'declined',
        };
        const strategy = {
            charge: vi.fn().mockResolvedValue(chargeResult),
        };
        const command = new CapturePaymentCommand(strategy, input, provider);
        const result = await command.execute();
        expect(strategy.charge).toHaveBeenCalledWith(input);
        expect(eventBus.emit).toHaveBeenCalledTimes(1);
        expect(eventBus.emit).toHaveBeenCalledWith('PaymentFailed', {
            reason: 'declined',
            provider,
        });
        expect(result).toBe(chargeResult);
    });
});
