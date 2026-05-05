import { useNavigate } from "react-router-dom";
import { TrendingUp, TrendingDown, ShoppingBag, Package, DollarSign, Eye, ArrowUpRight, Bell } from "lucide-react";
import { MerchantShell } from "@/components/MerchantShell";
import { useI18n } from "@/lib/i18n";
import { useMerchant } from "@/lib/merchant";
import { cn } from "@/lib/utils";

const MerchantDashboard = () => {
  const nav = useNavigate();
  const { lang } = useI18n();
  const { merchant, products, orders } = useMerchant();

  if (!merchant) {
    nav("/auth", { replace: true });
    return null;
  }

  const revenue = orders.filter(o => o.status === "delivered").reduce((s, o) => s + o.total, 0);
  const pendingRevenue = orders.filter(o => o.status !== "delivered" && o.status !== "cancelled").reduce((s, o) => s + o.total, 0);
  const newOrders = orders.filter(o => o.status === "new").length;
  const activeProducts = products.filter(p => p.status === "active").length;

  // Top products by units sold
  const sales: Record<string, { name: string; units: number; revenue: number }> = {};
  orders.forEach(o => o.items.forEach(it => {
    const k = it.productId;
    if (!sales[k]) sales[k] = { name: it.name, units: 0, revenue: 0 };
    sales[k].units += it.qty;
    sales[k].revenue += it.qty * it.price;
  }));
  const topProducts = Object.values(sales).sort((a, b) => b.revenue - a.revenue).slice(0, 3);

  // Last 7 days bars
  const days = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date(); d.setDate(d.getDate() - (6 - i)); d.setHours(0,0,0,0);
    const next = d.getTime() + 86400000;
    const total = orders.filter(o => o.createdAt >= d.getTime() && o.createdAt < next).reduce((s, o) => s + o.total, 0);
    return { label: d.toLocaleDateString(lang === "ar" ? "ar-SA" : "en-US", { weekday: "short" }), total };
  });
  const maxBar = Math.max(1, ...days.map(d => d.total));

  const stats = [
    { icon: DollarSign, label: lang === "ar" ? "الإيرادات" : "Revenue", value: `${revenue.toLocaleString()} SAR`, change: "+12.4%", up: true,
      tile: "bg-gradient-to-br from-emerald-400 to-emerald-600" },
    { icon: ShoppingBag, label: lang === "ar" ? "طلبات جديدة" : "New Orders", value: String(newOrders), change: `+${newOrders}`, up: true,
      tile: "bg-gradient-to-br from-fuchsia-500 to-pink-600" },
    { icon: Package, label: lang === "ar" ? "المنتجات" : "Products", value: String(activeProducts), change: `${products.length - activeProducts} ${lang === "ar" ? "غير نشط" : "inactive"}`, up: false,
      tile: "bg-gradient-to-br from-amber-400 to-orange-500" },
    { icon: Eye, label: lang === "ar" ? "قيد التجهيز" : "In Pipeline", value: `${pendingRevenue.toLocaleString()} SAR`, change: "+8.1%", up: true,
      tile: "bg-gradient-to-br from-sky-400 to-indigo-600" },
  ];

  const barColors = [
    "from-rose-400 to-rose-600",
    "from-orange-400 to-amber-500",
    "from-amber-400 to-yellow-500",
    "from-emerald-400 to-teal-500",
    "from-sky-400 to-cyan-500",
    "from-indigo-400 to-violet-500",
    "from-fuchsia-400 to-pink-500",
  ];

  const rankTiles = [
    "bg-gradient-to-br from-yellow-400 to-amber-500 text-white",
    "bg-gradient-to-br from-slate-300 to-slate-500 text-white",
    "bg-gradient-to-br from-orange-400 to-rose-500 text-white",
  ];

  return (
    <MerchantShell lang={lang}>
      <header className="bg-gradient-to-br from-violet-600 via-fuchsia-500 to-pink-500 text-white pt-6 pb-6 rounded-b-3xl shadow-elev1 px-5 relative overflow-hidden">
        <div className="absolute -top-10 -end-10 w-40 h-40 rounded-full bg-white/10 blur-2xl pointer-events-none" />
        <div className="absolute -bottom-12 -start-8 w-44 h-44 rounded-full bg-amber-300/20 blur-3xl pointer-events-none" />
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[11px] font-semibold tracking-[0.12em] opacity-80 uppercase">
              {lang === "ar" ? "مرحباً بعودتك" : "Welcome back"}
            </p>
            <h1 className="text-h1 font-bold">{merchant.businessName}</h1>
            <p className="text-caption opacity-80 mt-0.5">{merchant.ownerName}</p>
          </div>
          <button onClick={() => nav("/notifications")} className="relative w-10 h-10 rounded-xl bg-n8/15 backdrop-blur flex items-center justify-center">
            <Bell className="w-5 h-5" />
            {newOrders > 0 && (
              <span className="absolute -top-1 -end-1 min-w-[18px] h-[18px] px-1 rounded-full bg-warning text-n1 text-[10px] font-bold flex items-center justify-center">{newOrders}</span>
            )}
          </button>
        </div>

        <div className="mt-5 bg-n8/10 backdrop-blur rounded-2xl p-4">
          <p className="text-[11px] opacity-80 uppercase tracking-wider">{lang === "ar" ? "إجمالي المبيعات" : "Total Sales"}</p>
          <p className="text-display font-bold mt-1 tabular">{revenue.toLocaleString()} <span className="text-h2">SAR</span></p>
          <div className="flex items-center gap-1.5 mt-1 text-caption">
            <TrendingUp className="w-4 h-4" />
            <span className="font-semibold">+12.4%</span>
            <span className="opacity-70">{lang === "ar" ? "مقارنة بالأسبوع الماضي" : "vs last week"}</span>
          </div>
        </div>
      </header>

      <main className="px-4 pt-5 pb-6 space-y-5">
        {/* Stats grid */}
        <div className="grid grid-cols-2 gap-3">
          {stats.map(s => {
            const Icon = s.icon;
            return (
              <div key={s.label} className={cn("rounded-card shadow-elev1 p-3.5 text-white relative overflow-hidden", s.tile)}>
                <div className="absolute -top-6 -end-6 w-20 h-20 rounded-full bg-white/15 pointer-events-none" />
                <div className="flex items-center justify-between relative">
                  <div className="w-9 h-9 rounded-xl bg-white/25 backdrop-blur flex items-center justify-center">
                    <Icon className="w-4.5 h-4.5 text-white" />
                  </div>
                  <span className="text-[10px] font-bold flex items-center gap-0.5 bg-white/20 backdrop-blur px-1.5 py-0.5 rounded-full">
                    {s.up ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                    {s.change}
                  </span>
                </div>
                <p className="text-[11px] opacity-90 mt-2.5 relative">{s.label}</p>
                <p className="text-h3 font-bold mt-0.5 tabular relative">{s.value}</p>
              </div>
            );
          })}
        </div>

        {/* Sales chart */}
        <section className="bg-n8 rounded-card shadow-elev1 p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-h3 font-bold text-n1">{lang === "ar" ? "آخر 7 أيام" : "Last 7 Days"}</h3>
            <span className="text-caption text-n3">{lang === "ar" ? "المبيعات" : "Sales"}</span>
          </div>
          <div className="flex items-end justify-between gap-2 h-32">
            {days.map((d, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1.5">
                <div className="w-full bg-n7 rounded-t-md relative" style={{ height: "100%" }}>
                  <div
                    className={cn("absolute bottom-0 inset-x-0 bg-gradient-to-t rounded-t-md transition-all", barColors[i % barColors.length])}
                    style={{ height: `${(d.total / maxBar) * 100}%` }}
                  />
                </div>
                <span className="text-[10px] text-n3">{d.label}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Top products */}
        <section>
          <div className="flex items-center justify-between mb-3 px-1">
            <h3 className="text-h3 font-bold text-n1">{lang === "ar" ? "الأعلى مبيعاً" : "Top Products"}</h3>
            <button onClick={() => nav("/merchant/products")} className="text-caption font-bold text-primary flex items-center gap-0.5">
              {lang === "ar" ? "عرض الكل" : "View all"} <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="bg-n8 rounded-card shadow-elev1 overflow-hidden">
            {topProducts.length === 0 ? (
              <p className="p-6 text-center text-caption text-n3">{lang === "ar" ? "لا توجد بيانات بعد" : "No sales yet"}</p>
            ) : topProducts.map((p, i) => (
              <div key={i} className="flex items-center gap-3 px-4 py-3 border-b border-n6 last:border-0">
                <div className={cn("w-8 h-8 rounded-full font-bold flex items-center justify-center text-caption shadow-sm", rankTiles[i] || "bg-primary/10 text-primary")}>#{i + 1}</div>
                <div className="flex-1 min-w-0">
                  <p className="text-body font-semibold text-n1 truncate">{p.name}</p>
                  <p className="text-caption text-n3">{p.units} {lang === "ar" ? "قطعة مباعة" : "units sold"}</p>
                </div>
                <p className="text-body font-bold text-n1 tabular">{p.revenue.toLocaleString()}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Recent orders */}
        <section>
          <div className="flex items-center justify-between mb-3 px-1">
            <h3 className="text-h3 font-bold text-n1">{lang === "ar" ? "أحدث الطلبات" : "Recent Orders"}</h3>
            <button onClick={() => nav("/merchant/orders")} className="text-caption font-bold text-primary flex items-center gap-0.5">
              {lang === "ar" ? "عرض الكل" : "View all"} <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="bg-n8 rounded-card shadow-elev1 overflow-hidden">
            {orders.slice(0, 4).map(o => (
              <button key={o.id} onClick={() => nav("/merchant/orders")} className="w-full flex items-center gap-3 px-4 py-3 border-b border-n6 last:border-0 active:bg-n7 transition">
                <div className="flex-1 min-w-0 text-start">
                  <p className="text-body font-semibold text-n1 truncate">{o.orderNumber}</p>
                  <p className="text-caption text-n3 truncate">{o.customerName} • {o.city}</p>
                </div>
                <div className="text-end">
                  <p className="text-body font-bold text-n1 tabular">{o.total.toLocaleString()} SAR</p>
                  <StatusBadge status={o.status} lang={lang} />
                </div>
              </button>
            ))}
          </div>
        </section>
      </main>
    </MerchantShell>
  );
};

export const StatusBadge = ({ status, lang }: { status: string; lang: "en" | "ar" }) => {
  const map: Record<string, { en: string; ar: string; cls: string }> = {
    new: { en: "New", ar: "جديد", cls: "bg-info/15 text-info" },
    accepted: { en: "Accepted", ar: "مقبول", cls: "bg-warning/20 text-warning-text" },
    shipped: { en: "Shipped", ar: "مشحون", cls: "bg-primary/15 text-primary" },
    delivered: { en: "Delivered", ar: "مسلم", cls: "bg-success/15 text-success" },
    cancelled: { en: "Cancelled", ar: "ملغي", cls: "bg-destructive/15 text-destructive" },
  };
  const m = map[status] || map.new;
  return <span className={cn("inline-block mt-0.5 text-[10px] font-bold px-2 py-0.5 rounded-full", m.cls)}>{lang === "ar" ? m.ar : m.en}</span>;
};

export default MerchantDashboard;
