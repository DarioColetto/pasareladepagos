/**
 * Nombres de eventos soportados por el sistema
 */
export type EventName = "PaymentCaptured" | "PaymentRefunded" | "PaymentFailed";

/**
 * Estructuras de datos para cada tipo de evento
 */
export type EventPayloads = {
  PaymentCaptured: { paymentId: string; amount: number; provider: string };
  PaymentRefunded: { paymentId: string; amount: number; provider: string };
  PaymentFailed: { reason: string; provider: string };
};

/**
 * Tipo para manejadores de eventos
 */
type Handler<K extends EventName> = (payload: EventPayloads[K]) => void | Promise<void>;

/**
 * Bus de eventos para implementar el patrón Observer
 * 
 * Patrón Observer: Permite que objetos se suscriban a eventos y sean notificados
 * cuando ocurren cambios en el sistema
 */
export class EventBus {
  private handlers: { [K in EventName]?: Array<Handler<any>> } = {};

  /**
   * Suscribe un manejador a un evento específico
   * 
   * @param name - Nombre del evento al que suscribirse
   * @param handler - Función manejadora que se ejecutará cuando ocurra el evento
   */
  on<K extends EventName>(name: K, handler: Handler<K>) {
    const arr = (this.handlers[name] ??= []) as Handler<K>[];
    arr.push(handler);
  }

  /**
   * Emite un evento ejecutando todos los manejadores suscritos
   * 
   * @param name - Nombre del evento a emitir
   * @param payload - Datos del evento que se pasarán a los manejadores
   */
  async emit<K extends EventName>(name: K, payload: EventPayloads[K]) {
    const arr = (this.handlers[name] ?? []) as Handler<K>[];
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