/**
 * Critical path: stock-aware cart mutation (store logic without UI).
 */
import { canAddToCart } from '@/lib/checkout';
import type { Listing } from '@/types/models';

function addToCartPath(
  listing: Listing,
  cartQty: number,
  addBy: number,
): { nextQty: number; message?: string } {
  const check = canAddToCart(listing, cartQty, addBy);
  if (!check.ok) {
    return { nextQty: cartQty, message: check.message };
  }
  return { nextQty: cartQty + addBy };
}

describe('critical path: add to cart with stock rules', () => {
  const listing: Listing = {
    id: 'desk-1',
    sellerId: 's1',
    sellerName: 'Lan',
    title: 'Folding desk',
    category: 'Furniture',
    price: 350_000,
    stock: 1,
    photoUri: 'z',
    description: 'Dorm size',
    createdAt: '2026-10-03T00:00:00.000Z',
  };

  it('allows the first unit then blocks the second', () => {
    const first = addToCartPath(listing, 0, 1);
    expect(first.nextQty).toBe(1);
    expect(first.message).toBeUndefined();

    const second = addToCartPath(listing, first.nextQty, 1);
    expect(second.nextQty).toBe(1);
    expect(second.message).toMatch(/only 1|chỉ còn 1/i);
  });
});
