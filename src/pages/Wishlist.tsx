import { useNavigate } from "react-router-dom";
import { TopBar } from "@/components/TopBar";
import { MobileShell } from "@/components/MobileShell";
import { ProductCard } from "@/components/ProductCard";
import { useStore } from "@/lib/store";
import { useI18n } from "@/lib/i18n";
import { products } from "@/lib/data";
import { toast } from "sonner";

const Wishlist = () => {
  const nav = useNavigate();
  const { wishlist, addToCart } = useStore();
  const { t } = useI18n();
  const items = products.filter(p => wishlist.includes(p.id));

  return (
    <MobileShell>
      <TopBar title={t("wishlist")} />
      {items.length === 0 ? (
        <div className="py-24 text-center px-8 space-y-5">
          <div className="text-7xl">💝</div>
          <h2 className="text-h1 text-n1">No Favorites Yet</h2>
          <p className="text-body text-n3">Tap the heart on any product to save it here</p>
          <button onClick={() => nav("/home")} className="px-8 h-[52px] bg-primary text-n8 rounded-full font-semibold">Explore Products</button>
        </div>
      ) : (
        <main className="p-4 space-y-4">
          <div className="grid grid-cols-2 gap-3">{items.map(p => <ProductCard key={p.id} product={p} />)}</div>
          <button
            onClick={() => { items.forEach(i => addToCart(i)); toast.success(`${items.length} items added`); }}
            className="w-full h-[52px] bg-primary text-n8 rounded-full font-bold shadow-elev1 active:scale-[0.99] transition"
          >
            Add all to cart
          </button>
        </main>
      )}
    </MobileShell>
  );
};
export default Wishlist;
