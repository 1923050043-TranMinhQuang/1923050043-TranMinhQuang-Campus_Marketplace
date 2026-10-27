import type { Listing, ListingCategory } from '@/types/models';

/**
 * Filter + search computed during render — never store the result as state.
 */
export function filterListings(
  listings: Listing[],
  query: string,
  category: ListingCategory | 'All',
): Listing[] {
  const normalized = query.trim().toLowerCase();
  return listings.filter((listing) => {
    const matchesCategory =
      category === 'All' || listing.category === category;
    if (!matchesCategory) return false;
    if (!normalized) return true;
    return (
      listing.title.toLowerCase().includes(normalized) ||
      listing.description.toLowerCase().includes(normalized) ||
      listing.sellerName.toLowerCase().includes(normalized)
    );
  });
}
