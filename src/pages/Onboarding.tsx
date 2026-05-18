import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Truck, ShieldCheck, Check, MapPin, ArrowLeft, ArrowRight, Sparkles } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import { formatHijri, formatGregorian } from "@/lib/ksa";
import langEn from "@/assets/lang-en.png";
import langAr from "@/assets/lang-ar.png";
import { StatusBar } from "@/components/StatusBar";

type Step = 0 | 1 | 2 | 3 | 4;

const SLIDE_GRADIENTS = [
  "var(--gradient-onboarding)",
  "var(--gradient-onboarding-2)",
  "var(--gradient-onboarding-3)",
];

/** Islamic 8-point star geometric pattern — used as a soft decorative overlay. */
const ArabesquePattern = ({ className }: { className?: string }) => (
  <svg
    aria-hidden
    className={cn("pointer-events-none absolute inset-0 w-full h-full", className)}
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <pattern id="ejada-arabesque" x="0" y="0" width="64" height="64" patternUnits="userSpaceOnUse">
        <g fill="none" stroke="currentColor" strokeWidth="1" opacity="0.6">
          <path d="M32 4 L40 24 L60 32 L40 40 L32 60 L24 40 L4 32 L24 24 Z" />
          <circle cx="32" cy="32" r="6" />
          <path d="M0 32 H64 M32 0 V64" strokeDasharray="2 6" opacity="0.4" />
        </g>
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#ejada-arabesque)" />
  </svg>
);

