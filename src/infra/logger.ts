import pino from 'pino';

/**
 * Logger centralizado para la aplicación
 * 
 * Patrón Singleton: Garantiza una única instancia del logger en toda la aplicación
 * Utiliza Pino para logging estructurado y de alto rendimiento
 */
class Logger {
  private static _instancia: pino.Logger;
  
  /**
   * Obtiene la instancia singleton del logger
   * 
   * @returns Instancia configurada de Pino Logger
   */
  static get instancia() { 
    return (this._instancia ??= pino({ 
      level: process.env.LOG_LEVEL ?? 'info' 
    })); 
  }
}

/**
 * Exporta la instancia del logger para uso global
 */
export const log = Logger.instancia;