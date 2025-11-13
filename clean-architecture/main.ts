import { buildServer } from '@infrastructure/http/Server';
import { createOrderUseCase } from '@composition/container';
import { OrderController } from '@infrastructure/http/OrderController';

// Composición de dependencias
const orderController = new OrderController(createOrderUseCase);

const port = Number(process.env.PORT) || 3000;

buildServer(orderController).then((app) => {
    app.listen({ port }, (err, address) => {
        if (err) {
            app.log.error(err);
            process.exit(1);
        }
        console.log(`Server listening at ${address}`);
    });
});