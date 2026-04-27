import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Truck, ShieldCheck, Check, MapPin, ShoppingBag, ArrowLeft, ArrowRight } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import langEn from "@/assets/lang-en.png";
import langAr from "@/assets/lang-ar.png";
import { StatusBar } from "@/components/StatusBar";

type Step = 0 | 1 | 2 | 3 | 4; // 0-2 slides, 3 language, 4 city

const SLIDE_GRADIENTS = [
  "var(--gradient-onboarding)",
  "var(--gradient-onboarding-2)",
  "var(--gradient-onboarding-3)",
];

const Onboarding = () => {
  const nav = useNavigate();
  const { t, lang, setLang } = useI18n();
  const { setCity } = useStore();
  const [step, setStep] = useState<Step>(0);
  const [pickedLang, setPickedLang] = useState<"en" | "ar">(lang);
  const [pickedCity, setPickedCity] = useState<string>("Riyadh");

  const slides = [
    { icon: ShoppingBag, title: { en: "Discover", ar: "اكتشف" }, desc: { en: "Browse the latest electronics from top local and international brands", ar: "تصفح أحدث الإلكترونيات من أفضل العلامات المحلية والعالمية" } },
    { icon: Truck, title: { en: "Lightning-fast Delivery", ar: "توصيل بسرعة البرق" }, desc: { en: "Same-day delivery across Riyadh, Jeddah & Dammam.", ar: "توصيل في نفس اليوم في الرياض وجدة والدمام." } },
    { icon: ShieldCheck, title: { en: "Secure Payments", ar: "مدفوعات آمنة" }, desc: { en: "Pay securely with Mada, Apple Pay, Tamara and more.", ar: "ادفع بأمان عبر مدى وآبل باي وتمارا والمزيد." } },
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
    <div className={cn(
      "phone-frame flex flex-col relative overflow-hidden",
      onGradient ? "text-n8" : "bg-n8"
    )}
    style={onGradient ? { background: SLIDE_GRADIENTS[step] } : undefined}
    >
      <StatusBar />
      {/* Decorative blurred orbs (only on slide steps) */}
      {onGradient && (
        <>
          <div className="pointer-events-none absolute top-32 -end-10 w-40 h-40 rounded-full bg-n8/15 blur-2xl" />
          <div className="pointer-events-none absolute bottom-48 -start-12 w-48 h-48 rounded-full bg-primary/30 blur-3xl" />
          <div className="pointer-events-none absolute top-72 end-16 w-24 h-24 rounded-full bg-n8/10 blur-2xl" />
        </>
      )}

      <div className="relative flex justify-end items-center p-4 z-10">
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
        const Icon = Slide.icon;
        return (
          <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-8 text-center animate-fade-in" key={step}>
            {/* Glass-morphic icon badge with halo */}
            <div className="relative mb-10">
              <div className="absolute inset-0 -m-4 rounded-full bg-n8/10 blur-md" />
              <div className="relative w-32 h-32 rounded-full bg-n8/20 backdrop-blur-xl border border-n8/30 shadow-elev2 flex items-center justify-center">
                <Icon className="w-14 h-14 text-n8" strokeWidth={1.75} />
              </div>
            </div>
            <h2 className="text-display text-n8 mb-4 tracking-tight">{Slide.title[lang]}</h2>
            <p className="text-body-lg text-n8/85 leading-relaxed max-w-[280px]">{Slide.desc[lang]}</p>
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
                ? "bg-n8/20 backdrop-blur-xl border border-n8/30 text-n8 shadow-elev2"
                : "bg-primary text-n8 shadow-cta"
            )}
          >
            {step < 4 ? t("next") : t("getStarted")}
          </button>
        </div>
      </div>
    </div>
  );
};
export default Onboarding;
