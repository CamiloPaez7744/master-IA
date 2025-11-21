import { Order } from '../../domain/entities/Order';
import { OrderId } from '../../domain/value-objects/OrderId';

/**
 * OrderRepository Port
 * Define el contrato para la persistencia de pedidos
 * La infraestructura debe implementar esta interfaz
 */
export interface OrderRepository {
  /**
   * Guarda un nuevo pedido o actualiza uno existente
   * @throws InfraError si hay un problema con la persistencia
   */
  save(order: Order): Promise<void>;

  /**
   * Busca un pedido por su ID
   * @returns Order si existe, null si no se encuentra
   * @throws InfraError si hay un problema con la persistencia
   */
  findById(id: OrderId): Promise<Order | null>;

  /**
   * Verifica si existe un pedido con el ID dado
   * @throws InfraError si hay un problema con la persistencia
   */
  exists(id: OrderId): Promise<boolean>;
}