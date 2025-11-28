import { describe, it, expect, vi } from 'vitest';
import { CommandBus } from '../core/commands/CommandBus';
import { Command } from '../core/commands/Command';

/**
 * Suite de pruebas para CommandBus
 */
describe('CommandBus', () => {
  /**
   * Prueba: Dispatch ejecuta comando y devuelve resultado
   */
  it('dispatch debe llamar a execute() del comando y devolver su resultado', async () => {
    const bus = new CommandBus();

    const fakeCommand: Command<number> = {
      execute: vi.fn().mockResolvedValue(42),
    };

    const result = await bus.dispatch(fakeCommand);

    expect(fakeCommand.execute).toHaveBeenCalledTimes(1);
    expect(result).toBe(42);
  });
});