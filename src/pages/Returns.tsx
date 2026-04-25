import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { TopBar } from "@/components/TopBar";
import { MobileShell } from "@/components/MobileShell";
import {
  Check, ChevronRight, Camera, X, Package, CreditCard, Wallet,
  RotateCcw, AlertCircle, Truck,
} from "lucide-react";
import { Sar } from "@/components/Sar";
import { products, Product } from "@/lib/data";
import { useI18n } from "@/lib/i18n";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

type Reason = { key: string; en: string; ar: string };
type Refund = { key: string; en: string; ar: string; desc: { en: string; ar: string }; icon: any };

const REASONS: Reason[] = [
  { key: "wrong",     en: "Wrong item received",   ar: "تم استلام منتج خاطئ" },
  { key: "defective", en: "Defective or damaged",  ar: "منتج معيب أو تالف" },
  { key: "size",      en: "Size doesn't fit",      ar: "المقاس غير مناسب" },
  { key: "quality",   en: "Quality not as expected", ar: "الجودة ليست كما هو متوقع" },
  { key: "notneeded", en: "No longer needed",      ar: "لم أعد بحاجة إليه" },
  { key: "other",     en: "Other",                 ar: "أخرى" },
];

const REFUNDS: Refund[] = [
  { key: "original", en: "Original payment", ar: "وسيلة الدفع الأصلية",
    desc: { en: "3-5 business days", ar: "3-5 أيام عمل" }, icon: CreditCard },
  { key: "wallet",   en: "Store credit",     ar: "رصيد المتجر",
    desc: { en: "Instant · +10% bonus", ar: "فوري · +10% مكافأة" }, icon: Wallet },
];

const Stepper = ({ step, total, lang }: { step: number; total: number; lang: "en" | "ar" }) => (
  <div className="flex items-center gap-2 px-4 py-3">
    {Array.from({ length: total }).map((_, i) => (
      <div key={i} className={cn(
        "h-1.5 flex-1 rounded-full transition-colors",
        i < step ? "bg-primary" : "bg-n6",
      )} />
    ))}
    <span className="text-caption text-n3 tabular ms-2">
      {step}/{total}
    </span>
  </div>
);

