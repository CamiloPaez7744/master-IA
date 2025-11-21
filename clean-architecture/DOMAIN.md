# Dominio de Pedidos - Clean Architecture

Este documento describe la implementación del dominio de pedidos siguiendo principios de **Domain-Driven Design (DDD)** y **Clean Architecture**.

## 📋 Tabla de Contenidos

- [Arquitectura del Dominio](#arquitectura-del-dominio)
- [Value Objects](#value-objects)
- [Entidad Order (Aggregate Root)](#entidad-order-aggregate-root)
- [Eventos de Dominio](#eventos-de-dominio)
- [Invariantes y Reglas de Negocio](#invariantes-y-reglas-de-negocio)
- [Casos de Uso](#casos-de-uso)
- [Ejemplos de Código](#ejemplos-de-código)

---

## 🏗️ Arquitectura del Dominio

El dominio de pedidos está diseñado siguiendo estos principios:

1. **Sin dependencias externas**: El dominio no depende de frameworks, bases de datos o IO
2. **Inmutabilidad**: Los Value Objects son inmutables
3. **Validación en construcción**: Las invariantes se validan al crear objetos
4. **Eventos de dominio**: Las acciones importantes emiten eventos
5. **Aggregate Root**: `Order` protege la consistencia de sus ítems

### Estructura de Carpetas

```
domain/
├── entities/
│   └── Order.ts              # Aggregate Root
├── value-objects/
│   ├── OrderId.ts            # Identificador de pedido
│   ├── CustomerId.ts         # Identificador de cliente
│   ├── Currency.ts           # Moneda ISO 4217
│   ├── Money.ts              # Cantidad monetaria
│   ├── Sku.ts                # Código de producto
│   ├── Quantity.ts           # Cantidad de productos
│   └── OrderItem.ts          # Ítem del pedido
├── events/
│   ├── DomainEvent.ts        # Clase base de eventos
│   ├── OrderCreated.ts       # Evento: Pedido creado
│   ├── ItemAddedToOrder.ts   # Evento: Ítem añadido
│   └── OrderTotalCalculated.ts # Evento: Total calculado
└── examples.ts               # Ejemplos de uso
```

---

## 💎 Value Objects

Los Value Objects representan conceptos del dominio sin identidad propia. Se identifican por sus atributos.

### OrderId

Identificador único de pedido (UUID v4).

**Invariantes:**
- No puede ser vacío
- Debe tener formato UUID v4 válido

```typescript
const orderId = OrderId.create('550e8400-e29b-41d4-a716-446655440000');
```

### CustomerId

Identificador único de cliente (UUID v4).

**Invariantes:**
- No puede ser vacío
- Debe tener formato UUID v4 válido

```typescript
const customerId = CustomerId.create('660e8400-e29b-41d4-a716-446655440001');
```

### Currency

Moneda según estándar ISO 4217.

**Invariantes:**
- Código de 3 letras
- Solo soporta: USD, EUR, COP, GBP, JPY

```typescript
const usd = Currency.create('USD');
const eur = Currency.create('EUR');
const cop = Currency.create('COP');
```

### Money

Representa una cantidad monetaria con su moneda.

**Invariantes:**
- Monto debe ser finito y no negativo
- Precisión de 2 decimales
- Operaciones solo entre misma moneda

**Operaciones:**
```typescript
const currency = Currency.create('USD');
const price1 = Money.create(100.50, currency);
const price2 = Money.create(50.25, currency);

const sum = price1.add(price2);           // 150.75 USD
const diff = price1.subtract(price2);      // 50.25 USD
const mult = price1.multiply(3);           // 301.50 USD
const isGreater = price1.isGreaterThan(price2); // true
```

### Sku (Stock Keeping Unit)

Código único de producto.

**Invariantes:**
- No puede ser vacío
- Entre 3 y 50 caracteres
- Solo alfanuméricos y guiones
- Se normaliza a mayúsculas

```typescript
const sku = Sku.create('LAPTOP-15');      // LAPTOP-15
const sku2 = Sku.create('mouse-usb');     // MOUSE-USB (normalizado)
```

### Quantity

Cantidad de productos en un pedido.

**Invariantes:**
- Debe ser entero positivo
- Mayor que cero
- No puede exceder 10,000 unidades por ítem

```typescript
const qty = Quantity.create(5);
const qty2 = qty.add(Quantity.create(3)); // 8
```

### OrderItem

Representa un ítem dentro del pedido.

**Invariantes:**
- Debe tener SKU, precio unitario y cantidad válidos
- Calcula su propio total

```typescript
const item = OrderItem.create(sku, unitPrice, quantity);
const itemTotal = item.calculateTotal();  // unitPrice × quantity
```

---

## 🎯 Entidad Order (Aggregate Root)

La entidad `Order` es el **Aggregate Root** que protege la consistencia de los pedidos.

### Invariantes

1. **Moneda única**: Todos los ítems deben tener la misma moneda
2. **Límite de ítems**: Máximo 100 ítems por pedido
3. **Sin duplicados**: No se pueden añadir ítems con el mismo SKU
4. **Consistencia del total**: El total debe ser la suma exacta de los ítems

### Creación de Pedido

```typescript
const orderId = OrderId.create('550e8400-e29b-41d4-a716-446655440000');
const customerId = CustomerId.create('660e8400-e29b-41d4-a716-446655440001');
const currency = Currency.create('USD');

const order = Order.create(orderId, customerId, currency);
// Emite evento: OrderCreated
```

### Añadir Ítems

```typescript
const sku = Sku.create('LAPTOP-15');
const price = Money.create(999.99, currency);
const qty = Quantity.create(2);

order.addItem(sku, price, qty);
// Emite evento: ItemAddedToOrder

// Validaciones automáticas:
// ✅ Moneda coincide con el pedido
// ✅ No excede límite de ítems
// ✅ SKU no está duplicado
```

### Calcular Total

```typescript
const total = order.calculateTotal();
// Emite evento: OrderTotalCalculated

console.log(total.toString()); // "1999.98 USD"

const totalByCurrency = order.getTotalByCurrency();
// { currency: 'USD', amount: 1999.98 }
```

### Propiedades

```typescript
order.id            // OrderId
order.customerId    // CustomerId
order.currency      // Currency
order.items         // readonly OrderItem[]
order.itemCount     // number
order.isEmpty()     // boolean
```

---

## 📢 Eventos de Dominio

Los eventos de dominio registran hechos importantes que ya ocurrieron en el negocio.

### DomainEvent (Clase base)

Todos los eventos heredan de esta clase base:

```typescript
abstract class DomainEvent {
  readonly occurredOn: Date;     // Cuándo ocurrió
  readonly eventId: string;      // ID único del evento
  abstract get eventName(): string;
}
```

### OrderCreated

Se dispara cuando se crea un nuevo pedido.

```typescript
class OrderCreated extends DomainEvent {
  constructor(
    readonly orderId: OrderId,
    readonly customerId: CustomerId,
    readonly currency: Currency
  )
}
```

### ItemAddedToOrder

Se dispara cuando se añade un ítem al pedido.

```typescript
class ItemAddedToOrder extends DomainEvent {
  constructor(
    readonly orderId: OrderId,
    readonly sku: Sku,
    readonly unitPrice: Money,
    readonly quantity: Quantity,
    readonly itemTotal: Money
  )
}
```

### OrderTotalCalculated

Se dispara cuando se calcula el total del pedido.

```typescript
class OrderTotalCalculated extends DomainEvent {
  constructor(
    readonly orderId: OrderId,
    readonly total: Money,
    readonly itemCount: number
  )
}
```

### Manejo de Eventos

```typescript
// Obtener eventos pendientes
const events = order.getDomainEvents();
events.forEach(event => {
  console.log(`${event.eventName} at ${event.occurredOn.toISOString()}`);
});

// Limpiar eventos después de procesarlos
order.clearDomainEvents();
```

---

## 🔒 Invariantes y Reglas de Negocio

### A Nivel de Value Objects

| Value Object | Invariantes |
|-------------|-------------|
| **OrderId** | UUID v4 válido |
| **CustomerId** | UUID v4 válido |
| **Currency** | Código ISO 4217 de 3 letras, solo monedas soportadas |
| **Money** | Monto ≥ 0, finito, 2 decimales, operaciones solo en misma moneda |
| **Sku** | 3-50 caracteres, alfanumérico + guiones, normalizado a mayúsculas |
| **Quantity** | Entero, > 0, ≤ 10,000 |
| **OrderItem** | SKU, precio y cantidad válidos |

### A Nivel de Order (Aggregate)

1. **Moneda consistente**
   ```typescript
   // ✅ Válido
   order.addItem(sku1, Money.create(100, usd), qty);
   order.addItem(sku2, Money.create(50, usd), qty);
   
   // ❌ Error: Item currency (EUR) does not match order currency (USD)
   order.addItem(sku3, Money.create(100, eur), qty);
   ```

2. **Sin SKUs duplicados**
   ```typescript
   // ✅ Válido
   order.addItem(sku1, price, qty);
   order.addItem(sku2, price, qty);
   
   // ❌ Error: Item with SKU 'LAPTOP-15' already exists in the order
   order.addItem(sku1, price, Quantity.create(5));
   ```

3. **Límite de ítems**
   ```typescript
   // ❌ Error después de 100 ítems:
   // Order cannot have more than 100 items
   ```

4. **Total consistente**
   - El total siempre es la suma exacta de los ítems
   - Cálculo protegido con precisión de 2 decimales

---

## 💼 Casos de Uso

### Crear Pedido

```typescript
import { Order } from './domain/entities/Order';
import { OrderId, CustomerId, Currency } from './domain/value-objects';

function createOrder(customerIdStr: string): Order {
  const orderId = OrderId.create(generateUUID());
  const customerId = CustomerId.create(customerIdStr);
  const currency = Currency.create('USD');
  
  return Order.create(orderId, customerId, currency);
}
```

### Añadir Ítem a Pedido

```typescript
import { Sku, Money, Quantity } from './domain/value-objects';

function addItemToOrder(
  order: Order,
  skuCode: string,
  amount: number,
  quantity: number
): void {
  const sku = Sku.create(skuCode);
  const price = Money.create(amount, order.currency);
  const qty = Quantity.create(quantity);
  
  order.addItem(sku, price, qty);
}
```

### Obtener Total por Moneda

```typescript
function getTotalByCurrency(order: Order): Map<string, number> {
  const totals = new Map<string, number>();
  
  const orderTotal = order.getTotalByCurrency();
  totals.set(orderTotal.currency, orderTotal.amount);
  
  return totals;
}
```

---

## 📝 Ejemplos de Código

### Ejemplo Completo: Crear Pedido con Múltiples Ítems

```typescript
// 1. Crear pedido
const orderId = OrderId.create('550e8400-e29b-41d4-a716-446655440000');
const customerId = CustomerId.create('660e8400-e29b-41d4-a716-446655440001');
const currency = Currency.create('USD');

const order = Order.create(orderId, customerId, currency);

// 2. Añadir productos
const laptop = Sku.create('LAPTOP-15');
const laptopPrice = Money.create(999.99, currency);
const laptopQty = Quantity.create(2);
order.addItem(laptop, laptopPrice, laptopQty);

const mouse = Sku.create('MOUSE-USB');
const mousePrice = Money.create(25.50, currency);
const mouseQty = Quantity.create(3);
order.addItem(mouse, mousePrice, mouseQty);

const keyboard = Sku.create('KEYBOARD-MX');
const keyboardPrice = Money.create(75.00, currency);
const keyboardQty = Quantity.create(1);
order.addItem(keyboard, keyboardPrice, keyboardQty);

// 3. Calcular total
const total = order.calculateTotal();
console.log(`Total: ${total.toString()}`);
// Output: Total: 2151.48 USD

// 4. Obtener información
console.log(`Items: ${order.itemCount}`);           // 3
console.log(`Empty: ${order.isEmpty()}`);           // false
console.log(`Currency: ${order.currency.code}`);    // USD

// 5. Revisar eventos
const events = order.getDomainEvents();
events.forEach(event => {
  console.log(`- ${event.eventName}`);
});
// Output:
// - OrderCreated
// - ItemAddedToOrder
// - ItemAddedToOrder
// - ItemAddedToOrder
// - OrderTotalCalculated
```

### Ejemplo: Manejo de Errores

```typescript
try {
  const order = Order.create(orderId, customerId, Currency.create('USD'));
  
  // Error: Moneda diferente
  const eurPrice = Money.create(100, Currency.create('EUR'));
  order.addItem(Sku.create('PRODUCT-1'), eurPrice, Quantity.create(1));
} catch (error) {
  console.error(error.message);
  // Output: Item currency (EUR) does not match order currency (USD)
}

try {
  // Error: SKU duplicado
  const sku = Sku.create('PRODUCT-1');
  order.addItem(sku, price, qty);
  order.addItem(sku, price, qty); // Error
} catch (error) {
  console.error(error.message);
  // Output: Item with SKU 'PRODUCT-1' already exists in the order
}

try {
  // Error: Cantidad inválida
  Quantity.create(-5);
} catch (error) {
  console.error(error.message);
  // Output: Quantity must be greater than zero
}
```

### Ejemplo: Operaciones con Money

```typescript
const usd = Currency.create('USD');
const price1 = Money.create(100.00, usd);
const price2 = Money.create(50.25, usd);

// Suma
const total = price1.add(price2);
console.log(total.toString()); // "150.25 USD"

// Resta
const discount = price1.subtract(Money.create(10, usd));
console.log(discount.toString()); // "90.00 USD"

// Multiplicación (por cantidad)
const lineTotal = price1.multiply(3);
console.log(lineTotal.toString()); // "300.00 USD"

// Comparaciones
console.log(price1.isGreaterThan(price2)); // true
console.log(price1.isZero());              // false

// Igualdad
const anotherPrice = Money.create(100.00, usd);
console.log(price1.equals(anotherPrice));  // true
```

---

## 🧪 Testing

Los Value Objects y entidades son fáciles de testear porque:

1. **Sin dependencias externas**: No requieren mocks
2. **Comportamiento puro**: Mismos inputs = mismos outputs
3. **Validaciones claras**: Los errores son predecibles

```typescript
describe('Order', () => {
  it('should create order with valid data', () => {
    const orderId = OrderId.create('550e8400-e29b-41d4-a716-446655440000');
    const customerId = CustomerId.create('660e8400-e29b-41d4-a716-446655440001');
    const currency = Currency.create('USD');
    
    const order = Order.create(orderId, customerId, currency);
    
    expect(order.isEmpty()).toBe(true);
    expect(order.itemCount).toBe(0);
  });

  it('should add item and calculate total', () => {
    const order = createTestOrder();
    const sku = Sku.create('PRODUCT-1');
    const price = Money.create(100, order.currency);
    const qty = Quantity.create(2);
    
    order.addItem(sku, price, qty);
    const total = order.calculateTotal();
    
    expect(total.amount).toBe(200);
    expect(order.itemCount).toBe(1);
  });

  it('should throw error for different currency', () => {
    const order = createTestOrder(); // USD
    const sku = Sku.create('PRODUCT-1');
    const eurPrice = Money.create(100, Currency.create('EUR'));
    const qty = Quantity.create(1);
    
    expect(() => order.addItem(sku, eurPrice, qty))
      .toThrow('Item currency (EUR) does not match order currency (USD)');
  });
});
```

---

## 🎓 Principios de Diseño Aplicados

### Domain-Driven Design (DDD)

- **Ubiquitous Language**: Nombres del dominio de negocio
- **Value Objects**: Conceptos sin identidad propia
- **Entities**: Objetos con identidad (Order)
- **Aggregates**: Order protege sus ítems
- **Domain Events**: Comunicación de hechos importantes

### Clean Architecture

- **Independencia de frameworks**: Sin dependencias externas
- **Testeable**: Lógica pura, fácil de testear
- **Independiente de UI/DB**: Modelo de dominio puro
- **Reglas de negocio centralizadas**: En el dominio

### SOLID Principles

- **Single Responsibility**: Cada clase tiene un propósito claro
- **Open/Closed**: Extendible sin modificar código existente
- **Liskov Substitution**: Los Value Objects son intercambiables
- **Interface Segregation**: Interfaces específicas y pequeñas
- **Dependency Inversion**: El dominio no depende de nada

---

## 📚 Referencias

- **Domain-Driven Design** - Eric Evans
- **Clean Architecture** - Robert C. Martin
- **Implementing Domain-Driven Design** - Vaughn Vernon
- **Patterns of Enterprise Application Architecture** - Martin Fowler

---

## ✅ Checklist de Implementación

- [x] Value Objects con invariantes
- [x] Entidad Order como Aggregate Root
- [x] Eventos de dominio
- [x] Validación en construcción
- [x] Inmutabilidad de Value Objects
- [x] Sin dependencias externas
- [x] Operaciones con Money
- [x] Cálculo de total por moneda
- [x] Documentación completa
- [x] Ejemplos de uso

---

**Versión**: 1.0  
**Última actualización**: Noviembre 2025
