import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, Truck, Zap, Check, DollarSign, Smartphone, CalendarDays } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { useStore } from "@/lib/store";
import { formatHijri, formatGregorian } from "@/lib/ksa";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

type DeliveryId = "std" | "exp";
type PayId = "mada" | "applepay" | "stcpay" | "tabby" | "tamara" | "cod";

const Checkout = () => {
  const nav = useNavigate();
  const { t, lang, dir } = useI18n();
  const { cart, cartSubtotal, promo, clearCart } = useStore();
  const [addr, setAddr] = useState(0);
  const [delivery, setDelivery] = useState<DeliveryId>("exp");
  const [pay, setPay] = useState<PayId>("mada");
  const [submitting, setSubmitting] = useState(false);

  const addresses = [
    {
      label: lang === "ar" ? "المكتب الرئيسي" : "Home Office",
      line1: lang === "ar" ? "طريق الملك فهد، حي العليا" : "King Fahd Road, Al Olaya District",
      line2: lang === "ar" ? "الرياض 12211، المملكة العربية السعودية" : "Riyadh 12211, Saudi Arabia",
      isDefault: true,
    },
    {
      label: lang === "ar" ? "بيت الصيف" : "Summer House",
      line1: lang === "ar" ? "طريق الكورنيش، حي الشاطئ" : "Corniche Road, Ash Shati District",
      line2: lang === "ar" ? "جدة 23412، المملكة العربية السعودية" : "Jeddah 23412, Saudi Arabia",
      isDefault: false,
    },
  ];

  const shipping = delivery === "exp" ? 45 : 0;
  const codFee = pay === "cod" ? 15 : 0;
  const discount = promo ? cartSubtotal * promo.discount : 0;
  const vat = (cartSubtotal - discount + shipping) * 0.15;
  const total = cartSubtotal - discount + shipping + vat + codFee;

  // Delivery ETA — Saudi: today/tomorrow with Hijri date
  const etaDate = new Date();
  etaDate.setDate(etaDate.getDate() + (delivery === "exp" ? 1 : 4));

  const payments: { id: PayId; name: string; sub?: string; icon: React.ReactNode; iconBg: string }[] = [
    {
      id: "mada", name: lang === "ar" ? "مدى" : "Mada",
      sub: lang === "ar" ? "البطاقة الأكثر استخداماً" : "Most used in KSA",
      icon: <span className="text-body font-extrabold text-n8">م</span>,
      iconBg: "bg-primary",
    },
    {
      id: "applepay", name: lang === "ar" ? "آبل باي" : "Apple Pay",
      icon: <svg viewBox="0 0 24 24" className="w-4 h-4 fill-n8"><path d="M16.365 12.717c-.013-2.55 2.082-3.77 2.176-3.83-1.187-1.736-3.034-1.972-3.69-2-1.566-.158-3.06.92-3.857.92-.81 0-2.027-.9-3.336-.873-1.715.025-3.297.997-4.18 2.532-1.785 3.094-.456 7.677 1.282 10.197.85 1.232 1.86 2.611 3.184 2.563 1.281-.052 1.764-.83 3.31-.83 1.547 0 1.984.83 3.337.804 1.378-.025 2.249-1.252 3.09-2.49.973-1.43 1.373-2.815 1.397-2.886-.03-.013-2.682-1.029-2.713-4.107zM13.91 5.82c.71-.86 1.187-2.054 1.057-3.241-1.022.041-2.26.68-2.992 1.539-.658.762-1.23 1.977-1.075 3.144 1.139.088 2.3-.578 3.01-1.442z"/></svg>,
      iconBg: "bg-n1",
    },
    {
      id: "stcpay", name: "STC Pay",
      sub: lang === "ar" ? "محفظة سعودية" : "Saudi wallet",
      icon: <Smartphone className="w-4 h-4 text-n8" />,
      iconBg: "bg-[#4F1F8F]",
    },
    {
      id: "tabby", name: "Tabby",
      sub: lang === "ar" ? "قسّمها على 4 دفعات بدون فوائد" : "Pay in 4 — interest-free",
      icon: <span className="text-[10px] font-extrabold text-tabby-text">4×</span>,
      iconBg: "bg-tabby",
    },
    {
      id: "tamara", name: "Tamara",
      sub: lang === "ar" ? "قسّمها على 3 دفعات" : "Split in 3 payments",
      icon: <span className="text-[10px] font-extrabold text-tamara-text">3×</span>,
      iconBg: "bg-tamara",
    },
    {
      id: "cod", name: lang === "ar" ? "الدفع عند الاستلام" : "Cash on Delivery",
      sub: lang === "ar" ? "+15 ر.س رسوم" : "+15 SAR service fee",
      icon: <DollarSign className="w-4 h-4 text-n8" />,
      iconBg: "bg-ksa-red",
    },
  ];

  const submit = () => {
    if (cart.length === 0) {
      toast.error(lang === "ar" ? "سلتك فارغة" : "Your cart is empty");
      return;
    }
    setSubmitting(true);
    setTimeout(() => {
      const orderId = "SA-2024-" + Math.floor(100000 + Math.random() * 900000);
      sessionStorage.setItem("ejada_lastOrder", JSON.stringify({ orderId, total, items: cart.length, payment: pay }));
      clearCart();
      nav("/order-confirmation", { replace: true });
    }, 1200);
  };

  const BackIcon = dir === "rtl" ? ArrowRight : ArrowLeft;

  return (
    <div className="phone-frame bg-background pb-32">
      {/* Deep blue header */}
      <header className="bg-primary text-n8 px-4 pt-5 pb-7">
        <div className="flex items-center gap-3">
          <button
            onClick={() => nav(-1)}
            aria-label="Back"
            className="w-10 h-10 rounded-xl bg-n8/15 backdrop-blur flex items-center justify-center active:scale-95 transition"
          >
            <BackIcon className="w-5 h-5" />
          </button>
          <h1 className="text-h1 font-bold">{t("checkout")}</h1>
        </div>
      </header>

      <main className="px-5 -mt-3 space-y-7 pt-5">
        {/* STEP 01 — Shipping Address */}
        <section className="space-y-3">
          <div className="flex items-end justify-between">
            <div>
              <p className="text-[11px] font-bold tracking-[0.14em] text-primary">{lang === "ar" ? "الخطوة 01" : "STEP 01"}</p>
              <h2 className="text-h2 text-n1 mt-0.5">{lang === "ar" ? "عنوان الشحن" : "Shipping Address"}</h2>
            </div>
            <button
              onClick={() => toast(lang === "ar" ? "ميزة قادمة قريباً" : "Coming soon")}
              className="text-caption font-bold text-primary underline underline-offset-4"
            >
              {lang === "ar" ? "إضافة جديد" : "Add New"}
            </button>
          </div>
          <div className="space-y-3">
            {addresses.map((a, i) => (
              <button
                key={i}
                onClick={() => setAddr(i)}
                className={cn(
                  "w-full text-start bg-n8 rounded-card p-4 transition border-2",
                  addr === i ? "border-primary shadow-elev1" : "border-n6"
                )}
              >
                <div className="flex justify-between items-start gap-3">
                  <div className="flex-1 min-w-0">
                    {a.isDefault && (
                      <span className="inline-block text-[10px] font-bold tracking-wider text-success-text bg-success-bg px-2.5 py-1 rounded-full mb-2">
                        {lang === "ar" ? "افتراضي" : "DEFAULT"}
                      </span>
                    )}
                    <p className="text-body font-bold text-n1">{a.label}</p>
                    <p className="text-caption text-n2 mt-1 leading-relaxed">{a.line1}</p>
                    <p className="text-caption text-n2 leading-relaxed">{a.line2}</p>
                  </div>
                  <div className={cn(
                    "shrink-0 w-6 h-6 rounded-full flex items-center justify-center transition",
                    addr === i ? "bg-primary" : "border-2 border-n4"
                  )}>
                    {addr === i && <Check className="w-4 h-4 text-n8" strokeWidth={3} />}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* STEP 02 — Delivery Method */}
        <section className="space-y-3">
          <div>
            <p className="text-[11px] font-bold tracking-[0.14em] text-primary">{lang === "ar" ? "الخطوة 02" : "STEP 02"}</p>
            <h2 className="text-h2 text-n1 mt-0.5">{lang === "ar" ? "طريقة التوصيل" : "Delivery Method"}</h2>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {([
              { id: "std" as const, name: lang === "ar" ? "عادي" : "Standard", desc: lang === "ar" ? "3-5 أيام عمل" : "3-5 Business Days", icon: Truck, price: 0 },
              { id: "exp" as const, name: lang === "ar" ? "سريع" : "Express", desc: lang === "ar" ? "توصيل اليوم التالي" : "Next Day Delivery", icon: Zap, price: 45 },
            ]).map(o => {
              const Icon = o.icon;
              const active = delivery === o.id;
              return (
                <button
                  key={o.id}
                  onClick={() => setDelivery(o.id)}
                  className={cn(
                    "rounded-card p-4 text-center bg-n8 border-2 transition",
                    active ? "border-primary shadow-elev1" : "border-n6"
                  )}
                >
                  <Icon className={cn("w-6 h-6 mx-auto mb-2", active ? "text-primary" : "text-n2")} strokeWidth={2} />
                  <p className="text-body font-bold text-n1">{o.name}</p>
                  <p className="text-caption text-n3 mt-0.5">{o.desc}</p>
                  <p className={cn("mt-2 font-bold text-body", active ? "text-primary" : "text-n2")}>
                    {o.price === 0 ? t("free") : <span className="price-sar tabular">+ {o.price}</span>}
                  </p>
                </button>
              );
            })}
          </div>
        </section>

        {/* STEP 03 — Payment */}
        <section className="space-y-3">
          <div>
            <p className="text-[11px] font-bold tracking-[0.14em] text-primary">{lang === "ar" ? "الخطوة 03" : "STEP 03"}</p>
            <h2 className="text-h2 text-n1 mt-0.5">{lang === "ar" ? "الدفع" : "Payment"}</h2>
          </div>
          <div className="space-y-2.5">
            {payments.map(p => {
              const active = pay === p.id;
              return (
                <button
                  key={p.id}
                  onClick={() => setPay(p.id)}
                  className={cn(
                    "w-full bg-n8 rounded-card p-3.5 flex items-center gap-3 border-2 transition",
                    active ? "border-primary shadow-elev1" : "border-n6"
                  )}
                >
                  <div className={cn("w-9 h-9 rounded-full flex items-center justify-center shrink-0", p.iconBg)}>
                    {p.icon}
                  </div>
                  <div className="flex-1 text-start min-w-0">
                    <p className="text-body font-bold text-n1">{p.name}</p>
                    {p.sub && <p className="text-caption text-n3">{p.sub}</p>}
                  </div>
                  <div className={cn(
                    "shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition",
                    active ? "border-primary" : "border-n4"
                  )}>
                    {active && <span className="w-2.5 h-2.5 rounded-full bg-primary" />}
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        {/* Order Summary */}
        <section className="rounded-card p-4 space-y-2.5 border border-n6 bg-n8">
          <h3 className="text-body font-bold text-n1 mb-2">{lang === "ar" ? "ملخص الطلب" : "Order Summary"}</h3>
          <div className="flex justify-between text-body text-n2">
            <span>{t("subtotal")}</span>
            <span className="tabular price-sar">{cartSubtotal.toFixed(2)}</span>
          </div>
          {discount > 0 && (
            <div className="flex justify-between text-body text-success-text">
              <span>{t("discount")}</span>
              <span className="tabular price-sar">-{discount.toFixed(2)}</span>
            </div>
          )}
          <div className="flex justify-between text-body text-n2">
            <span>
              {t("shipping")} ({delivery === "exp" ? (lang === "ar" ? "سريع" : "Express") : (lang === "ar" ? "عادي" : "Standard")})
            </span>
            <span className="tabular price-sar">{shipping.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-body text-n2">
            <span>{t("vat")}</span>
            <span className="tabular price-sar">{vat.toFixed(2)}</span>
          </div>
          <div className="border-t border-n6 pt-2.5 mt-1 flex justify-between items-center">
            <span className="text-h2 font-bold text-n1">{t("total")}</span>
            <span className="text-h1 font-bold text-primary tabular price-sar">{total.toFixed(2)}</span>
          </div>
        </section>
      </main>

      {/* Sticky Place Order CTA */}
      <div className="fixed bottom-0 inset-x-0 mx-auto max-w-[402px] bg-n8 border-t border-n6 px-5 safe-bottom shadow-elev2 z-40 my-0 py-[14px] pt-[12px] pb-[16px]">
        <button
          onClick={submit}
          disabled={submitting}
          className="w-full h-[56px] rounded-full font-bold text-h3 text-n8 shadow-cta active:scale-[0.98] transition disabled:opacity-70 bg-gradient-primary flex items-center justify-center gap-2"
        >
          {submitting ? (
            <span className="w-5 h-5 border-2 border-n8 border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              <span>{lang === "ar" ? "تأكيد الطلب" : "Place Order"}</span>
              <span className="opacity-80">•</span>
              <span className="tabular price-sar">{total.toFixed(2)}</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
export default Checkout;
