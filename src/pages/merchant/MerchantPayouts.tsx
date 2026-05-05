import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, Info, Wallet } from "lucide-react";
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

  return (
    <MerchantShell lang={lang} hideFab>
      <header className="bg-primary text-n8 pt-4 pb-5 rounded-b-3xl shadow-elev1 px-4">
        <div className="flex items-center gap-2">
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
          <Wallet className="w-6 h-6 opacity-90" />
        </div>
      </header>

      <main className="px-4 pt-5 pb-8 space-y-4">
        {/* Card 1 — Available Balance (primary) */}
        <section className="rounded-card shadow-elev1 p-5 bg-gradient-to-br from-primary to-primary/80 text-n8 relative overflow-hidden">
          <div className="absolute -top-10 -end-10 w-32 h-32 rounded-full bg-white/10 blur-2xl pointer-events-none" />
          <p className="text-[11px] font-semibold tracking-[0.12em] uppercase opacity-85">
            {lang === "ar" ? "الرصيد المتاح" : "Available Balance"}
          </p>
          <p className="text-display font-bold mt-1 tabular text-white">
            SAR {available.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>

          <div className="mt-4 relative">
            <button
              onClick={requestPayout}
              onMouseEnter={() => !canPayout && setShowTip(true)}
              onMouseLeave={() => setShowTip(false)}
              onFocus={() => !canPayout && setShowTip(true)}
              onBlur={() => setShowTip(false)}
              disabled={!canPayout}
              className={cn(
                "w-full h-12 rounded-full font-bold text-body bg-n8 text-primary shadow-cta transition active:scale-[0.98]",
                !canPayout && "opacity-60 cursor-not-allowed",
              )}
            >
              {lang === "ar" ? "طلب تحويل" : "Request Payout"}
            </button>

            {!canPayout && (
              <button
                type="button"
                onClick={() => setShowTip(s => !s)}
                className="mt-2 flex items-center justify-center gap-1 w-full text-caption opacity-90"
              >
                <Info className="w-3.5 h-3.5" />
                {lang === "ar" ? `الحد الأدنى للتحويل ${MIN_PAYOUT} ر.س` : `Minimum payout is SAR ${MIN_PAYOUT}`}
              </button>
            )}
            {showTip && !canPayout && (
              <div className="absolute -top-10 inset-x-0 mx-auto w-fit bg-n1 text-n8 text-caption px-3 py-1.5 rounded-md shadow-elev1">
                {lang === "ar" ? `الحد الأدنى للتحويل ${MIN_PAYOUT} ر.س` : `Minimum payout is SAR ${MIN_PAYOUT}`}
              </div>
            )}
          </div>
        </section>

        {/* Card 2 — Pending */}
        <section className="bg-n8 rounded-card shadow-elev1 p-4">
          <p className="text-h3 font-bold text-n1">{lang === "ar" ? "قيد الانتظار" : "Pending"}</p>
          <p className="text-h1 font-bold tabular text-n1 mt-1">
            SAR {pending.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
          <p className="text-caption text-n3 mt-1">
            {lang === "ar" ? "يتم الإفراج عنها خلال 7 أيام" : "Clears in 7 days"}
          </p>
        </section>

        {/* Card 3 — Total Earned */}
        <section className="bg-n8 rounded-card shadow-elev1 p-4">
          <p className="text-h3 font-bold text-n1">{lang === "ar" ? "إجمالي الأرباح" : "Total Earned"}</p>
          <p className="text-h1 font-bold tabular text-n1 mt-1">
            SAR {totalEarned.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
        </section>

        {/* Transactions */}
        <section className="space-y-4 pt-2">
          {grouped.length === 0 && (
            <div className="bg-n8 rounded-card shadow-elev1 p-8 text-center">
              <p className="text-caption text-n3">{lang === "ar" ? "لا توجد معاملات بعد" : "No transactions yet"}</p>
            </div>
          )}
          {grouped.map(([month, items]) => (
            <div key={month}>
              <p className="text-caption font-bold text-n3 uppercase tracking-wider px-1 mb-2">{month}</p>
              <div className="bg-n8 rounded-card shadow-elev1 overflow-hidden">
                {items.map((t, i) => {
                  const income = t.amount > 0;
                  return (
                    <div
                      key={t.id}
                      className={cn(
                        "flex items-center gap-3 px-4 py-3",
                        i !== items.length - 1 && "border-b border-n6",
                      )}
                    >
                      <div className={cn("w-10 h-10 rounded-full flex items-center justify-center text-lg flex-shrink-0", kindBg[t.kind])}>
                        <span aria-hidden>{kindIcon[t.kind]}</span>
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
