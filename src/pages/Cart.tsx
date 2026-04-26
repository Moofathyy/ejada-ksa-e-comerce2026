import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Minus, Trash2, Tag, ShieldCheck, Truck, Clock, X, ShoppingBag } from "lucide-react";
import { TrustModule } from "@/components/TrustModule";
import { Sar } from "@/components/Sar";
import { useI18n } from "@/lib/i18n";
import { useStore } from "@/lib/store";
import { TopBar } from "@/components/TopBar";
import { MobileShell } from "@/components/MobileShell";
import { toast } from "sonner";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";

const FREE_THRESHOLD = 500;

const Cart = () => {
  const nav = useNavigate();
  const { t, lang } = useI18n();
  const { cart, updateQty, removeFromCart, clearCart, cartSubtotal, promo, applyPromo, removePromo } = useStore();
  const [code, setCode] = useState("");
  const [codeError, setCodeError] = useState(false);

  if (cart.length === 0) {
    return (
      <MobileShell>
        <TopBar title={t("cart")} showBack={false} />
        <div className="flex flex-col items-center justify-center py-24 px-8 text-center">
          <div className="w-[120px] h-[120px] rounded-full bg-gradient-primary shadow-cta flex items-center justify-center mb-6">
            <ShoppingBag className="w-12 h-12 text-n8" strokeWidth={2} />
          </div>
          <h2 className="text-h1 text-n1 mb-2">{t("emptyCart")}</h2>
          <p className="text-body text-n3 mb-8">Start adding items to your cart</p>
          <button onClick={() => nav("/home")} className="px-10 h-[52px] bg-gradient-primary text-n8 rounded-full font-semibold shadow-cta active:scale-[0.98]">{t("startShopping")}</button>
        </div>
      </MobileShell>
    );
  }

  const remaining = Math.max(0, FREE_THRESHOLD - cartSubtotal);
  const freeShipping = remaining === 0 || promo?.code === "FREESHIP";
  const progress = Math.min(100, (cartSubtotal / FREE_THRESHOLD) * 100);

  const discount = promo ? cartSubtotal * promo.discount : 0;
  const shipping = freeShipping ? 0 : 25;
  const vat = (cartSubtotal - discount) * 0.15;
  const total = cartSubtotal - discount + shipping + vat;

  const handlePromo = () => {
    const ok = applyPromo(code);
    if (ok) { setCodeError(false); setCode(""); toast.success(t("promoApplied")); }
    else { setCodeError(true); toast.error(t("invalidPromo")); }
  };

  return (
    <MobileShell>
      <TopBar
        title={`${t("cart")} (${cart.length})`}
        showBack={false}
        right={
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <button className="text-caption text-warning-text font-semibold">{t("clearAll")}</button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>{t("removeAllConfirm")}</AlertDialogTitle>
                <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>{t("cancel")}</AlertDialogCancel>
                <AlertDialogAction onClick={clearCart} className="bg-warning-text">{t("clearCart")}</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        }
      />

      {/* Free delivery progress */}
      <div className="px-4 pt-3">
        <div className={cn("rounded-input p-3 border", freeShipping ? "bg-success-bg border-success/20" : "bg-primary-bg border-primary/10")}>
          <div className="flex items-center gap-2 mb-2">
            <Truck className={cn("w-4 h-4", freeShipping ? "text-success-text" : "text-primary")} />
            <p className="text-caption font-semibold flex-1">
              {freeShipping ? (
                t("freeDeliveryUnlocked")
              ) : (() => {
                const parts = t("addMoreForFreeDelivery", { x: remaining.toLocaleString() }).split("{c}");
                return (<>{parts[0]}<Sar />{parts[1]}</>);
              })()}
            </p>
          </div>
          <div className="h-1.5 bg-n8 rounded-full overflow-hidden">
            <div className={cn("h-full rounded-full transition-all", freeShipping ? "bg-success" : "bg-primary")} style={{ width: `${progress}%` }} />
          </div>
        </div>
      </div>

      {/* Items */}
      <main className="p-4 space-y-3 pb-40">
        {cart.map(({ product: p, qty, warranty }) => {
          const oos = p.stock === 0;
          const low = p.stock > 0 && p.stock <= 3;
          const onSale = !!p.originalPrice;
          const linePrice = p.price + (warranty?.price ?? 0);

          return (
            <div key={`${p.id}-${warranty?.id ?? "std"}`} className={cn("bg-n8 rounded-card shadow-elev1 p-3", oos && "opacity-70")}>
              <div className="flex gap-3">
                <div className="w-20 h-20 bg-n7 rounded-input flex-shrink-0 p-1">
                  <img src={p.image} alt="" className="w-full h-full object-contain" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="text-[10px] text-n4 uppercase">{p.brand}</p>
                      <h3 className="text-body text-n1 line-clamp-2 leading-tight">{p.name[lang]}</h3>
                    </div>
                    <button onClick={() => removeFromCart(p.id)} className="text-n4 -mt-1"><X className="w-4 h-4" /></button>
                  </div>

                  {/* Smart badges */}
                  <div className="flex flex-wrap gap-1 mt-1.5">
                    {oos && <span className="text-[10px] bg-n6 text-n2 px-2 py-0.5 rounded-full font-semibold">{t("outOfStock")}</span>}
                    {low && <span className="text-[10px] bg-warning-bg text-warning-text px-2 py-0.5 rounded-full font-semibold">{t("onlyXLeft", { x: p.stock })}</span>}
                    {onSale && <span className="text-[10px] bg-warning-text text-n8 px-2 py-0.5 rounded-full font-bold">{Math.round((1 - p.price / p.originalPrice!) * 100)}% {t("off")}</span>}
                    {p.warranty && <span className="text-[10px] bg-primary-bg text-primary px-2 py-0.5 rounded-full font-semibold flex items-center gap-1"><ShieldCheck className="w-2.5 h-2.5" />{t("officialWarranty")}</span>}
                    {p.installments && <span className="text-[10px] bg-accent text-primary px-2 py-0.5 rounded-full font-semibold">Tabby/Tamara</span>}
                    {p.topSeller && <span className="text-[10px] bg-warning text-n1 px-2 py-0.5 rounded-full font-semibold">🔥 {t("topSeller")}</span>}
                  </div>

                  {warranty && (
                    <div className="mt-2 flex items-center justify-between gap-2 px-2.5 py-1.5 rounded-input bg-primary-bg/70 border border-primary/15">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <ShieldCheck className="w-3.5 h-3.5 text-primary shrink-0" />
                        <span className="text-[11px] font-semibold text-primary truncate">
                          {lang === "ar" ? "ضمان " : "Warranty: "}{warranty.label[lang]}
                        </span>
                      </div>
                      <span className="text-[11px] font-bold text-primary tabular shrink-0">
                        +{warranty.price.toLocaleString()} <Sar />
                      </span>
                    </div>
                  )}

                  <div className="flex items-end justify-between mt-2">
                    <div>
                      <div className="flex items-baseline gap-2">
                        <span className="text-body font-bold text-primary tabular price-sar">{linePrice.toLocaleString()}</span>
                        {onSale && <span className="text-[11px] text-n4 line-through tabular">{p.originalPrice!.toLocaleString()}</span>}
                      </div>
                      {oos && <p className="text-[10px] text-n4 mt-0.5">Not included in total</p>}
                    </div>
                    {oos ? (
                      <button className="text-caption text-primary font-semibold border border-primary px-3 py-1 rounded-full">🔔 {t("notifyMe")}</button>
                    ) : (
                      <div className="flex items-center bg-n7 rounded-full">
                        <button onClick={() => updateQty(p.id, qty - 1)} className="w-7 h-7 flex items-center justify-center"><Minus className="w-3.5 h-3.5" /></button>
                        <span className="w-7 text-center text-caption font-semibold tabular">{qty}</span>
                        <button onClick={() => updateQty(p.id, qty + 1)} className="w-7 h-7 flex items-center justify-center"><Plus className="w-3.5 h-3.5" /></button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {/* Promo */}
        <div className="bg-n8 rounded-card shadow-elev1 p-3">
          <div className="flex items-center gap-2 mb-2">
            <Tag className="w-4 h-4 text-primary" />
            <span className="text-label text-n2">{t("promoCode")}</span>
          </div>
          {promo ? (
            <div className="flex items-center justify-between bg-success-bg rounded-input p-2.5">
              <span className="text-caption text-success-text font-semibold">✓ {promo.code} applied</span>
              <button onClick={removePromo} className="text-caption text-warning-text font-semibold">Remove</button>
            </div>
          ) : (
            <div className="flex gap-2">
              <input value={code} onChange={e => { setCode(e.target.value); setCodeError(false); }}
                placeholder="SAVE10 / FREESHIP"
                className={cn("flex-1 h-11 rounded-input border px-3 text-body uppercase outline-none",
                  codeError ? "border-warning-text" : "border-n4 focus:border-primary")} />
              <button onClick={handlePromo} className="px-5 h-11 bg-primary text-n8 rounded-full font-semibold text-caption">{t("apply")}</button>
            </div>
          )}
        </div>

        {/* Trust module — compact reassurance row */}
        <TrustModule variant="compact" />

        {/* Summary */}
        <div className="bg-n8 rounded-card shadow-elev1 p-4 space-y-2">
          <div className="flex justify-between text-body text-n2"><span>{t("subtotal")}</span><span className="tabular price-sar">{cartSubtotal.toLocaleString()}</span></div>
          {discount > 0 && (
            <div className="flex justify-between text-body text-success-text"><span>{t("discount")}</span><span className="tabular">- {discount.toLocaleString()} <Sar /></span></div>
          )}
          <div className="flex justify-between text-body text-n2">
            <span>{t("shipping")}</span>
            {shipping === 0 ? <span className="text-success-text font-semibold">{t("free")}</span> : <span className="tabular price-sar">{shipping}</span>}
          </div>
          <div className="flex justify-between text-body text-n2"><span>{t("vat")}</span><span className="tabular price-sar">{vat.toFixed(2)}</span></div>
          <div className="border-t border-n6 pt-2 flex justify-between text-h2 text-n1 font-bold"><span>{t("total")}</span><span className="tabular price-sar">{total.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span></div>
        </div>

        <div className="flex items-center justify-center gap-1 text-caption text-n3 pt-2">
          <Clock className="w-3.5 h-3.5" />
          <span>Most orders arrive within 24-48 hours</span>
        </div>
      </main>

      {/* Sticky checkout */}
      <div className="fixed bottom-[80px] inset-x-0 mx-auto max-w-[402px] px-4 safe-bottom z-40 pointer-events-none">
        <div className="pointer-events-auto">
        <button onClick={() => nav("/checkout")}
          className="w-full h-[52px] bg-gradient-primary text-n8 rounded-full font-semibold text-h3 shadow-cta active:scale-[0.98] flex items-center justify-center gap-2">
          {lang === "ar" ? "الدفع" : "Checkout"} · {total.toLocaleString(undefined, { maximumFractionDigits: 2 })} <Sar />
        </button>
        </div>
      </div>
    </MobileShell>
  );
};
export default Cart;
