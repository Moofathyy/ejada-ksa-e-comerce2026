import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Check, Star, Sparkles, Package, ArrowRight } from "lucide-react";
import { Sar } from "@/components/Sar";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";

const OrderConfirmation = () => {
  const nav = useNavigate();
  const { t, lang, dir } = useI18n();
  const [show, setShow] = useState(false);
  const order = JSON.parse(sessionStorage.getItem("ejada_lastOrder") || "null");

  useEffect(() => { setShow(true); }, []);
  if (!order) { nav("/home"); return null; }

  // Loyalty: 10 pts per SAR, valued at 0.1 SAR each
  const earnedPoints = Math.round(order.total * 0.1) * 10;
  const pointsValue = (earnedPoints * 0.1).toFixed(2);

  // Estimated delivery — tomorrow, formatted "MMM D"
  const eta = new Date();
  eta.setDate(eta.getDate() + 1);
  const etaLabel = eta.toLocaleDateString(lang === "ar" ? "ar-SA" : "en-US", {
    month: "short", day: "numeric",
  });

  return (
    <div className="phone-frame bg-background flex flex-col min-h-screen">
      <main className="flex-1 px-6 pt-10 pb-4 space-y-6">
        {/* Success icon */}
        <div className="text-center">
          <div className={cn(
            "w-24 h-24 mx-auto rounded-full bg-success/15 flex items-center justify-center",
            show && "animate-confetti",
          )}>
            <div className="w-16 h-16 rounded-full border-[3px] border-success flex items-center justify-center">
              <Check className="w-9 h-9 text-success-text" strokeWidth={3} />
            </div>
          </div>
          <h1 className="text-h1 text-n1 mt-5">{t("orderConfirmed")}</h1>
          <p className="text-body text-n3 mt-2 px-4">
            {lang === "ar"
              ? "شكراً لطلبك. سنرسل لك تأكيداً قريباً."
              : "Thank you for your order. We'll send you a confirmation shortly."}
          </p>
        </div>

        {/* Order details card */}
        <div className="bg-n7 rounded-card p-5 space-y-3.5">
          <Row
            label={lang === "ar" ? "رقم الطلب" : "Order ID"}
            value={<span className="text-primary font-bold tabular">ORD-{order.orderId}</span>}
          />
          <Row
            label={lang === "ar" ? "المبلغ الإجمالي" : "Total Amount"}
            value={
              <span className="font-bold text-n1 tabular inline-flex items-baseline gap-1">
                <Sar className="text-primary" />
                {Number(order.total).toLocaleString(undefined, { maximumFractionDigits: 1 })}
              </span>
            }
          />
          <Row
            label={lang === "ar" ? "التوصيل المتوقع" : "Estimated Delivery"}
            value={<span className="font-bold text-n1">{etaLabel}</span>}
          />
        </div>

        {/* Loyalty reward card */}
        <div className="rounded-card p-5 bg-warning relative overflow-hidden text-n1 shadow-elev2">
          <Sparkles className="absolute end-4 top-4 w-20 h-20 opacity-25" strokeWidth={1.5} />
          <Sparkles className="absolute end-14 top-12 w-10 h-10 opacity-20" strokeWidth={1.5} />

          <div className="flex items-center gap-2.5 relative">
            <div className="w-8 h-8 rounded-full bg-n1 flex items-center justify-center">
              <Star className="w-4 h-4 text-warning fill-warning" />
            </div>
            <span className="text-[11px] font-bold tracking-[0.16em] uppercase">
              {lang === "ar" ? "مكافأة الولاء" : "Loyalty Reward"}
            </span>
          </div>

          <p className="text-h1 font-bold mt-3 relative">
            {lang === "ar"
              ? `ربحت ${earnedPoints} نقطة!`
              : `You earned ${earnedPoints} points!`}
          </p>
          <p className="text-caption mt-1 opacity-80 inline-flex items-baseline gap-1 relative">
            = <Sar /> {pointsValue} {lang === "ar" ? "قيمة" : "value"}
          </p>

          <button
            onClick={() => nav("/profile/loyalty")}
            className="mt-4 inline-flex items-center gap-1 text-caption font-bold underline underline-offset-4 relative"
          >
            {lang === "ar" ? "عرض نقاطي" : "View my points"}
            <ArrowRight className={cn("w-4 h-4", dir === "rtl" && "rotate-180")} />
          </button>
        </div>
      </main>

      {/* CTAs */}
      <div className="px-6 pb-6 pt-2 space-y-3 safe-bottom">
        <button
          onClick={() => nav("/orders")}
          className="w-full h-[52px] bg-primary text-primary-foreground rounded-full font-bold shadow-cta flex items-center justify-center gap-2"
        >
          <Package className="w-5 h-5" />
          {t("trackOrder")}
        </button>
        <button
          onClick={() => nav("/home")}
          className="w-full h-[52px] border-2 border-primary text-primary rounded-full font-bold"
        >
          {t("continueShopping")}
        </button>
      </div>
    </div>
  );
};

const Row = ({ label, value }: { label: string; value: React.ReactNode }) => (
  <div className="flex items-center justify-between gap-4">
    <span className="text-caption text-n3">{label}</span>
    <span className="text-body">{value}</span>
  </div>
);

export default OrderConfirmation;
