import { createContext, useContext, useState, ReactNode, useCallback, useEffect } from "react";
import { Product } from "./data";

export type CartItem = { product: Product; qty: number };

export interface UserProfile {
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  city: string;
}

export interface Address {
  id: string;
  type: "home" | "work" | "other";
  label: string;
  region: string;
  city: string;
  district: string;
  street: string;
  building: string;
  postal: string;
  additional?: string;
  phone: string;
  isDefault?: boolean;
}

interface StoreCtx {
  cart: CartItem[];
  wishlist: string[];
  addToCart: (p: Product, qty?: number) => void;
  removeFromCart: (id: string) => void;
  updateQty: (id: string, qty: number) => void;
  clearCart: () => void;
  toggleWishlist: (id: string) => void;
  promo: { code: string; discount: number } | null;
  applyPromo: (code: string) => boolean;
  removePromo: () => void;
  cartCount: number;
  cartSubtotal: number;
  user: UserProfile | null;
  signIn: (u: UserProfile) => void;
  signOut: () => void;
  city: string;
  setCity: (c: string) => void;
  addresses: Address[];
  addAddress: (a: Omit<Address, "id">) => Address;
  removeAddress: (id: string) => void;
  setDefaultAddress: (id: string) => void;
}

const Ctx = createContext<StoreCtx | null>(null);

const PROMOS: Record<string, number> = { SAVE10: 0.1, FREESHIP: 0 };

export const StoreProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>(["p2", "p7"]);
  const [promo, setPromo] = useState<{ code: string; discount: number } | null>(null);
  const [user, setUser] = useState<UserProfile | null>(() => {
    try { const raw = localStorage.getItem("ejada_user_profile"); return raw ? JSON.parse(raw) : null; } catch { return null; }
  });
  const [city, setCityState] = useState<string>(() => localStorage.getItem("ejada_city") || "Riyadh");
  const [addresses, setAddresses] = useState<Address[]>(() => {
    try { const raw = localStorage.getItem("ejada_addresses"); return raw ? JSON.parse(raw) : []; } catch { return []; }
  });

  useEffect(() => {
    localStorage.setItem("ejada_addresses", JSON.stringify(addresses));
  }, [addresses]);

  useEffect(() => {
    if (user) localStorage.setItem("ejada_user_profile", JSON.stringify(user));
    else localStorage.removeItem("ejada_user_profile");
  }, [user]);

  const setCity = (c: string) => { setCityState(c); localStorage.setItem("ejada_city", c); };
  const signIn = (u: UserProfile) => setUser(u);
  const signOut = () => setUser(null);

  const addToCart = useCallback((p: Product, qty = 1) => {
    setCart(prev => {
      const ex = prev.find(i => i.product.id === p.id);
      if (ex) return prev.map(i => i.product.id === p.id ? { ...i, qty: i.qty + qty } : i);
      return [...prev, { product: p, qty }];
    });
  }, []);

  const removeFromCart = useCallback((id: string) => setCart(prev => prev.filter(i => i.product.id !== id)), []);
  const updateQty = useCallback((id: string, qty: number) => {
    if (qty <= 0) return removeFromCart(id);
    setCart(prev => prev.map(i => i.product.id === id ? { ...i, qty } : i));
  }, [removeFromCart]);
  const clearCart = useCallback(() => { setCart([]); setPromo(null); }, []);

  const toggleWishlist = useCallback((id: string) => {
    setWishlist(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  }, []);

  const applyPromo = useCallback((code: string) => {
    const c = code.trim().toUpperCase();
    if (PROMOS[c] !== undefined) { setPromo({ code: c, discount: PROMOS[c] }); return true; }
    return false;
  }, []);
  const removePromo = useCallback(() => setPromo(null), []);

  const addAddress = useCallback((a: Omit<Address, "id">) => {
    const id = `addr_${Date.now()}`;
    const next: Address = { ...a, id };
    setAddresses(prev => {
      // If this one is default, clear others
      const cleaned = next.isDefault ? prev.map(x => ({ ...x, isDefault: false })) : prev;
      // First address becomes default automatically
      if (cleaned.length === 0) next.isDefault = true;
      return [next, ...cleaned];
    });
    return next;
  }, []);

  const removeAddress = useCallback((id: string) => {
    setAddresses(prev => {
      const next = prev.filter(a => a.id !== id);
      // Ensure something stays default
      if (next.length && !next.some(a => a.isDefault)) next[0].isDefault = true;
      return next;
    });
  }, []);

  const setDefaultAddress = useCallback((id: string) => {
    setAddresses(prev => prev.map(a => ({ ...a, isDefault: a.id === id })));
  }, []);

  const cartCount = cart.reduce((s, i) => s + i.qty, 0);
  const cartSubtotal = cart.reduce((s, i) => s + i.product.price * i.qty, 0);

  return (
    <Ctx.Provider value={{ cart, wishlist, addToCart, removeFromCart, updateQty, clearCart, toggleWishlist, promo, applyPromo, removePromo, cartCount, cartSubtotal, user, signIn, signOut, city, setCity, addresses, addAddress, removeAddress, setDefaultAddress }}>
      {children}
    </Ctx.Provider>
  );
};

export const useStore = () => {
  const c = useContext(Ctx);
  if (!c) throw new Error("useStore must be used within StoreProvider");
  return c;
};
