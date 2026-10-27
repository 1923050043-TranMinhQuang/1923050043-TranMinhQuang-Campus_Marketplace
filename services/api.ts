import AsyncStorage from '@react-native-async-storage/async-storage';

import type { CreateListingInput, Listing } from '@/types/models';

const LOCAL_LISTINGS_KEY = 'campus.localListings';
const CATALOGUE_CACHE_KEY = 'campus.catalogueCache';
const STOCK_DELTAS_KEY = 'campus.stockDeltas';

const SEED_PRODUCTS: Listing[] = [
  // ==================== 1. QUẦN ÁO (Clothing) ====================
  {
    id: 'remote-c1',
    sellerId: 'seller-1',
    sellerName: 'Campus Wear',
    title: 'Áo thun Cotton trơn dáng rộng Unisex',
    category: 'Clothing',
    price: 150000,
    stock: 50,
    photoUri: 'https://cdn.hstatic.net/products/1000257344/609348b88eac47cfbc24d4f1b8d8d2a0_tplv-o3syd03w52-origin-jpeg_ef7a7573ff9347db846b57c79f8001b0_master.jpeg',
    description: 'Chất liệu vải cotton thoáng mát, form basic dễ phối đồ.',
    createdAt: new Date('2026-10-18T14:00:00Z').toISOString(),
  },
  {
    id: 'remote-c2',
    sellerId: 'seller-2',
    sellerName: 'Denim Studio',
    title: 'Quần Jean ống suông phong cách Hàn Quốc',
    category: 'Clothing',
    price: 280000,
    stock: 35,
    photoUri: 'https://cdn.kkfashion.vn/37911-large_default/quan-jeans-ong-suong-loe-nhe-qj-19.jpg',
    description: 'Quần jean vải dày dặn, ống rộng tôn dáng nam nữ đều mặc đẹp.',
    createdAt: new Date('2026-10-19T15:20:00Z').toISOString(),
  },
  {
    id: 'remote-c3',
    sellerId: 'seller-1',
    sellerName: 'Vintage Shop',
    title: 'Áo khoác Hoodie nỉ bông ấm áp',
    category: 'Clothing',
    price: 320000,
    stock: 25,
    photoUri: 'https://image.made-in-china.com/202f0j00YGVfAkysAjbU/Hoodie-Sweater-Fleece-Cotton-Warm-Jacket-Comfortable-Wear-for-Winter.webp',
    description: 'Chất vải nỉ lót bông mềm mại, có mũ trùm dày giữ ấm tốt.',
    createdAt: new Date('2026-10-20T16:40:00Z').toISOString(),
  },
  {
    id: 'remote-c4',
    sellerId: 'seller-3',
    sellerName: 'Minimalist Store',
    title: 'Áo sơ mi trắng tay dài thanh lịch',
    category: 'Clothing',
    price: 195000,
    stock: 40,
    photoUri: 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=500&q=80',
    description: 'Vải lụa tuyết ít nhăn, chuẩn form lịch sự.',
    createdAt: new Date('2026-10-21T09:15:00Z').toISOString(),
  },
  {
    id: 'remote-c5',
    sellerId: 'seller-4',
    sellerName: 'Sneaker Station',
    title: 'Giày Sneaker cổ thấp phong cách năng động',
    category: 'Clothing',
    price: 450000,
    stock: 18,
    photoUri: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=500&q=80',
    description: 'Đế đệm cao su êm ái chống trơn trượt, đi bộ thoải mái cả ngày.',
    createdAt: new Date('2026-10-22T10:00:00Z').toISOString(),
  },

  // ==================== 2. ĐỒ ĐIỆN TỬ (Electronics) ====================
  {
    id: 'remote-e1',
    sellerId: 'seller-1',
    sellerName: 'Phụ kiện Số 1',
    title: 'Tai nghe Bluetooth không dây TWS',
    category: 'Electronics',
    price: 320000,
    stock: 45,
    photoUri: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=500&q=80',
    description: 'Tai nghe Bluetooth chống ồn, âm bass khỏe, pin dùng 6 tiếng liên tục.',
    createdAt: new Date('2026-10-15T08:00:00Z').toISOString(),
  },
  {
    id: 'remote-e2',
    sellerId: 'seller-2',
    sellerName: 'Gear Store',
    title: 'Chuột không dây Silent chống ồn',
    category: 'Electronics',
    price: 180000,
    stock: 60,
    photoUri: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500&q=80',
    description: 'Bấm êm không phát ra tiếng ồn, cực kỳ phù hợp khi học tại thư viện.',
    createdAt: new Date('2026-10-16T09:30:00Z').toISOString(),
  },
  {
    id: 'remote-e3',
    sellerId: 'seller-3',
    sellerName: 'Tech Hub',
    title: 'Bàn phím cơ không dây RGB',
    category: 'Electronics',
    price: 650000,
    stock: 15,
    photoUri: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500&q=80',
    description: 'Phím cơ Red Switch bấm nhẹ, đèn nền RGB nhiều chế độ đẹp mắt.',
    createdAt: new Date('2026-10-17T10:15:00Z').toISOString(),
  },
  {
    id: 'remote-e4',
    sellerId: 'seller-5',
    sellerName: 'Smart Life',
    title: 'Đồng hồ thông minh Smartwatch',
    category: 'Electronics',
    price: 490000,
    stock: 22,
    photoUri: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&q=80',
    description: 'Đo nhịp tim, bước chân và nhận thông báo tin nhắn tiện lợi.',
    createdAt: new Date('2026-10-18T11:20:00Z').toISOString(),
  },
  {
    id: 'remote-e5',
    sellerId: 'seller-2',
    sellerName: 'Audio Box',
    title: 'Loa Bluetooth mini không dây',
    category: 'Electronics',
    price: 260000,
    stock: 30,
    photoUri: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=500&q=80',
    description: 'Kích thước nhỏ gọn bỏ balo, âm thanh trong trẻo, pin nghe 8 tiếng.',
    createdAt: new Date('2026-10-19T13:45:00Z').toISOString(),
  },

  // ==================== 3. NỘI THẤT (Furniture) ====================
  {
    id: 'remote-f1',
    sellerId: 'seller-4',
    sellerName: 'Nội Thất Tiện Ích',
    title: 'Bàn làm việc chân chữ A hiện đại',
    category: 'Furniture',
    price: 450000,
    stock: 40,
    photoUri: 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=500&q=80',
    description: 'Bàn làm việc chân chữ A chắc chắn, mặt bàn rộng rãi để máy tính và sách vở.',
    createdAt: new Date('2026-10-23T08:30:00Z').toISOString(),
  },
  {
    id: 'remote-f2',
    sellerId: 'seller-5',
    sellerName: 'Gia Dụng Phòng Trọ',
    title: 'Ghế sofa đơn thư giãn decor phòng',
    category: 'Furniture',
    price: 450000,
    stock: 12,
    photoUri: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=500&q=80',
    description: 'Ghế bọc vải nỉ êm ái, chân gỗ chắc chắn, phù hợp đọc sách thư giãn hoặc decor phòng.',
    createdAt: new Date('2026-10-23T09:40:00Z').toISOString(),
  },
  {
    id: 'remote-f3',
    sellerId: 'seller-3',
    sellerName: 'Decor Sinh Viên',
    title: 'Đèn cây đứng kim loại tối giản',
    category: 'Furniture',
    price: 165000,
    stock: 35,
    photoUri: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=500&q=80',
    description: 'Đèn sàn đứng góc phòng, chân sắt chắc chắn, phù hợp đọc sách hoặc decor không gian.',
    createdAt: new Date('2026-10-23T11:10:00Z').toISOString(),
  },
  {
    id: 'remote-f4',
    sellerId: 'seller-1',
    sellerName: 'Gỗ Tự Nhiên',
    title: 'Kệ sách gỗ mini 3 tầng để bàn',
    category: 'Furniture',
    price: 120000,
    stock: 28,
    photoUri: 'https://down-vn.img.susercontent.com/file/sg-11134202-821ft-mhax3nhkekne17',
    description: 'Kệ gỗ để bàn gọn gàng, chứa được nhiều sách vở và đồ dùng cá nhân.',
    createdAt: new Date('2026-10-23T14:00:00Z').toISOString(),
  },
  {
    id: 'remote-f5',
    sellerId: 'seller-4',
    sellerName: 'Decor Xinh',
    title: 'Gương soi toàn thân chân đứng',
    category: 'Furniture',
    price: 290000,
    stock: 16,
    photoUri: 'https://down-vn.img.susercontent.com/file/vn-11134207-7qukw-lk0najj38sn622_tn',
    description: 'Kính sắc nét, chân chống gập gọn tiện di chuyển trong phòng trọ.',
    createdAt: new Date('2026-10-23T16:30:00Z').toISOString(),
  },

  // ==================== 4. PHỤ KIỆN / SÁCH (Textbooks) ====================
  {
    id: 'remote-t1',
    sellerId: 'seller-2',
    sellerName: 'Balo Đẹp',
    title: 'Balo chống nước đựng laptop 15.6 inch',
    category: 'Textbooks',
    price: 260000,
    stock: 30,
    photoUri: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&q=80',
    description: 'Vải dù oxford chống thấm mưa, đệm quai êm ái giảm tải trọng vai.',
    createdAt: new Date('2026-10-21T11:00:00Z').toISOString(),
  },
  {
    id: 'remote-t2',
    sellerId: 'seller-3',
    sellerName: 'Văn Phòng Phẩm',
    title: 'Bình giữ nhiệt Inox 304 dung tích 800ml',
    category: 'Textbooks',
    price: 135000,
    stock: 40,
    photoUri: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=500&q=80',
    description: 'Giữ nhiệt nước nóng/lạnh lên tới 12 tiếng, inox 304 tiêu chuẩn.',
    createdAt: new Date('2026-10-22T09:10:00Z').toISOString(),
  },
  {
    id: 'remote-t3',
    sellerId: 'seller-1',
    sellerName: 'Book & Note',
    title: 'Sổ tay bìa da A5 kèm bút ghi chép',
    category: 'Textbooks',
    price: 65000,
    stock: 70,
    photoUri: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=500&q=80',
    description: 'Giấy chống lóa mắt màu kem, kẻ ô ngang tiêu chuẩn cho sinh viên ghi chép bài giảng.',
    createdAt: new Date('2026-10-22T14:25:00Z').toISOString(),
  },
  {
    id: 'remote-t4',
    sellerId: 'seller-5',
    sellerName: 'Kstore Edu',
    title: 'Máy tính Casio khoa học chính hãng',
    category: 'Textbooks',
    price: 380000,
    stock: 25,
    photoUri: 'https://images.unsplash.com/photo-1587145820266-a5951ee6f620?w=500&q=80',
    description: 'Đầy đủ chức năng tính toán ma trận, phương trình phục vụ thi cử các môn chuyên ngành.',
    createdAt: new Date('2026-10-22T16:00:00Z').toISOString(),
  },
  {
    id: 'remote-t5',
    sellerId: 'seller-4',
    sellerName: 'Art Pen',
    title: 'Bút gel mực đen viết êm tay',
    category: 'Textbooks',
    price: 45000,
    stock: 85,
    photoUri: 'https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?w=500&q=80',
    description: 'Ngòi bút 0.5mm êm mượt, mực mau khô không lem tay.',
    createdAt: new Date('2026-10-22T17:10:00Z').toISOString(),
  },

  // ==================== 5. KHÁC (Other) ====================
  {
    id: 'remote-o1',
    sellerId: 'seller-3',
    sellerName: 'Tạp Hóa Tiện Lợi',
    title: 'Ô dù tự động nhỏ gọn chống tia UV',
    category: 'Other',
    price: 110000,
    stock: 50,
    photoUri: 'https://image.uniqlo.com/UQ/ST3/AsianCommon/imagesgoods/486199/item/goods_09_486199_3x4.jpg?width=400',
    description: 'Bấm nút mở tự động 1 chạm tiện lợi, tráng phủ lớp chống nắng che mưa bền bỉ.',
    createdAt: new Date('2026-10-24T08:00:00Z').toISOString(),
  },
  {
    id: 'remote-o2',
    sellerId: 'seller-2',
    sellerName: 'Summer Breeze',
    title: 'Quạt mini để bàn sạc cổng USB',
    category: 'Other',
    price: 85000,
    stock: 45,
    photoUri: 'https://bizweb.dktcdn.net/100/386/494/products/quat-dien-mini-yoobao-f04-6400mah-903922.jpg?v=1784045067973',
    description: 'Gió mát 3 cấp độ, động cơ chạy êm không ồn, pin dung lượng cao dùng cả buổi.',
    createdAt: new Date('2026-10-24T09:30:00Z').toISOString(),
  },
  {
    id: 'remote-o3',
    sellerId: 'seller-1',
    sellerName: 'Túi Xinh Eco',
    title: 'Túi vải Canvas Tote Bag phong cách tối giản',
    category: 'Other',
    price: 75000,
    stock: 60,
    photoUri: 'https://cdn.hstatic.net/products/200000660979/z7260587105335_c0d831d40c9d8f9b7c3f905ec68543ea_910329ee90e64c4e9a67b004b9291d53.jpg',
    description: 'Vải bố canvas tự nhiên dày dặn, quai xách chắc chắn đựng vừa tập vở và laptop.',
    createdAt: new Date('2026-10-24T10:15:00Z').toISOString(),
  },
  {
    id: 'remote-o4',
    sellerId: 'seller-5',
    sellerName: 'Gia Dụng Bếp',
    title: 'Hộp cơm giữ nhiệt Inox văn phòng',
    category: 'Other',
    price: 175000,
    stock: 30,
    photoUri: 'https://socdo.cdn.vccloud.vn/uploads/hinh-anh/19-12-2024/imgl7776-copy-1734601091.jpg',
    description: 'Khay inox 304 không gỉ giữ nhiệt tốt, nắp đậy khít chống tràn nước canh ra ngoài.',
    createdAt: new Date('2026-10-24T11:45:00Z').toISOString(),
  },
  {
    id: 'remote-o5',
    sellerId: 'seller-4',
    sellerName: 'Quà Lưu Niệm',
    title: 'Móc treo chìa khóa kim loại đa năng',
    category: 'Other',
    price: 35000,
    stock: 90,
    photoUri: 'https://webgiadung.com/storage/webgiadungcom/2825/sfynfpx0.jpg',
    description: 'Móc chìa khóa bằng hợp kim chống rỉ sét, thiết kế tiện dụng gắn đai quần hoặc balo.',
    createdAt: new Date('2026-10-24T14:10:00Z').toISOString(),
  },
];

