export type UserRole = 'buyer' | 'seller';

export type ListingCategory =
  | 'Textbooks'
  | 'Electronics'
  | 'Furniture'
  | 'Clothing'
  | 'Other';

export const LISTING_CATEGORIES: ListingCategory[] = [
  'Textbooks',
  'Electronics',
  'Furniture',
  'Clothing',
  'Other',
];

export type User = {
  id: string;
  name: string;
  role: UserRole;
};

export type Listing = {
  id: string;
  sellerId: string;
  sellerName: string;
  title: string;
  category: ListingCategory;
  price: number;
  stock: number;
  photoUri: string;
  description: string;
  createdAt: string;
};

export type CartItem = {
  listingId: string;
  quantity: number;
};

export type CreateListingInput = {
  title: string;
  category: ListingCategory;
  price: number;
  stock: number;
  photoUri: string;
  description: string;
  sellerId: string;
  sellerName: string;
};
