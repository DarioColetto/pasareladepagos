import { describe, it, expect } from 'vitest';
import { PaymentFactory } from '../core/payments/factories/PaymentFactory';
import { commandBus } from '../core/commands/CommandBus';
import { CapturePaymentCommand } from '../core/commands/CapturePaymentCommand';
import { eventBus } from '../core/events/EventBus';
/**
 * Prueba de integración entre Command y Observer patterns
 */
describe('Command + Observer', () => {
    /**
     * Prueba: Comando emite evento al aprobar pago
     */
    it('emite PaymentCaptured al aprobar', async () => {
        const s = PaymentFactory.create('stripe');
        let captured = false;
        eventBus.on('PaymentCaptured', () => { captured = true; });
        const res = await commandBus.dispatch(new CapturePaymentCommand(s, { amount: 100, currency: 'ARS', token: 'tok' }, 'stripe'));
        expect(res.status).toBe('approved');
        expect(captured).toBe(true);
    });
});
