import { PricingService } from '../../application/ports/PricingService';
import { Sku } from '../../domain/value-objects/Sku';
import { Money } from '../../domain/value-objects/Money';
import { Currency } from '../../domain/value-objects/Currency';
import { NotFoundError } from '../../application/errors/NotFoundError';
import { InfraError } from '../../application/errors/InfraError';

/**
 * StaticPricingService
 * Implementación estática del PricingService con precios predefinidos
 * Útil para testing y desarrollo
 */
export class StaticPricingService implements PricingService {
  private prices: Map<string, Map<string, number>> = new Map();

  constructor(initialPrices?: Array<{ sku: string; currency: string; price: number }>) {
    if (initialPrices) {
      initialPrices.forEach(({ sku, currency, price }) => {
        this.addPrice(sku, currency, price);
      });
    }
  }

  async getPrice(sku: Sku, currency: Currency): Promise<Money> {
    const skuKey = sku.code;
    const currencyKey = currency.code;

    if (!this.prices.has(skuKey)) {
      throw new NotFoundError(
        `Product with SKU '${skuKey}' not found`,
        'Product',
        skuKey
      );
    }

    const skuPrices = this.prices.get(skuKey)!;
    
    if (!skuPrices.has(currencyKey)) {
      throw new NotFoundError(
        `Price for SKU '${skuKey}' not available in currency '${currencyKey}'`,
        'Price',
        `${skuKey}-${currencyKey}`
      );
    }

    const priceAmount = skuPrices.get(currencyKey)!;

    try {
      return Money.create(priceAmount, currency);
    } catch (error) {
      throw new InfraError(
        `Failed to create Money object for SKU '${skuKey}'`,
        'StaticPricingService',
        error instanceof Error ? error : undefined
      );
    }
  }

  async productExists(sku: Sku): Promise<boolean> {
    return this.prices.has(sku.code);
  }

  /**
   * Métodos adicionales para configuración (útiles para testing)
   */
  addPrice(sku: string, currency: string, price: number): void {
    const skuKey = sku.toUpperCase();
    const currencyKey = currency.toUpperCase();

    if (!this.prices.has(skuKey)) {
      this.prices.set(skuKey, new Map());
    }

    this.prices.get(skuKey)!.set(currencyKey, price);
  }

  removePrice(sku: string, currency?: string): void {
    const skuKey = sku.toUpperCase();

    if (currency) {
      const currencyKey = currency.toUpperCase();
      this.prices.get(skuKey)?.delete(currencyKey);
    } else {
      this.prices.delete(skuKey);
    }
  }

  clear(): void {
    this.prices.clear();
  }

  getAllProducts(): string[] {
    return Array.from(this.prices.keys());
  }
}