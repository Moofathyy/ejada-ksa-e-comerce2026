import { useNavigate } from "react-router-dom";
import { Heart } from "lucide-react";
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
  const { t, lang } = useI18n();
  const items = products.filter(p => wishlist.includes(p.id));

  return (
    <MobileShell>
      <TopBar title={t("wishlist")} />
      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 px-8 text-center">
          <div className="w-[120px] h-[120px] rounded-full bg-gradient-primary shadow-cta flex items-center justify-center mb-6">
            <Heart className="w-12 h-12 text-n8" strokeWidth={2} />
          </div>
          <h2 className="text-h1 text-n1 mb-2">{lang === "ar" ? "لا توجد مفضلات بعد" : "No Favorites Yet"}</h2>
          <p className="text-body text-n3 mb-8">{lang === "ar" ? "اضغط على القلب لحفظ المنتجات هنا" : "Tap the heart on any product to save it here"}</p>
          <button onClick={() => nav("/home")} className="px-10 h-[52px] bg-gradient-primary text-n8 rounded-full font-semibold shadow-cta active:scale-[0.98]">{lang === "ar" ? "تصفّح المنتجات" : "Explore Products"}</button>
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
