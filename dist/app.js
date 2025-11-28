import express from 'express';
import { routes } from './api/routes';
import { log } from './infra/logger';
import { eventBus } from './core/events/EventBus';
/**
 * Aplicación principal Express
 * @type {express.Express}
 */
const app = express();
app.use(express.json());
app.use(routes);
// Observer demo
/**
 * Manejador de evento para PaymentCaptured - envía email de confirmación
 * @param {Object} e - Datos del evento de pago capturado
 */
eventBus.on('PaymentCaptured', async (e) => log.info({ msg: 'Send email: payment captured', ...e }));
/**
 * Manejador de evento para PaymentRefunded - envía email de reembolso
 * @param {Object} e - Datos del evento de reembolso
 */
eventBus.on('PaymentRefunded', async (e) => log.info({ msg: 'Send email: payment refunded', ...e }));
/**
 * Puerto del servidor, obtenido de variables de entorno o por defecto 3000
 * @type {number}
 */
const port = process.env.PORT ? Number(process.env.PORT) : 3000;
/**
 * Inicia el servidor Express
 */
app.listen(port, () => console.log(`API on http://localhost:${port}`));
export default app;
