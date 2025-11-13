export class Price {
    private constructor(readonly amount: number, readonly currency: 'EUR' | 'USD' | 'COP') {}

    static create(amount: number, currency: 'EUR' | 'USD' | 'COP'): Price {
        if(!Number.isFinite(amount) || amount < 0) {
            throw new Error('Invalid price amount');
        }
        const rounded = Math.round(amount * 100) / 100;
        return new Price(rounded, currency);
    }
}