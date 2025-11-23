# Clean Architecture - Guía de Uso

## Resumen del Proyecto

Este es un proyecto de ejemplo que implementa **Clean Architecture** para un sistema de gestión de pedidos (orders). El proyecto demuestra cómo separar correctamente las capas de dominio, aplicación e infraestructura, con manejo de errores robusto y patrones de diseño modernos.

## Arquitectura

```
src/
├── domain/              # Lógica de negocio pura
│   ├── entities/       # Entidades del dominio (Order)
│   ├── value-objects/  # Value Objects inmutables
│   └── events/         # Eventos de dominio
├── application/        # Casos de uso y lógica de aplicación
│   ├── use-cases/      # Casos de uso
│   ├── dtos/           # Data Transfer Objects
│   ├── ports/          # Interfaces (Repository, Services)
│   └── errors/         # Errores de aplicación
└── infrastructure/     # Implementaciones concretas
    ├── http/           # API REST con Fastify
    ├── persistence/    # Repositorios (InMemory)
    ├── messaging/      # Event Bus
    └── composition/    # Dependency Injection
```

## Instalación y Ejecución

```bash
# Instalar dependencias
cd clean-architecture
npm install

# Ejecutar tests
npm test

# Ejecutar en modo desarrollo
npm run dev

# Compilar TypeScript
npm run build
```

## Casos de Uso Implementados

### 1. CreateOrderUseCase - Crear un Pedido

Crea un nuevo pedido vacío en el sistema.

**Entrada:**
- `orderId`: UUID v4 (requerido)
- `customerId`: UUID v4 (requerido)
- `currency`: Código de moneda ISO (USD, EUR, COP)

**Validaciones:**
- OrderId y CustomerId deben ser UUIDs v4 válidos
- Currency debe ser una de las soportadas (USD, EUR, COP)
- El pedido no debe existir previamente

**Ejemplo:**

```typescript
const result = await createOrderUseCase.execute({
  orderId: "550e8400-e29b-41d4-a716-446655440000",
  customerId: "6ba7b810-9dad-11d1-80b4-00c04fd430c8",
  currency: "USD"
});

if (result.success) {
  console.log("Pedido creado:", result.data);
} else {
  console.error("Error:", result.error.message);
}
```

### 2. AddItemToOrderUseCase - Añadir Ítem a un Pedido

Añade un producto al pedido especificado.

**Entrada:**
- `orderId`: UUID v4 del pedido (requerido)
- `sku`: Código del producto (3-50 caracteres, alfanumérico + guiones)
- `qty`: Cantidad (número positivo)
- `currency`: Moneda del precio (debe coincidir con la del pedido)

**Reglas de Negocio:**
- El pedido debe existir
- El producto (SKU) debe existir en el catálogo
- La moneda debe coincidir con la del pedido
- No se pueden agregar SKUs duplicados
- Máximo 100 ítems por pedido
- El precio se obtiene del PricingService

**Ejemplo:**

```typescript
const result = await addItemToOrderUseCase.execute({
  orderId: "550e8400-e29b-41d4-a716-446655440000",
  sku: "LAPTOP-001",
  qty: 2,
  currency: "USD"
});

if (result.success) {
  console.log("Total del pedido:", result.data.total);
} else {
  console.error("Error:", result.error.message);
}
```

## API REST

El servidor HTTP se ejecuta en el puerto 3000 por defecto.

### Endpoints

#### `POST /orders` - Crear Pedido

```bash
curl -X POST http://localhost:3000/orders \
  -H "Content-Type: application/json" \
  -d '{
    "orderId": "550e8400-e29b-41d4-a716-446655440000",
    "customerId": "6ba7b810-9dad-11d1-80b4-00c04fd430c8",
    "currency": "USD"
  }'
```

**Respuesta exitosa (201):**
```json
{
  "success": true,
  "data": {
    "orderId": "550e8400-e29b-41d4-a716-446655440000",
    "customerId": "6ba7b810-9dad-11d1-80b4-00c04fd430c8",
    "currency": "USD",
    "createdAt": "2024-01-15T10:00:00.000Z"
  }
}
```

#### `POST /orders/:orderId/items` - Añadir Ítem

