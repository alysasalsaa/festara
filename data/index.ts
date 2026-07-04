// ============ TYPES ============
export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice: number;
  discount: number;
  image: string;
  images: string[];
  rating: number;
  sold: number;
  stock: number;
  category: string;
  storeId: string;
  storeName: string;
  location: string;
  description: string;
  specs: Record<string, string>;
  isFlashSale?: boolean;
  flashSaleEnd?: string;
  tags: string[];
}

export interface Store {
  id: string;
  name: string;
  logo: string;
  cover: string;
  rating: number;
  totalSales: number;
  totalProducts: number;
  location: string;
  description: string;
  joinDate: string;
  responseRate: number;
  responseTime: string;
  isVerified: boolean;
  followers: number;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
  productCount: number;
}

export interface Review {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  userAvatar: string;
  rating: number;
  comment: string;
  date: string;
  images?: string[];
}

export interface Order {
  id: string;
  date: string;
  status: "pending" | "paid" | "processing" | "shipped" | "delivered" | "cancelled";
  total: number;
  items: { productId: string; name: string; qty: number; price: number; image: string }[];
  storeName: string;
  trackingNumber?: string;
}

export interface Notification {
  id: string;
  type: "order" | "promo" | "chat" | "system";
  title: string;
  message: string;
  date: string;
  isRead: boolean;
  icon?: string;
}

// ============ CATEGORIES ============
export const categories: Category[] = [
  { id: "wedding-organizer", name: "Wedding Organizer", icon: "", color: "#1CABB4", productCount: 128 },
  { id: "event-organizer", name: "Event Organizer", icon: "", color: "#F59E0B", productCount: 94 },
  { id: "photographer", name: "Fotografer", icon: "", color: "#6366F1", productCount: 213 },
  { id: "venue", name: "Venue", icon: "", color: "#22C55E", productCount: 76 },
  { id: "dekorasi", name: "Dekorasi", icon: "", color: "#EC4899", productCount: 155 },
  { id: "merchandise-wisuda", name: "Merchandise Wisuda", icon: "", color: "#A855F7", productCount: 189 },
  { id: "catering", name: "Catering", icon: "", color: "#F97316", productCount: 112 },
];

// ============ STORES ============
export const stores: Store[] = [
  {
    id: "store-1",
    name: "TechNusa Official",
    logo: "https://api.dicebear.com/7.x/shapes/svg?seed=technusa&backgroundColor=1CABB4",
    cover: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&h=300&fit=crop",
    rating: 4.9,
    totalSales: 12430,
    totalProducts: 89,
    location: "Jakarta Pusat",
    description: "Toko elektronik terpercaya dengan produk original bergaransi resmi.",
    joinDate: "Jan 2020",
    responseRate: 98,
    responseTime: "< 1 jam",
    isVerified: true,
    followers: 45200,
  },
  {
    id: "store-2",
    name: "Batik Nusantara",
    logo: "https://api.dicebear.com/7.x/shapes/svg?seed=batiknusantara&backgroundColor=EC4899",
    cover: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&h=300&fit=crop",
    rating: 4.8,
    totalSales: 8920,
    totalProducts: 156,
    location: "Yogyakarta",
    description: "Koleksi batik premium dari pengrajin lokal terbaik Indonesia.",
    joinDate: "Mar 2019",
    responseRate: 95,
    responseTime: "< 2 jam",
    isVerified: true,
    followers: 32100,
  },
  {
    id: "store-3",
    name: "DapurIbu Kitchen",
    logo: "https://api.dicebear.com/7.x/shapes/svg?seed=dapuribu&backgroundColor=22C55E",
    cover: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1200&h=300&fit=crop",
    rating: 4.7,
    totalSales: 5640,
    totalProducts: 64,
    location: "Surabaya",
    description: "Peralatan dapur berkualitas untuk memasak lebih nyaman.",
    joinDate: "Jun 2021",
    responseRate: 92,
    responseTime: "< 3 jam",
    isVerified: false,
    followers: 18700,
  },
];

