
import { Router } from 'express';
import { PaymentService } from '../core/payments/facade/PaymentService';
import { validateRequest } from '../middleware/validate-request'
import { PaymentChargeSchema } from '../schemas/payment.schema'

export const routes = Router();

routes.post('/payments/charge', validateRequest(PaymentChargeSchema)  , async (req, res) => {

  
  try {
    const { provider = 'stripe', amount, currency, token, metadata } = req.body?? {};
    
    const out = await PaymentService.charge(provider, { amount, currency, token, metadata });
    res.json(out);
  } catch (e:any) { res.status(500).json({ error: e.message }); }
});

routes.post('/payments/refund', async (req, res) => {
  try {
    const { provider = 'stripe', paymentId, amount } = req.body ?? {};
    const out = await PaymentService.refund(provider, { paymentId, amount });
    res.json(out);
  } catch (e:any) { res.status(500).json({ error: e.message }); }
});
