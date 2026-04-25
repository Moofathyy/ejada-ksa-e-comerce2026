import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Check, Calendar } from "lucide-react";
import { Sar } from "@/components/Sar";
import { useI18n } from "@/lib/i18n";

const OrderConfirmation = () => {
  const nav = useNavigate();
  const { t } = useI18n();
  const [show, setShow] = useState(false);
  const order = JSON.parse(sessionStorage.getItem("ejada_lastOrder") || "null");

  useEffect(() => { setShow(true); }, []);
  if (!order) { nav("/home"); return null; }

  return (
    <div className="phone-frame bg-n8 flex flex-col">
      {/* Confetti area */}
      <div className="bg-gradient-success p-8 pt-16 text-center text-n8 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          {Array.from({ length: 12 }).map((_, i) => (
            <span key={i} className="absolute text-2xl animate-confetti"
              style={{ left: `${(i * 8) % 100}%`, top: `${(i * 13) % 80}%`, animationDelay: `${i * 0.05}s` }}>
              {["🎉", "✨", "🎊", "⭐"][i % 4]}
            </span>
          ))}
        </div>
        <div className={`relative inline-flex w-20 h-20 rounded-full bg-n8 items-center justify-center mb-4 ${show ? 'animate-confetti' : 'opacity-0'}`}>
          <Check className="w-12 h-12 text-success" strokeWidth={3} />
        </div>
        <h1 className="text-h1">{t("orderConfirmed")}</h1>
        <p className="text-body opacity-90 mt-1">{t("orderSuccess")}</p>
      </div>

      <main className="p-4 space-y-4 flex-1">
        <div className="bg-n8 rounded-card shadow-elev1 p-4 -mt-6 relative z-10">
          <div className="flex justify-between items-center pb-3 border-b border-n6">
            <div>
              <p className="text-caption text-n3">Order Number</p>
              <p className="text-h3 text-n1 font-bold tabular">#{order.orderId}</p>
            </div>
            <div className="text-end">
              <p className="text-caption text-n3">Total Paid</p>
              <p className="text-h3 text-primary font-bold tabular">{Math.round(order.total).toLocaleString()} <Sar /></p>
            </div>
          </div>
          <div className="flex items-center gap-3 pt-3">
            <div className="w-10 h-10 rounded-full bg-success-bg flex items-center justify-center"><Calendar className="w-5 h-5 text-success-text" /></div>
            <div>
              <p className="text-caption text-n3">{t("expectedArrival")}</p>
              <p className="text-body font-semibold text-n1">Tomorrow · 6 PM – 9 PM</p>
            </div>
          </div>
        </div>

        <div className="bg-primary-bg rounded-card p-4">
          <p className="text-body text-n2">📦 {order.items} item{order.items > 1 ? "s" : ""} confirmed and being prepared</p>
          <p className="text-caption text-n3 mt-1">Payment: {order.payment.toUpperCase()}</p>
        </div>

        <div className="bg-accent rounded-card p-3 text-caption text-primary">
          💡 You'll receive an SMS with tracking details within 5 minutes.
        </div>
      </main>

      <div className="p-4 space-y-2 safe-bottom">
        <button onClick={() => nav("/orders")} className="w-full h-[52px] bg-primary text-n8 rounded-full font-semibold shadow-cta">{t("trackOrder")}</button>
        <button onClick={() => nav("/home")} className="w-full h-[52px] border-2 border-primary text-primary rounded-full font-semibold">{t("continueShopping")}</button>
      </div>
    </div>
  );
};
export default OrderConfirmation;