// ============ PRODUCTS ============
export const products: Product[] = [
  {
    id: "prod-1",
    name: "Wireless Earbuds Pro X5 — Noise Cancelling Bluetooth 5.3",
    price: 299000,
    originalPrice: 499000,
    discount: 40,
    image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&h=600&fit=crop",
      "https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=600&h=600&fit=crop",
      "https://images.unsplash.com/photo-1572536147248-ac59a8abfa4b?w=600&h=600&fit=crop",
    ],
    rating: 4.8,
    sold: 3240,
    stock: 120,
    category: "electronics",
    storeId: "store-1",
    storeName: "TechNusa Official",
    location: "Jakarta Pusat",
    description: "Nikmati kualitas suara premium dengan Wireless Earbuds Pro X5. Dilengkapi teknologi Active Noise Cancelling terbaru yang memblokir kebisingan hingga 35dB. Baterai tahan 8 jam + 24 jam dengan case charging.",
    specs: { "Konektivitas": "Bluetooth 5.3", "Garansi": "1 Tahun Resmi", "Baterai": "8 + 24 jam", "Driver": "10mm Dynamic", "IPX": "IPX5 Water Resistant" },
    isFlashSale: true,
    flashSaleEnd: "2025-07-01T23:59:59",
    tags: ["earbuds", "wireless", "bluetooth", "noise-cancelling"],
  },
  {
    id: "prod-2",
    name: "Batik Tulis Motif Parang Premium — Kain Sutra Asli",
    price: 850000,
    originalPrice: 1200000,
    discount: 29,
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=600&fit=crop",
      "https://images.unsplash.com/photo-1594938298603-c8148c4b4d51?w=600&h=600&fit=crop",
    ],
    rating: 4.9,
    sold: 891,
    stock: 45,
    category: "fashion",
    storeId: "store-2",
    storeName: "Batik Nusantara",
    location: "Yogyakarta",
    description: "Batik tulis premium dengan motif Parang klasik yang dibuat oleh pengrajin batik berpengalaman dari Yogyakarta. Menggunakan kain sutra asli yang lembut dan nyaman.",
    specs: { "Bahan": "Sutra Asli", "Teknik": "Batik Tulis", "Motif": "Parang", "Ukuran": "200cm x 110cm", "Asal": "Yogyakarta" },
    tags: ["batik", "fashion", "premium", "sutra"],
  },
  {
    id: "prod-3",
    name: "Smartwatch Series 8 AMOLED — Health Monitor GPS",
    price: 1299000,
    originalPrice: 1899000,
    discount: 32,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&h=600&fit=crop",
      "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=600&h=600&fit=crop",
    ],
    rating: 4.7,
    sold: 2150,
    stock: 78,
    category: "electronics",
    storeId: "store-1",
    storeName: "TechNusa Official",
    location: "Jakarta Pusat",
    description: "Smartwatch premium dengan layar AMOLED 1.9 inci yang jernih. Dilengkapi monitor kesehatan lengkap: detak jantung, saturasi oksigen, kualitas tidur, dan GPS built-in.",
    specs: { "Layar": "AMOLED 1.9\"", "GPS": "Built-in", "Baterai": "7 hari", "Water Resistant": "5ATM", "OS": "WearOS" },
    isFlashSale: true,
    flashSaleEnd: "2025-07-01T23:59:59",
    tags: ["smartwatch", "wearable", "gps", "health"],
  },
  {
    id: "prod-4",
    name: "Set Peralatan Masak Premium 8-in-1 Anti Lengket",
    price: 459000,
    originalPrice: 650000,
    discount: 29,
    image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&h=600&fit=crop",
    ],
    rating: 4.6,
    sold: 1432,
    stock: 200,
    category: "home",
    storeId: "store-3",
    storeName: "DapurIbu Kitchen",
    location: "Surabaya",
    description: "Set peralatan memasak lengkap 8 buah dengan lapisan anti lengket premium. Cocok untuk kompor gas dan induksi. Material food grade stainless steel.",
    specs: { "Isi": "8 pcs", "Material": "Stainless Steel + Non-stick", "Kompatibel": "Gas & Induksi", "Garansi": "2 Tahun" },
    tags: ["dapur", "masak", "anti-lengket", "set"],
  },
  {
    id: "prod-5",
    name: "Serum Vitamin C 20% Brightening + Hyaluronic Acid",
    price: 189000,
    originalPrice: 289000,
    discount: 35,
    image: "https://images.unsplash.com/photo-1570194065650-d99fb4b38bf9?w=400&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1570194065650-d99fb4b38bf9?w=600&h=600&fit=crop",
    ],
    rating: 4.8,
    sold: 5621,
    stock: 300,
    category: "beauty",
    storeId: "store-2",
    storeName: "Batik Nusantara",
    location: "Yogyakarta",
    description: "Serum wajah dengan kandungan Vitamin C 20% murni yang membantu mencerahkan kulit kusam, meratakan warna kulit, dan memudarkan noda hitam dalam 4 minggu.",
    specs: { "Kandungan": "Vitamin C 20% + HA", "Volume": "30ml", "BPOM": "NA18231000123", "Cocok untuk": "Semua jenis kulit" },
    isFlashSale: true,
    flashSaleEnd: "2025-07-01T23:59:59",
    tags: ["skincare", "serum", "vitamin c", "brightening"],
  },
  {
    id: "prod-6",
    name: "Laptop Gaming ROG Zephyrus — RTX 4070 16GB RAM",
    price: 18999000,
    originalPrice: 22500000,
    discount: 16,
    image: "https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=400&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=600&h=600&fit=crop",
      "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600&h=600&fit=crop",
    ],
    rating: 4.9,
    sold: 342,
    stock: 15,
    category: "electronics",
    storeId: "store-1",
    storeName: "TechNusa Official",
    location: "Jakarta Pusat",
    description: "Laptop gaming terpopuler 2024. Ditenagai AMD Ryzen 9 + NVIDIA RTX 4070 untuk performa gaming dan creative work tanpa kompromi.",
    specs: { "CPU": "AMD Ryzen 9 7945HX", "GPU": "RTX 4070 8GB", "RAM": "16GB DDR5", "Storage": "1TB NVMe SSD", "Layar": "16\" QHD 165Hz" },
    tags: ["laptop", "gaming", "rtx", "rog"],
  },
  {
    id: "prod-7",
    name: "Kopi Arabika Specialty Aceh Gayo 500gr",
    price: 85000,
    originalPrice: 110000,
    discount: 23,
    image: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=600&h=600&fit=crop",
    ],
    rating: 4.9,
    sold: 8920,
    stock: 500,
    category: "food",
    storeId: "store-3",
    storeName: "DapurIbu Kitchen",
    location: "Surabaya",
    description: "Kopi Arabika single origin dari dataran tinggi Gayo, Aceh. Dipanen secara natural dengan profil rasa: floral, fruity, medium acidity.",
    specs: { "Jenis": "Arabika", "Asal": "Aceh Gayo", "Proses": "Natural", "Roast": "Medium", "Berat": "500gr" },
    tags: ["kopi", "arabika", "gayo", "specialty"],
  },
  {
    id: "prod-8",
    name: "Lampu LED Aesthetic Fairy Lights 10 Meter — USB Powered",
    price: 45000,
    originalPrice: 75000,
    discount: 40,
    image: "https://images.unsplash.com/photo-1545486332-9e0999c535b2?w=400&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1545486332-9e0999c535b2?w=600&h=600&fit=crop",
    ],
    rating: 4.5,
    sold: 12300,
    stock: 850,
    category: "home",
    storeId: "store-3",
    storeName: "DapurIbu Kitchen",
    location: "Surabaya",
    description: "Lampu fairy aesthetic dengan 100 titik cahaya hangat. Cocok untuk dekorasi kamar, kafe, dan event. Powered USB dengan controller 8 mode.",
    specs: { "Panjang": "10 meter", "Jumlah LED": "100 titik", "Power": "USB 5V", "Mode": "8 mode", "Warna": "Warm White" },
    isFlashSale: true,
    tags: ["lampu", "dekorasi", "aesthetic", "led"],
  },
];