const Returns = () => {
  const nav = useNavigate();
  const { orderId } = useParams();
  const { lang, dir } = useI18n();
  const tr = (en: string, ar: string) => (lang === "ar" ? ar : en);

  const [step, setStep] = useState(1);
  const [item, setItem] = useState<Product | null>(null);
  const [reason, setReason] = useState<string | null>(null);
  const [notes, setNotes] = useState("");
  const [photos, setPhotos] = useState<string[]>([]);
  const [refund, setRefund] = useState<string>("original");

  const TOTAL = 4;
  const orderItems = products.slice(0, 3);

  const next = () => setStep(s => Math.min(s + 1, TOTAL + 1));
  const back = () => (step === 1 ? nav(-1) : setStep(s => s - 1));

  const submit = () => {
    if (!item || !reason) return;
    setStep(TOTAL + 1);
    toast.success(tr("Return request submitted", "تم إرسال طلب الإرجاع"));
  };

  const addPhoto = () => {
    if (photos.length >= 4) return;
    // demo: push a placeholder image
    setPhotos(p => [...p, `https://picsum.photos/seed/${Date.now()}/200`]);
  };

  return (
    <MobileShell>
      <TopBar
        title={tr("Request Return", "طلب إرجاع")}
        onBack={step <= TOTAL ? back : undefined}
      />

      {step <= TOTAL && <Stepper step={step} total={TOTAL} lang={lang} />}

      {orderId && step === 1 && (
        <div className="mx-4 mb-2 px-3 py-2 rounded-input bg-primary/10 text-primary text-caption font-semibold flex items-center gap-2">
          <Package className="w-4 h-4" />
          {tr("Order", "طلب")} #{orderId}
        </div>
      )}

      <main className="p-4 space-y-4">
        {/* STEP 1 — pick item */}
        {step === 1 && (
          <>
            <div>
              <h2 className="text-h2 text-n1 font-bold">{tr("Select item to return", "اختر العنصر المراد إرجاعه")}</h2>
              <p className="text-caption text-n3 mt-1">
                {tr("Items can be returned within 14 days of delivery.",
                    "يمكن إرجاع العناصر خلال 14 يوماً من التسليم.")}
              </p>
            </div>
            <div className="space-y-2">
              {orderItems.map(p => {
                const active = item?.id === p.id;
                return (
                  <button
                    key={p.id}
                    onClick={() => setItem(p)}
                    className={cn(
                      "w-full bg-n8 rounded-card shadow-elev1 p-3 flex gap-3 items-center text-start border-2 transition",
                      active ? "border-primary" : "border-transparent",
                    )}
                  >
                    <img src={p.image} className="w-16 h-16 object-contain bg-n7 rounded-input p-1" alt="" />
                    <div className="flex-1 min-w-0">
                      <p className="text-body text-n1 font-medium line-clamp-2">{p.name[lang]}</p>
                      <p className="text-caption text-primary font-bold tabular mt-0.5">
                        {p.price.toLocaleString()} <Sar />
                      </p>
                    </div>
                    <div className={cn(
                      "w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0",
                      active ? "bg-primary border-primary" : "border-n5",
                    )}>
                      {active && <Check className="w-4 h-4 text-n8" strokeWidth={3} />}
                    </div>
                  </button>
                );
              })}
            </div>
            <PrimaryBtn disabled={!item} onClick={next}>
              {tr("Continue", "متابعة")}
              <ChevronRight className={cn("w-5 h-5", dir === "rtl" && "rotate-180")} />
            </PrimaryBtn>
          </>
        )}

        {/* STEP 2 — reason */}
        {step === 2 && (
          <>
            <div>
              <h2 className="text-h2 text-n1 font-bold">{tr("Why are you returning this?", "لماذا تريد إرجاع هذا؟")}</h2>
              <p className="text-caption text-n3 mt-1">
                {tr("Help us understand so we can improve.",
                    "ساعدنا على الفهم حتى نتمكن من التحسين.")}
              </p>
            </div>
            <div className="space-y-2">
              {REASONS.map(r => {
                const active = reason === r.key;
                return (
                  <button
                    key={r.key}
                    onClick={() => setReason(r.key)}
                    className={cn(
                      "w-full p-4 bg-n8 rounded-card border-2 flex items-center justify-between text-start transition",
                      active ? "border-primary" : "border-n6",
                    )}
                  >
                    <span className="text-body font-medium text-n1">{r[lang]}</span>
                    <div className={cn(
                      "w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0",
                      active ? "bg-primary border-primary" : "border-n5",
                    )}>
                      {active && <Check className="w-4 h-4 text-n8" strokeWidth={3} />}
                    </div>
                  </button>
                );
              })}
            </div>
            <PrimaryBtn disabled={!reason} onClick={next}>
              {tr("Continue", "متابعة")}
              <ChevronRight className={cn("w-5 h-5", dir === "rtl" && "rotate-180")} />
            </PrimaryBtn>
          </>
        )}

        {/* STEP 3 — photos & notes */}
        {step === 3 && (
          <>
            <div>
              <h2 className="text-h2 text-n1 font-bold">{tr("Add photos & notes", "أضف صوراً وملاحظات")}</h2>
              <p className="text-caption text-n3 mt-1">
                {tr("Optional, but speeds up approval.",
                    "اختياري، ولكنه يسرّع الموافقة.")}
              </p>
            </div>

            <div>
              <p className="text-caption font-bold text-n2 mb-2">
                {tr("Photos", "الصور")} <span className="text-n3 font-normal">({photos.length}/4)</span>
              </p>
              <div className="grid grid-cols-4 gap-2">
                {photos.map((src, i) => (
                  <div key={i} className="relative aspect-square rounded-input overflow-hidden bg-n7">
                    <img src={src} alt="" className="w-full h-full object-cover" />
                    <button
                      onClick={() => setPhotos(p => p.filter((_, idx) => idx !== i))}
                      aria-label="Remove"
                      className="absolute top-1 end-1 w-5 h-5 rounded-full bg-n1/80 text-n8 flex items-center justify-center"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
                {photos.length < 4 && (
                  <button
                    onClick={addPhoto}
                    className="aspect-square rounded-input border-2 border-dashed border-n5 text-n3 flex flex-col items-center justify-center gap-1 active:bg-n7 transition"
                  >
                    <Camera className="w-5 h-5" />
                    <span className="text-[10px] font-medium">{tr("Add", "إضافة")}</span>
                  </button>
                )}
              </div>
            </div>

            <div>
              <label className="text-caption font-bold text-n2 mb-2 block">
                {tr("Additional notes", "ملاحظات إضافية")}
              </label>
              <textarea
                value={notes}
                onChange={e => setNotes(e.target.value.slice(0, 500))}
                rows={4}
                placeholder={tr("Describe the issue (optional)…", "صف المشكلة (اختياري)…")}
                className="w-full bg-n8 border-2 border-n6 rounded-card px-3 py-2.5 text-body text-n1 placeholder:text-n4 focus:border-primary focus:outline-none resize-none"
              />
              <p className="text-[11px] text-n3 mt-1 text-end tabular">{notes.length}/500</p>
            </div>

            <PrimaryBtn onClick={next}>
              {tr("Continue", "متابعة")}
              <ChevronRight className={cn("w-5 h-5", dir === "rtl" && "rotate-180")} />
            </PrimaryBtn>
          </>
        )}

        {/* STEP 4 — refund method + summary */}
        {step === 4 && (
          <>
            <div>
              <h2 className="text-h2 text-n1 font-bold">{tr("Choose refund method", "اختر طريقة الاسترداد")}</h2>
              <p className="text-caption text-n3 mt-1">
                {tr("How would you like to receive your refund?",
                    "كيف تود استلام مبلغ الاسترداد؟")}
              </p>
            </div>

            <div className="space-y-2">
              {REFUNDS.map(r => {
                const Icon = r.icon;
                const active = refund === r.key;
                return (
                  <button
                    key={r.key}
                    onClick={() => setRefund(r.key)}
                    className={cn(
                      "w-full p-4 bg-n8 rounded-card border-2 flex items-center gap-3 text-start transition",
                      active ? "border-primary" : "border-n6",
                    )}
                  >
                    <div className={cn(
                      "w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0",
                      active ? "bg-primary text-n8" : "bg-n7 text-primary",
                    )}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-body font-bold text-n1">{r[lang]}</p>
                      <p className="text-caption text-n3">{r.desc[lang]}</p>
                    </div>
                    <div className={cn(
                      "w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0",
                      active ? "bg-primary border-primary" : "border-n5",
                    )}>
                      {active && <Check className="w-4 h-4 text-n8" strokeWidth={3} />}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Summary */}
            <div className="bg-n8 rounded-card shadow-elev1 p-4 space-y-3">
              <p className="text-caption font-bold text-n3 uppercase tracking-wider">
                {tr("Summary", "الملخص")}
              </p>
              {item && (
                <div className="flex items-center gap-3">
                  <img src={item.image} className="w-14 h-14 object-contain bg-n7 rounded-input p-1" alt="" />
                  <div className="flex-1 min-w-0">
                    <p className="text-body text-n1 line-clamp-2">{item.name[lang]}</p>
                    <p className="text-caption text-primary font-bold tabular">
                      {item.price.toLocaleString()} <Sar />
                    </p>
                  </div>
                </div>
              )}
              <div className="flex justify-between text-caption pt-2 border-t border-n6">
                <span className="text-n3">{tr("Reason", "السبب")}</span>
                <span className="text-n1 font-semibold">
                  {REASONS.find(r => r.key === reason)?.[lang]}
                </span>
              </div>
              <div className="flex items-center gap-2 px-3 py-2 rounded-input bg-primary/10">
                <Truck className="w-4 h-4 text-primary flex-shrink-0" />
                <p className="text-caption text-primary font-medium">
                  {tr("Free pickup scheduled within 2 days",
                      "موعد استلام مجاني خلال يومين")}
                </p>
              </div>
            </div>

            <PrimaryBtn onClick={submit}>
              <Check className="w-5 h-5" />
              {tr("Submit Return Request", "إرسال طلب الإرجاع")}
            </PrimaryBtn>
          </>
        )}

        {/* STEP 5 — confirmation */}
        {step === TOTAL + 1 && (
          <div className="py-8 text-center space-y-4 animate-fade-in">
            <div className="w-20 h-20 mx-auto rounded-full bg-success flex items-center justify-center">
              <Check className="w-12 h-12 text-n8" strokeWidth={3} />
            </div>
            <div>
              <h3 className="text-h1 text-n1 font-bold">{tr("Return Confirmed", "تم تأكيد الإرجاع")}</h3>
              <p className="text-body text-n3 mt-1 px-4">
                {tr("Pickup scheduled within 2 days. You'll receive an SMS shortly.",
                    "موعد الاستلام خلال يومين. ستصلك رسالة قريباً.")}
              </p>
            </div>

            <div className="bg-n8 rounded-card shadow-elev1 p-4 text-start space-y-3">
              <Row label={tr("Return ID", "رقم الإرجاع")} value="#RET-29481" mono />
              <Row label={tr("Refund Method", "طريقة الاسترداد")}
                   value={REFUNDS.find(r => r.key === refund)?.[lang] || ""} />
              <Row label={tr("Refund Time", "مدة الاسترداد")}
                   value={REFUNDS.find(r => r.key === refund)?.desc[lang] || ""}
                   accent />
              {item && (
                <Row label={tr("Refund Amount", "مبلغ الاسترداد")}
                     value={`${item.price.toLocaleString()} ${tr("SAR", "ر.س")}`}
                     bold />
              )}
            </div>

            <div className="flex items-start gap-2 px-3 py-2.5 rounded-input bg-warning-bg text-warning-text text-caption text-start">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <p>
                {tr("Please keep the original packaging ready for the courier.",
                    "يرجى تجهيز التغليف الأصلي للمندوب.")}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                onClick={() => nav("/orders")}
                className="h-12 rounded-full border-2 border-primary text-primary font-bold flex items-center justify-center gap-2 active:bg-primary/5 transition"
              >
                <Package className="w-4 h-4" />
                {tr("My Orders", "طلباتي")}
              </button>
              <button
                onClick={() => nav("/home")}
                className="h-12 rounded-full bg-primary text-n8 font-bold flex items-center justify-center gap-2 active:scale-[0.99] transition"
              >
                <RotateCcw className="w-4 h-4" />
                {tr("Continue", "متابعة")}
              </button>
            </div>
          </div>
        )}
      </main>
    </MobileShell>
  );
};

const PrimaryBtn = ({
  children, onClick, disabled,
}: { children: React.ReactNode; onClick: () => void; disabled?: boolean }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className="w-full h-[52px] bg-primary text-n8 rounded-full font-bold shadow-elev1 disabled:opacity-50 active:scale-[0.99] transition flex items-center justify-center gap-2"
  >
    {children}
  </button>
);

const Row = ({
  label, value, mono, bold, accent,
}: { label: string; value: string; mono?: boolean; bold?: boolean; accent?: boolean }) => (
  <div className="flex justify-between items-center">
    <span className="text-caption text-n3">{label}</span>
    <span className={cn(
      "text-body",
      bold ? "font-bold text-n1" : "font-semibold",
      mono && "tabular text-n1",
      accent && "text-success-text",
      !bold && !mono && !accent && "text-n1",
    )}>
      {value}
    </span>
  </div>
);

export default Returns;
