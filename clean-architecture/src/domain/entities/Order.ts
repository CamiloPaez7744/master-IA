import { Price } from '@domain/value-objects/Price';
import { Quantity } from '@domain/value-objects/Quantity';
import { Sku } from '@domain/value-objects/Sku';

type orderItem = Readonly<{ sku: Sku; unit: Price; qty: Quantity }>;
export class Order {
    private readonly items: orderItem[] = [];

    constructor(public readonly id: string, public readonly customerId: string) {}

    static create(id: string, customerId: string): Order {
        return new Order(id, customerId);
    }

    addItem(sku: Sku, unit: Price, qty: Quantity): void {
        const existing = this.items[0];
        if (existing) {
            const currency = existing.unit.currency;
            if (currency !== unit.currency) {
                throw new Error('All items in the order must have the same currency');
            }
        }
        this.items.push(Object.freeze({ sku, unit, qty }));
    }

    total(): Price {
        if (this.items.length === 0) return Price.create(0, 'USD');
        const first = this.items[0];
        if (!first) return Price.create(0, 'USD');
        const currency = first.unit.currency;
        return this.items.reduce((acc, item) => {
            const itemTotal = item.unit.amount * item.qty.value;
            return Price.create(acc.amount + itemTotal, currency);
        }, Price.create(0, currency));
    }
}