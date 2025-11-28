/**
 * Fake para EventBus que registra los eventos emitidos.
 *
 * Patrón Fake: Objeto con implementación funcional pero simplificada para pruebas.
 * Útil para verificar que se emiten los eventos esperados sin usar el EventBus real.
 */
import { EventBus } from '../../core/events/EventBus';
export class FakeEventBus extends EventBus {
    emittedEvents = [];
    /**
     * Emite un evento y lo registra en el historial.
     *
     * @param name - Nombre del evento
     * @param payload - Datos del evento
     */
    async emit(name, payload) {
        this.emittedEvents.push({ name, payload });
        // Opcional: también llamar al comportamiento real si se desea
        // await super.emit(name, payload);
    }
    /**
     * Obtiene los eventos emitidos de un tipo específico.
     *
     * @param name - Nombre del evento a filtrar
     * @returns Array de eventos emitidos del tipo especificado
     */
    getEventsByName(name) {
        return this.emittedEvents
            .filter(event => event.name === name)
            .map(event => event.payload);
    }
    /**
     * Verifica si se emitió un evento específico con los datos esperados.
     *
     * @param name - Nombre del evento
     * @param expectedPayload - Datos esperados del evento (parciales)
     * @returns true si se encontró el evento
     */
    wasEventEmittedWith(name, expectedPayload) {
        return this.emittedEvents.some(event => event.name === name &&
            Object.keys(expectedPayload).every(key => event.payload[key] === expectedPayload[key]));
    }
    /**
     * Obtiene el número total de eventos emitidos.
     *
     * @returns Cantidad de eventos emitidos
     */
    getTotalEmittedEvents() {
        return this.emittedEvents.length;
    }
    /**
     * Reinicia el historial de eventos emitidos.
     */
    reset() {
        this.emittedEvents = [];
    }
}
