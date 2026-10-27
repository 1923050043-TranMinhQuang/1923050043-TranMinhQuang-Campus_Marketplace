import {
  buildCheckoutSummary,
  CAMPUS_DELIVERY_FEE,
  canAddToCart,
  FREE_DELIVERY_THRESHOLD,
} from '@/lib/checkout';
import type { Listing } from '@/types/models';

const sample: Listing = {
  id: '1',
  sellerId: 's1',
  sellerName: 'Lan',
  title: 'Calculus textbook',
  category: 'Textbooks',
  price: 120_000,
  stock: 2,
  photoUri: 'https://example.com/a.jpg',
  description: 'Good condition',
  createdAt: '2026-10-01T00:00:00.000Z',
};

describe('checkout pure logic', () => {
  it('applies campus delivery fee below the free threshold', () => {
    const summary = buildCheckoutSummary(
      [{ listingId: '1', quantity: 1 }],
      [sample],
    );
    expect(summary.subtotal).toBe(120_000);
    expect(summary.deliveryFee).toBe(CAMPUS_DELIVERY_FEE);
    expect(summary.total).toBe(120_000 + CAMPUS_DELIVERY_FEE);
  });

  it('gives free delivery at or above the threshold', () => {
    const expensive = { ...sample, price: FREE_DELIVERY_THRESHOLD };
    const summary = buildCheckoutSummary(
      [{ listingId: '1', quantity: 1 }],
      [expensive],
    );
    expect(summary.deliveryFee).toBe(0);
    expect(summary.total).toBe(FREE_DELIVERY_THRESHOLD);
  });

  it('reports stock errors when quantity exceeds availability', () => {
    const summary = buildCheckoutSummary(
      [{ listingId: '1', quantity: 5 }],
      [sample],
    );
      expect(summary.errors[0]).toMatch(/only has 2 left|chỉ còn 2/i);
  });

  it('blocks add-to-cart when stock is exhausted', () => {
    const result = canAddToCart({ ...sample, stock: 0 }, 0, 1);
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.message).toMatch(/out of stock|đã hết hàng/i);
    }
  });
});
