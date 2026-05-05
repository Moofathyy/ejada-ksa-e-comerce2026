import { createContext, useContext, useEffect, useState, ReactNode, useCallback, useMemo } from "react";

export interface Merchant {
  id: string;
  ownerName: string;
  email: string;
  phone: string;
  businessName: string;
  crNumber: string;
  category: string;
  city: string;
  logo?: string;
  createdAt: number;
}

export interface MerchantProduct {
  id: string;
  merchantId: string;
  name: string;
  nameAr?: string;
  brand: string;
  category: string;
  price: number;
  originalPrice?: number;
  stock: number;
  image: string;
  description?: string;
  status: "active" | "draft" | "out_of_stock";
  createdAt: number;
}

export type OrderStatus = "new" | "accepted" | "shipped" | "delivered" | "cancelled";

export interface MerchantOrder {
  id: string;
  merchantId: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  city: string;
  items: { productId: string; name: string; qty: number; price: number; image?: string }[];
  total: number;
  status: OrderStatus;
  createdAt: number;
  updatedAt: number;
}

interface MerchantCtx {
  merchant: Merchant | null;
  signInMerchant: (m: Merchant) => void;
  signOutMerchant: () => void;
  updateMerchant: (patch: Partial<Merchant>) => void;
  products: MerchantProduct[];
  addProduct: (p: Omit<MerchantProduct, "id" | "merchantId" | "createdAt">) => MerchantProduct;
  updateProduct: (id: string, patch: Partial<MerchantProduct>) => void;
  deleteProduct: (id: string) => void;
  orders: MerchantOrder[];
  setOrderStatus: (id: string, status: OrderStatus) => void;
}

const Ctx = createContext<MerchantCtx | null>(null);

const KEY_M = "ejada_merchant";
const KEY_P = "ejada_merchant_products";
const KEY_O = "ejada_merchant_orders";

const seedProducts = (merchantId: string): MerchantProduct[] => [
  {
    id: "mp1", merchantId, name: "Wireless Earbuds Pro", nameAr: "سماعات لاسلكية برو",
    brand: "SoundMax", category: "headphones", price: 349, originalPrice: 499, stock: 28,
    image: "/lovable-uploads/a684ad16-cb41-4933-a549-fafe21ea49c7.png",
    status: "active", createdAt: Date.now() - 86400000 * 5,
    description: "Premium ANC wireless earbuds.",
  },
  {
    id: "mp2", merchantId, name: "Smart Watch Series X", nameAr: "ساعة ذكية سيريز X",
    brand: "TechWear", category: "wearables", price: 799, stock: 12,
    image: "/placeholder.svg", status: "active", createdAt: Date.now() - 86400000 * 10,
  },
  {
    id: "mp3", merchantId, name: "USB-C Fast Charger 65W", nameAr: "شاحن سريع 65 واط",
    brand: "PowerUp", category: "accessories", price: 89, stock: 0,
    image: "/placeholder.svg", status: "out_of_stock", createdAt: Date.now() - 86400000 * 2,
  },
];

