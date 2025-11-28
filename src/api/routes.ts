import { Router } from 'express';
import { PaymentChargeSchema } from '../schemas/payment.schema';
import { PaymentRefundSchema } from '../schemas/refund.schema';
import { PaymentService } from '../core/payments/facade/PaymentService';
import { validateRequest } from '../middleware/validate-request';

/**
 * Router principal para endpoints de pagos
 * Implementa el patrón Controller para separar lógica HTTP de lógica de negocio
 */
export const routes = Router();

/**
 * POST /payments/charge
 * Realiza un cargo mediante el proveedor especificado
 * 
 * @body {string} provider - Proveedor de pago ('stripe' | 'mp')
 * @body {number} amount - Monto del cargo
 * @body {string} currency - Moneda ('ARS' | 'USD')
 * @body {string} token - Token de pago
 * @body {object} metadata - Metadatos adicionales
 * 
 * @returns {ChargeResult} Resultado del cargo
 */
routes.post(
  '/payments/charge',
  validateRequest(PaymentChargeSchema),
  async (request, response) => {
    try {
      const { provider, amount, currency, token, metadata } = request.body;

      const resultado = await PaymentService.charge(provider, {
        amount,
        currency,
        token,
        metadata,
      });

      response.json(resultado);
    } catch (error: any) {
      // Manejo específico de errores por tipo
      const statusCode = obtenerCodigoError(error);
      const mensajeError = obtenerMensajeError(error);
      
      response.status(statusCode).json({ 
        error: mensajeError,
        codigo: error.codigo || 'ERROR_DESCONOCIDO'
      });
    }
  }
);

/**
 * POST /payments/refund
 * Realiza un reembolso de un pago existente
 * 
 * @body {string} provider - Proveedor de pago
 * @body {string} paymentId - ID del pago a reembolsar
 * @body {number} amount - Monto a reembolsar (opcional, reembolso parcial)
 * 
 * @returns {RefundResult} Resultado del reembolso
 */
routes.post(
  '/payments/refund',
  validateRequest(PaymentRefundSchema),
  async (request, response) => {
    try {
      const { provider, paymentId, amount } = request.body;

      const resultado = await PaymentService.refund(provider, {
        paymentId,
        amount,
      });

      response.json(resultado);
    } catch (error: any) {
      const statusCode = obtenerCodigoError(error);
      const mensajeError = obtenerMensajeError(error);
      
      response.status(statusCode).json({ 
        error: mensajeError,
        codigo: error.codigo || 'ERROR_REEMBOLSO'
      });
    }
  }
);

/**
 * Determina el código HTTP apropiado basado en el tipo de error
 */
function obtenerCodigoError(error: any): number {
  if (error.codigo === 'PROVEEDOR_NO_SOPORTADO') return 400;
  if (error.codigo === 'PAGO_NO_ENCONTRADO') return 404;
  if (error.codigo === 'FONDOS_INSUFICIENTES') return 402;
  if (error.codigo === 'ERROR_AUTENTICACION') return 401;
  return 500; // Error interno del servidor
}

/**
 * Obtiene un mensaje de error amigable para el cliente
 */
function obtenerMensajeError(error: any): string {
  if (error.codigo === 'PROVEEDOR_NO_SOPORTADO') 
    return 'El proveedor de pago especificado no está soportado';
  if (error.codigo === 'PAGO_NO_ENCONTRADO') 
    return 'El pago especificado no fue encontrado';
  if (error.codigo === 'FONDOS_INSUFICIENTES') 
    return 'Fondos insuficientes para realizar la operación';
  return error.message || 'Error interno del servidor';
}