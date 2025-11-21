#Microservicios de pedidos
- **Dominio**: Order, Price, SKU, Quantity, eventos de dominio
- **Appication**: Casos de uso CreateOrder, AddItemToOrder
puertos y DTOs
- **Infrastructure**: repositorio InMemoryOrderRepository, implementación de eventos de dominio
no-op
- **HTTP**: endpoints mínimos de fastify
- **Composition**: containers.ts como composition root
- **Tests**: pruebas unitarias para casos de uso y repositorio


# Comportamiento
`Post /orders` - Crea un nuevo pedido vacío y devuelve su ID.
`Post /orders/:orderId/items` - Agrega una línea (SKU, cantidad, precio) al pedido especificado.
