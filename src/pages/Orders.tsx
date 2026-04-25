import { useNavigate } from "react-router-dom";
import { Package, CheckCircle2, Truck, Home as HomeIcon, Phone } from "lucide-react";
import { Sar } from "@/components/Sar";
import { TopBar } from "@/components/TopBar";
import { MobileShell } from "@/components/MobileShell";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";

const ORDERS = [
  { id: "SA-2024-849021", date: "Today", status: "out", items: 2, total: 1899 },
  { id: "SA-2024-748390", date: "2 days ago", status: "delivered", items: 1, total: 4799 },
  { id: "SA-2024-637281", date: "Last week", status: "delivered", items: 3, total: 2450 },
];

const Orders = () => {
  const nav = useNavigate();
  const { t } = useI18n();

  return (
    <MobileShell>
      <TopBar title={t("myOrders")} showBack={false} />
      <main className="p-4 space-y-3">
        {ORDERS.map(o => (
          <button key={o.id} onClick={() => nav(`/order/${o.id}`)} className="w-full bg-n8 rounded-card shadow-elev1 p-4 text-start active:scale-[0.99] transition">
            <div className="flex justify-between items-start mb-2">
              <div>
                <p className="text-caption text-n3">Order</p>
                <p className="text-body font-bold text-n1 tabular">#{o.id}</p>
              </div>
              <span className={cn("text-[11px] font-bold px-2.5 py-1 rounded-full",
                o.status === "delivered" ? "bg-success-bg text-success-text" : "bg-warning-bg text-warning-text")}>
                {o.status === "delivered" ? "✓ Delivered" : "🚚 Out for Delivery"}
              </span>
            </div>
            <div className="flex justify-between items-center text-caption text-n2">
              <span>{o.items} item{o.items > 1 ? "s" : ""} · {o.date}</span>
              <span className="text-h3 text-primary font-bold tabular">{o.total.toLocaleString()} <Sar /></span>
            </div>
          </button>
        ))}
      </main>
    </MobileShell>
  );
};

export const OrderTracking = () => {
  const { t } = useI18n();
  const steps = [
    { icon: CheckCircle2, label: "Order Received", time: "9:42 AM", done: true },
    { icon: Package, label: "Processing", time: "10:15 AM", done: true },
    { icon: Package, label: "Left Warehouse", time: "11:30 AM", done: true },
    { icon: Truck, label: "On the Way", time: "Now", done: true, active: true },
    { icon: HomeIcon, label: "Delivered", time: "ETA 6-9 PM", done: false },
  ];

  return (
    <div className="phone-frame bg-n8 pb-8">
      <TopBar title="Track Order" />
      <div className="px-4 py-3 bg-primary-bg flex justify-between items-center">
        <div>
          <p className="text-caption text-n3">Order ID</p>
          <p className="text-body font-bold text-n1 tabular">#SA-2024-849021</p>
        </div>
        <span className="text-caption font-bold bg-warning-bg text-warning-text px-3 py-1.5 rounded-full">Out for Delivery</span>
      </div>

      {/* Map placeholder */}
      <div className="h-40 bg-gradient-to-br from-primary-bg to-accent flex items-center justify-center relative">
        <div className="text-5xl">📍</div>
        <span className="absolute bottom-3 start-3 bg-n8 px-3 py-1.5 rounded-full text-caption font-semibold text-primary shadow-elev1">~45 min</span>
      </div>

      <main className="p-4 space-y-4">
        <div className="bg-warning-bg/50 rounded-card p-3 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary text-n8 flex items-center justify-center font-bold">M</div>
          <div className="flex-1">
            <p className="text-body font-semibold text-n1">Mohammed S. (Driver)</p>
            <p className="text-caption text-n3">Arriving in ~45 minutes</p>
          </div>
          <button className="w-10 h-10 rounded-full bg-success text-n8 flex items-center justify-center"><Phone className="w-5 h-5" /></button>
        </div>

        <div className="space-y-0">
          {steps.map((s, i) => {
            const Icon = s.icon;
            return (
              <div key={i} className="flex gap-3">
                <div className="flex flex-col items-center">
                  <div className={cn("w-10 h-10 rounded-full flex items-center justify-center",
                    s.active ? "bg-primary text-n8 ring-4 ring-primary/20" :
                    s.done ? "bg-success text-n8" : "bg-n6 text-n4")}>
                    <Icon className="w-5 h-5" />
                  </div>
                  {i < steps.length - 1 && <div className={cn("w-0.5 flex-1 my-1", s.done ? "bg-success" : "bg-n6")} style={{ minHeight: 30 }} />}
                </div>
                <div className="flex-1 pb-6">
                  <p className={cn("text-body font-semibold", s.done || s.active ? "text-n1" : "text-n4")}>{s.label}</p>
                  <p className="text-caption text-n3">{s.time}</p>
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
};

export default Orders;
