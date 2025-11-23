import Fastify, { FastifyInstance } from 'fastify';
import { OrderController } from './controller/OrderController';
import { health } from '@shared/health';

/**
 * buildServer
 * Configura y construye el servidor Fastify con todas las rutas
 */
export async function buildServer(orderController: OrderController): Promise<FastifyInstance> {
  const app = Fastify({
    logger: {
      level: process.env.LOG_LEVEL || 'info'
    }
  });

  // Health check endpoint
  app.get('/health', async () => {
    return health();
  });

  // Registrar todas las rutas del controlador
  await orderController.registerRoutes(app);

  // Hook para logging de errores
  app.addHook('onError', async (request, reply, error) => {
    request.log.error({
      url: request.url,
      method: request.method,
      error: error.message,
      stack: error.stack
    }, 'Request error');
  });

  return app;
}