```bash
curl -X POST http://localhost:3000/orders/550e8400-e29b-41d4-a716-446655440000/items \
  -H "Content-Type: application/json" \
  -d '{
    "sku": "LAPTOP-001",
    "qty": 2,
    "currency": "USD"
  }'
```

**Respuesta exitosa (200):**
```json
{
  "success": true,
  "data": {
    "orderId": "550e8400-e29b-41d4-a716-446655440000",
    "total": {
      "amount": 1999.98,
      "currency": "USD"
    }
  }
}
```

#### `GET /health` - Health Check

```bash
curl http://localhost:3000/health
```

**Respuesta:**
```json
{
  "status": "ok",
  "uptime": 1234.56,
  "timestamp": "2024-01-15T10:00:00.000Z"
}
```

## Manejo de Errores

El sistema implementa 4 tipos de errores de aplicación:

### 1. ValidationError (400 Bad Request)

Se produce cuando los datos de entrada no cumplen las validaciones.

**Ejemplo:**
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "OrderId must be a valid UUID v4 format",
    "field": "orderId"
  }
}
```

### 2. NotFoundError (404 Not Found)

Se produce cuando un recurso no existe.

**Ejemplo:**
```json
{
  "success": false,
  "error": {
    "code": "NOT_FOUND",
    "message": "Order with ID '...' not found",
    "resourceType": "Order",
    "resourceId": "..."
  }
}
```

### 3. ConflictError (409 Conflict)

Se produce cuando hay un conflicto con las reglas de negocio.

**Ejemplo:**
```json
{
  "success": false,
  "error": {
    "code": "DUPLICATE_ORDER",
    "message": "Order with ID '...' already exists",
    "details": { "orderId": "..." }
  }
}
```

### 4. InfraError (503 Service Unavailable)

Se produce cuando hay problemas de infraestructura (BD, servicios externos).

**Ejemplo:**
```json
{
  "success": false,
  "error": {
    "code": "SERVICE_UNAVAILABLE",
    "message": "Service temporarily unavailable. Please try again later."
  }
}
```

## Catálogo de Productos (PricingService)

Productos configurados por defecto:

| SKU | USD | EUR | COP |
|-----|-----|-----|-----|
| LAPTOP-001 | 999.99 | 899.99 | 3,999,999 |
| MOUSE-001 | 29.99 | 24.99 | 119,999 |
| KEYBOARD-001 | 79.99 | 69.99 | 319,999 |

## Formatos de Datos

### UUID v4

OrderId y CustomerId deben seguir el formato UUID v4:
```
550e8400-e29b-41d4-a716-446655440000
```

Puedes generar UUIDs con:
- Online: https://www.uuidgenerator.net/version4
- Node.js: `crypto.randomUUID()`
- JavaScript: `crypto.randomUUID()` (navegadores modernos)

### SKU (Stock Keeping Unit)

- Longitud: 3-50 caracteres
- Caracteres permitidos: A-Z, 0-9, guión (-)
- Se convierte automáticamente a mayúsculas

Ejemplos válidos:
- `LAPTOP-001`
- `MOUSE-001`
- `PROD-XYZ-123`

### Currency

Monedas soportadas:
- `USD` - Dólar estadounidense
- `EUR` - Euro
- `COP` - Peso colombiano

## Ejemplos de Flujo Completo

### Crear un pedido y añadir 3 productos

```bash
# 1. Crear pedido
ORDER_ID="550e8400-e29b-41d4-a716-446655440000"
CUSTOMER_ID="6ba7b810-9dad-11d1-80b4-00c04fd430c8"

curl -X POST http://localhost:3000/orders \
  -H "Content-Type: application/json" \
  -d "{
    \"orderId\": \"$ORDER_ID\",
    \"customerId\": \"$CUSTOMER_ID\",
    \"currency\": \"USD\"
  }"

# 2. Añadir laptop
curl -X POST http://localhost:3000/orders/$ORDER_ID/items \
  -H "Content-Type: application/json" \
  -d '{
    "sku": "LAPTOP-001",
    "qty": 1,
    "currency": "USD"
  }'

