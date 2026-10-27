import type { CartItem, Listing } from '@/types/models';

/** Miễn phí giao hàng trong trường khi tổng tiền đạt ngưỡng VNĐ này. */
export const FREE_DELIVERY_THRESHOLD = 200_000;
export const CAMPUS_DELIVERY_FEE = 15_000;

export type CheckoutLine = {
  listingId: string;
  title: string;
  unitPrice: number;
  quantity: number;
  lineTotal: number;
  stock: number;
};

export type CheckoutSummary = {
  lines: CheckoutLine[];
  subtotal: number;
  deliveryFee: number;
  deliveryRule: string;
  total: number;
  errors: string[];
};

export function buildCheckoutSummary(
  cart: CartItem[],
  listings: Listing[],
): CheckoutSummary {
  const errors: string[] = [];
  const lines: CheckoutLine[] = [];

  for (const item of cart) {
    const listing = listings.find((l) => l.id === item.listingId);
    if (!listing) {
      errors.push(`Sản phẩm ${item.listingId} hiện không còn khả dụng.`);
      continue;
    }
    if (listing.stock <= 0) {
      errors.push(`"${listing.title}" đã hết hàng.`);
      continue;
    }
    if (item.quantity > listing.stock) {
      errors.push(
        `"${listing.title}" chỉ còn ${listing.stock} sản phẩm (bạn đang chọn ${item.quantity}).`,
      );
    }
    const quantity = Math.min(item.quantity, Math.max(listing.stock, 0));
    if (quantity <= 0) continue;

    lines.push({
      listingId: listing.id,
      title: listing.title,
      unitPrice: listing.price,
      quantity,
      lineTotal: listing.price * quantity,
      stock: listing.stock,
    });
  }

  const subtotal = lines.reduce((sum, line) => sum + line.lineTotal, 0);
  const qualifiesForFreeDelivery = subtotal >= FREE_DELIVERY_THRESHOLD;
  const deliveryFee =
    lines.length === 0 ? 0 : qualifiesForFreeDelivery ? 0 : CAMPUS_DELIVERY_FEE;
  const deliveryRule = qualifiesForFreeDelivery
    ? `Miễn phí giao hàng trong khuôn viên trường (đơn từ ${FREE_DELIVERY_THRESHOLD.toLocaleString('vi-VN')}₫)`
    : `Phí giao hàng trong trường ${CAMPUS_DELIVERY_FEE.toLocaleString('vi-VN')}₫ (miễn phí từ ${FREE_DELIVERY_THRESHOLD.toLocaleString('vi-VN')}₫)`;

  return {
    lines,
    subtotal,
    deliveryFee,
    deliveryRule,
    total: subtotal + deliveryFee,
    errors,
  };
}

export function canAddToCart(
  listing: Listing,
  currentQuantityInCart: number,
  addBy = 1,
): { ok: true } | { ok: false; message: string } {
  if (listing.stock <= 0) {
    return { ok: false, message: `"${listing.title}" đã hết hàng.` };
  }
  if (currentQuantityInCart + addBy > listing.stock) {
    return {
      ok: false,
      message: `Chỉ còn ${listing.stock} sản phẩm "${listing.title}".`,
    };
  }
  return { ok: true };
}

export function formatVnd(amount: number): string {
  return `${amount.toLocaleString('vi-VN')}₫`;
}