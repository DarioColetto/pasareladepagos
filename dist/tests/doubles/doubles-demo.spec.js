/**
 * Tests de demostración para los dobles de prueba.
 *
 * Muestra cómo utilizar cada tipo de doble en pruebas reales.
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { DummyPaymentProvider, AlwaysApprovedStub, AlwaysDeclinedStub, FlakyPaymentStub, SpyPaymentProvider, FakeEventBus } from './index';
describe('Dobles de Prueba - Demostración', () => {
    describe('DummyPaymentProvider', () => {
        it('debe lanzar error al intentar usar métodos del dummy', async () => {
            const dummy = new DummyPaymentProvider();
            const inputCargo = { amount: 100, currency: 'ARS', token: 'test' };
            const inputReembolso = { paymentId: 'test', amount: 50 };
            await expect(dummy.pay(inputCargo)).rejects.toThrow('Método no implementado');
            await expect(dummy.refund(inputReembolso)).rejects.toThrow('Método no implementado');
        });
    });
    describe('AlwaysApprovedStub', () => {
        it('debe siempre aprobar pagos', async () => {
            const stub = new AlwaysApprovedStub();
            const input = { amount: 100, currency: 'ARS', token: 'test' };
            const resultado = await stub.pay(input);
            expect(resultado.status).toBe('approved');
            expect(resultado.id).toContain('stub_');
        });
        it('debe siempre aprobar reembolsos', async () => {
            const stub = new AlwaysApprovedStub();
            const input = { paymentId: 'test', amount: 50 };
            const resultado = await stub.refund(input);
            expect(resultado.status).toBe('refunded');
            expect(resultado.id).toContain('stub_refund_');
        });
    });
    describe('AlwaysDeclinedStub', () => {
        it('debe siempre rechazar pagos', async () => {
            const stub = new AlwaysDeclinedStub();
            const input = { amount: 100, currency: 'ARS', token: 'test' };
            const resultado = await stub.pay(input);
            expect(resultado.status).toBe('declined');
        });
        it('debe siempre fallar reembolsos', async () => {
            const stub = new AlwaysDeclinedStub();
            const input = { paymentId: 'test', amount: 50 };
            const resultado = await stub.refund(input);
            expect(resultado.status).toBe('failed');
        });
    });
    describe('FlakyPaymentStub', () => {
        let flakyStub;
        beforeEach(() => {
            flakyStub = new FlakyPaymentStub();
        });
        it('debe fallar en las primeras llamadas y luego tener éxito', async () => {
            const input = { amount: 100, currency: 'ARS', token: 'test' };
            // Primeras 2 llamadas deben fallar
            await expect(flakyStub.pay(input)).rejects.toThrow('Proveedor temporalmente no disponible');
            await expect(flakyStub.pay(input)).rejects.toThrow('Proveedor temporalmente no disponible');
            // Tercera llamada debe tener éxito
            const resultado = await flakyStub.pay(input);
            expect(resultado.status).toBe('approved');
        });
        it('debe alternar entre éxito y falla en reembolsos', async () => {
            const input1 = { paymentId: 'test1', amount: 50 };
            const input2 = { paymentId: 'test2', amount: 30 };
            const resultado1 = await flakyStub.refund(input1);
            const resultado2 = await flakyStub.refund(input2);
            expect(resultado1.status).not.toBe(resultado2.status);
        });
    });
    describe('SpyPaymentProvider', () => {
        let spy;
        beforeEach(() => {
            spy = new SpyPaymentProvider();
        });
        it('debe registrar llamadas al método pay', async () => {
            const input = { amount: 100, currency: 'ARS', token: 'test' };
            await spy.pay(input);
            await spy.pay(input);
            expect(spy.payCallCount).toBe(2);
            expect(spy.lastPayInput).toEqual(input);
            expect(spy.wasPayCalledWith({ amount: 100 })).toBe(true);
        });
        it('debe registrar llamadas al método refund', async () => {
            const input = { paymentId: 'test123', amount: 50 };
            await spy.refund(input);
            expect(spy.refundCallCount).toBe(1);
            expect(spy.lastRefundInput).toEqual(input);
            expect(spy.wasRefundCalledWith({ paymentId: 'test123' })).toBe(true);
        });
    });
    describe('FakeEventBus', () => {
        let fakeEventBus;
        beforeEach(() => {
            fakeEventBus = new FakeEventBus();
        });
        it('debe registrar eventos emitidos', async () => {
            const payloadCaptura = { paymentId: '123', amount: 100, provider: 'stripe' };
            const payloadReembolso = { paymentId: '456', amount: 50, provider: 'mp' };
            await fakeEventBus.emit('PaymentCaptured', payloadCaptura);
            await fakeEventBus.emit('PaymentRefunded', payloadReembolso);
            expect(fakeEventBus.getTotalEmittedEvents()).toBe(2);
            expect(fakeEventBus.getEventsByName('PaymentCaptured')).toHaveLength(1);
            expect(fakeEventBus.wasEventEmittedWith('PaymentCaptured', { paymentId: '123' })).toBe(true);
        });
        it('debe poder reiniciar el historial', async () => {
            const payload = { paymentId: '123', amount: 100, provider: 'stripe' };
            await fakeEventBus.emit('PaymentCaptured', payload);
            fakeEventBus.reset();
            expect(fakeEventBus.getTotalEmittedEvents()).toBe(0);
        });
    });
});
