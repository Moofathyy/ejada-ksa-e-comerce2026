import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, Info, Wallet, TrendingUp, Clock, Sparkles, Download, Filter, ArrowUpRight, ArrowDownLeft } from "lucide-react";
import { MerchantShell } from "@/components/MerchantShell";
import { useI18n } from "@/lib/i18n";
import { useMerchant } from "@/lib/merchant";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

type TxKind = "sales" | "commission" | "transfer";
interface Tx {
  id: string;
  kind: TxKind;
  ref: string;
  date: number;
  amount: number; // positive=income, negative=deduction
}

const MIN_PAYOUT = 100;

const MerchantPayouts = () => {
  const nav = useNavigate();
  const { lang, dir } = useI18n();
  const { merchant, orders } = useMerchant();
  const [showTip, setShowTip] = useState(false);

  if (!merchant) { nav("/auth", { replace: true }); return null; }

  const Back = dir === "rtl" ? ArrowRight : ArrowLeft;

  // Derive ledger from delivered orders + 8% commission, plus a couple of mock past payouts.
  const txs = useMemo<Tx[]>(() => {
    const list: Tx[] = [];
    orders
      .filter(o => o.status === "delivered" || o.status === "shipped")
      .forEach(o => {
        list.push({ id: `s_${o.id}`, kind: "sales", ref: o.orderNumber, date: o.updatedAt || o.createdAt, amount: o.total });
        list.push({ id: `c_${o.id}`, kind: "commission", ref: `${lang === "ar" ? "عمولة" : "Commission"} • ${o.orderNumber}`, date: (o.updatedAt || o.createdAt) + 1, amount: -Math.round(o.total * 0.08) });
      });
    // Mock previous transfers
    const now = Date.now();
    list.push({ id: "t_1", kind: "transfer", ref: lang === "ar" ? "تحويل بنكي" : "Bank transfer", date: now - 86400000 * 14, amount: -650 });
    list.push({ id: "t_2", kind: "transfer", ref: lang === "ar" ? "تحويل بنكي" : "Bank transfer", date: now - 86400000 * 45, amount: -420 });
    return list.sort((a, b) => b.date - a.date);
  }, [orders, lang]);

  const totalEarned = txs.filter(t => t.kind === "sales").reduce((s, t) => s + t.amount, 0);
  const commissions = txs.filter(t => t.kind === "commission").reduce((s, t) => s + t.amount, 0); // negative
  const transfers = txs.filter(t => t.kind === "transfer").reduce((s, t) => s + t.amount, 0); // negative

  // Pending = revenue from "shipped" orders not yet cleared
  const pending = orders.filter(o => o.status === "shipped").reduce((s, o) => s + Math.round(o.total * 0.92), 0);
  const available = Math.max(0, totalEarned + commissions + transfers - pending);

  const canPayout = available >= MIN_PAYOUT;

  const requestPayout = () => {
    if (!canPayout) return;
    toast.success(lang === "ar" ? `تم طلب تحويل ${available.toLocaleString()} ر.س` : `Payout of SAR ${available.toLocaleString()} requested`);
  };

  // Group transactions by month
  const grouped = useMemo(() => {
    const map = new Map<string, Tx[]>();
    txs.forEach(t => {
      const d = new Date(t.date);
      const key = d.toLocaleDateString(lang === "ar" ? "ar-SA" : "en-US", { month: "long", year: "numeric" });
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(t);
    });
    return Array.from(map.entries());
  }, [txs, lang]);

  const fmtSar = (n: number) =>
    `${n < 0 ? "-" : ""}SAR ${Math.abs(n).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  const kindIcon: Record<TxKind, string> = { sales: "💰", commission: "⚡", transfer: "🏦" };
  const kindBg: Record<TxKind, string> = {
    sales: "bg-success/15",
    commission: "bg-warning/20",
    transfer: "bg-info/15",
  };

  // sparkline points from last 7 days income
  const spark = useMemo(() => {
    const days = Array.from({ length: 7 }).map((_, i) => {
      const start = new Date(); start.setHours(0,0,0,0); start.setDate(start.getDate() - (6 - i));
      const end = start.getTime() + 86400000;
      return txs.filter(t => t.kind === "sales" && t.date >= start.getTime() && t.date < end).reduce((s, t) => s + t.amount, 0);
    });
    const max = Math.max(1, ...days);
    return { days, max };
  }, [txs]);

  const [filter, setFilter] = useState<"all" | TxKind>("all");
  const filteredGrouped = useMemo(() => {
    if (filter === "all") return grouped;
    return grouped
      .map(([m, items]) => [m, items.filter(i => i.kind === filter)] as const)
      .filter(([, items]) => items.length > 0);
  }, [grouped, filter]);

  const filterChips: { key: "all" | TxKind; en: string; ar: string }[] = [
    { key: "all", en: "All", ar: "الكل" },
    { key: "sales", en: "Sales", ar: "مبيعات" },
    { key: "commission", en: "Commission", ar: "عمولة" },
    { key: "transfer", en: "Transfers", ar: "تحويلات" },
  ];

  return (
    <MerchantShell lang={lang} hideFab>
      <header className="bg-primary text-n8 pt-4 pb-20 rounded-b-3xl shadow-elev1 px-4 relative overflow-hidden">
        <div className="absolute -top-16 -end-10 w-56 h-56 rounded-full bg-white/10 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -start-10 w-60 h-60 rounded-full bg-white/5 blur-3xl pointer-events-none" />
        <div className="flex items-center gap-2 relative">
          <button
            onClick={() => nav(-1)}
            aria-label="Back"
            className="w-10 h-10 -ms-2 rounded-full flex items-center justify-center hover:bg-white/10"
          >
            <Back className="w-5 h-5" />
          </button>
          <div className="leading-tight flex-1 min-w-0">
            <p className="text-[10px] font-semibold tracking-[0.12em] opacity-80 uppercase">
              {lang === "ar" ? "المالية" : "Finances"}
            </p>
            <h1 className="text-h1 font-bold truncate">
              {lang === "ar" ? "الأرباح والتحويلات" : "Earnings & Payouts"}
            </h1>
          </div>
          <button
            onClick={() => toast(lang === "ar" ? "تنزيل الكشف قريباً" : "Statement export coming soon")}
            className="w-10 h-10 rounded-full bg-white/15 backdrop-blur flex items-center justify-center hover:bg-white/25 transition"
            aria-label="Download statement"
          >
            <Download className="w-4.5 h-4.5" />
          </button>
        </div>
      </header>

      <main className="px-4 -mt-16 pb-8 space-y-4 relative z-10">
        {/* Hero — Available Balance */}
        <section className="rounded-card shadow-elev2 p-5 bg-gradient-to-br from-primary via-primary to-primary/70 text-n8 relative overflow-hidden">
          <div className="absolute -top-12 -end-12 w-40 h-40 rounded-full bg-white/15 blur-2xl pointer-events-none" />
          <div className="absolute -bottom-10 -start-6 w-32 h-32 rounded-full bg-warning/20 blur-2xl pointer-events-none" />

          <div className="flex items-start justify-between relative">
            <div>
              <p className="text-[11px] font-semibold tracking-[0.12em] uppercase opacity-85 flex items-center gap-1.5">
                <Sparkles className="w-3 h-3" />
                {lang === "ar" ? "الرصيد المتاح" : "Available Balance"}
              </p>
              <p className="text-display font-bold mt-1.5 tabular text-white leading-none">
                <span className="text-h2 opacity-80 me-1">SAR</span>
                {available.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
            </div>
            <div className="bg-white/20 backdrop-blur rounded-full px-2.5 py-1 flex items-center gap-1 text-[10px] font-bold">
              <TrendingUp className="w-3 h-3" /> +12.4%
            </div>
          </div>

          {/* Mini sparkline */}
          <div className="mt-4 h-12 flex items-end gap-1.5 relative">
            {spark.days.map((v, i) => (
              <div
                key={i}
                className="flex-1 bg-white/40 rounded-t-sm transition-all"
                style={{ height: `${Math.max(8, (v / spark.max) * 100)}%` }}
              />
            ))}
          </div>

          <div className="mt-4 relative">
            <button
              onClick={requestPayout}
              onMouseEnter={() => !canPayout && setShowTip(true)}
              onMouseLeave={() => setShowTip(false)}
              onFocus={() => !canPayout && setShowTip(true)}
              onBlur={() => setShowTip(false)}
              disabled={!canPayout}
              className={cn(
                "w-full h-12 rounded-full font-bold text-body bg-n8 text-primary shadow-cta transition active:scale-[0.98] flex items-center justify-center gap-2",
                !canPayout && "opacity-60 cursor-not-allowed",
              )}
            >
              <ArrowUpRight className="w-4.5 h-4.5" />
              {lang === "ar" ? "طلب تحويل" : "Request Payout"}
            </button>
            {!canPayout && (
              <p className="mt-2 flex items-center justify-center gap-1 w-full text-caption opacity-90">
                <Info className="w-3.5 h-3.5" />
                {lang === "ar" ? `الحد الأدنى للتحويل ${MIN_PAYOUT} ر.س` : `Minimum payout is SAR ${MIN_PAYOUT}`}
              </p>
            )}
            {showTip && !canPayout && (
              <div className="absolute -top-9 inset-x-0 mx-auto w-fit bg-n1 text-n8 text-caption px-3 py-1.5 rounded-md shadow-elev1">
                {lang === "ar" ? `الحد الأدنى للتحويل ${MIN_PAYOUT} ر.س` : `Minimum payout is SAR ${MIN_PAYOUT}`}
              </div>
            )}
          </div>
        </section>

        {/* Pending + Total Earned (side by side) */}
        <section className="grid grid-cols-2 gap-3">
          <div className="bg-n8 rounded-card shadow-elev1 p-4 relative overflow-hidden">
            <div className="w-9 h-9 rounded-xl bg-warning/20 flex items-center justify-center">
              <Clock className="w-4.5 h-4.5 text-warning-text" />
            </div>
            <p className="text-caption text-n3 mt-2.5">{lang === "ar" ? "قيد الانتظار" : "Pending"}</p>
            <p className="text-h2 font-bold tabular text-n1 mt-0.5 truncate">
              {pending.toLocaleString()}<span className="text-caption text-n3 ms-1">SAR</span>
            </p>
            <p className="text-[10px] text-n4 mt-0.5">{lang === "ar" ? "خلال 7 أيام" : "Clears in 7d"}</p>
          </div>
          <div className="bg-n8 rounded-card shadow-elev1 p-4 relative overflow-hidden">
            <div className="w-9 h-9 rounded-xl bg-success/15 flex items-center justify-center">
              <TrendingUp className="w-4.5 h-4.5 text-success-text" />
            </div>
            <p className="text-caption text-n3 mt-2.5">{lang === "ar" ? "إجمالي الأرباح" : "Total Earned"}</p>
            <p className="text-h2 font-bold tabular text-n1 mt-0.5 truncate">
              {totalEarned.toLocaleString()}<span className="text-caption text-n3 ms-1">SAR</span>
            </p>
            <p className="text-[10px] text-n4 mt-0.5">{lang === "ar" ? "كل الأوقات" : "All-time"}</p>
          </div>
        </section>

        {/* Filter chips */}
        <section className="flex items-center gap-2 overflow-x-auto -mx-1 px-1 pb-1 scrollbar-hide">
          <Filter className="w-4 h-4 text-n3 flex-shrink-0" />
          {filterChips.map(c => {
            const active = filter === c.key;
            return (
              <button
                key={c.key}
                onClick={() => setFilter(c.key)}
                className={cn(
                  "h-8 px-3 rounded-full text-caption font-bold flex-shrink-0 transition",
                  active ? "bg-primary text-n8 shadow-elev1" : "bg-n7 text-n2 hover:bg-n6",
                )}
              >
                {lang === "ar" ? c.ar : c.en}
              </button>
            );
          })}
        </section>

        {/* Transactions */}
        <section className="space-y-4">
          {filteredGrouped.length === 0 && (
            <div className="bg-n8 rounded-card shadow-elev1 p-10 text-center">
              <div className="w-12 h-12 mx-auto rounded-full bg-n7 flex items-center justify-center mb-2">
                <Wallet className="w-5 h-5 text-n4" />
              </div>
              <p className="text-caption text-n3">{lang === "ar" ? "لا توجد معاملات" : "No transactions"}</p>
            </div>
          )}
          {filteredGrouped.map(([month, items]) => (
            <div key={month}>
              <div className="flex items-center gap-2 px-1 mb-2">
                <p className="text-caption font-bold text-n3 uppercase tracking-wider">{month}</p>
                <div className="flex-1 h-px bg-n6" />
                <p className="text-caption text-n4 tabular">
                  {items.length} {lang === "ar" ? "حركة" : items.length === 1 ? "item" : "items"}
                </p>
              </div>
              <div className="bg-n8 rounded-card shadow-elev1 overflow-hidden">
                {items.map((t, i) => {
                  const income = t.amount > 0;
                  const ArrowIcon = income ? ArrowDownLeft : ArrowUpRight;
                  return (
                    <div
                      key={t.id}
                      className={cn(
                        "flex items-center gap-3 px-4 py-3.5 hover:bg-n7/50 transition",
                        i !== items.length - 1 && "border-b border-n6",
                      )}
                    >
                      <div className={cn("w-10 h-10 rounded-full flex items-center justify-center text-lg flex-shrink-0 relative", kindBg[t.kind])}>
                        <span aria-hidden>{kindIcon[t.kind]}</span>
                        <span className={cn(
                          "absolute -bottom-0.5 -end-0.5 w-4 h-4 rounded-full flex items-center justify-center border-2 border-n8",
                          income ? "bg-success" : "bg-destructive",
                        )}>
                          <ArrowIcon className="w-2 h-2 text-white" strokeWidth={3} />
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-body font-semibold text-n1 truncate">{t.ref}</p>
                        <p className="text-caption text-n3">
                          {new Date(t.date).toLocaleDateString(lang === "ar" ? "ar-SA" : "en-US", {
                            day: "numeric", month: "short", year: "numeric",
                          })}
                        </p>
                      </div>
                      <p className={cn(
                        "text-h3 font-bold tabular flex-shrink-0",
                        income ? "text-success-text" : "text-destructive",
                      )}>
                        {income ? "+" : ""}{fmtSar(t.amount)}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </section>
      </main>
    </MerchantShell>
  );
};

export default MerchantPayouts;
