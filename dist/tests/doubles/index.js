/**
 * Exportaciones de todos los dobles de prueba (test doubles).
 *
 * Incluye:
 * - Dummy: objetos que no implementan funcionalidad.
 * - Stub: objetos con respuestas predefinidas.
 * - Spy: objetos que registran llamadas.
 * - Fake: implementaciones simplificadas para pruebas.
 */
export { DummyPaymentProvider } from './DummyPaymentProvider';
export { AlwaysApprovedStub, AlwaysDeclinedStub, FlakyPaymentStub } from './StubPaymentProvider';
export { SpyPaymentProvider } from './SpyPaymentProvider';
export { FakeEventBus } from './FakeEventBus';
