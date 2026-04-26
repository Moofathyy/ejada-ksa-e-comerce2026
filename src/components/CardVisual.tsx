import { Wifi, CreditCard as CreditCardIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export type CardBrand = "mada" | "visa" | "mastercard" | "amex" | "unknown";

/** Detect brand from a digit-only PAN. Mada BINs take precedence over Visa/MC. */
export const detectBrand = (digits: string): CardBrand => {
  const d = digits.replace(/\D/g, "");
  if (!d) return "unknown";
  // Mada BINs (subset of well-known Saudi Mada prefixes)
  const madaBins = [
    "440533", "440647", "440795", "445564", "446672", "457865", "468540",
    "468541", "468542", "468543", "474491", "488845", "493428", "504300",
    "508160", "513213", "535825", "543357", "557606", "558848", "588845",
    "588848", "636120",
  ];
  if (madaBins.some(b => d.startsWith(b))) return "mada";
  if (/^4/.test(d)) return "visa";
  if (/^(5[1-5]|2[2-7])/.test(d)) return "mastercard";
  if (/^3[47]/.test(d)) return "amex";
  return "unknown";
};

/** Format PAN with spaces: 4-4-4-4 (Amex 4-6-5). */
export const formatCardNumber = (raw: string): string => {
  const d = raw.replace(/\D/g, "").slice(0, 19);
  const brand = detectBrand(d);
  if (brand === "amex") {
    return [d.slice(0, 4), d.slice(4, 10), d.slice(10, 15)].filter(Boolean).join(" ");
  }
  return d.match(/.{1,4}/g)?.join(" ") ?? "";
};

const BRAND_GRADIENT: Record<CardBrand, string> = {
  mada:       "from-[hsl(155_70%_22%)] via-[hsl(155_55%_30%)] to-[hsl(38_92%_50%)]",
  visa:       "from-[hsl(220_70%_18%)] via-[hsl(220_60%_28%)] to-[hsl(220_80%_45%)]",
  mastercard: "from-[hsl(355_70%_25%)] via-[hsl(20_75%_35%)] to-[hsl(35_85%_50%)]",
  amex:       "from-[hsl(200_75%_30%)] via-[hsl(200_60%_42%)] to-[hsl(190_70%_55%)]",
  unknown:    "from-n2 via-n3 to-n4",
};

const BrandLogo = ({ brand }: { brand: CardBrand }) => {
  if (brand === "mada") {
    return (
      <div className="flex items-baseline gap-0.5 leading-none">
        <span className="text-base font-black tracking-tight text-white">mada</span>
        <span className="w-1.5 h-1.5 rounded-full bg-[hsl(38_92%_55%)]" />
      </div>
    );
  }
  if (brand === "visa") {
    return <span className="text-xl font-black italic tracking-tighter text-white">VISA</span>;
  }
  if (brand === "mastercard") {
    return (
      <div className="flex items-center -space-x-2">
        <span className="w-6 h-6 rounded-full bg-[hsl(355_85%_55%)]" />
        <span className="w-6 h-6 rounded-full bg-[hsl(38_92%_55%)] mix-blend-screen" />
      </div>
    );
  }
  if (brand === "amex") {
    return <span className="text-xs font-black tracking-widest text-white px-2 py-1 border border-white/40 rounded">AMEX</span>;
  }
  return <CreditCardIcon className="w-7 h-7 text-white/80" />;
};

/** EMV chip — small SVG for realism. */
const Chip = () => (
  <svg viewBox="0 0 40 32" className="w-10 h-8" aria-hidden>
    <defs>
      <linearGradient id="chipG" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#E8C26A" />
        <stop offset="50%" stopColor="#B8862B" />
        <stop offset="100%" stopColor="#8E6418" />
      </linearGradient>
    </defs>
    <rect x="0.5" y="0.5" width="39" height="31" rx="5" fill="url(#chipG)" stroke="rgba(0,0,0,.25)" />
    <g stroke="rgba(0,0,0,.35)" strokeWidth="0.8" fill="none">
      <path d="M0 10 H14 M0 22 H14 M40 10 H26 M40 22 H26" />
      <path d="M14 5 V27 M26 5 V27" />
      <path d="M14 16 H26" />
    </g>
  </svg>
);

export type CardVisualProps = {
  number?: string;     // raw digits or formatted
  holder?: string;
  expiry?: string;     // "MM/YY"
  cvv?: string;
  brand?: CardBrand;   // override; otherwise detected
  flipped?: boolean;   // show back side
  lang?: "en" | "ar";
  className?: string;
};

export const CardVisual = ({
  number = "", holder = "", expiry = "", cvv = "",
  brand, flipped = false, lang = "en", className,
}: CardVisualProps) => {
  const digits = number.replace(/\D/g, "");
  const detected = brand ?? detectBrand(digits);
  const grad = BRAND_GRADIENT[detected];
  const tr = (en: string, ar: string) => (lang === "ar" ? ar : en);

  // Build masked display number: keep spaces, mask all but last 4
  const formatted = formatCardNumber(digits || "•••• •••• •••• ••••");
  const display = digits.length === 0
    ? "•••• •••• •••• ••••"
    : formatted;

  return (
    <div
      className={cn("relative w-full aspect-[1.586/1] [perspective:1200px]", className)}
      aria-label={tr("Bank card preview", "معاينة البطاقة")}
    >
      <div
        className={cn(
          "relative w-full h-full transition-transform duration-700 [transform-style:preserve-3d]",
          flipped && "[transform:rotateY(180deg)]",
        )}
      >
        {/* FRONT */}
        <div
          className={cn(
            "absolute inset-0 rounded-2xl p-5 text-white shadow-elev2 overflow-hidden",
            "bg-gradient-to-br [backface-visibility:hidden]",
            grad,
          )}
          dir="ltr"
        >
          {/* Decorative orbs */}
          <span className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-white/10 blur-2xl" />
          <span className="absolute -bottom-12 -left-8 w-44 h-44 rounded-full bg-black/20 blur-2xl" />

          <div className="relative flex items-start justify-between">
            <Chip />
            <Wifi className="w-5 h-5 rotate-90 opacity-90" />
          </div>

          <p className="relative mt-6 text-[clamp(15px,4.6vw,22px)] font-semibold tracking-[0.18em] tabular drop-shadow-sm">
            {display}
          </p>

          <div className="relative mt-4 flex items-end justify-between gap-3">
            <div className="min-w-0">
              <p className="text-[9px] uppercase tracking-widest opacity-70">
                {tr("Card Holder", "حامل البطاقة")}
              </p>
              <p className="text-sm font-bold uppercase truncate">
                {holder || tr("YOUR NAME", "اسمك هنا")}
              </p>
            </div>
            <div className="text-right">
              <p className="text-[9px] uppercase tracking-widest opacity-70">
                {tr("Expires", "الانتهاء")}
              </p>
              <p className="text-sm font-bold tabular">{expiry || "MM/YY"}</p>
            </div>
            <BrandLogo brand={detected} />
          </div>
        </div>

        {/* BACK */}
        <div
          className={cn(
            "absolute inset-0 rounded-2xl text-white shadow-elev2 overflow-hidden",
            "bg-gradient-to-br [backface-visibility:hidden] [transform:rotateY(180deg)]",
            grad,
          )}
          dir="ltr"
        >
          <div className="h-10 mt-5 bg-black/80" />
          <div className="px-5 mt-5 flex items-center gap-3">
            <div className="flex-1 h-9 bg-white/85 rounded-sm flex items-center justify-end pr-3">
              <span className="text-n1 italic text-xs tracking-widest">
                {"".padStart(Math.max(0, 11 - (cvv?.length || 0)), "/")}
              </span>
            </div>
            <div className="h-9 px-3 bg-white rounded-sm flex items-center">
              <span className="text-n1 font-bold tabular tracking-widest">
                {cvv || "•••"}
              </span>
            </div>
          </div>
          <p className="px-5 mt-3 text-[10px] opacity-80">
            {lang === "ar"
              ? "آخر 3 أرقام خلف البطاقة"
              : "3-digit code on the back of your card"}
          </p>
          <div className="absolute bottom-4 right-5">
            <BrandLogo brand={detected} />
          </div>
        </div>
      </div>
    </div>
  );
};
