export class Sku {
    private constructor(readonly code: string) {}

    static create(code: string): Sku {
        if (!code || code.trim().length === 0) {
            throw new Error('SKU code cannot be empty');
        }
        return new Sku(code.trim());
    }
}