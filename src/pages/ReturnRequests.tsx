import { useNavigate } from "react-router-dom";
import { MobileShell } from "@/components/MobileShell";
import { TopBar } from "@/components/TopBar";
import { useI18n } from "@/lib/i18n";
import { Sar } from "@/components/Sar";
import { Package, RotateCcw, CheckCircle2, Clock, XCircle, ChevronRight, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

type ReturnStatus = "pending" | "approved" | "in_transit" | "refunded" | "rejected";

type ReturnRequest = {
  id: string;
  orderId: string;
  productName: { en: string; ar: string };
  image: string;
  date: string;
  amount: number;
  reason: { en: string; ar: string };
  status: ReturnStatus;
  refundMethod: { en: string; ar: string };
};

const SAMPLE: ReturnRequest[] = [
  {
    id: "RET-2401-AX",
    orderId: "ORD-8821",
    productName: { en: "Wireless Headphones Pro", ar: "سماعات لاسلكية برو" },
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200",
    date: "2026-04-22",
    amount: 449,
    reason: { en: "Defective or damaged", ar: "منتج معيب أو تالف" },
    status: "in_transit",
    refundMethod: { en: "Original payment", ar: "وسيلة الدفع الأصلية" },
  },
  {
    id: "RET-2387-BK",
    orderId: "ORD-8754",
    productName: { en: "Smart Watch Series 9", ar: "ساعة ذكية الإصدار 9" },
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200",
    date: "2026-04-15",
    amount: 1299,
    reason: { en: "Size doesn't fit", ar: "المقاس غير مناسب" },
    status: "refunded",
    refundMethod: { en: "Store credit", ar: "رصيد المتجر" },
  },
  {
    id: "RET-2356-CM",
    orderId: "ORD-8702",
    productName: { en: "Bluetooth Speaker", ar: "مكبر صوت بلوتوث" },
    image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=200",
    date: "2026-04-08",
    amount: 199,
    reason: { en: "No longer needed", ar: "لم أعد بحاجة إليه" },
    status: "pending",
    refundMethod: { en: "Original payment", ar: "وسيلة الدفع الأصلية" },
  },
  {
    id: "RET-2298-DZ",
    orderId: "ORD-8611",
    productName: { en: "Laptop Stand Aluminum", ar: "حامل لابتوب من الألمنيوم" },
    image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=200",
    date: "2026-03-28",
    amount: 159,
    reason: { en: "Quality not as expected", ar: "الجودة ليست كما هو متوقع" },
    status: "rejected",
    refundMethod: { en: "Original payment", ar: "وسيلة الدفع الأصلية" },
  },
];

const statusConfig: Record<ReturnStatus, { en: string; ar: string; icon: any; cls: string }> = {
  pending:    { en: "Pending Review", ar: "قيد المراجعة",    icon: Clock,         cls: "bg-warning-bg text-warning-text" },
  approved:   { en: "Approved",       ar: "تمت الموافقة",    icon: CheckCircle2,  cls: "bg-success-bg text-success-text" },
  in_transit: { en: "In Transit",     ar: "قيد الشحن",       icon: RotateCcw,     cls: "bg-primary/10 text-primary" },
  refunded:   { en: "Refunded",       ar: "تم الاسترداد",    icon: CheckCircle2,  cls: "bg-success-bg text-success-text" },
  rejected:   { en: "Rejected",       ar: "مرفوض",           icon: XCircle,       cls: "bg-warning-bg text-warning-text" },
};

const ReturnRequests = () => {
  const nav = useNavigate();
  const { lang, dir } = useI18n();
  const tr = (en: string, ar: string) => (lang === "ar" ? ar : en);

  return (
    <MobileShell>
      <TopBar title={tr("Returned Requests", "طلبات الإرجاع")} onBack={() => nav(-1)} />

      <main className="px-4 pt-4 pb-6 space-y-3">
        {/* Summary */}
        <div className="bg-primary text-n8 rounded-card p-4 shadow-elev1 flex items-center gap-3">
          <div className="w-11 h-11 rounded-full bg-n8/15 flex items-center justify-center">
            <RotateCcw className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <p className="text-caption opacity-80">{tr("Total Requests", "إجمالي الطلبات")}</p>
            <p className="text-h1 font-bold tabular">{SAMPLE.length}</p>
          </div>
          <button
            onClick={() => nav("/returns")}
            className="bg-n8 text-primary rounded-full px-3 py-2 text-caption font-bold flex items-center gap-1"
          >
            <Plus className="w-4 h-4" /> {tr("New", "جديد")}
          </button>
        </div>

        {SAMPLE.length === 0 ? (
          <div className="bg-n8 rounded-card shadow-elev1 p-8 text-center">
            <Package className="w-12 h-12 text-n4 mx-auto mb-2" />
            <p className="text-body font-medium text-n1">{tr("No return requests", "لا توجد طلبات إرجاع")}</p>
            <p className="text-caption text-n3 mt-1">{tr("Your return requests will appear here", "ستظهر طلبات الإرجاع هنا")}</p>
          </div>
        ) : (
          SAMPLE.map((req) => {
            const sc = statusConfig[req.status];
            const SIcon = sc.icon;
            return (
              <button
                key={req.id}
                onClick={() => nav(`/returns/${req.orderId}`)}
                className="w-full bg-n8 rounded-card shadow-elev1 p-3.5 active:bg-n7 transition-colors text-start"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-caption text-n3 tabular">{req.id}</span>
                  <span className={cn("inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold", sc.cls)}>
                    <SIcon className="w-3 h-3" /> {tr(sc.en, sc.ar)}
                  </span>
                </div>

                <div className="flex gap-3">
                  <img src={req.image} alt="" className="w-16 h-16 rounded-input object-cover bg-n7 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-body font-bold text-n1 truncate">{tr(req.productName.en, req.productName.ar)}</p>
                    <p className="text-caption text-n3 mt-0.5">{tr("Reason: ", "السبب: ")}{tr(req.reason.en, req.reason.ar)}</p>
                    <p className="text-caption text-n3 mt-0.5 tabular">{req.date} · {req.orderId}</p>
                  </div>
                  <ChevronRight className={cn("w-5 h-5 text-n4 self-center", dir === "rtl" && "rotate-180")} />
                </div>

                <div className="mt-3 pt-3 border-t border-n6 flex items-center justify-between">
                  <span className="text-caption text-n3">{tr(req.refundMethod.en, req.refundMethod.ar)}</span>
                  <span className="text-body font-bold text-primary inline-flex items-center gap-1 tabular">
                    <Sar className="w-3.5 h-3.5" /> {req.amount}
                  </span>
                </div>
              </button>
            );
          })
        )}
      </main>
    </MobileShell>
  );
};

export default ReturnRequests;
