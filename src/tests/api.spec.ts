import { describe, it, expect, beforeEach, vi } from 'vitest';
import request from 'supertest';
import express from 'express';
import { routes } from '../api/routes';
import { PaymentService } from '../core/payments/facade/PaymentService';

vi.mock('../core/payments/facade/PaymentService', () => ({
  __esModule: true,
  PaymentService: {
    charge: vi.fn(),
    refund: vi.fn(),
  },
}));

/**
 * Crea una aplicación Express para testing
 * @returns {express.Express} Aplicación Express configurada
 */
function createApp() {
  const app = express();
  app.use(express.json());
  app.use(routes);
  return app;
}

describe('API /payments', () => {
  let app: ReturnType<typeof createApp>;

  beforeEach(() => {
    app = createApp();
    vi.clearAllMocks();
  });

  /**
   * Prueba: Carga exitosa de pago
   */
  it('POST /payments/charge → 200 y responde lo que devuelve PaymentService.charge', async () => {
    (PaymentService.charge as any).mockResolvedValue({
      id: 'ch_123',
      status: 'approved',
    });

    const res = await request(app)
      .post('/payments/charge')
      .send({
        provider: 'stripe',
        amount: 1500,
        currency: 'ARS',
        token: 'tok_123',
      })
      .expect(200);

    expect(PaymentService.charge).toHaveBeenCalledTimes(1);
    expect(PaymentService.charge).toHaveBeenCalledWith(
      'stripe',
      {
        amount: 1500,
        currency: 'ARS',
        token: 'tok_123',
        metadata: undefined,
      }
    );

    expect(res.body).toEqual({
      id: 'ch_123',
      status: 'approved',
    });
  });

  /**
   * Prueba: Validación de body inválido
   */
  it('POST /payments/charge → 400 por body inválido (falla schema) y NO llama a PaymentService', async () => {
    const res = await request(app)
      .post('/payments/charge')
      .send({
        provider: '',
        amount: 'abc',
      })
      .expect(400);

    expect(res.body).toHaveProperty('error', 'Datos inválidos');
    expect(PaymentService.charge).not.toHaveBeenCalled();
  });

  /**
   * Prueba: Manejo de errores del servicio
   */
  it('POST /payments/charge → 500 cuando PaymentService.charge lanza un error', async () => {
    (PaymentService.charge as any).mockRejectedValue(new Error('Service error'));

    const res = await request(app)
      .post('/payments/charge')
      .send({
        provider: 'stripe',
        amount: 1500,
        currency: 'ARS',
        token: 'tok_123',
      })
      .expect(500);

    expect(res.body).toEqual({ 
      error: 'Service error',
      codigo: 'ERROR_DESCONOCIDO'
    });
  });

  /**
   * Prueba: Reembolso exitoso
   */
  it('POST /payments/refund → 200 y responde lo que devuelve PaymentService.refund', async () => {
    (PaymentService.refund as any).mockResolvedValue({
      id: 're_123',
      status: 'refunded',
    });

    const res = await request(app)
      .post('/payments/refund')
      .send({
        provider: 'stripe',
        paymentId: 'ch_123',
        amount: 500,
      })
      .expect(200);

    expect(PaymentService.refund).toHaveBeenCalledTimes(1);
    expect(PaymentService.refund).toHaveBeenCalledWith(
      'stripe',
      {
        paymentId: 'ch_123',
        amount: 500,
      }
    );

    expect(res.body).toEqual({
      id: 're_123',
      status: 'refunded',
    });
  });
});