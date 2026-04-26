import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, ArrowRight, Copy, MapPin, Navigation, CheckCircle2, Phone, MessageSquare, RotateCcw, FileText, Mail, HelpCircle, Package } from "lucide-react";
import { Sar } from "@/components/Sar";
import { TopBar } from "@/components/TopBar";
import { MobileShell } from "@/components/MobileShell";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

const ORDERS = [
  { id: "SA-2024-849021", date: "Today", status: "out", items: 2, total: 1899 },
  { id: "SA-2024-748390", date: "2 days ago", status: "delivered", items: 1, total: 4799 },
  { id: "SA-2024-637281", date: "Last week", status: "delivered", items: 3, total: 2450 },
];

const Orders = () => {
  const nav = useNavigate();
  const { t, lang } = useI18n();
  const tr = (en: string, ar: string) => (lang === "ar" ? ar : en);

  return (
    <MobileShell>
      <TopBar title={t("myOrders")} showBack={false} />
      <main className="p-4 space-y-3">
        {ORDERS.map(o => (
          <button key={o.id} onClick={() => nav(`/order/${o.id}`)} className="w-full bg-n8 rounded-card shadow-elev1 p-4 text-start active:scale-[0.99] transition">
            <div className="flex justify-between items-start mb-2">
              <div>
                <p className="text-caption text-n3">{tr("Order", "طلب")}</p>
                <p className="text-body font-bold text-n1 tabular">#{o.id}</p>
              </div>
              <span className={cn("text-[11px] font-bold px-2.5 py-1 rounded-full",
                o.status === "delivered" ? "bg-success-bg text-success-text" : "bg-warning-bg text-warning-text")}>
                {o.status === "delivered" ? tr("✓ Delivered", "✓ تم التوصيل") : tr("🚚 Out for Delivery", "🚚 قيد التوصيل")}
              </span>
            </div>
            <div className="flex justify-between items-center text-caption text-n2">
              <span>{o.items} {tr(o.items > 1 ? "items" : "item", "عناصر")} · {o.date}</span>
              <span className="text-h3 text-primary font-bold tabular">{o.total.toLocaleString()} <Sar /></span>
            </div>
          </button>
        ))}
      </main>
    </MobileShell>
  );
};

type Step = {
  key: string;
  label: { en: string; ar: string };
  desc: { en: string; ar: string };
  time?: string;
  status: "done" | "active" | "pending";
};

