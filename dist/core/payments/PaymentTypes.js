/**
 * Tipos principales para el sistema de pagos
 * Define las interfaces y tipos de datos para operaciones de pago
 */
/**
 * Proveedores de pago soportados
 */
export var PaymentProviders;
(function (PaymentProviders) {
    PaymentProviders["STRIPE"] = "stripe";
    PaymentProviders["MERCADOPAGO"] = "mp";
})(PaymentProviders || (PaymentProviders = {}));
/**
 * Eventos del sistema de pagos
 */
export var PaymentEvents;
(function (PaymentEvents) {
    PaymentEvents["PAYMENT_CREATED"] = "payment:created";
    PaymentEvents["PAYMENT_PROCESSED"] = "payment:processed";
    PaymentEvents["PAYMENT_FAILED"] = "payment:failed";
    PaymentEvents["PAYMENT_REFUNDED"] = "payment:refunded";
})(PaymentEvents || (PaymentEvents = {}));
