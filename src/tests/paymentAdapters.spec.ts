import { describe, it, expect, vi } from "vitest";
import { MercadoPagoAdapter } from "../core/payments/adapters/MpAdapter";
import { StripeAdapter } from "../core/payments/adapters/StripeAdapter";
import { ChargeInput, RefundInput } from "../core/payments/PaymentTypes";

/**
 * Suite de pruebas para StripeAdapter
 */
describe("StripeAdapter", () => {
  /**
   * Prueba: Pay llama al SDK y normaliza resultado
   */
  it("pay() debe llamar al SDK y devolver un ChargeResult normalizado", async () => {
    const chargesCreate = vi.fn().mockResolvedValue({
      id: "ch_123",
      paid: true,
      status: "succeeded",
    });

    const refundsCreate = vi.fn();

    const fakeStripeSdk = {
      charges: {
        create: chargesCreate,
      },
      refunds: {
        create: refundsCreate,
      },
    };

    const adapter = new StripeAdapter(fakeStripeSdk);

    const input: ChargeInput = {
      amount: 1000,
      currency: "ARS",
      token: '12345',
    } as ChargeInput;

    const result = await adapter.pay(input);

    expect(chargesCreate).toHaveBeenCalledTimes(1);
    expect(chargesCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        amount: input.amount,
      })
    );

    expect(result.id).toBe("ch_123");
    expect(result.status).toBe("approved");
    expect(result.raw).toEqual(
      expect.objectContaining({
        id: "ch_123",
        paid: true,
      })
    );
  });

  /**
   * Prueba: Refund llama al SDK y normaliza resultado
   */
  it("refund() debe llamar al SDK y devolver un RefundResult normalizado", async () => {
    const chargesCreate = vi.fn();

    const refundsCreate = vi.fn().mockResolvedValue({
      id: "re_456",
      status: "succeeded",
    });

    const fakeStripeSdk = {
      charges: {
        create: chargesCreate,
      },
      refunds: {
        create: refundsCreate,
      },
    };

    const adapter = new StripeAdapter(fakeStripeSdk);

    const input: RefundInput = {
      paymentId: "ch_123",
      amount: 500,
    } as RefundInput;

    const result = await adapter.refund(input);

    expect(refundsCreate).toHaveBeenCalledTimes(1);
    expect(refundsCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        payment_intent: input.paymentId,
        amount: input.amount,
      })
    );

    expect(result.id).toBe("re_456");
    expect(result.status).toBe("refunded");
    expect(result.raw).toEqual(
      expect.objectContaining({
        id: "re_456",
        status: "succeeded",
      })
    );
  });
});

/**
 * Suite de pruebas para MercadoPagoAdapter
 */
describe("MpAdapter", () => {
  /**
   * Prueba: Pay llama al SDK y normaliza resultado
   */
  it("pay() debe llamar a payments.create y devolver un ChargeResult normalizado", async () => {
    const paymentsCreate = vi.fn().mockResolvedValue({
      id: "mp_pay_1",
      status: "approved",
    });

    const paymentsRefund = vi.fn();

    const fakeMpSdk = {
      payments: {
        create: paymentsCreate,
        refund: paymentsRefund,
      },
    };

    const adapter = new MercadoPagoAdapter(fakeMpSdk);

    const input: ChargeInput = {
      amount: 2000,
      currency: "ARS",
      token: '345677'
    } as ChargeInput;

    const result = await adapter.pay(input);

    expect(paymentsCreate).toHaveBeenCalledTimes(1);
    expect(paymentsCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        transaction_amount: input.amount,
      })
    );

    expect(result.id).toBe("mp_pay_1");
    expect(result.status).toBe("approved");
    expect(result.raw).toEqual(
      expect.objectContaining({
        id: "mp_pay_1",
        status: "approved",
      })
    );
  });

  /**
   * Prueba: Refund llama al SDK y normaliza resultado
   */
  it("refund() debe llamar a payments.refund y devolver un RefundResult normalizado", async () => {
    const paymentsCreate = vi.fn();

    const paymentsRefund = vi.fn().mockResolvedValue({
      id: "mp_refund_1",
      status: "approved",
    });

    const fakeMpSdk = {
      payments: {
        create: paymentsCreate,
        refund: paymentsRefund,
      },
    };

    const adapter = new MercadoPagoAdapter(fakeMpSdk);

    const input: RefundInput = {
      paymentId: "mp_pay_1",
      amount: 500,
    } as RefundInput;

    const result = await adapter.refund(input);

    expect(paymentsRefund).toHaveBeenCalledTimes(1);
    expect(paymentsRefund).toHaveBeenCalledWith(
      input.paymentId,
      expect.objectContaining({
        amount: input.amount,
      })
    );

    expect(result.id).toBe("mp_refund_1");
    expect(result.status).toBe("refunded");
    expect(result.raw).toEqual(
      expect.objectContaining({
        id: "mp_refund_1",
        status: "approved",
      })
    );
  });
});