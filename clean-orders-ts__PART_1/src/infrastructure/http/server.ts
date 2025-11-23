import fastify from 'fastify'
import { ServerDependencies } from '../../application/ports/server-dependencies.js'
import { OrderController } from './controllers/order-controller.js'

export async function buildServer(dependencies: ServerDependencies) {
  const server = fastify({ 
    logger: true 
  })

  // Presentation layer (Controllers)
  const orderController = new OrderController(
    dependencies.createOrderUseCase,
    dependencies.addItemToOrderUseCase
  )

  // Register routes
  await orderController.registerRoutes(server)

  // Health check endpoint
  server.get('/health', async () => {
    return { status: 'ok', timestamp: new Date().toISOString() }
  })

  return server
}

