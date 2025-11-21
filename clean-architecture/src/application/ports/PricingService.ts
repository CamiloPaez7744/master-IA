import { Sku } from '../../domain/value-objects/Sku';
import { Money } from '../../domain/value-objects/Money';
import { Currency } from '../../domain/value-objects/Currency';

/**
 * PricingService Port
 * Define el contrato para obtener precios de productos
 * La infraestructura debe implementar esta interfaz (puede conectarse a API externa, BD, etc.)
 */
export interface PricingService {
  /**
   * Obtiene el precio de un producto por su SKU en la moneda especificada
   * @returns Money con el precio unitario
   * @throws InfraError si hay un problema consultando el servicio
   * @throws NotFoundError si el SKU no existe
   */
  getPrice(sku: Sku, currency: Currency): Promise<Money>;

  /**
   * Verifica si un producto existe en el catálogo
   * @throws InfraError si hay un problema consultando el servicio
   */
  productExists(sku: Sku): Promise<boolean>;
}
