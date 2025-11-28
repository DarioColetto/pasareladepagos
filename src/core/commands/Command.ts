/**
 * Interfaz genérica para comandos
 * 
 * Patrón Command: Define la interfaz común para todos los comandos del sistema
 * Permite ejecutar operaciones de forma uniforme y desacoplada
 * 
 * @typeParam R - Tipo del resultado que devuelve el comando
 */
export interface Command<R = unknown> { 
  /**
   * Ejecuta el comando
   * 
   * @returns Promesa con el resultado de la ejecución
   */
  execute(): Promise<R>; 
}