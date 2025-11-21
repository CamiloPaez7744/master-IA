/**
 * Clock Port
 * Define el contrato para obtener la fecha/hora actual
 * Útil para testing (podemos inyectar un reloj falso)
 */
export interface Clock {
  /**
   * Obtiene la fecha y hora actual
   */
  now(): Date;

  /**
   * Obtiene el timestamp actual en milisegundos
   */
  timestamp(): number;
}