export const OrderTracking = () => {
  const nav = useNavigate();
  const { id } = useParams();
  const { lang, dir } = useI18n();
  const tr = (en: string, ar: string) => (lang === "ar" ? ar : en);
  const orderId = id || "ORD-123456";
  const tracking = "ARX-SA-2026-8472910";

  const steps: Step[] = [
    {
      key: "confirmed",
      label: { en: "Confirmed", ar: "تم التأكيد" },
      desc: { en: "Order placed successfully", ar: "تم تقديم الطلب بنجاح" },
      time: tr("Sun, Apr 17 · 10:30 AM", "الأحد، 17 أبريل · 10:30 ص"),
      status: "done",
    },
    {
      key: "packed",
      label: { en: "Packed", ar: "تم التغليف" },
      desc: { en: "Items packed and labeled", ar: "تم تغليف وتوسيم العناصر" },
      time: tr("Mon, Apr 18 · 2:15 PM", "الإثنين، 18 أبريل · 2:15 م"),
      status: "done",
    },
    {
      key: "shipped",
      label: { en: "Shipped", ar: "تم الشحن" },
      desc: { en: "Package is on the way", ar: "الطرد في الطريق" },
      time: tr("Mon, Apr 18 · 6:45 PM", "الإثنين، 18 أبريل · 6:45 م"),
      status: "done",
    },
    {
      key: "out",
      label: { en: "Out for Delivery", ar: "قيد التوصيل" },
      desc: { en: "Driver is in your area", ar: "السائق في منطقتك" },
      status: "active",
    },
    {
      key: "delivered",
      label: { en: "Delivered", ar: "تم التوصيل" },
      desc: { en: "", ar: "" },
      status: "pending",
    },
  ];

  const copyTracking = () => {
    navigator.clipboard?.writeText(tracking);
    toast.success(tr("Tracking number copied", "تم نسخ رقم التتبع"));
  };

  const ChevronBack = dir === "rtl" ? ArrowRight : ArrowLeft;

  return (
    <MobileShell>
      {/* Hero header */}
      <header className="bg-primary text-n8 px-4 pt-5 pb-8 rounded-b-3xl shadow-elev1">
        <div className="flex items-center gap-3">
          <button
            aria-label="Back"
            onClick={() => nav(-1)}
            className="w-10 h-10 rounded-full bg-n8/15 backdrop-blur flex items-center justify-center active:scale-95 transition"
          >
            <ChevronBack className="w-5 h-5" />
          </button>
          <div className="flex-1 min-w-0">
            <h1 className="text-h1 font-bold leading-tight">{tr("Track Order", "تتبع الطلب")}</h1>
            <p className="text-caption opacity-80 tabular">{tr("Order", "طلب")} #{orderId}</p>
          </div>
        </div>
      </header>

      <main className="px-4 -mt-4 pb-8 space-y-4">
        {/* Map card */}
        <div className="bg-n8 rounded-card shadow-elev1 overflow-hidden">
          <div className="relative h-44 bg-gradient-to-br from-primary/10 via-accent to-primary/5">
            {/* Decorative grid lines as map placeholder */}
            <div
              className="absolute inset-0 opacity-30"
              style={{
                backgroundImage:
                  "linear-gradient(hsl(var(--n4)/.4) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--n4)/.4) 1px, transparent 1px)",
                backgroundSize: "32px 32px",
              }}
            />
            {/* Route stroke */}
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 320 176" fill="none" preserveAspectRatio="none">
              <path d="M20 150 C 80 120, 120 60, 200 80 S 290 40, 300 30" stroke="hsl(var(--primary))" strokeWidth="3" strokeLinecap="round" strokeDasharray="6 6" />
            </svg>
            {/* ETA pill */}
            <div className="absolute top-3 start-3 bg-n8 px-3 py-2 rounded-input shadow-elev1">
              <p className="text-[10px] text-n3 uppercase tracking-wider font-bold">{tr("Estimated Arrival", "الوصول المتوقع")}</p>
              <p className="text-body font-bold text-primary tabular leading-tight">{tr("25 min", "25 دقيقة")}</p>
            </div>
            {/* Driver pointer */}
            <div className="absolute top-1/2 end-6 -translate-y-1/2 w-10 h-10 rounded-full bg-primary text-n8 flex items-center justify-center shadow-elev1 ring-4 ring-primary/20">
              <Navigation className="w-4 h-4" fill="currentColor" />
            </div>
            <div className="absolute bottom-3 end-3 w-3 h-3 rounded-full bg-success ring-4 ring-success/30" />
          </div>

          {/* Courier */}
          <div className="p-4 space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-input bg-primary text-n8 flex items-center justify-center font-bold">A</div>
              <div className="flex-1 min-w-0">
                <p className="text-body font-bold text-n1">Aramex</p>
                <p className="text-caption text-n3">{tr("Driver: Ahmed Al-Rashid", "السائق: أحمد الراشد")}</p>
              </div>
            </div>

            <button
              onClick={copyTracking}
              className="w-full flex items-center justify-between gap-3 bg-n7 rounded-input px-3 py-2.5 active:bg-n6 transition"
            >
              <span className="text-caption font-semibold text-n1 tabular truncate">{tracking}</span>
              <Copy className="w-4 h-4 text-primary flex-shrink-0" />
            </button>

            <div className="pt-1">
              <p className="text-caption text-n3">{tr("Estimated Delivery", "التوصيل المتوقع")}</p>
              <p className="text-body font-bold text-n1">{tr("Tue, Apr 20", "الثلاثاء، 20 أبريل")}</p>
            </div>
          </div>
        </div>

        {/* Timeline */}
        <div className="space-y-0">
          {steps.map((s, i) => {
            const last = i === steps.length - 1;
            const isDone = s.status === "done";
            const isActive = s.status === "active";
            const isPending = s.status === "pending";
            return (
              <div key={s.key} className="flex gap-3">
                <div className="flex flex-col items-center">
                  <div
                    className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-caption font-bold",
                      isDone && "bg-success text-n8",
                      isActive && "bg-primary text-n8 ring-4 ring-primary/20",
                      isPending && "bg-n6 text-n4",
                    )}
                  >
                    {isDone ? <CheckCircle2 className="w-5 h-5" /> : i + 1}
                  </div>
                  {!last && (
                    <div
                      className={cn(
                        "w-0.5 flex-1 my-1",
                        isDone ? "bg-success" : "bg-n6",
                      )}
                      style={{ minHeight: 56 }}
                    />
                  )}
                </div>

                <div className="flex-1 pb-5 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <p className={cn(
                      "text-body font-bold",
                      isPending ? "text-n4" : isActive ? "text-primary" : "text-n1",
                    )}>
                      {s.label[lang]}
                    </p>
                    {s.time && <p className="text-[11px] text-n3 tabular flex-shrink-0">{s.time}</p>}
                  </div>
                  {s.desc[lang] && (
                    <p className={cn("text-caption mt-0.5", isPending ? "text-n4" : "text-n3")}>{s.desc[lang]}</p>
                  )}
                  {(isDone || isActive) && s.desc[lang] && (
                    <div className={cn(
                      "mt-2 px-3 py-2 rounded-input text-caption",
                      isActive ? "bg-primary/10 text-primary" : "bg-n7 text-n2",
                    )}>
                      {isActive && (
                        <p className="font-bold mb-0.5">{tr("In Progress", "قيد التنفيذ")}</p>
                      )}
                      {isActive
                        ? tr("Your package is currently with the driver in your area.",
                             "طردك حالياً مع السائق في منطقتك.")
                        : s.desc[lang]}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Delivery address */}
        <div className="bg-n8 rounded-card shadow-elev1 p-4 flex gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
            <MapPin className="w-5 h-5 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-body font-bold text-n1">{tr("Delivery Address", "عنوان التوصيل")}</p>
            <p className="text-caption text-n2 mt-1">{tr("King Fahd Road, Building 1234", "طريق الملك فهد، مبنى 1234")}</p>
            <p className="text-caption text-n2">{tr("Al Olaya, Riyadh", "العليا، الرياض")}</p>
            <p className="text-caption text-n3 tabular mt-0.5">12213-5678</p>
          </div>
        </div>

        {/* Action buttons */}
        <div className="grid grid-cols-2 gap-3 pt-1">
          <button
            onClick={() => toast(tr("Calling support…", "جارٍ الاتصال بالدعم…"))}
            className="h-12 rounded-full border-2 border-primary text-primary font-bold flex items-center justify-center gap-2 active:bg-primary/5 transition"
          >
            <Phone className="w-4 h-4" />
            {tr("Contact", "اتصال")}
          </button>
          <button
            onClick={() => toast(tr("Opening order details", "فتح تفاصيل الطلب"))}
            className="h-12 rounded-full border-2 border-primary text-primary font-bold flex items-center justify-center gap-2 active:bg-primary/5 transition"
          >
            <FileText className="w-4 h-4" />
            {tr("Details", "التفاصيل")}
          </button>
        </div>

        {/* Return CTA */}
        <button
          onClick={() => nav(`/returns/${orderId}`)}
          className="w-full h-12 rounded-full bg-warning-bg text-warning-text font-bold flex items-center justify-center gap-2 active:scale-[0.99] transition"
        >
          <RotateCcw className="w-4 h-4" />
          {tr("Request Return", "طلب إرجاع")}
        </button>
      </main>
    </MobileShell>
  );
};

export default Orders;
