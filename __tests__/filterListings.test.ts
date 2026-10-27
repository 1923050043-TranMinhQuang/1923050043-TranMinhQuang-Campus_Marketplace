import { filterListings } from '@/lib/filterListings';
import type { Listing } from '@/types/models';

const listings: Listing[] = [
  {
    id: '1',
    sellerId: 's1',
    sellerName: 'Lan',
    title: 'Linear Algebra notes',
    category: 'Textbooks',
    price: 40_000,
    stock: 1,
    photoUri: 'x',
    description: 'Chapter 1-5',
    createdAt: '2026-10-01T00:00:00.000Z',
  },
  {
    id: '2',
    sellerId: 's2',
    sellerName: 'Minh',
    title: 'USB-C hub',
    category: 'Electronics',
    price: 150_000,
    stock: 3,
    photoUri: 'y',
    description: '7-in-1',
    createdAt: '2026-10-02T00:00:00.000Z',
  },
];

describe('filterListings', () => {
  it('filters by category and search text during render-style computation', () => {
    expect(filterListings(listings, '', 'All')).toHaveLength(2);
    expect(filterListings(listings, 'algebra', 'All')[0]?.id).toBe('1');
    expect(filterListings(listings, '', 'Electronics')).toHaveLength(1);
    expect(filterListings(listings, 'hub', 'Textbooks')).toHaveLength(0);
  });
});
