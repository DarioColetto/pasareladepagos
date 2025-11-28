/**
 * Bus de eventos para implementar el patrón Observer
 *
 * Patrón Observer: Permite que objetos se suscriban a eventos y sean notificados
 * cuando ocurren cambios en el sistema
 */
export class EventBus {
    handlers = {};
    /**
     * Suscribe un manejador a un evento específico
     *
     * @param name - Nombre del evento al que suscribirse
     * @param handler - Función manejadora que se ejecutará cuando ocurra el evento
     */
    on(name, handler) {
        const arr = (this.handlers[name] ??= []);
        arr.push(handler);
    }
    /**
     * Emite un evento ejecutando todos los manejadores suscritos
     *
     * @param name - Nombre del evento a emitir
     * @param payload - Datos del evento que se pasarán a los manejadores
     */
    async emit(name, payload) {
        const arr = (this.handlers[name] ?? []);
        for (const handler of arr) {
            await handler(payload);
        }
    }
}
/**
 * Instancia singleton del EventBus
 * Proporciona un punto de acceso global al bus de eventos
 */
export const eventBus = new EventBus();
