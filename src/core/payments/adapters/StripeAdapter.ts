import {
  ChargeInput,
  ChargeResult,
  RefundInput,
  RefundResult,
} from "../PaymentTypes";
import { PaymentProvider } from "./PaymentProvider";

/**
 * Adaptador para Stripe que implementa la interfaz PaymentProvider
 * 
 * Patrón Adapter: Adapta la API específica de Stripe a nuestra interfaz uniforme
 * Convierte los objetos de entrada/salida de Stripe a nuestro dominio interno
 */
export class StripeAdapter implements PaymentProvider {
  /**
   * Crea una instancia de StripeAdapter
   * 
   * @param sdk - Instancia del SDK de Stripe
   */
  constructor(
    private sdk: {
      charges: { create: (parametros: any) => Promise<any> };
      refunds: { create: (parametros: any) => Promise<any> };
    }
  ) {}

  /**
   * Realiza un cargo mediante Stripe
   * 
   * @param input - Datos del cargo a realizar
   * @returns Promesa con el resultado del cargo normalizado
   */
  async pay(input: ChargeInput): Promise<ChargeResult> {
    const respuesta = await this.sdk.charges.create({
      amount: input.amount,
      currency: input.currency,
      source: input.token,
      metadata: input.metadata,
    });
    
    return { 
      id: respuesta.id, 
      status: respuesta.paid ? "approved" : "declined", 
      raw: respuesta 
    };
  }

  /**
   * Realiza un reembolso mediante Stripe
   * 
   * @param input - Datos del reembolso a realizar
   * @returns Promesa con el resultado del reembolso normalizado
   */
  async refund(input: RefundInput): Promise<RefundResult> {
    const respuesta = await this.sdk.refunds.create({
      payment_intent: input.paymentId,
      amount: input.amount,
    });
    
    return {
      id: respuesta.id,
      status: respuesta.status === "succeeded" ? "refunded" : "failed",
      raw: respuesta,
    };
  }
}