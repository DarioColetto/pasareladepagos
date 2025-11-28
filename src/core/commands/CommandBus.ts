import { Command } from './Command';

/**
 * Bus de comandos para ejecutar operaciones
 * 
 * Patrón Command: Desacopla el objeto que invoca la operación del que la ejecuta
 * Permite encolar, logging, y ejecución diferida de comandos
 */
export class CommandBus {
  /**
   * Ejecuta un comando y devuelve su resultado
   * 
   * @param comando - Comando a ejecutar
   * @returns Promesa con el resultado del comando
   */
  async dispatch<R>(comando: Command<R>) { 
    return comando.execute(); 
  }
}

/**
 * Instancia singleton del Command Bus
 * Proporciona un punto de acceso global al bus de comandos
 */
export const commandBus = new CommandBus();