async function getStockDeltas(): Promise<Record<string, number>> {
  const raw = await AsyncStorage.getItem(STOCK_DELTAS_KEY);
  if (!raw) return {};
  try {
    return JSON.parse(raw) as Record<string, number>;
  } catch {
    return {};
  }
}

export async function deductStock(
  items: { listingId: string; quantity: number }[],
): Promise<void> {
  const deltas = await getStockDeltas();
  for (const item of items) {
    deltas[item.listingId] = (deltas[item.listingId] ?? 0) + item.quantity;
  }
  await AsyncStorage.setItem(STOCK_DELTAS_KEY, JSON.stringify(deltas));
}

async function readLocalListings(): Promise<Listing[]> {
  const raw = await AsyncStorage.getItem(LOCAL_LISTINGS_KEY);
  if (!raw) return [];
  try {
    const list = JSON.parse(raw) as Listing[];
    return list.filter((item) => item.title.trim().toLowerCase() !== 'test');
  } catch {
    return [];
  }
}

async function writeLocalListings(listings: Listing[]): Promise<void> {
  await AsyncStorage.setItem(LOCAL_LISTINGS_KEY, JSON.stringify(listings));
}

export async function cacheCatalogue(listings: Listing[]): Promise<void> {
  await AsyncStorage.setItem(
    CATALOGUE_CACHE_KEY,
    JSON.stringify({ listings, savedAt: new Date().toISOString() }),
  );
}

