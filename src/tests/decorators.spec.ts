import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock del logger
vi.mock('../infra/logger', () => ({
  log: {
    info: vi.fn(),
  },
}));

import { log } from '../infra/logger';
import { RetryDecorator } from '../core/payments/decorators/RetryDecorator';
import { TelemetryDecorator } from '../core/payments/decorators/TelemetryDecorator';

beforeEach(() => {
  vi.clearAllMocks();
});

/**
 * Suite de pruebas para RetryDecorator
 */
describe('RetryDecorator', () => {
  /**
   * Prueba: Reintentos exitosos dentro del límite
   */
  it('reintenta charge hasta tener éxito dentro del límite de reintentos', async () => {
    let attempts = 0;

    const inner = {
      charge: vi.fn(async () => {
        attempts++;
        if (attempts < 3) {
          throw new Error('fallo transitorio');
        }
        return { status: 'success' } as any;
      }),
      refund: vi.fn(),
    } as any;

    const retry = new RetryDecorator(inner, 2, 0);

    const result = await retry.charge({} as any);

    expect(result.status).toBe('success');
    expect(inner.charge).toHaveBeenCalledTimes(3);
  });

  /**
   * Prueba: Lanza error al superar reintentos
   */
  it('lanza el último error si se superan los reintentos', async () => {
    const inner = {
      charge: vi.fn(async () => {
        throw new Error('fallo definitivo');
      }),
      refund: vi.fn(),
    } as any;

    const retry = new RetryDecorator(inner, 2, 0);

    await expect(retry.charge({} as any)).rejects.toThrow('fallo definitivo');
    expect(inner.charge).toHaveBeenCalledTimes(3);
  });
});

/**
 * Suite de pruebas para TelemetryDecorator
 */
describe('TelemetryDecorator', () => {
  /**
   * Prueba: Delegación y logging de charge
   */
  it('delegates en charge y loguea la operación', async () => {
    const inner = {
      charge: vi.fn(async () => ({ status: 'success' } as any)),
      refund: vi.fn(),
    } as any;

    const telemetry = new TelemetryDecorator(inner, 'stripe');

    const input = { amount: 1000 } as any;

    const out = await telemetry.charge(input);

    expect(inner.charge).toHaveBeenCalledTimes(1);
    expect(inner.charge).toHaveBeenCalledWith(input);

    expect(log.info).toHaveBeenCalledTimes(1);
    expect(log.info).toHaveBeenCalledWith(
      expect.objectContaining({
        op: 'charge',
        provider: 'stripe',
        status: 'success',
      }),
    );

    expect(out.status).toBe('success');
  });

  /**
   * Prueba: Delegación y logging de refund
   */
  it('delegates en refund y loguea la operación', async () => {
    const inner = {
      charge: vi.fn(),
      refund: vi.fn(async () => ({ status: 'refunded' } as any)),
    } as any;

    const telemetry = new TelemetryDecorator(inner, 'paypal');

    const input = { paymentId: 'abc123' } as any;

    const out = await telemetry.refund(input);

    expect(inner.refund).toHaveBeenCalledTimes(1);
    expect(inner.refund).toHaveBeenCalledWith(input);

    expect(log.info).toHaveBeenCalledTimes(1);
    expect(log.info).toHaveBeenCalledWith(
      expect.objectContaining({
        op: 'refund',
        provider: 'paypal',
        status: 'refunded',
      }),
    );

    expect(out.status).toBe('refunded');
  });
});