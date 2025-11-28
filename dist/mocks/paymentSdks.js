/**
 * Crea un mock del SDK de Stripe para pruebas
 * @returns {Object} Mock del SDK de Stripe con métodos simulados
 */
export function createMockStripeSdk() {
    return {
        charges: {
            /**
             * Simula la creación de un cargo en Stripe
             * @param {any} p - Parámetros del cargo
             * @returns {Promise<Object>} Resultado simulado del cargo
             */
            async create(p) {
                return {
                    id: 'st_' + Math.random().toString(36).slice(2),
                    paid: true,
                    ...p,
                };
            },
        },
        refunds: {
            /**
             * Simula la creación de un reembolso en Stripe
             * @param {any} p - Parámetros del reembolso
             * @returns {Promise<Object>} Resultado simulado del reembolso
             */
            async create(p) {
                return {
                    id: 'strf_' + Math.random().toString(36).slice(2),
                    status: 'succeeded',
                    ...p,
                };
            },
        },
    };
}
/**
 * Crea un mock del SDK de MercadoPago para pruebas
 * @returns {Object} Mock del SDK de MercadoPago con métodos simulados
 */
export function createMockMpSdk() {
    return {
        payments: {
            /**
             * Simula la creación de un pago en MercadoPago
             * @param {any} p - Parámetros del pago
             * @returns {Promise<Object>} Resultado simulado del pago
             */
            async create(p) {
                return {
                    id: 'mp_' + Math.random().toString(36).slice(2),
                    status: 'approved',
                    ...p,
                };
            },
            /**
             * Simula la creación de un reembolso en MercadoPago
             * @param {string} id - ID del pago a reembolsar
             * @param {any} p - Parámetros del reembolso
             * @returns {Promise<Object>} Resultado simulado del reembolso
             */
            async refund(id, p) {
                return {
                    id: 'mprf_' + id,
                    status: 'approved',
                    ...p,
                };
            },
        },
    };
}