// ============ REVIEWS ============
export const reviews: Review[] = [
  {
    id: "rev-1",
    productId: "prod-1",
    userId: "user-1",
    userName: "Rina Wijaya",
    userAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=rina",
    rating: 5,
    comment: "Kualitas suara sangat bagus! Noise cancelling benar-benar terasa. Pengiriman cepat juga, 2 hari sudah sampai. Recommended banget!",
    date: "2025-06-20",
  },
  {
    id: "rev-2",
    productId: "prod-1",
    userId: "user-2",
    userName: "Budi Santoso",
    userAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=budi",
    rating: 4,
    comment: "Earbuds sudah oke, bass cukup deep. Tapi case-nya agak susah dibuka pertama kali. Overall happy dengan pembelian ini.",
    date: "2025-06-18",
  },
  {
    id: "rev-3",
    productId: "prod-3",
    userId: "user-3",
    userName: "Sari Dewi",
    userAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=sari",
    rating: 5,
    comment: "Layar AMOLED-nya keren banget! Health tracking akurat sesuai alat profesional. Worth it!",
    date: "2025-06-15",
  },
];

// ============ ORDERS ============
export const orders: Order[] = [
  {
    id: "ORD-2025-001234",
    date: "2025-06-25",
    status: "delivered",
    total: 299000,
    items: [{ productId: "prod-1", name: "Wireless Earbuds Pro X5", qty: 1, price: 299000, image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=100&h=100&fit=crop" }],
    storeName: "TechNusa Official",
    trackingNumber: "JNE892312312",
  },
  {
    id: "ORD-2025-001198",
    date: "2025-06-20",
    status: "shipped",
    total: 1299000,
    items: [{ productId: "prod-3", name: "Smartwatch Series 8 AMOLED", qty: 1, price: 1299000, image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100&h=100&fit=crop" }],
    storeName: "TechNusa Official",
    trackingNumber: "SICEPAT123456",
  },
  {
    id: "ORD-2025-001050",
    date: "2025-06-10",
    status: "processing",
    total: 459000,
    items: [{ productId: "prod-4", name: "Set Peralatan Masak 8-in-1", qty: 1, price: 459000, image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=100&h=100&fit=crop" }],
    storeName: "DapurIbu Kitchen",
  },
  {
    id: "ORD-2025-000912",
    date: "2025-05-28",
    status: "cancelled",
    total: 850000,
    items: [{ productId: "prod-2", name: "Batik Tulis Motif Parang Premium", qty: 1, price: 850000, image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=100&h=100&fit=crop" }],
    storeName: "Batik Nusantara",
  },
];

// ============ NOTIFICATIONS ============
export const notifications: Notification[] = [
  { id: "notif-1", type: "order", title: "Pesanan Dikirim!", message: "Pesanan ORD-2025-001198 sedang dalam perjalanan ke alamatmu.", date: "2025-06-22", isRead: false },
  { id: "notif-2", type: "promo", title: "Flash Sale Hari Ini!", message: "Diskon hingga 60% untuk produk elektronik pilihan. Jangan sampai kehabisan!", date: "2025-06-21", isRead: false },
  { id: "notif-3", type: "chat", title: "Pesan baru dari TechNusa Official", message: "Halo kak, barang sudah kami proses dan akan segera dikirim!", date: "2025-06-20", isRead: true },
  { id: "notif-4", type: "order", title: "Pesanan Berhasil Diterima", message: "Pesanan ORD-2025-001234 telah diterima. Jangan lupa beri ulasan ya!", date: "2025-06-18", isRead: true },
  { id: "notif-5", type: "promo", title: "Voucher Spesial Untukmu 🎁", message: "Kamu mendapat voucher diskon Rp50.000 untuk pembelian berikutnya.", date: "2025-06-15", isRead: true },
];

// ============ BANNERS ============
export const banners = [
  {
    id: 1,
    title: "Flash Sale Elektronik",
    subtitle: "Diskon hingga 60% — Hanya hari ini!",
    cta: "Belanja Sekarang",
    bg: "from-[#1CABB4] to-[#178E96]",
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&h=400&fit=crop",
    badge: "FLASH SALE",
  },
  {
    id: 2,
    title: "Koleksi Batik Premium",
    subtitle: "Warisan budaya dengan sentuhan modern",
    cta: "Lihat Koleksi",
    bg: "from-[#EC4899] to-[#BE185D]",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=400&fit=crop",
    badge: "NEW ARRIVAL",
  },
  {
    id: 3,
    title: "Produk Lokal Terbaik",
    subtitle: "Bangga pakai produk Indonesia berkualitas",
    cta: "Temukan Produk",
    bg: "from-[#22C55E] to-[#15803D]",
    image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&h=400&fit=crop",
    badge: "PRODUK LOKAL",
  },
];

// ============ MESSAGES ============
export const chatMessages = [
  { id: 1, from: "seller", text: "Halo kak! Ada yang bisa saya bantu? 😊", time: "10:00" },
  { id: 2, from: "buyer", text: "Halo, produk earbuds yang ini masih ready stok?", time: "10:02" },
  { id: 3, from: "seller", text: "Ready kak! Stok masih banyak. Mau warna apa? Ada hitam, putih, dan biru 🎧", time: "10:03" },
  { id: 4, from: "buyer", text: "Yang hitam ada? Ongkir ke Bandung berapa ya?", time: "10:05" },
  { id: 5, from: "seller", text: "Ada kak! Warna hitam tersedia. Untuk ongkir ke Bandung sekitar Rp15.000 - Rp25.000 tergantung ekspedisi 📦", time: "10:06" },
  { id: 6, from: "buyer", text: "Ok siap, saya mau pesan 2 ya", time: "10:08" },
  { id: 7, from: "seller", text: "Siap kak! Langsung add to cart dan checkout ya. Kalau ada kendala bisa chat lagi 🙏", time: "10:08" },
];

// ============ SELLER STATS ============
export const sellerStats = {
  totalRevenue: 48920000,
  totalOrders: 342,
  totalProducts: 89,
  totalCustomers: 287,
  revenueChart: [
    { month: "Jan", revenue: 3200000 },
    { month: "Feb", revenue: 4100000 },
    { month: "Mar", revenue: 3800000 },
    { month: "Apr", revenue: 5200000 },
    { month: "Mei", revenue: 6800000 },
    { month: "Jun", revenue: 7400000 },
  ],
  categoryChart: [
    { name: "Elektronik", value: 45 },
    { name: "Fashion", value: 25 },
    { name: "Rumah", value: 15 },
    { name: "Lainnya", value: 15 },
  ],
  recentOrders: [
  { id: "FST-2026-0342", product: "Paket Silver — Lavinia Wedding Fotografer", buyer: "Dewi Santika", amount: 5500000, status: "delivered", date: "28 Jun 2026" },
  { id: "FST-2026-0341", product: "Paket Premium — Lavinia Wedding Fotografer", buyer: "Budi Prasetyo", amount: 9000000, status: "shipped", date: "25 Jun 2026" },
  { id: "FST-2026-0340", product: "Paket Basic — Lavinia Wedding Fotografer", buyer: "Anita Lestari", amount: 3500000, status: "processing", date: "22 Jun 2026" },
  { id: "FST-2026-0339", product: "Paket Silver — Lavinia Wedding Fotografer", buyer: "Rizky Firmansyah", amount: 5500000, status: "processing", date: "20 Jun 2026" },
  { id: "FST-2026-0338", product: "Paket Premium — Lavinia Wedding Fotografer", buyer: "Mega Wulandari", amount: 9000000, status: "delivered", date: "15 Jun 2026" },
  ],
};

// ============ TESTIMONIALS ============
export const testimonials = [
  { id: 1, name: "Dewi Rahayu", role: "Pelanggan Setia", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=dewi", rating: 5, comment: "Pasar Nusantara jadi andalan belanja online saya. Produk original, pengiriman cepat, dan seller sangat responsif!" },
  { id: 2, name: "Ahmad Fauzi", role: "Penjual Aktif", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=ahmad", rating: 5, comment: "Dashboard seller-nya lengkap banget. Mudah kelola produk dan pantau penjualan. Omzet naik 3x sejak jualan di sini!" },
  { id: 3, name: "Siti Nurhaliza", role: "Pelanggan Baru", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=siti", rating: 5, comment: "Pertama kali belanja langsung berkesan. QRIS payment-nya mudah banget. Barang datang sesuai foto dan deskripsi." },
];

// Helper
export const formatPrice = (price: number) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(price);

export const formatNumber = (n: number) =>
  n >= 1000 ? `${(n / 1000).toFixed(1)}k` : n.toString();

// ============ VENDOR TYPE ============
export interface Vendor {
  id: string;
  name: string;
  category: string;
  categoryLabel: string;
  location: string;
  price: number;
  rating: number;
  reviewCount: number;
  image: string;
  logo: string;
  isVerified: boolean;
  tags: string[];
  description: string;
}

export const vendors: Vendor[] = [
  {
    id: "v1", name: "Lavinia Wedding Fotografer", category: "photographer",
    categoryLabel: "Photographer", location: "Yogyakarta",
    price: 3500000, rating: 4.9, reviewCount: 128,
    image: "https://images.unsplash.com/photo-1519741497674-611481863552?w=600&h=400&fit=crop",
    logo: "https://api.dicebear.com/7.x/shapes/svg?seed=lavinia&backgroundColor=1CABB4",
    isVerified: true, tags: ["Prewedding", "Wedding", "Outdoor"],
    description: "Spesialis foto pernikahan dengan gaya natural dan elegan."
  },
  {
    id: "v2", name: "Memoir Studio", category: "photographer",
    categoryLabel: "Photographer", location: "Jakarta",
    price: 5000000, rating: 4.8, reviewCount: 95,
    image: "https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=600&h=400&fit=crop",
    logo: "https://api.dicebear.com/7.x/shapes/svg?seed=memoir&backgroundColor=6366F1",
    isVerified: true, tags: ["Cinematic", "Indoor", "Prewedding"],
    description: "Studio foto profesional dengan konsep sinematik modern."
  },
  {
    id: "v3", name: "PhotoMoment Jogja", category: "photographer",
    categoryLabel: "Photographer", location: "Yogyakarta",
    price: 2800000, rating: 4.7, reviewCount: 74,
    image: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=600&h=400&fit=crop",
    logo: "https://api.dicebear.com/7.x/shapes/svg?seed=photomoment&backgroundColor=F59E0B",
    isVerified: false, tags: ["Dokumentasi", "Wedding", "Budget Friendly"],
    description: "Dokumentasi pernikahan terjangkau tanpa mengorbankan kualitas."
  },
  {
    id: "v4", name: "Elegant WO Jogja", category: "wedding-organizer",
    categoryLabel: "Wedding Organizer", location: "Yogyakarta",
    price: 15000000, rating: 4.9, reviewCount: 210,
    image: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=600&h=400&fit=crop",
    logo: "https://api.dicebear.com/7.x/shapes/svg?seed=elegant&backgroundColor=EC4899",
    isVerified: true, tags: ["Full Service", "Adat Jawa", "Premium"],
    description: "Wedding organizer terpercaya dengan pengalaman lebih dari 10 tahun."
  },
  {
    id: "v5", name: "Sakura Event Organizer", category: "event-organizer",
    categoryLabel: "Event Organizer", location: "Semarang",
    price: 8000000, rating: 4.8, reviewCount: 163,
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&h=400&fit=crop",
    logo: "https://api.dicebear.com/7.x/shapes/svg?seed=sakura&backgroundColor=22C55E",
    isVerified: true, tags: ["Corporate", "Seminar", "Gathering"],
    description: "Spesialis event perusahaan dan gathering eksklusif."
  },
  {
    id: "v6", name: "The Royal Ballroom", category: "venue",
    categoryLabel: "Venue", location: "Jakarta",
    price: 25000000, rating: 4.9, reviewCount: 88,
    image: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=600&h=400&fit=crop",
    logo: "https://api.dicebear.com/7.x/shapes/svg?seed=royal&backgroundColor=A855F7",
    isVerified: true, tags: ["Ballroom", "Kapasitas 500", "Mewah"],
    description: "Venue mewah dengan kapasitas hingga 500 tamu undangan."
  },
  {
    id: "v7", name: "Bloom Decoration Studio", category: "dekorasi",
    categoryLabel: "Dekorasi", location: "Bandung",
    price: 6000000, rating: 4.7, reviewCount: 142,
    image: "https://images.unsplash.com/photo-1478146059778-26028b07395a?w=600&h=400&fit=crop",
    logo: "https://api.dicebear.com/7.x/shapes/svg?seed=bloom&backgroundColor=EC4899",
    isVerified: true, tags: ["Floral", "Modern", "Rustic"],
    description: "Dekorasi pernikahan bertema floral dan modern yang memukau."
  },
  {
    id: "v8", name: "Glam by Sari", category: "mua",
    categoryLabel: "Makeup Artist", location: "Yogyakarta",
    price: 1500000, rating: 4.9, reviewCount: 317,
    image: "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=600&h=400&fit=crop",
    logo: "https://api.dicebear.com/7.x/shapes/svg?seed=glam&backgroundColor=A855F7",
    isVerified: true, tags: ["Bridal", "Natural", "Tahan Lama"],
    description: "MUA profesional spesialis makeup bridal natural dan elegan."
  },
  {
    id: "v9", name: "Aura Makeup Studio", category: "mua",
    categoryLabel: "Makeup Artist", location: "Jakarta",
    price: 2500000, rating: 4.8, reviewCount: 198,
    image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600&h=400&fit=crop",
    logo: "https://api.dicebear.com/7.x/shapes/svg?seed=aura&backgroundColor=1CABB4",
    isVerified: true, tags: ["HD Makeup", "Airbrush", "Premium"],
    description: "Studio makeup premium dengan teknik airbrush terkini."
  },
];
