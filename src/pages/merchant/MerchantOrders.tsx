import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Phone, MapPin, ChevronDown, ChevronUp } from "lucide-react";
import { MerchantShell } from "@/components/MerchantShell";
import { useI18n } from "@/lib/i18n";
import { useMerchant, OrderStatus } from "@/lib/merchant";
import { StatusBadge } from "./MerchantDashboard";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const tabsList: { key: "all" | OrderStatus; en: string; ar: string }[] = [
  { key: "all", en: "All", ar: "الكل" },
  { key: "new", en: "New", ar: "جديد" },
  { key: "accepted", en: "Accepted", ar: "مقبول" },
  { key: "shipped", en: "Shipped", ar: "مشحون" },
  { key: "delivered", en: "Delivered", ar: "مسلم" },
];

const MerchantOrders = () => {
  const nav = useNavigate();
  const { lang } = useI18n();
  const { merchant, orders, setOrderStatus } = useMerchant();
  const [tab, setTab] = useState<"all" | OrderStatus>("all");
  const [expanded, setExpanded] = useState<string | null>(null);

  if (!merchant) { nav("/auth", { replace: true }); return null; }

  const filtered = tab === "all" ? orders : orders.filter(o => o.status === tab);
  const sorted = [...filtered].sort((a, b) => b.createdAt - a.createdAt);

  const nextStatus = (s: OrderStatus): OrderStatus | null => {
    if (s === "new") return "accepted";
    if (s === "accepted") return "shipped";
    if (s === "shipped") return "delivered";
    return null;
  };

  const nextLabel = (s: OrderStatus) => {
    const n = nextStatus(s);
    if (!n) return null;
    const map: Record<OrderStatus, { en: string; ar: string }> = {
      new: { en: "Accept", ar: "قبول" },
      accepted: { en: "Mark Shipped", ar: "تم الشحن" },
      shipped: { en: "Mark Delivered", ar: "تم التسليم" },
      delivered: { en: "", ar: "" },
      cancelled: { en: "", ar: "" },
    };
    return { next: n, label: map[s][lang] };
  };

  return (
    <MerchantShell lang={lang}>
      <header className="bg-primary text-n8 pt-6 pb-5 rounded-b-3xl shadow-elev1 px-5">
        <p className="text-[11px] font-semibold tracking-[0.12em] opacity-80 uppercase">{lang === "ar" ? "إدارة" : "Management"}</p>
        <h1 className="text-h1 font-bold">{lang === "ar" ? "الطلبات" : "Orders"}</h1>
        <div className="grid grid-cols-3 gap-2 mt-4">
          {[
            { label: lang === "ar" ? "جديد" : "New", value: orders.filter(o => o.status === "new").length },
            { label: lang === "ar" ? "قيد التنفيذ" : "Processing", value: orders.filter(o => o.status === "accepted" || o.status === "shipped").length },
            { label: lang === "ar" ? "مسلم" : "Delivered", value: orders.filter(o => o.status === "delivered").length },
          ].map(s => (
            <div key={s.label} className="bg-n8/10 backdrop-blur rounded-input px-3 py-2.5">
              <p className="text-[11px] opacity-80">{s.label}</p>
              <p className="text-h2 font-bold mt-0.5">{s.value}</p>
            </div>
          ))}
        </div>
      </header>

      <div className="px-4 pt-4">
        <div className="flex gap-2 overflow-x-auto -mx-1 px-1 no-scrollbar">
          {tabsList.map(tt => (
            <button
              key={tt.key}
              onClick={() => setTab(tt.key)}
              className={cn(
                "px-3.5 h-9 rounded-full text-caption font-semibold whitespace-nowrap transition",
                tab === tt.key ? "bg-primary text-n8" : "bg-n7 text-n2"
              )}
            >
              {lang === "ar" ? tt.ar : tt.en}
            </button>
          ))}
        </div>
      </div>

      <main className="px-4 pt-3 pb-6 space-y-2.5">
        {sorted.length === 0 ? (
          <p className="text-center py-16 text-n3">{lang === "ar" ? "لا توجد طلبات" : "No orders"}</p>
        ) : sorted.map(o => {
          const isOpen = expanded === o.id;
          const adv = nextLabel(o.status);
          return (
            <div key={o.id} className="bg-n8 rounded-card shadow-elev1 overflow-hidden">
              <button onClick={() => setExpanded(isOpen ? null : o.id)} className="w-full px-4 py-3.5 flex items-center gap-3 active:bg-n7 transition">
                <div className="flex-1 min-w-0 text-start">
                  <div className="flex items-center gap-2">
                    <p className="text-body font-bold text-n1">{o.orderNumber}</p>
                    <StatusBadge status={o.status} lang={lang} />
                  </div>
                  <p className="text-caption text-n3 mt-0.5 truncate">{o.customerName} • {o.items.length} {lang === "ar" ? "صنف" : "items"}</p>
                </div>
                <div className="text-end">
                  <p className="text-body font-bold text-n1 tabular">{o.total.toLocaleString()} SAR</p>
                  <p className="text-caption text-n3">{new Date(o.createdAt).toLocaleDateString(lang === "ar" ? "ar-SA" : "en-US", { month: "short", day: "numeric" })}</p>
                </div>
                {isOpen ? <ChevronUp className="w-4 h-4 text-n4" /> : <ChevronDown className="w-4 h-4 text-n4" />}
              </button>

              {isOpen && (
                <div className="px-4 pb-4 pt-1 border-t border-n6 space-y-3">
                  <div className="space-y-1.5 pt-3">
                    <div className="flex items-center gap-2 text-caption text-n2">
                      <Phone className="w-4 h-4 text-n4" /> <span dir="ltr">{o.customerPhone}</span>
                    </div>
                    <div className="flex items-center gap-2 text-caption text-n2">
                      <MapPin className="w-4 h-4 text-n4" /> {o.city}
                    </div>
                  </div>
                  <div className="bg-n7 rounded-input p-3 space-y-2">
                    {o.items.map((it, i) => (
                      <div key={i} className="flex items-center justify-between text-caption">
                        <span className="text-n1 font-medium truncate flex-1">{it.name}</span>
                        <span className="text-n3 mx-2">×{it.qty}</span>
                        <span className="text-n1 font-bold tabular">{(it.qty * it.price).toLocaleString()} SAR</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    {adv && (
                      <button
                        onClick={() => { setOrderStatus(o.id, adv.next); toast.success(lang === "ar" ? "تم تحديث الطلب" : "Order updated"); }}
                        className="flex-1 h-11 rounded-full bg-primary text-n8 font-bold text-caption active:scale-[0.99] transition"
                      >
                        {adv.label}
                      </button>
                    )}
                    {o.status !== "delivered" && o.status !== "cancelled" && (
                      <button
                        onClick={() => { if (confirm(lang === "ar" ? "إلغاء هذا الطلب؟" : "Cancel this order?")) { setOrderStatus(o.id, "cancelled"); toast(lang === "ar" ? "تم الإلغاء" : "Order cancelled"); } }}
                        className="px-4 h-11 rounded-full bg-destructive/10 text-destructive font-bold text-caption"
                      >
                        {lang === "ar" ? "إلغاء" : "Cancel"}
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </main>
    </MerchantShell>
  );
};

export default MerchantOrders;