export async function readCatalogueCache(): Promise<{
  listings: Listing[];
  savedAt: string;
} | null> {
  const raw = await AsyncStorage.getItem(CATALOGUE_CACHE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as { listings: Listing[]; savedAt: string };
  } catch {
    return null;
  }
}

export type CatalogueResult = {
  listings: Listing[];
  fetchedAt: string;
  fromCache: boolean;
};

export async function fetchCatalogue(): Promise<CatalogueResult> {

  const deltas = await getStockDeltas();

  // 1. Trừ tồn kho cho sản phẩm mẫu từ xa
  const remote: Listing[] = SEED_PRODUCTS.map((p) => {
    const delta = deltas[p.id] ?? 0;
    return {
      ...p,
      stock: Math.max(0, p.stock - delta),
    };
  });

  const rawLocal = await readLocalListings();
  const local: Listing[] = rawLocal.map((p) => {
  const delta = deltas[p.id] ?? 0;
    return {
      ...p,
      stock: Math.max(0, p.stock - delta),
    };
  });

  const listings = [...local, ...remote];
  const fetchedAt = new Date().toISOString();
  await cacheCatalogue(listings);
  return { listings, fetchedAt, fromCache: false };
}

export async function getListingById(id: string): Promise<Listing | null> {
  const deltas = await getStockDeltas();
  const delta = deltas[id] ?? 0;

  if (id.startsWith('remote-')) {
    const item = SEED_PRODUCTS.find((p) => p.id === id);
    if (!item) return null;
    return {
      ...item,
      stock: Math.max(0, item.stock - delta),
    };
  }

  const local = await readLocalListings();
  const found = local.find((l) => l.id === id) ?? null;
  if (!found) return null;

  return {
    ...found,
    stock: Math.max(0, found.stock - delta),
  };
}

export async function createListing(input: CreateListingInput): Promise<Listing> {
  const listing: Listing = {
    id: `local-${Date.now()}`,
    sellerId: input.sellerId,
    sellerName: input.sellerName,
    title: input.title.trim(),
    category: input.category,
    price: input.price,
    stock: input.stock,
    photoUri: input.photoUri,
    description: input.description.trim(),
    createdAt: new Date().toISOString(),
  };

  // 1. Đọc danh sách hiện tại và thêm món mới lên đầu
  const local = await readLocalListings();
  const next = [listing, ...local.filter((l) => l.id !== listing.id)];
  await writeLocalListings(next);

  // 2. Ép cập nhật lại toàn bộ Catalogue Cache ngay lập tức
  const deltas = await getStockDeltas();
  const remote: Listing[] = SEED_PRODUCTS.map((p) => {
    const delta = deltas[p.id] ?? 0;
    return {
      ...p,
      stock: Math.max(0, p.stock - delta),
    };
  });
  const fullCatalogue = [...next, ...remote];
  await cacheCatalogue(fullCatalogue);

  return listing;
}