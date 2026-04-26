import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Heart, Share2, Star, ChevronLeft, ChevronRight, ArrowLeft, X, Plus, Minus, ShoppingCart, Check, Sparkles, Zap, ShieldCheck, GitCompareArrows, ArrowRight } from "lucide-react";
import { TrustModule } from "@/components/TrustModule";
import { Sar } from "@/components/Sar";
import { useI18n } from "@/lib/i18n";
import { useStore } from "@/lib/store";
import { getProduct, products } from "@/lib/data";
import { ProductCard } from "@/components/ProductCard";
import { tabbyInstallment, tamaraInstallment, soldThisMonth, fastDeliveryCutoff } from "@/lib/ksa";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const PDP = () => {
  const { id } = useParams();
  const nav = useNavigate();
  const { lang, t, dir } = useI18n();
  const { addToCart, toggleWishlist, wishlist, compareList, toggleCompare, removeCompare } = useStore();
  const product = getProduct(id || "");
  const [qty, setQty] = useState(1);
  const [storageIdx, setStorageIdx] = useState(1);
  const [connIdx, setConnIdx] = useState(1);
  const [tab, setTab] = useState<"description" | "specs" | "reviews">("description");
  const [warrantyIdx, setWarrantyIdx] = useState(0);

  if (!product) return <div className="phone-frame p-8 text-center">Product not found</div>;

  const fav = wishlist.includes(product.id);
  const savings = product.originalPrice ? product.originalPrice - product.price : 0;
  const Back = dir === "rtl" ? ChevronRight : ChevronLeft;
  const storageOpts = product.variants?.storage ?? ["256GB", "512GB", "1TB"];
  const connOpts = ["Wi-Fi 7", "5G", "Bluetooth 5.3"];
  const warrantyOpts: { id: string; label: { en: string; ar: string }; price: number; sub: { en: string; ar: string } }[] = [
    { id: "std",  label: { en: "Standard",  ar: "قياسي" },     price: 0,   sub: { en: "1-year manufacturer", ar: "سنة من الشركة" } },
    { id: "ext2", label: { en: "Extended",  ar: "ممتد" },      price: 199, sub: { en: "+1 year extra cover", ar: "سنة إضافية" } },
    { id: "ext3", label: { en: "Premium",   ar: "بريميوم" },   price: 349, sub: { en: "+2 years + accidental", ar: "سنتان + حوادث" } },
  ];

  const selectedWarranty = warrantyOpts[warrantyIdx];
  const warrantyForCart = selectedWarranty.price > 0
    ? { id: selectedWarranty.id, label: selectedWarranty.label, price: selectedWarranty.price }
    : undefined;
  const handleAdd = () => {
    addToCart(product, qty, warrantyForCart);
    toast.success(t("addedToCart"));
    setTimeout(() => nav("/home"), 1000);
  };
  const handleBuyNow = () => { addToCart(product, qty, warrantyForCart); nav("/checkout"); };
  const sold = soldThisMonth(product.id);
  const tabby = tabbyInstallment(product.price);
  const tamara = tamaraInstallment(product.price);
  const cutoff = fastDeliveryCutoff();

  return (
    <div className="phone-frame bg-background pb-28">
      {/* Dark hero image with floating controls */}
      <div className="relative h-[380px] flex items-center justify-center overflow-hidden bg-primary-bg">
        <img src={product.image} alt={product.name[lang]} className="max-w-[80%] max-h-[85%] object-contain" />

        {/* Floating top controls */}
        <button
          onClick={() => nav(-1)}
          className="absolute top-4 start-4 w-10 h-10 rounded-xl bg-n8 shadow-elev2 flex items-center justify-center active:scale-95 transition"
          aria-label="Back"
        >
          <ArrowLeft className={cn("w-5 h-5 text-n1", dir === "rtl" && "rotate-180")} />
        </button>
        <div className="absolute top-4 end-4 flex gap-2">
          <button
            onClick={() => toggleWishlist(product.id)}
            className="w-11 h-11 rounded-full bg-n8 shadow-elev2 flex items-center justify-center active:scale-95 transition"
            aria-label="Wishlist"
          >
            <Heart className={cn("w-5 h-5", fav ? "fill-primary text-primary" : "text-primary")} />
          </button>
          <button
            className="w-11 h-11 rounded-full bg-n8 shadow-elev2 flex items-center justify-center active:scale-95 transition"
            aria-label="Share"
          >
            <Share2 className="w-5 h-5 text-primary" />
          </button>
        </div>
      </div>

      {/* Sliding white card */}
      <main className="relative -mt-6 bg-n8 rounded-t-[28px] px-5 pt-5 pb-6">
        {/* Brand + close */}
        <div className="flex items-start justify-between">
          <div className="flex-1 pe-3">
            <p className="text-caption font-semibold tracking-wider text-n4 uppercase">{product.brand}</p>
            <h1 className="text-h1 text-n1 mt-1 leading-tight">{product.name[lang]}</h1>
          </div>
          <button
            onClick={() => nav(-1)}
            className="w-9 h-9 rounded-full bg-n1 flex items-center justify-center text-n8 shrink-0 active:scale-95"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Price block */}
        <div className="mt-4 -mx-1 px-3 py-3 rounded-2xl bg-primary-bg/60">
          <div className="flex items-baseline gap-3 flex-wrap">
            <span className="text-display text-primary font-bold tabular price-sar">{product.price.toLocaleString()}</span>
            {product.originalPrice && (
              <span className="text-body-lg text-n4 line-through tabular price-sar">{product.originalPrice.toLocaleString()}</span>
            )}
          </div>
          <div className="flex items-center gap-2 mt-1.5">
            <span className="text-caption text-n3">inc. VAT</span>
            {savings > 0 && (
              <span className="inline-flex items-center text-[11px] font-bold text-n8 bg-success px-2.5 py-1 rounded-full tabular">
                You save {savings.toLocaleString()} <Sar />
              </span>
            )}
          </div>
        </div>

        {/* Social proof + fast delivery cutoff */}
        <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-caption">
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 fill-ksa-yellow text-ksa-yellow" />
            <span className="font-bold text-n1 tabular">{product.rating}</span>
            <span className="text-n4">({product.reviews})</span>
          </div>
          <span className="text-n4">·</span>
          <span className="text-n2 tabular font-semibold">{sold.toLocaleString()} {lang === "ar" ? "مُباع هذا الشهر" : "sold this month"}</span>
          {cutoff && (
            <span className="w-full inline-flex items-center gap-1.5 text-success-text font-bold mt-1">
              <Zap className="w-3.5 h-3.5 fill-current" />
              {lang === "ar"
                ? `يصل غداً إذا طلبت خلال ${cutoff.hours}س ${cutoff.minutes}د`
                : `Tomorrow if you order within ${cutoff.hours}h ${cutoff.minutes}m`}
            </span>
          )}
        </div>

        {/* Tabby + Tamara installment calculator */}
        {product.installments && (
          <div className="mt-3 rounded-2xl border border-n6 bg-gradient-to-br from-tabby/40 to-tamara/40 p-3 space-y-2">
            <p className="text-[11px] font-extrabold tracking-wider text-n2 uppercase">{t("payInInstallments")}</p>
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="bg-tabby text-tabby-text px-2 py-0.5 rounded text-caption font-extrabold">tabby</span>
                <span className="text-body text-n1">4 × <span className="tabular price-sar font-extrabold">{tabby.toLocaleString()}</span></span>
              </div>
              <span className="text-[10px] text-n3 font-semibold">{lang === "ar" ? "بدون فوائد" : "0% interest"}</span>
            </div>
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="bg-tamara text-tamara-text px-2 py-0.5 rounded text-caption font-extrabold">tamara</span>
                <span className="text-body text-n1">3 × <span className="tabular price-sar font-extrabold">{tamara.toLocaleString()}</span></span>
              </div>
              <span className="text-[10px] text-n3 font-semibold">{lang === "ar" ? "بدون فوائد" : "0% interest"}</span>
            </div>
          </div>
        )}

        {/* Trust module — KSA: warranty, authenticity, delivery, returns */}
        <TrustModule variant="detailed" className="mt-4" />

        {/* Storage selector */}
        <div className="mt-5">
          <div className="flex items-center justify-between mb-2">
            <p className="text-caption font-semibold tracking-wider text-n4 uppercase">Select Storage</p>
            <button className="text-caption font-bold text-primary underline underline-offset-2">VIEW FULL SPECS SHEET</button>
          </div>
          <div className="flex flex-wrap gap-2">
            {storageOpts.map((s, i) => (
              <button
                key={s}
                onClick={() => setStorageIdx(i)}
                className={cn(
                  "px-5 py-2.5 rounded-full text-body font-semibold border transition",
                  storageIdx === i
                    ? "border-primary text-primary bg-primary-bg"
                    : "border-n6 text-n1 bg-n8"
                )}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Connectivity */}
        <div className="mt-5">
          <p className="text-caption font-semibold tracking-wider text-n4 uppercase mb-2">Connectivity</p>
          <div className="flex flex-wrap gap-2">
            {connOpts.map((c, i) => (
              <button
                key={c}
                onClick={() => setConnIdx(i)}
                className={cn(
                  "px-5 py-2.5 rounded-full text-body font-semibold border transition",
                  connIdx === i
                    ? "border-primary text-primary bg-primary-bg"
                    : "border-n6 text-n1 bg-n8"
                )}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* Warranty */}
        <div className="mt-5">
          <div className="flex items-center justify-between mb-2">
            <p className="text-caption font-semibold tracking-wider text-n4 uppercase flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-primary" />
              {lang === "ar" ? "خيارات الضمان" : "Warranty Options"}
            </p>
          </div>
          <div className="space-y-2">
            {warrantyOpts.map((w, i) => {
              const active = warrantyIdx === i;
              return (
                <button
                  key={w.id}
                  onClick={() => setWarrantyIdx(i)}
                  className={cn(
                    "w-full flex items-center justify-between gap-3 px-4 py-3 rounded-2xl border text-start transition active:scale-[0.99]",
                    active ? "border-primary bg-primary-bg" : "border-n6 bg-n8",
                  )}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span
                      className={cn(
                        "w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0",
                        active ? "border-primary" : "border-n4",
                      )}
                    >
                      {active && <span className="w-2.5 h-2.5 rounded-full bg-primary" />}
                    </span>
                    <div className="min-w-0">
                      <p className={cn("text-body font-semibold truncate", active ? "text-primary" : "text-n1")}>
                        {w.label[lang]}
                      </p>
                      <p className="text-caption text-n4 truncate">{w.sub[lang]}</p>
                    </div>
                  </div>
                  <span className={cn("text-caption font-bold tabular shrink-0", active ? "text-primary" : "text-n2")}>
                    {w.price === 0
                      ? (lang === "ar" ? "مجاناً" : "Free")
                      : <>+{w.price.toLocaleString()} <Sar /></>}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Quantity */}
        <div className="mt-5">
          <p className="text-h3 text-n1 mb-2">Quantity</p>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setQty(Math.max(1, qty - 1))}
              className="w-11 h-11 rounded-xl border border-n6 flex items-center justify-center active:scale-95"
            >
              <Minus className="w-4 h-4 text-n1" />
            </button>
            <span className="w-10 text-center text-h2 font-semibold tabular">{qty}</span>
            <button
              onClick={() => setQty(qty + 1)}
              className="w-11 h-11 rounded-xl border border-n6 flex items-center justify-center active:scale-95"
            >
              <Plus className="w-4 h-4 text-n1" />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-6 border-t border-n6 pt-4">
          <div className="flex items-center gap-6 border-b border-n6">
            {([
              { id: "description", label: "Description" },
              { id: "specs", label: "Specifications" },
              { id: "reviews", label: `Reviews (${product.reviews})` },
            ] as const).map(tb => (
              <button
                key={tb.id}
                onClick={() => setTab(tb.id)}
                className={cn(
                  "pb-3 text-body font-semibold relative transition",
                  tab === tb.id ? "text-primary" : "text-n4"
                )}
              >
                {tb.label}
                {tab === tb.id && (
                  <span className="absolute -bottom-px inset-x-0 h-0.5 bg-primary rounded-full" />
                )}
              </button>
            ))}
          </div>

          <div className="pt-4">
            {tab === "description" && (
              <div className="space-y-4">
                <p className="text-body text-n2 leading-relaxed">
                  Engineered with premium components and attention to detail. This {product.name.en.toLowerCase()} combines cutting-edge technology with exceptional performance. Perfect for any use, it offers both power and reliability.
                </p>
                <ul className="space-y-3">
                  {[
                    "Premium quality components from certified manufacturers",
                    "Advanced engineering with exceptional performance optimization",
                    "Built for durability and extended use",
                  ].map((line, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span className="w-5 h-5 rounded-full bg-success flex items-center justify-center shrink-0 mt-0.5">
                        <Check className="w-3 h-3 text-n8" strokeWidth={3} />
                      </span>
                      <span className="text-body text-n2 leading-relaxed">{line}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {tab === "specs" && (
              <div className="space-y-2">
                {[
                  ["Brand", product.brand],
                  ["Storage", storageOpts[storageIdx]],
                  ["Connectivity", connOpts[connIdx]],
                  ["Warranty", product.warranty ?? "1-year"],
                  ["Stock", product.stock > 0 ? `${product.stock} units` : "Out of stock"],
                ].map(([k, v]) => (
                  <div key={k} className="flex justify-between py-2 border-b border-n7">
                    <span className="text-body text-n4">{k}</span>
                    <span className="text-body font-semibold text-n1">{v}</span>
                  </div>
                ))}
              </div>
            )}

            {tab === "reviews" && (
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 fill-warning text-warning" />
                  <span className="text-h2 text-n1 tabular">{product.rating}</span>
                  <span className="text-caption text-n4">· {product.reviews} {t("reviews")}</span>
                </div>
                {[
                  { n: "Mohammed A.", r: 5, txt: "Amazing product, fast delivery to Riyadh!" },
                  { n: "Fatima K.", r: 4, txt: "Great quality, exactly as described." },
                ].map((rev, i) => (
                  <div key={i} className="bg-n7 rounded-input p-3">
                    <div className="flex justify-between items-center">
                      <span className="text-body font-semibold text-n1">{rev.n}</span>
                      <div className="flex gap-0.5">{Array.from({length: 5}).map((_, j) => <Star key={j} className={cn("w-3.5 h-3.5", j < rev.r ? "fill-warning text-warning" : "text-n6")} />)}</div>
                    </div>
                    <p className="text-caption text-n2 mt-1">{rev.txt}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Compare with suggested item */}
        {(() => {
          const suggestions = products
            .filter(p => p.id !== product.id && p.category === product.category)
            .slice(0, 3);
          if (suggestions.length === 0) return null;
          return (
            <div className="mt-6 border-t border-n6 pt-4">
              <div className="flex items-center gap-2 mb-1">
                <GitCompareArrows className="w-5 h-5 text-primary" />
                <h3 className="text-h3 text-n1">
                  {lang === "ar" ? "قارن مع منتج مقترح" : "Compare with a suggested item"}
                </h3>
              </div>
              <p className="text-caption text-n4 mb-3">
                {lang === "ar"
                  ? "اختر منتجاً لمقارنته جنباً إلى جنب مع هذا المنتج."
                  : "Pick a product to compare side-by-side with this one."}
              </p>
              <div className="space-y-2">
                {suggestions.map(p => (
                  <div
                    key={p.id}
                    className="flex items-center gap-3 p-3 rounded-2xl border border-n6 bg-n8"
                  >
                    <button
                      onClick={() => nav(`/product/${p.id}`)}
                      className="w-14 h-14 rounded-xl bg-primary-bg/40 flex items-center justify-center shrink-0 overflow-hidden active:scale-95"
                    >
                      <img src={p.image} alt={p.name[lang]} className="max-w-[80%] max-h-[80%] object-contain" />
                    </button>
                    <div className="flex-1 min-w-0">
                      <p className="text-caption text-n4 font-semibold uppercase tracking-wider">{p.brand}</p>
                      <p className="text-body font-semibold text-n1 truncate">{p.name[lang]}</p>
                      <p className="text-caption text-primary font-bold tabular price-sar mt-0.5">{p.price.toLocaleString()}</p>
                    </div>
                    <button
                      onClick={() => {
                        if (!compareList.includes(product.id)) toggleCompare(product.id);
                        if (!compareList.includes(p.id)) toggleCompare(p.id);
                        nav("/compare");
                      }}
                      className="shrink-0 h-10 px-4 rounded-full bg-primary text-primary-foreground text-caption font-bold flex items-center gap-1.5 active:scale-95 transition"
                    >
                      {lang === "ar" ? "قارن" : "Compare"}
                      <ArrowRight className={cn("w-3.5 h-3.5", dir === "rtl" && "rotate-180")} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          );
        })()}

        {/* Upsell */}
        <div className="mt-6 border-t border-n6 pt-4">
          <h3 className="text-h3 text-n1 mb-3">You might also like</h3>
          <div className="grid grid-cols-2 gap-3">
            {products.filter(p => p.id !== product.id).slice(0, 2).map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        </div>
      </main>

      {/* Fixed Add to Cart + Buy Now bar */}
      <div className="fixed bottom-0 inset-x-0 mx-auto max-w-[402px] bg-n8 border-t border-n6 px-4 pt-3 pb-[20px] safe-bottom shadow-elev2 z-40 flex gap-2.5">
        <button
          onClick={handleAdd}
          disabled={product.stock === 0}
          className="flex-1 h-14 bg-primary text-n8 rounded-full font-bold text-body flex items-center justify-center gap-2 shadow-elev1 disabled:opacity-50 active:scale-[0.98] transition"
        >
          <ShoppingCart className="w-5 h-5" />
          <span>{t("addToCart")}</span>
        </button>
        <button
          onClick={handleBuyNow}
          disabled={product.stock === 0}
          className="flex-1 h-14 bg-gradient-primary text-n8 rounded-full font-extrabold text-body flex items-center justify-center gap-2 shadow-cta disabled:opacity-50 active:scale-[0.98] transition"
        >
          <Zap className="w-5 h-5 fill-current" />
          <span>{t("buyNowAction")}</span>
        </button>
      </div>
    </div>
  );
};
export default PDP;
