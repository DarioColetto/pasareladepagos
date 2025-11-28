import { PaymentFactory, Provider } from '../factories/PaymentFactory';
import { RetryDecorator } from '../decorators/RetryDecorator';
import { TelemetryDecorator } from '../decorators/TelemetryDecorator';
import { ChargeInput, RefundInput } from '../PaymentTypes';
import { commandBus } from '../../commands/CommandBus';
import { CapturePaymentCommand } from '../../commands/CapturePaymentCommand';
import { RefundPaymentCommand } from '../../commands/RefundPaymentCommand';

/**
 * Servicio principal de pagos que actúa como Fachada
 * 
 * Patrón Facade: Proporciona una interfaz simplificada al subsistema complejo de pagos
 * Oculta la complejidad de los comandos, decoradores y factory del cliente
 */
export class PaymentService {
  /**
   * Realiza un cargo mediante el proveedor especificado
   * 
   * Aplica automáticamente:
   * - Patrón Decorator: Retry + Telemetry
   * - Patrón Command: CapturePaymentCommand
   * - Patrón Factory: Creación de estrategia
   * 
   * @param provider - Proveedor de pago a utilizar
   * @param input - Datos del cargo a realizar
   * @returns Promesa con el resultado del cargo
   */
  static async charge(provider: Provider, input: ChargeInput) {
    // Crear estrategia base usando Factory
    const estrategiaBase = PaymentFactory.create(provider);
    
    // Aplicar decoradores para funcionalidad transversal
    const estrategiaDecorada = new TelemetryDecorator(
      new RetryDecorator(estrategiaBase), 
      provider
    );
    
    // Ejecutar comando a través del Command Bus
    return commandBus.dispatch(
      new CapturePaymentCommand(estrategiaDecorada, input, provider)
    );
  }

  /**
   * Realiza un reembolso mediante el proveedor especificado
   * 
   * @param provider - Proveedor de pago a utilizar
   * @param input - Datos del reembolso a realizar
   * @returns Promesa con el resultado del reembolso
   */
  static async refund(provider: Provider, input: RefundInput) {
    const estrategiaBase = PaymentFactory.create(provider);
    const estrategiaDecorada = new TelemetryDecorator(
      new RetryDecorator(estrategiaBase), 
      provider
    );
    
    return commandBus.dispatch(
      new RefundPaymentCommand(estrategiaDecorada, input, provider)
    );
  }
}