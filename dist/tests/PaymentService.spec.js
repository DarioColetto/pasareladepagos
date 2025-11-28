import { describe, it, expect, vi, beforeEach } from 'vitest';
vi.mock('../core/payments/factories/PaymentFactory', () => {
    return {
        PaymentFactory: {
            create: vi.fn(),
        },
    };
});
vi.mock('../core/commands/CommandBus', () => {
    return {
        commandBus: {
            dispatch: vi.fn(),
        },
    };
});
import { PaymentService } from '../core/payments/facade/PaymentService';
import { commandBus } from '../core/commands/CommandBus';
import { CapturePaymentCommand } from '../core/commands/CapturePaymentCommand';
import { RefundPaymentCommand } from '../core/commands/RefundPaymentCommand';
import { PaymentFactory } from '../core/payments/factories/PaymentFactory';
/**
 * Suite de pruebas para PaymentService (Facade)
 */
describe('PaymentService (Facade)', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });
    /**
     * Prueba: Charge usa PaymentFactory y CommandBus correctamente
     */
    it('charge: usa PaymentFactory y commandBus correctamente', async () => {
        const provider = 'stripe';
        const input = { amount: 100, currency: 'usd' };
        const factoryCreateMock = PaymentFactory.create;
        const dispatchMock = commandBus.dispatch;
        const fakeStrategy = { charge: vi.fn(), refund: vi.fn() };
        factoryCreateMock.mockReturnValueOnce(fakeStrategy);
        const expectedResult = { id: 'payment-123' };
        dispatchMock.mockResolvedValueOnce(expectedResult);
        const result = await PaymentService.charge(provider, input);
        expect(factoryCreateMock).toHaveBeenCalledTimes(1);
        expect(factoryCreateMock).toHaveBeenCalledWith(provider);
        expect(dispatchMock).toHaveBeenCalledTimes(1);
        const dispatchedCommand = dispatchMock.mock.calls[0][0];
        expect(dispatchedCommand).toBeInstanceOf(CapturePaymentCommand);
        expect(result).toEqual(expectedResult);
    });
    /**
     * Prueba: Refund usa PaymentFactory y CommandBus correctamente
     */
    it('refund: usa PaymentFactory y commandBus correctamente', async () => {
        const provider = 'mp';
        const input = { paymentId: 'pay_1', amount: 50 };
        const factoryCreateMock = PaymentFactory.create;
        const dispatchMock = commandBus.dispatch;
        const fakeStrategy = { charge: vi.fn(), refund: vi.fn() };
        factoryCreateMock.mockReturnValueOnce(fakeStrategy);
        const expectedResult = { id: 'refund-999' };
        dispatchMock.mockResolvedValueOnce(expectedResult);
        const result = await PaymentService.refund(provider, input);
        expect(factoryCreateMock).toHaveBeenCalledTimes(1);
        expect(factoryCreateMock).toHaveBeenCalledWith(provider);
        expect(dispatchMock).toHaveBeenCalledTimes(1);
        const dispatchedCommand = dispatchMock.mock.calls[0][0];
        expect(dispatchedCommand).toBeInstanceOf(RefundPaymentCommand);
        expect(result).toEqual(expectedResult);
    });
});
