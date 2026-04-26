import { useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, X, Star, Zap, ShieldCheck, Check, Minus, ShoppingBag } from "lucide-react";
import { MobileShell } from "@/components/MobileShell";
import { useStore } from "@/lib/store";
import { useI18n } from "@/lib/i18n";
import { getProduct } from "@/lib/data";
import { Sar } from "@/components/Sar";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const Compare = () => {
  const nav = useNavigate();
  const { compareList, removeCompare, clearCompare, addToCart } = useStore();
  const { lang, t, dir } = useI18n();
  const ChevronBack = dir === "rtl" ? ArrowRight : ArrowLeft;

  const items = compareList.map(getProduct).filter(Boolean) as NonNullable<ReturnType<typeof getProduct>>[];

  const minPrice = Math.min(...items.map(p => p.price));
  const maxRating = Math.max(...items.map(p => p.rating));

  const Row = ({ label, render }: { label: string; render: (p: typeof items[0]) => React.ReactNode }) => (
    <div className="grid grid-cols-[88px_1fr] gap-0 border-b border-n6 last:border-b-0">
      <div className="px-3 py-2.5 bg-n7 text-[11px] font-bold text-n3 uppercase tracking-wide flex items-center">
        {label}
      </div>
      <div
        className="grid divide-x divide-n6"
        style={{ gridTemplateColumns: `repeat(${items.length}, minmax(0, 1fr))` }}
      >
        {items.map(p => (
          <div key={p.id} className="px-2.5 py-2.5 text-caption text-n1 flex items-center justify-center text-center">
            {render(p)}
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <MobileShell hideNav>
      <header className="bg-primary text-n8 px-4 pt-5 pb-6 rounded-b-3xl shadow-elev1 mb-2">
        <div className="flex items-center gap-3">
          <button
            aria-label="Back"
            onClick={() => nav(-1)}
            className="w-10 h-10 rounded-xl bg-n8/15 backdrop-blur flex items-center justify-center active:scale-95 transition"
          >
            <ChevronBack className="w-5 h-5" />
          </button>
          <div className="flex-1 min-w-0">
            <h1 className="text-h1 font-bold leading-tight">{lang === "ar" ? "مقارنة المنتجات" : "Compare Products"}</h1>
            <p className="text-caption opacity-80 tabular">
              {items.length} {lang === "ar" ? "منتجات" : "items"}
            </p>
          </div>
          {items.length > 0 && (
            <button
              onClick={() => { clearCompare(); nav(-1); }}
              className="h-9 px-3 rounded-xl bg-n8/15 backdrop-blur text-caption font-semibold active:scale-95 transition"
            >
              {lang === "ar" ? "مسح" : "Clear"}
            </button>
          )}
        </div>
      </header>

      {items.length < 2 ? (
        <div className="px-6 py-20 text-center">
          <div className="w-16 h-16 mx-auto rounded-full bg-n7 flex items-center justify-center mb-3">
            <ShoppingBag className="w-7 h-7 text-n4" />
          </div>
          <p className="text-n2 font-semibold mb-1">
            {lang === "ar" ? "أضف منتجين على الأقل للمقارنة" : "Add at least 2 products to compare"}
          </p>
          <button onClick={() => nav("/home")} className="mt-4 h-10 px-5 rounded-full bg-gradient-primary text-n8 text-caption font-extrabold">
            {lang === "ar" ? "تصفح المنتجات" : "Browse Products"}
          </button>
        </div>
      ) : (
        <main className="pb-8">
          {/* Header cards */}
          <div
            className="grid divide-x divide-n6 border-b border-n6 bg-n8"
            style={{ gridTemplateColumns: `88px repeat(${items.length}, minmax(0, 1fr))` }}
          >
            <div className="bg-n7" />
            {items.map(p => (
              <div key={p.id} className="p-2.5 relative">
                <button
                  onClick={() => removeCompare(p.id)}
                  className="absolute top-1 end-1 w-6 h-6 rounded-full bg-n7 border border-n6 flex items-center justify-center text-n3 active:scale-90"
                  aria-label="Remove"
                >
                  <X className="w-3 h-3" />
                </button>
                <div
                  onClick={() => nav(`/product/${p.id}`)}
                  className="aspect-square bg-n7 rounded-lg flex items-center justify-center mb-2 cursor-pointer"
                >
                  <img src={p.image} alt={p.name[lang]} className="w-full h-full object-contain p-2" />
                </div>
                <p className="text-[10px] text-n4 uppercase font-bold">{p.brand}</p>
                <h3 className="text-[11px] text-n1 line-clamp-2 leading-tight font-semibold min-h-[28px]">
                  {p.name[lang]}
                </h3>
              </div>
            ))}
          </div>

          {/* Comparison rows */}
          <Row label={lang === "ar" ? "السعر" : "Price"} render={p => (
            <div className="flex flex-col items-center">
              <div className={cn("flex items-baseline gap-1 font-extrabold tabular", p.price === minPrice && "text-success-text")}>
                <span className="price-sar">{p.price.toLocaleString()}</span>
                <Sar className="w-3 h-3" />
              </div>
              {p.price === minPrice && items.length > 1 && (
                <span className="text-[9px] font-bold text-success-text mt-0.5">
                  {lang === "ar" ? "الأرخص" : "Best price"}
                </span>
              )}
            </div>
          )} />

          <Row label={lang === "ar" ? "التقييم" : "Rating"} render={p => (
            <div className="flex items-center gap-1">
              <Star className={cn("w-3.5 h-3.5", p.rating === maxRating ? "fill-ksa-yellow text-ksa-yellow" : "fill-n4 text-n4")} />
              <span className="font-bold tabular">{p.rating}</span>
              <span className="text-[10px] text-n4">({p.reviews})</span>
            </div>
          )} />

          <Row label={lang === "ar" ? "التوصيل" : "Delivery"} render={p => (
            p.delivery === "today" ? (
              <span className="inline-flex items-center gap-1 text-[10px] font-bold px-1.5 py-0.5 rounded bg-success-bg text-success-text">
                <Zap className="w-2.5 h-2.5 fill-current" />
                {t("arrivedToday")}
              </span>
            ) : (
              <span className="text-[11px] text-n2 font-semibold">{t("arrivedTomorrow")}</span>
            )
          )} />

          <Row label={lang === "ar" ? "المخزون" : "Stock"} render={p => (
            p.stock === 0
              ? <span className="text-ksa-red font-bold text-[11px]">{t("outOfStock")}</span>
              : p.stock <= 3
                ? <span className="text-warning-text font-bold text-[11px]">{t("onlyXLeft", { x: p.stock })}</span>
                : <span className="text-success-text font-semibold text-[11px]">{lang === "ar" ? "متوفر" : "In stock"}</span>
          )} />

          <Row label={lang === "ar" ? "الضمان" : "Warranty"} render={p => (
            p.warranty ? (
              <span className="inline-flex items-center gap-1 text-[11px] text-n2 font-semibold">
                <ShieldCheck className="w-3 h-3 text-success-text" />
                {p.warranty === "official" ? (lang === "ar" ? "رسمي" : "Official") : p.warranty}
              </span>
            ) : <Minus className="w-3 h-3 text-n5" />
          )} />

          <Row label={lang === "ar" ? "تقسيط" : "Installments"} render={p => (
            p.installments
              ? <Check className="w-4 h-4 text-success-text" />
              : <Minus className="w-3 h-3 text-n5" />
          )} />

          <Row label={lang === "ar" ? "الأكثر مبيعاً" : "Bestseller"} render={p => (
            p.topSeller
              ? <Check className="w-4 h-4 text-success-text" />
              : <Minus className="w-3 h-3 text-n5" />
          )} />

          <Row label={lang === "ar" ? "الفئة" : "Category"} render={p => (
            <span className="text-[11px] text-n2 capitalize">{p.category}</span>
          )} />

          {/* CTAs */}
          <div
            className="grid gap-2 p-3 border-t border-n6"
            style={{ gridTemplateColumns: `88px repeat(${items.length}, minmax(0, 1fr))` }}
          >
            <div />
            {items.map(p => (
              <button
                key={p.id}
                disabled={p.stock === 0}
                onClick={() => { addToCart(p); toast.success(t("addedToCart")); }}
                className={cn(
                  "h-10 rounded-full text-[11px] font-extrabold transition",
                  p.stock === 0 ? "bg-n6 text-n4" : "bg-gradient-primary text-n8 active:scale-[0.97] shadow-sm"
                )}
              >
                {p.stock === 0 ? t("outOfStock") : t("addToCart")}
              </button>
            ))}
          </div>
        </main>
      )}
    </MobileShell>
  );
};

export default Compare;