# 3. Añadir mouse
curl -X POST http://localhost:3000/orders/$ORDER_ID/items \
  -H "Content-Type: application/json" \
  -d '{
    "sku": "MOUSE-001",
    "qty": 2,
    "currency": "USD"
  }'

# 4. Añadir teclado
curl -X POST http://localhost:3000/orders/$ORDER_ID/items \
  -H "Content-Type: application/json" \
  -d '{
    "sku": "KEYBOARD-001",
    "qty": 1,
    "currency": "USD"
  }'

# Total esperado: 999.99 + (29.99 * 2) + 79.99 = 1139.96 USD
```

## Testing

```bash
# Ejecutar todos los tests
npm test

# Ejecutar tests en modo watch
npm test -- --watch

# Ejecutar tests con cobertura
npm test -- --coverage

# Ejecutar un archivo específico
npm test -- tests/application/use-cases/CreateOrderUseCase.spec.ts
```

## Principios Aplicados

- ✅ **Clean Architecture**: Separación clara de capas
- ✅ **SOLID**: Principios de diseño orientado a objetos
- ✅ **DDD**: Value Objects, Entities, Domain Events
- ✅ **Result Pattern**: Manejo de errores funcional (sin excepciones en el flujo normal)
- ✅ **Dependency Injection**: Inversión de control
- ✅ **Port/Adapter Pattern**: Interfaces para desacoplar capas
- ✅ **Domain Events**: Comunicación entre agregados
- ✅ **Type Safety**: TypeScript en modo estricto

## Estructura de Archivos Clave

```
clean-architecture/
├── src/
│   ├── domain/
│   │   ├── entities/Order.ts          # Aggregate Root
│   │   ├── value-objects/
│   │   │   ├── OrderId.ts            # UUID v4
│   │   │   ├── CustomerId.ts         # UUID v4
│   │   │   ├── Sku.ts                # Product code
│   │   │   ├── Money.ts              # Amount + Currency
│   │   │   └── ...
│   │   └── events/
│   │       ├── OrderCreated.ts
│   │       └── ItemAddedToOrder.ts
│   ├── application/
│   │   ├── use-cases/
│   │   │   ├── CreateOrderUseCase.ts
│   │   │   └── AddItemToOrderUseCase.ts
│   │   ├── ports/
│   │   │   ├── OrderRepository.ts
│   │   │   └── PricingService.ts
│   │   └── errors/                   # AppError types
│   └── infrastructure/
│       ├── http/
│       │   ├── Server.ts
│       │   └── controller/OrderController.ts
│       ├── persistence/
│       │   └── in-memory/InMemoryOrderRepository.ts
│       └── composition/
│           └── container.ts          # DI Container
├── tests/                            # Unit & Integration tests
├── main.ts                           # Entry point
├── package.json
└── tsconfig.json
```

## Próximos Pasos

Para extender este proyecto, considera:

1. **Agregar más casos de uso:**
   - GetOrderUseCase (consultar pedido)
   - RemoveItemFromOrderUseCase
   - CancelOrderUseCase
   - CheckoutOrderUseCase

2. **Implementar persistencia real:**
   - PostgreSQL con TypeORM/Prisma
   - MongoDB con Mongoose

3. **Agregar autenticación:**
   - JWT tokens
   - Role-based access control (RBAC)

4. **Implementar Event Bus real:**
   - RabbitMQ
   - Apache Kafka
   - AWS SQS/SNS

5. **Agregar documentación OpenAPI/Swagger:**
   - @fastify/swagger
   - @fastify/swagger-ui

6. **Implementar caché:**
   - Redis para datos de sesión
   - Cache de productos/precios

7. **Monitoreo y observabilidad:**
   - Winston/Pino para logging
   - Prometheus para métricas
   - Sentry para errores

## Recursos Adicionales

- [Clean Architecture (Robert C. Martin)](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [Domain-Driven Design](https://martinfowler.com/bliki/DomainDrivenDesign.html)
- [SOLID Principles](https://www.digitalocean.com/community/conceptual-articles/s-o-l-i-d-the-first-five-principles-of-object-oriented-design)
- [Fastify Documentation](https://www.fastify.io/)
- [Vitest Documentation](https://vitest.dev/)
