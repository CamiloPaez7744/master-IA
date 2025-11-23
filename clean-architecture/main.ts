import { buildServer } from '@infrastructure/http/Server';
import { createOrderUseCase, addItemToOrderUseCase } from '@composition/container';
import { OrderController } from '@infrastructure/http/controller/OrderController';

/**
 * Main entry point
 * Inicializa el servidor con todas las dependencias configuradas
 */

// Composición de dependencias
const orderController = new OrderController(
  createOrderUseCase,
  addItemToOrderUseCase
);

const port = Number(process.env.PORT) || 3000;
const host = process.env.HOST || '0.0.0.0';

buildServer(orderController).then((app) => {
  app.listen({ port, host }, (err, address) => {
    if (err) {
      app.log.error(err);
      process.exit(1);
    }
    console.log(`🚀 Server listening at ${address}`);
    console.log(`📊 Health check: ${address}/health`);
  });
}).catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});