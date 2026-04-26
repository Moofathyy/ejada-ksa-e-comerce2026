import { ShieldCheck, BadgeCheck, Truck, RefreshCw, Lock, MapPin } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";

type Variant = "detailed" | "compact" | "checkout";

interface Props {
  variant?: Variant;
  className?: string;
}

/**
 * Reusable Saudi-market trust signals: warranty, authenticity, delivery, returns.
 * - detailed: 2x2 grid with icon + title + sub (PDP)
 * - compact:  single horizontal strip of 4 mini-tiles (Cart)
 * - checkout: horizontal row emphasising secure payment + delivery promise (Checkout)
 */
export const TrustModule = ({ variant = "detailed", className }: Props) => {
  const { lang } = useI18n();
  const tr = (en: string, ar: string) => (lang === "ar" ? ar : en);

  const items = [
    {
      icon: ShieldCheck,
      title: tr("Official Warranty", "ضمان رسمي"),
      sub: tr("1-year Saudi warranty", "ضمان سعودي لمدة سنة"),
      tint: "text-success-text",
      bg: "bg-success-bg",
    },
    {
      icon: BadgeCheck,
      title: tr("100% Authentic", "أصلي 100%"),
      sub: tr("Authorized dealer", "وكيل معتمد"),
      tint: "text-primary",
      bg: "bg-primary-bg",
    },
    {
      icon: Truck,
      title: tr("Stocked in KSA", "متوفر بالسعودية"),
      sub: tr("Fast local delivery", "توصيل محلي سريع"),
      tint: "text-info-text",
      bg: "bg-info-bg",
    },
    {
      icon: RefreshCw,
      title: tr("Easy Returns", "إرجاع سهل"),
      sub: tr("15 days, free pickup", "15 يوماً، استلام مجاني"),
      tint: "text-warning-text",
      bg: "bg-warning-bg",
    },
  ];

  if (variant === "compact") {
    return (
      <div
        className={cn(
          "rounded-card border border-n6 bg-n8 p-3 grid grid-cols-4 gap-2",
          className
        )}
      >
        {items.map((it) => {
          const Icon = it.icon;
          return (
            <div key={it.title} className="flex flex-col items-center text-center gap-1">
              <div className={cn("w-9 h-9 rounded-full flex items-center justify-center", it.bg)}>
                <Icon className={cn("w-4 h-4", it.tint)} />
              </div>
              <p className="text-[10px] font-bold text-n1 leading-tight">{it.title}</p>
            </div>
          );
        })}
      </div>
    );
  }

  if (variant === "checkout") {
    const ck = [
      {
        icon: Lock,
        title: tr("Secure Checkout", "دفع آمن"),
        sub: tr("256-bit SSL encryption", "تشفير SSL بـ256 بت"),
      },
      {
        icon: ShieldCheck,
        title: tr("Buyer Protection", "حماية المشتري"),
        sub: tr("Full refund if not as described", "استرداد كامل إن لم يطابق الوصف"),
      },
      {
        icon: MapPin,
        title: tr("Tracked Delivery", "توصيل قابل للتتبع"),
        sub: tr("Live courier tracking", "تتبع حي للمندوب"),
      },
    ];
    return (
      <div className={cn("rounded-card border border-n6 bg-n8 divide-y divide-n6", className)}>
        {ck.map((it) => {
          const Icon = it.icon;
          return (
            <div key={it.title} className="flex items-center gap-3 p-3">
              <div className="w-9 h-9 rounded-full bg-primary-bg flex items-center justify-center shrink-0">
                <Icon className="w-4 h-4 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-caption font-bold text-n1">{it.title}</p>
                <p className="text-[11px] text-n3 leading-tight">{it.sub}</p>
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  // detailed (default — for PDP)
  return (
    <div className={cn("grid grid-cols-2 gap-2.5", className)}>
      {items.map((it) => {
        const Icon = it.icon;
        return (
          <div
            key={it.title}
            className="rounded-card border border-n6 bg-n8 p-3 flex items-start gap-2.5"
          >
            <div className={cn("w-9 h-9 rounded-full flex items-center justify-center shrink-0", it.bg)}>
              <Icon className={cn("w-4 h-4", it.tint)} />
            </div>
            <div className="min-w-0">
              <p className="text-caption font-bold text-n1 leading-tight">{it.title}</p>
              <p className="text-[11px] text-n3 leading-tight mt-0.5">{it.sub}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
};
