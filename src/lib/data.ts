 const iphone = "/iphone-new.png";
import airpods from "@/assets/product-airpods.jpg";
import headphones from "@/assets/product-headphones.png";
import tv from "@/assets/product-tv.png";
import ps5 from "@/assets/product-ps5.png";
import macbook from "@/assets/product-macbook.jpg";
import watch from "@/assets/product-watch.jpg";

export type Product = {
  id: string;
  name: { en: string; ar: string };
  brand: string;
  price: number;
  originalPrice?: number;
  image: string;
  rating: number;
  reviews: number;
  delivery: "today" | "tomorrow";
  stock: number;
  warranty?: "official" | "manufacturer" | "2-year" | "1-year";
  topSeller?: boolean;
  installments?: boolean;
  category: string;
  variants?: { colors?: string[]; storage?: string[] };
};

export const products: Product[] = [
  {
    id: "p1",
    name: { en: "iPhone 15 Pro Max 256GB Titanium", ar: "آيفون 15 برو ماكس 256 جيجا تيتانيوم" },
    brand: "Apple", price: 4799, originalPrice: 5299, image: iphone,
    rating: 4.8, reviews: 1248, delivery: "today", stock: 12, warranty: "official",
    topSeller: true, installments: true, category: "smartphones",
    variants: { colors: ["#8E8E93", "#1F2937", "#FFD7B5", "#3C3F44"], storage: ["128GB", "256GB", "512GB", "1TB"] },
  },
  {
    id: "p2",
    name: { en: "AirPods Pro (2nd Generation)", ar: "إيربودز برو الجيل الثاني" },
    brand: "Apple", price: 899, originalPrice: 1099, image: "/2587eac4-c062-41ae-9bf6-2a458c15b127.png",
    rating: 4.7, reviews: 892, delivery: "today", stock: 2, warranty: "1-year",
    installments: true, category: "headphones",
  },
  {
    id: "p3",
    name: { en: "Sony WH-1000XM5 Wireless Headphones", ar: "سماعات سوني WH-1000XM5 لاسلكية" },
    brand: "Sony", price: 1499, originalPrice: 1799, image: headphones,
    rating: 4.9, reviews: 521, delivery: "tomorrow", stock: 8, warranty: "2-year",
    installments: true, category: "headphones",
  },
  {
    id: "p4",
    name: { en: "Samsung 65\" QLED 4K Smart TV", ar: "تلفاز سامسونج 65 بوصة QLED 4K" },
    brand: "Samsung", price: 3499, originalPrice: 4299, image: tv,
    rating: 4.6, reviews: 314, delivery: "tomorrow", stock: 5, warranty: "2-year",
    installments: true, category: "tvs",
  },
  {
    id: "p5",
    name: { en: "PlayStation 5 Slim Console", ar: "بلايستيشن 5 سليم" },
    brand: "Sony", price: 1999, originalPrice: 2299, image: ps5,
    rating: 4.9, reviews: 2104, delivery: "today", stock: 0, warranty: "1-year",
    topSeller: true, category: "gaming",
  },
  {
    id: "p6",
    name: { en: "MacBook Pro 14\" M3 Pro 512GB", ar: "ماك بوك برو 14 M3 برو 512 جيجا" },
    brand: "Apple", price: 9499, originalPrice: 9999, image: macbook,
    rating: 4.9, reviews: 187, delivery: "tomorrow", stock: 3, warranty: "official",
    installments: true, category: "laptops",
  },
  {
    id: "p7",
    name: { en: "Apple Watch Series 9 GPS 45mm", ar: "آبل واتش سيريز 9 GPS 45 مم" },
    brand: "Apple", price: 1799, originalPrice: 1999, image: watch,
    rating: 4.7, reviews: 643, delivery: "today", stock: 14, warranty: "1-year",
    installments: true, category: "wearables",
  },
];

export const categories = [
  { id: "smartphones", en: "Smartphones", ar: "هواتف", icon: "📱" },
  { id: "laptops", en: "Laptops", ar: "لابتوبات", icon: "💻" },
  { id: "headphones", en: "Headphones", ar: "سماعات", icon: "🎧" },
  { id: "tvs", en: "TVs", ar: "تلفاز", icon: "📺" },
  { id: "gaming", en: "Gaming", ar: "ألعاب", icon: "🎮" },
  { id: "wearables", en: "Wearables", ar: "أجهزة قابلة للارتداء", icon: "⌚" },
  { id: "smarthome", en: "Smart Home", ar: "المنزل الذكي", icon: "🏠" },
  { id: "accessories", en: "Accessories", ar: "إكسسوارات", icon: "🔌" },
];

export const brands = ["Apple", "Samsung", "Sony", "HP", "Dell", "Lenovo", "Xiaomi", "Huawei"];

export const getProduct = (id: string) => products.find(p => p.id === id);