const seedOrders = (merchantId: string): MerchantOrder[] => {
  const now = Date.now();
  return [
    {
      id: "mo1", merchantId, orderNumber: "EJ-10342", customerName: "Sarah Al-Nemri",
      customerPhone: "+966501234567", city: "Riyadh",
      items: [{ productId: "mp1", name: "Wireless Earbuds Pro", qty: 1, price: 349 }],
      total: 349, status: "new", createdAt: now - 3600000, updatedAt: now - 3600000,
    },
    {
      id: "mo2", merchantId, orderNumber: "EJ-10338", customerName: "Ahmed Al-Otaibi",
      customerPhone: "+966555678901", city: "Jeddah",
      items: [{ productId: "mp2", name: "Smart Watch Series X", qty: 2, price: 799 }],
      total: 1598, status: "accepted", createdAt: now - 86400000, updatedAt: now - 7200000,
    },
    {
      id: "mo3", merchantId, orderNumber: "EJ-10311", customerName: "Fatima Al-Harbi",
      customerPhone: "+966533344455", city: "Dammam",
      items: [{ productId: "mp1", name: "Wireless Earbuds Pro", qty: 1, price: 349 }],
      total: 349, status: "shipped", createdAt: now - 86400000 * 2, updatedAt: now - 86400000,
    },
    {
      id: "mo4", merchantId, orderNumber: "EJ-10250", customerName: "Khalid Al-Qahtani",
      customerPhone: "+966512223344", city: "Riyadh",
      items: [{ productId: "mp2", name: "Smart Watch Series X", qty: 1, price: 799 }],
      total: 799, status: "delivered", createdAt: now - 86400000 * 5, updatedAt: now - 86400000 * 4,
    },
    {
      id: "mo5", merchantId, orderNumber: "EJ-10198", customerName: "Noura Al-Sabah",
      customerPhone: "+966577788899", city: "Mecca",
      items: [{ productId: "mp1", name: "Wireless Earbuds Pro", qty: 2, price: 349 }],
      total: 698, status: "delivered", createdAt: now - 86400000 * 9, updatedAt: now - 86400000 * 8,
    },
  ];
};

const load = <T,>(k: string): T | null => {
  try { const raw = localStorage.getItem(k); return raw ? JSON.parse(raw) : null; } catch { return null; }
};

export const MerchantProvider = ({ children }: { children: ReactNode }) => {
  const [merchant, setMerchant] = useState<Merchant | null>(() => load<Merchant>(KEY_M));
  const [products, setProducts] = useState<MerchantProduct[]>(() => load<MerchantProduct[]>(KEY_P) || []);
  const [orders, setOrders] = useState<MerchantOrder[]>(() => load<MerchantOrder[]>(KEY_O) || []);

  useEffect(() => { merchant ? localStorage.setItem(KEY_M, JSON.stringify(merchant)) : localStorage.removeItem(KEY_M); }, [merchant]);
  useEffect(() => { localStorage.setItem(KEY_P, JSON.stringify(products)); }, [products]);
  useEffect(() => { localStorage.setItem(KEY_O, JSON.stringify(orders)); }, [orders]);

  const signInMerchant = useCallback((m: Merchant) => {
    setMerchant(m);
    // Seed demo data if first sign-in
    setProducts(prev => prev.length ? prev : seedProducts(m.id));
    setOrders(prev => prev.length ? prev : seedOrders(m.id));
  }, []);
  const signOutMerchant = useCallback(() => setMerchant(null), []);
  const updateMerchant = useCallback((patch: Partial<Merchant>) => {
    setMerchant(prev => prev ? { ...prev, ...patch } : prev);
  }, []);

  const addProduct = useCallback((p: Omit<MerchantProduct, "id" | "merchantId" | "createdAt">) => {
    const np: MerchantProduct = { ...p, id: `mp_${Date.now()}`, merchantId: merchant?.id || "anon", createdAt: Date.now() };
    setProducts(prev => [np, ...prev]);
    return np;
  }, [merchant]);
  const updateProduct = useCallback((id: string, patch: Partial<MerchantProduct>) => {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, ...patch } : p));
  }, []);
  const deleteProduct = useCallback((id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
  }, []);

  const setOrderStatus = useCallback((id: string, status: OrderStatus) => {
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status, updatedAt: Date.now() } : o));
  }, []);

  const value = useMemo(() => ({
    merchant, signInMerchant, signOutMerchant, updateMerchant,
    products, addProduct, updateProduct, deleteProduct,
    orders, setOrderStatus,
  }), [merchant, signInMerchant, signOutMerchant, updateMerchant, products, addProduct, updateProduct, deleteProduct, orders, setOrderStatus]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
};

export const useMerchant = () => {
  const c = useContext(Ctx);
  if (!c) throw new Error("useMerchant must be used within MerchantProvider");
  return c;
};