const Onboarding = () => {
  const nav = useNavigate();
  const { t, lang, setLang } = useI18n();
  const { setCity } = useStore();
  const [step, setStep] = useState<Step>(0);
  const [pickedLang, setPickedLang] = useState<"en" | "ar">(lang);
  const [pickedCity, setPickedCity] = useState<string>("Riyadh");

  const today = new Date();
  const hijri = formatHijri(today, lang);
  const greg = formatGregorian(today, lang);

  const slides = [
    {
      eyebrow: { en: "Ahlan wa Sahlan, Partner", ar: "أهلاً بك يا شريكنا" },
      title: { en: "Sell across the Kingdom", ar: "بِع في كل أنحاء المملكة" },
      desc: {
        en: "Launch your store on Ejada and reach millions of Saudi shoppers — aligned with Vision 2030.",
        ar: "أطلق متجرك على إجادة وتواصل مع ملايين المتسوقين في المملكة — انسجاماً مع رؤية 2030.",
      },
      chips: [
        { en: "CR Verified", ar: "سجل تجاري موثّق" },
        { en: "VAT Ready", ar: "جاهز للضريبة" },
        { en: "Maroof", ar: "معروف" },
        { en: "Zatca e-Invoice", ar: "فاتورة زاتكا" },
      ],
    },
    {
      eyebrow: { en: "Fulfillment made easy", ar: "شحن وتوصيل بكل سهولة" },
      title: { en: "We pick, pack & deliver", ar: "نجهّز ونغلّف ونوصّل" },
      desc: {
        en: "Same-day dispatch in Riyadh, Jeddah & Dammam. Deliveries pause respectfully during prayer times.",
        ar: "شحن في نفس اليوم بالرياض وجدة والدمام. يتوقف التوصيل احتراماً لأوقات الصلاة.",
      },
      chips: [
        { en: "SMSA", ar: "سمسا" },
        { en: "Aramex", ar: "أرامكس" },
        { en: "SPL", ar: "البريد السعودي" },
        { en: "J&T", ar: "جي آند تي" },
      ],
    },
    {
      eyebrow: { en: "Get paid, your way", ar: "استلم أرباحك كما تريد" },
      title: { en: "Weekly SAR payouts", ar: "تحويلات أسبوعية بالريال" },
      desc: {
        en: "Track sales, commissions and payouts in real time. Direct bank transfers via SARIE, fully SAMA-compliant.",
        ar: "تابع المبيعات والعمولات والتحويلات لحظياً. تحويلات بنكية مباشرة عبر سريع — متوافق مع ساما.",
      },
      chips: ["SARIE", "mada Business", "STC Pay", "Apple Pay"],
    },
  ];

  const cities = [
    { id: "Riyadh", key: "riyadh" as const, eta: { en: "Same-day delivery", ar: "توصيل في نفس اليوم" } },
    { id: "Jeddah", key: "jeddah" as const, eta: { en: "Same-day delivery", ar: "توصيل في نفس اليوم" } },
    { id: "Dammam", key: "dammam" as const, eta: { en: "Next-day delivery", ar: "توصيل في اليوم التالي" } },
    { id: "Mecca", key: "mecca" as const, eta: { en: "1-2 days", ar: "1-2 يوم" } },
    { id: "Medina", key: "medina" as const, eta: { en: "1-2 days", ar: "1-2 يوم" } },
    { id: "Khobar", key: "khobar" as const, eta: { en: "Next-day delivery", ar: "توصيل في اليوم التالي" } },
  ];

  const finish = () => {
    setLang(pickedLang);
    setCity(pickedCity);
    localStorage.setItem("ejada_onboarded", "1");
    nav("/auth", { replace: true });
  };

  const next = () => {
    if (step < 4) setStep((step + 1) as Step);
    else finish();
  };

  const totalDots = 5;
  const onGradient = step <= 2;
  const back = () => { if (step > 0) setStep((step - 1) as Step); };

  return (
    <div
      className={cn(
        "phone-frame flex flex-col relative overflow-hidden",
        onGradient ? "text-n8" : "bg-n8"
      )}
      style={onGradient ? { background: SLIDE_GRADIENTS[step] } : undefined}
    >
      <StatusBar transparent />

      {/* Decorative layers (only on slide steps) */}
      {onGradient && (
        <>
          <ArabesquePattern className="text-n8/10" />
          <div className="pointer-events-none absolute top-32 -end-10 w-40 h-40 rounded-full bg-n8/15 blur-2xl" />
          <div className="pointer-events-none absolute bottom-48 -start-12 w-48 h-48 rounded-full bg-[hsl(var(--ksa-green))]/40 blur-3xl" />
          <div className="pointer-events-none absolute top-72 end-16 w-24 h-24 rounded-full bg-[hsl(var(--ksa-yellow))]/25 blur-2xl" />
          {/* KSA flag accent ribbon */}
          <div className="pointer-events-none absolute top-0 inset-x-0 h-1 bg-[hsl(var(--ksa-green))]" />
        </>
      )}

      {/* Top bar: skip + Hijri date */}
      <div className="relative flex justify-between items-center px-4 pt-3 pb-2 z-10">
        {onGradient ? (
          <div className="flex items-center gap-1.5 text-[11px] font-medium text-n8/85 bg-n8/15 backdrop-blur-md border border-n8/25 rounded-full px-3 py-1.5">
            <span className="tabular">{hijri}</span>
            <span className="opacity-60">•</span>
            <span className="tabular opacity-80">{greg}</span>
          </div>
        ) : <span />}
        {step < 3 && (
          <button
            onClick={finish}
            className={cn(
              "text-caption font-bold px-4 py-2 rounded-full transition",
              onGradient ? "bg-n8 text-primary shadow-elev1" : "text-n3"
            )}
          >
            {t("skip")}
          </button>
        )}
      </div>

      {/* Slides */}
      {step <= 2 && (() => {
        const Slide = slides[step];
        const SlideIcon = step === 0 ? Sparkles : step === 1 ? Truck : ShieldCheck;
        return (
          <div
            className="relative z-10 flex-1 flex flex-col items-center justify-center px-8 text-center animate-fade-in"
            key={step}
          >
            {/* Glass-morphic icon badge with halo */}
            <div className="relative mb-8">
              <div className="absolute inset-0 -m-4 rounded-full bg-n8/10 blur-md" />
              <div className="relative w-28 h-28 rounded-3xl bg-n8/15 backdrop-blur-xl border border-n8/30 shadow-elev2 flex items-center justify-center rotate-3">
                <div className="-rotate-3">
                  <SlideIcon className="w-12 h-12 text-n8" strokeWidth={1.75} />
                </div>
              </div>
              {/* Tiny accent dot — KSA green */}
              <span className="absolute -top-1 -end-1 w-4 h-4 rounded-full bg-[hsl(var(--ksa-green))] ring-2 ring-n8/40" />
            </div>

            <p className="text-caption uppercase tracking-[0.2em] text-n8/70 mb-3 font-semibold">
              {Slide.eyebrow[lang]}
            </p>
            <h2 className="text-display text-n8 mb-4 tracking-tight">{Slide.title[lang]}</h2>
            <p className="text-body text-n8/85 leading-relaxed max-w-[300px] mb-6">
              {Slide.desc[lang]}
            </p>

            {/* Chips reinforce the slide's KSA-specific value */}
            <div className="flex flex-wrap justify-center gap-2 max-w-[320px]">
              {Slide.chips.map((c, i) => {
                const label = typeof c === "string" ? c : c[lang];
                return (
                  <span
                    key={i}
                    className="text-[11px] font-semibold px-3 py-1.5 rounded-full bg-n8/15 backdrop-blur-md border border-n8/25 text-n8"
                  >
                    {label}
                  </span>
                );
              })}
            </div>
          </div>
        );
      })()}

      {/* Language picker */}
      {step === 3 && (
        <div className="relative z-10 flex-1 px-6 animate-fade-in" key="lang">
          <h2 className="text-h1 text-n1 mb-2">{t("chooseLanguage")}</h2>
          <p className="text-body text-n2 mb-8">{t("chooseLanguageDesc")}</p>
          <div className="space-y-3">
            {([
              { code: "en" as const, label: "English", sub: "Left-to-right", logo: langEn },
              { code: "ar" as const, label: "العربية", sub: "من اليمين إلى اليسار", logo: langAr },
            ]).map(opt => (
              <button
                key={opt.code}
                onClick={() => { setPickedLang(opt.code); setLang(opt.code); }}
                className={cn(
                  "w-full flex items-center gap-3 p-4 rounded-2xl border-2 transition",
                  pickedLang === opt.code ? "border-primary bg-primary-bg" : "border-n6 bg-n8"
                )}
              >
                <div className="w-12 h-12 rounded-full overflow-hidden ring-1 ring-n6 bg-n8 shrink-0 flex items-center justify-center">
                  <img
                    src={opt.logo}
                    alt={`${opt.label} flag`}
                    width={48}
                    height={48}
                    loading="lazy"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="text-start flex-1 min-w-0">
                  <div className="text-h3 text-n1 font-semibold truncate">{opt.label}</div>
                  <div className="text-caption text-n3 mt-0.5 truncate">{opt.sub}</div>
                </div>
                <div className={cn(
                  "w-6 h-6 rounded-full flex items-center justify-center border-2 shrink-0",
                  pickedLang === opt.code ? "bg-primary border-primary" : "border-n4"
                )}>
                  {pickedLang === opt.code && <Check className="w-4 h-4 text-n8" strokeWidth={3} />}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* City picker */}
      {step === 4 && (
        <div className="relative z-10 flex-1 px-6 animate-fade-in overflow-y-auto" key="city">
          <h2 className="text-h1 text-n1 mb-2">{t("chooseCity")}</h2>
          <p className="text-body text-n2 mb-6">{t("chooseCityDesc")}</p>
          <div className="space-y-2.5 pb-4">
            {cities.map(c => (
              <button
                key={c.id}
                onClick={() => setPickedCity(c.id)}
                className={cn(
                  "w-full flex items-center gap-3 p-4 rounded-2xl border-2 transition text-start",
                  pickedCity === c.id ? "border-primary bg-primary-bg" : "border-n6 bg-n8"
                )}
              >
                <div className={cn(
                  "w-10 h-10 rounded-xl flex items-center justify-center",
                  pickedCity === c.id ? "bg-primary text-n8" : "bg-n7 text-n2"
                )}>
                  <MapPin className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <div className="text-body text-n1 font-semibold">{t(c.key)}</div>
                  <div className="text-caption text-n3">{c.eta[lang]}</div>
                </div>
                {pickedCity === c.id && (
                  <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                    <Check className="w-4 h-4 text-n8" strokeWidth={3} />
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="relative z-10 px-6 pb-10 pt-4 space-y-5">
        <div className="flex justify-center gap-2">
          {Array.from({ length: totalDots }).map((_, i) => (
            <span
              key={i}
              className={cn(
                "h-1.5 rounded-full transition-all",
                i === step
                  ? onGradient ? "w-8 bg-n8" : "w-8 bg-primary"
                  : onGradient ? "w-1.5 bg-n8/40" : "w-1.5 bg-n6"
              )}
            />
          ))}
        </div>
        <div className="flex items-center gap-3">
          {step > 0 && (
            <button
              onClick={back}
              aria-label={t("back") as string || "Back"}
              className={cn(
                "shrink-0 w-14 h-14 rounded-full flex items-center justify-center active:scale-[0.95] transition",
                onGradient
                  ? "bg-n8 text-primary shadow-elev2"
                  : "bg-n8 text-primary border border-n6 shadow-elev1"
              )}
            >
              {lang === "ar" ? <ArrowRight className="w-5 h-5" /> : <ArrowLeft className="w-5 h-5" />}
            </button>
          )}
          <button
            onClick={next}
            className={cn(
              "flex-1 h-[56px] rounded-full text-h3 font-semibold active:scale-[0.98] transition",
              onGradient
                ? "bg-n8 text-primary shadow-cta hover:bg-n8/95"
                : "bg-primary text-n8 shadow-cta"
            )}
          >
            {step < 4 ? t("next") : t("getStarted")}
          </button>
        </div>
        {onGradient && (
          <p className="text-center text-[11px] text-n8/70 font-medium">
            {t("visa2030")}
          </p>
        )}
      </div>
    </div>
  );
};
export default Onboarding;
