import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, Truck, Zap, Check, DollarSign, Smartphone, CalendarDays, ShieldCheck, CalendarClock, ChevronRight } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { useStore } from "@/lib/store";
import { formatHijri, formatGregorian } from "@/lib/ksa";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { TrustModule } from "@/components/TrustModule";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";

type DeliveryId = "std" | "exp";
type PayId = "mada" | "applepay" | "stcpay" | "cod" | "installments";

const Checkout = () => {
  const nav = useNavigate();
  const { t, lang, dir } = useI18n();
  const { cart, cartSubtotal, promo, clearCart } = useStore();
  const [addr, setAddr] = useState(0);
  const [delivery, setDelivery] = useState<DeliveryId>("exp");
  const [pay, setPay] = useState<PayId>("mada");
  const [installPlan, setInstallPlan] = useState<3 | 4 | 6 | 12>(4);
  const [showInstallSheet, setShowInstallSheet] = useState(false);
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

  const warrantyTotal = cart.reduce((s, i) => s + (i.warranty?.price ?? 0) * i.qty, 0);
  const productsSubtotal = cartSubtotal - warrantyTotal;
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

          {/* Installments CTA */}
          <button
            type="button"
            onClick={() => setShowInstallSheet(true)}
            className={cn(
              "w-full mt-1 bg-n8 rounded-card p-3.5 flex items-center gap-3 border-2 transition text-start",
              pay === "installments" ? "border-primary shadow-elev1" : "border-n6 border-dashed",
            )}
          >
            <div className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 bg-gradient-primary">
              <CalendarClock className="w-4 h-4 text-n8" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-body font-bold text-n1">
                {lang === "ar" ? "الدفع بالتقسيط" : "Pay in Installments"}
              </p>
              <p className="text-caption text-n3">
                {pay === "installments"
                  ? (lang === "ar"
                      ? `${installPlan} دفعات × ${(total / installPlan).toFixed(2)} ر.س`
                      : `${installPlan} payments × ${(total / installPlan).toFixed(2)} SAR`)
                  : (lang === "ar"
                      ? "قسّم المبلغ على عدة دفعات بدون فوائد"
                      : "Split your total — interest-free options")}
              </p>
            </div>
            {pay === "installments" ? (
              <span className="text-caption font-bold text-primary shrink-0">
                {lang === "ar" ? "تعديل" : "Edit"}
              </span>
            ) : (
              <ChevronRight className={cn("w-5 h-5 text-n3 shrink-0", dir === "rtl" && "rotate-180")} />
            )}
          </button>
        </section>

        {/* Order Summary */}
        <section className="rounded-card p-4 space-y-2.5 border border-n6 bg-n8">
          <h3 className="text-body font-bold text-n1 mb-2">{lang === "ar" ? "ملخص الطلب" : "Order Summary"}</h3>

          <div className="flex items-center gap-2 -mt-1 mb-1 p-2.5 rounded-input bg-success-bg/60">
            <CalendarDays className="w-4 h-4 text-success-text shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-caption font-extrabold text-success-text leading-tight">
                {t("estimatedArrival")} · {formatGregorian(etaDate, lang)}
              </p>
              <p className="text-[10px] text-n3 tabular">{t("hijri")}: {formatHijri(etaDate, lang)}</p>
            </div>
          </div>

          <div className="flex justify-between text-body text-n2">
            <span>{t("subtotal")}</span>
            <span className="tabular price-sar">{productsSubtotal.toFixed(2)}</span>
          </div>
          {warrantyTotal > 0 && (
            <div className="space-y-1">
              <div className="flex justify-between text-body text-n2">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-primary" />
                  {lang === "ar" ? "ضمان ممتد" : "Extended warranty"}
                </span>
                <span className="tabular price-sar">{warrantyTotal.toFixed(2)}</span>
              </div>
              {cart.filter(i => i.warranty).map(i => (
                <div key={`w-${i.product.id}-${i.warranty!.id}`} className="flex justify-between text-[11px] text-n3 ps-5">
                  <span className="truncate pe-2">
                    {i.product.name[lang]} · {i.warranty!.label[lang]}{i.qty > 1 ? ` × ${i.qty}` : ""}
                  </span>
                  <span className="tabular shrink-0">+{(i.warranty!.price * i.qty).toLocaleString()}</span>
                </div>
              ))}
            </div>
          )}
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
          {codFee > 0 && (
            <div className="flex justify-between text-body text-ksa-red">
              <span>{lang === "ar" ? "رسوم الدفع عند الاستلام" : "COD service fee"}</span>
              <span className="tabular price-sar">{codFee.toFixed(2)}</span>
            </div>
          )}
          <div className="flex justify-between text-body text-n2">
            <span>{t("vat")}</span>
            <span className="tabular price-sar">{vat.toFixed(2)}</span>
          </div>
          <div className="border-t border-n6 pt-2.5 mt-1 flex justify-between items-center">
            <span className="text-h2 font-bold text-n1">{t("total")}</span>
            <span className="text-h1 font-extrabold text-primary tabular price-sar">{total.toFixed(2)}</span>
          </div>
        </section>

        {/* Trust module — secure checkout, buyer protection, tracked delivery */}
        <TrustModule variant="checkout" />
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

      {/* Installments Bottom Sheet */}
      <Sheet open={showInstallSheet} onOpenChange={setShowInstallSheet}>
        <SheetContent side="bottom" className="rounded-t-3xl border-0 p-0 max-h-[85vh] overflow-y-auto">
          <div className="mx-auto w-12 h-1.5 rounded-full bg-n6 mt-3 mb-1" />
          <SheetHeader className="px-5 pt-3 pb-2 text-start">
            <SheetTitle className="text-h2 text-n1 font-bold">
              {lang === "ar" ? "اختر خطة التقسيط" : "Choose an installment plan"}
            </SheetTitle>
            <SheetDescription className="text-caption text-n3">
              {lang === "ar"
                ? `إجمالي الطلب ${total.toFixed(2)} ر.س — جميع الخطط بدون فوائد`
                : `Order total ${total.toFixed(2)} SAR — all plans are interest-free`}
            </SheetDescription>
          </SheetHeader>

          <div className="px-5 py-4 space-y-2.5">
            {([3, 4, 6, 12] as const).map(n => {
              const monthly = total / n;
              const active = installPlan === n;
              return (
                <button
                  key={n}
                  type="button"
                  onClick={() => setInstallPlan(n)}
                  className={cn(
                    "w-full bg-n8 rounded-card p-4 flex items-center gap-3 border-2 transition text-start",
                    active ? "border-primary shadow-elev1" : "border-n6",
                  )}
                >
                  <div className={cn(
                    "w-12 h-12 rounded-2xl flex flex-col items-center justify-center shrink-0 leading-none",
                    active ? "bg-primary text-n8" : "bg-primary-bg text-primary",
                  )}>
                    <span className="text-h3 font-extrabold tabular">{n}</span>
                    <span className="text-[9px] font-bold uppercase tracking-wider opacity-80 mt-0.5">
                      {lang === "ar" ? "دفعات" : "Pmts"}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-body font-bold text-n1">
                      {lang === "ar" ? `${n} دفعات شهرية` : `${n} monthly payments`}
                    </p>
                    <p className="text-caption text-n3 mt-0.5">
                      {lang === "ar"
                        ? `${monthly.toFixed(2)} ر.س / شهر · بدون فوائد`
                        : `${monthly.toFixed(2)} SAR / month · 0% interest`}
                    </p>
                  </div>
                  <div className={cn(
                    "shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition",
                    active ? "border-primary bg-primary" : "border-n4",
                  )}>
                    {active && <Check className="w-3 h-3 text-n8" strokeWidth={3} />}
                  </div>
                </button>
              );
            })}

            <div className="flex items-start gap-2.5 p-3 mt-2 rounded-card bg-info/5 border border-info/20">
              <ShieldCheck className="w-4 h-4 text-info-text shrink-0 mt-0.5" />
              <p className="text-caption text-info-text leading-relaxed">
                {lang === "ar"
                  ? "تتم الموافقة على التقسيط فوراً بعد التحقق من بطاقتك."
                  : "Installment approval is instant after card verification."}
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                setPay("installments");
                setShowInstallSheet(false);
                toast.success(
                  lang === "ar"
                    ? `تم اختيار التقسيط على ${installPlan} دفعات`
                    : `Installments set to ${installPlan} payments`,
                );
              }}
              className="w-full h-[52px] mt-2 bg-primary text-primary-foreground rounded-full font-bold shadow-cta active:scale-[0.98] transition"
            >
              {lang === "ar"
                ? `تأكيد · ${(total / installPlan).toFixed(2)} ر.س × ${installPlan}`
                : `Confirm · ${(total / installPlan).toFixed(2)} SAR × ${installPlan}`}
            </button>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};
export default Checkout;
