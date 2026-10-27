import type { Listing, ListingCategory } from '@/types/models';

/**
 * Chuẩn hóa chuỗi tiếng Việt: loại bỏ toàn bộ dấu thanh/mũ và chuyển đ/Đ thành d.
 */
function removeVietnameseAccents(str: string): string {
  if (!str) return '';
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'd')
    .toLowerCase()
    .trim();
}

/**
 * Filter + search computed during render — never store the result as state.
 */
export function filterListings(
  listings: Listing[],
  query: string,
  category: ListingCategory | 'All',
): Listing[] {
  const normalized = removeVietnameseAccents(query);

  return listings.filter((listing) => {
    const matchesCategory =
      category === 'All' || listing.category === category;
    if (!matchesCategory) return false;
    if (!normalized) return true;

    // Chỉ so khớp với tiêu đề (tên sản phẩm)
    const titleNormalized = removeVietnameseAccents(listing.title);

    return titleNormalized.includes(normalized);
  });
}