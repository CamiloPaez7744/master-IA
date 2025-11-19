export class Quantity {
    private constructor(readonly value: number) {}

    static create(value: number): Quantity {
        if (value <= 0) {
            throw new Error('Quantity must be greater than zero');
        }
        return new Quantity(value);
    }
}