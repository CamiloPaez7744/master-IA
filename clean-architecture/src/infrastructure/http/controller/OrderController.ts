import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { CreateOrderUseCase } from '@application/use-cases/CreateOrderUseCase';
import { AddItemToOrderUseCase } from '@application/use-cases/AddItemToOrderUseCase';
import { AppError } from '@application/errors/AppError';
import { ValidationError } from '@application/errors/ValidationError';
import { NotFoundError } from '@application/errors/NotFoundError';
import { ConflictError } from '@application/errors/ConflictError';
import { InfraError } from '@application/errors/InfraError';

interface CreateOrderBody {
  orderId: string;
  customerId: string;
  currency: string;
}

interface AddItemBody {
  sku: string;
  qty: number;
  currency: string;
}

interface OrderParams {
  orderId: string;
}

/**
 * OrderController
 * Controlador HTTP para operaciones de pedidos
 * Maneja la capa de presentación y traduce errores de aplicación a respuestas HTTP
 */
export class OrderController {
  constructor(
    private readonly createOrderUseCase: CreateOrderUseCase,
    private readonly addItemUseCase: AddItemToOrderUseCase
  ) {}

  async registerRoutes(fastify: FastifyInstance): Promise<void> {
    fastify.post('/orders', this.createOrder.bind(this));
    fastify.post('/orders/:orderId/items', this.addItem.bind(this));
  }

  async createOrder(
    request: FastifyRequest<{ Body: CreateOrderBody }>,
    reply: FastifyReply
  ): Promise<void> {
    try {
      const { orderId, customerId, currency } = request.body;

      // Validación básica de entrada
      if (!orderId || !customerId || !currency) {
        return reply.status(400).send({
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Missing required fields: orderId, customerId, and currency are required'
          }
        });
      }

      const result = await this.createOrderUseCase.execute({
        orderId,
        customerId,
        currency
      });

      if (!result.success) {
        return this.handleError(result.error, reply);
      }

      return reply.status(201).send({
        success: true,
        data: result.data
      });
    } catch (error) {
      request.log.error(error, 'Unexpected error in createOrder');
      return reply.status(500).send({
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'An unexpected error occurred'
        }
      });
    }
  }

  async addItem(
    request: FastifyRequest<{ Params: OrderParams; Body: AddItemBody }>,
    reply: FastifyReply
  ): Promise<void> {
    try {
      const { orderId } = request.params;
      const { sku, qty, currency } = request.body;

      // Validación básica de entrada
      if (!sku || qty === undefined || !currency) {
        return reply.status(400).send({
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Missing required fields: sku, qty, and currency are required'
          }
        });
      }

      if (typeof qty !== 'number' || qty <= 0) {
        return reply.status(400).send({
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'qty must be a positive number'
          }
        });
      }

      const result = await this.addItemUseCase.execute({
        orderId,
        sku,
        qty,
        currency
      });

      if (!result.success) {
        return this.handleError(result.error, reply);
      }

      return reply.status(200).send({
        success: true,
        data: result.data
      });
    } catch (error) {
      request.log.error(error, 'Unexpected error in addItem');
      return reply.status(500).send({
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'An unexpected error occurred'
        }
      });
    }
  }

  /**
   * Mapea errores de aplicación a respuestas HTTP apropiadas
   */
  private handleError(error: AppError, reply: FastifyReply): FastifyReply {
    if (error instanceof ValidationError) {
      reply.status(400).send({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: error.message,
          field: error.field,
          details: error.details
        }
      });
      return reply;
    }

    if (error instanceof NotFoundError) {
      reply.status(404).send({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: error.message,
          resourceType: error.resourceType,
          resourceId: error.resourceId
        }
      });
      return reply;
    }

    if (error instanceof ConflictError) {
      reply.status(409).send({
        success: false,
        error: {
          code: error.conflictReason || 'CONFLICT',
          message: error.message,
          details: error.details
        }
      });
      return reply;
    }

    if (error instanceof InfraError) {
      reply.log.error(error.originalError, `Infrastructure error in ${error.serviceName}`);
      reply.status(503).send({
        success: false,
        error: {
          code: 'SERVICE_UNAVAILABLE',
          message: 'Service temporarily unavailable. Please try again later.'
        }
      });
      return reply;
    }

    // Error genérico - esto no debería ocurrir si todos los tipos están bien definidos
    // pero TypeScript necesita un caso por defecto
    reply.status(500).send({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'An unexpected error occurred'
      }
    });
    return reply;
  }
}