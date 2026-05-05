import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft, ArrowRight, Store, Building2, FileBadge2, Tag, User,
  Mail, Eye, EyeOff, Check, X, ShieldCheck,
} from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { useStore } from "@/lib/store";
import { useMerchant } from "@/lib/merchant";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { StatusBar } from "@/components/StatusBar";
import {
  formatSaudiMobile, isValidSaudiMobile, maskSaudiMobile,
  parseSaudiMobile, toE164Saudi, toLatinDigits,
} from "@/lib/ksa";

type Step = "business" | "owner" | "otp" | "password";

const CATEGORIES = ["Electronics", "Fashion", "Home", "Beauty", "Sports", "Grocery", "Other"];

const checks = (p: string) => ({
  length: p.length >= 8,
  upper: /[A-Z]/.test(p),
  lower: /[a-z]/.test(p),
  number: /\d/.test(p),
  special: /[!@#$%^&*(),.?":{}|<>_\-+=/\\[\]~`';]/.test(p),
});
const isValidPwd = (p: string) => Object.values(checks(p)).every(Boolean);

const MerchantRegister = () => {
  const nav = useNavigate();
  const { lang, dir } = useI18n();
  const { city } = useStore();
  const { signInMerchant } = useMerchant();

  const [step, setStep] = useState<Step>("business");
  const steps: Step[] = ["business", "owner", "otp", "password"];
  const stepIdx = steps.indexOf(step);

  // Business
  const [businessName, setBusinessName] = useState("");
  const [crNumber, setCrNumber] = useState("");
  const [category, setCategory] = useState(CATEGORIES[0]);
  // Owner
  const [ownerName, setOwnerName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  // OTP
  const [otp, setOtp] = useState<string[]>(["", "", "", ""]);
  const otpRefs = useRef<Array<HTMLInputElement | null>>([]);
  const [resendIn, setResendIn] = useState(0);
  // Password
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [agree, setAgree] = useState(false);
  const [loading, setLoading] = useState(false);

  type FE = Partial<Record<"businessName" | "crNumber" | "ownerName" | "phone" | "email" | "otp" | "password" | "confirm" | "agree", string>>;
  const [errors, setErrors] = useState<FE>({});
  const clr = (k: keyof FE) => setErrors(p => p[k] ? { ...p, [k]: undefined } : p);

  useEffect(() => {
    if (resendIn <= 0) return;
    const id = setInterval(() => setResendIn(s => Math.max(0, s - 1)), 1000);
    return () => clearInterval(id);
  }, [resendIn]);

  const Back = dir === "rtl" ? ArrowRight : ArrowLeft;

  const goBack = () => {
    const i = stepIdx;
    if (i === 0) { nav("/auth"); return; }
    setStep(steps[i - 1]);
  };

  const next = () => {
    const e: FE = {};
    if (step === "business") {
      if (businessName.trim().length < 2) e.businessName = lang === "ar" ? "أدخل اسم النشاط" : "Enter business name";
      if (!/^\d{10}$/.test(crNumber)) e.crNumber = lang === "ar" ? "السجل التجاري 10 أرقام" : "CR number must be 10 digits";
      setErrors(e); if (Object.keys(e).length) return;
      setStep("owner"); return;
    }
    if (step === "owner") {
      if (ownerName.trim().length < 2) e.ownerName = lang === "ar" ? "أدخل اسم المالك" : "Enter owner name";
      if (!isValidSaudiMobile(phone)) e.phone = lang === "ar" ? "أدخل رقم جوال سعودي صحيح" : "Enter a valid Saudi mobile";
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) e.email = lang === "ar" ? "بريد إلكتروني غير صحيح" : "Invalid email";
      setErrors(e); if (Object.keys(e).length) return;
      setStep("otp"); setResendIn(45);
      setTimeout(() => otpRefs.current[0]?.focus(), 50);
      return;
    }
    if (step === "otp") {
      if (otp.some(d => d.length !== 1)) {
        setErrors({ otp: lang === "ar" ? "أدخل رمز التحقق" : "Enter 4-digit code" }); return;
      }
      setErrors({}); setStep("password"); return;
    }
    // password
    if (!isValidPwd(password)) e.password = lang === "ar" ? "كلمة المرور لا تستوفي المتطلبات" : "Password does not meet requirements";
    if (password !== confirm) e.confirm = lang === "ar" ? "كلمتا المرور غير متطابقتين" : "Passwords do not match";
    if (!agree) e.agree = lang === "ar" ? "يرجى الموافقة على الشروط" : "Please accept the terms";
    setErrors(e); if (Object.keys(e).length) return;

    setLoading(true);
    setTimeout(() => {
      signInMerchant({
        id: `m_${Date.now()}`,
        ownerName: ownerName.trim(),
        email: email.trim(),
        phone: toE164Saudi(phone),
        businessName: businessName.trim(),
        crNumber, category, city,
        createdAt: Date.now(),
      });
      toast.success(lang === "ar" ? "تم تسجيل المتجر بنجاح 🎉" : "Merchant account created 🎉");
      setLoading(false);
      nav("/merchant/dashboard", { replace: true });
    }, 600);
  };

  const setOtpAt = (i: number, val: string) => {
    const cleaned = toLatinDigits(val).replace(/\D/g, "");
    if (cleaned.length > 1) {
      setOtp(prev => {
        const n = [...prev];
        for (let k = 0; k < cleaned.length && i + k < 4; k++) n[i + k] = cleaned[k];
        return n;
      });
      otpRefs.current[Math.min(i + cleaned.length - 1, 3)]?.focus();
      return;
    }
    const v = cleaned.slice(-1);
    setOtp(prev => { const n = [...prev]; n[i] = v; return n; });
    if (v && i < 3) otpRefs.current[i + 1]?.focus();
  };

  const eyebrow = lang === "ar" ? "تسجيل تاجر" : "Merchant Registration";
  const title =
    step === "business" ? (lang === "ar" ? "معلومات النشاط" : "Business Info") :
    step === "owner" ? (lang === "ar" ? "معلومات المالك" : "Owner Info") :
    step === "otp" ? (lang === "ar" ? "تحقق من رقمك" : "Verify Your Number") :
    (lang === "ar" ? "كلمة المرور" : "Create Password");

  const cta =
    step === "password" ? (lang === "ar" ? "إنشاء حساب التاجر" : "Create Merchant Account") :
    (lang === "ar" ? "متابعة" : "Continue");

  const pwdChecks = checks(password);
  const rules: { key: keyof typeof pwdChecks; en: string; ar: string }[] = [
    { key: "length", en: "At least 8 characters", ar: "8 أحرف على الأقل" },
    { key: "upper", en: "One uppercase (A-Z)", ar: "حرف كبير (A-Z)" },
    { key: "lower", en: "One lowercase (a-z)", ar: "حرف صغير (a-z)" },
    { key: "number", en: "One number (0-9)", ar: "رقم (0-9)" },
    { key: "special", en: "One special character", ar: "رمز خاص" },
  ];

  return (
    <div className="phone-frame bg-background flex flex-col overflow-y-auto">
      <StatusBar />
      <header className="sticky top-7 z-30 bg-primary text-n8 rounded-b-3xl shadow-elev1">
        <div className="px-4 pt-4 pb-4 flex items-center gap-3">
          <button
            onClick={goBack}
            className="w-10 h-10 -ms-2 rounded-full flex items-center justify-center hover:bg-white/10"
            aria-label="Back"
          >
            <Back className="w-5 h-5" />
          </button>
          <div className="leading-tight flex-1 min-w-0">
            <p className="text-[10px] font-semibold tracking-[0.12em] opacity-80 uppercase flex items-center gap-1.5">
              <Store className="w-3 h-3" /> {eyebrow}
            </p>
            <p className="text-h1 font-bold truncate">{title}</p>
          </div>
        </div>
        {/* Step progress */}
        <div className="px-4 pb-3 flex items-center gap-1.5">
          {steps.map((_, i) => (
            <div
              key={i}
              className={cn(
                "h-1 flex-1 rounded-full transition-colors",
                i <= stepIdx ? "bg-n8" : "bg-white/25"
              )}
            />
          ))}
        </div>
      </header>

      <div className="px-6 pt-6 pb-8 flex-1 space-y-5 my-[24px]">
        {step === "business" && (
          <>
            <Field label={lang === "ar" ? "اسم النشاط التجاري" : "Business Name"} icon={<Building2 className="w-5 h-5 text-n4" />} error={errors.businessName}>
              <input
                value={businessName}
                onChange={e => { setBusinessName(e.target.value); clr("businessName"); }}
                placeholder={lang === "ar" ? "متجر التقنية" : "Tech Store"}
                className="flex-1 h-full outline-none text-body bg-transparent text-n1 placeholder:text-n4"
              />
            </Field>
            <Field label={lang === "ar" ? "رقم السجل التجاري" : "Commercial Registration No."} icon={<FileBadge2 className="w-5 h-5 text-n4" />} error={errors.crNumber}>
              <input
                value={crNumber}
                onChange={e => { setCrNumber(e.target.value.replace(/\D/g, "").slice(0, 10)); clr("crNumber"); }}
                inputMode="numeric" placeholder="1010234567" dir="ltr"
                className="flex-1 h-full outline-none text-body bg-transparent text-n1 placeholder:text-n4 tabular"
              />
            </Field>
            <Field label={lang === "ar" ? "فئة النشاط" : "Business Category"} icon={<Tag className="w-5 h-5 text-n4" />}>
              <select
                value={category} onChange={e => setCategory(e.target.value)}
                className="flex-1 h-full outline-none text-body bg-transparent text-n1"
              >
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </Field>
            <div className="bg-primary-bg border border-primary/20 rounded-input p-3 flex gap-2.5">
              <ShieldCheck className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
              <p className="text-caption text-n2 leading-relaxed">
                {lang === "ar"
                  ? "سيتم التحقق من السجل التجاري قبل تفعيل المتجر."
                  : "Your CR number will be verified before your store goes live."}
              </p>
            </div>
          </>
        )}

        {step === "owner" && (
          <>
            <Field label={lang === "ar" ? "اسم المالك" : "Owner Full Name"} icon={<User className="w-5 h-5 text-n4" />} error={errors.ownerName}>
              <input
                value={ownerName}
                onChange={e => { setOwnerName(e.target.value); clr("ownerName"); }}
                placeholder={lang === "ar" ? "أحمد العتيبي" : "Ahmed Al-Otaibi"}
                className="flex-1 h-full outline-none text-body bg-transparent text-n1 placeholder:text-n4"
              />
            </Field>

            <label className="block">
              <span className="text-label text-n1 font-bold">{lang === "ar" ? "رقم الجوال" : "Mobile Number"}</span>
              <div className={cn(
                "mt-2 flex items-stretch h-[52px] rounded-input border bg-n8 transition overflow-hidden",
                errors.phone ? "border-ksa-red border-2" : "border-n4 focus-within:border-primary focus-within:border-2",
              )} dir="ltr">
                <div className="flex items-center gap-1.5 px-3 bg-n7 border-e border-n6 text-n1">
                  <span className="text-lg leading-none" aria-hidden>🇸🇦</span>
                  <span className="text-body font-bold tabular">+966</span>
                </div>
                <input
                  type="tel" inputMode="numeric"
                  value={formatSaudiMobile(phone)}
                  onChange={e => { setPhone(parseSaudiMobile(e.target.value)); clr("phone"); }}
                  placeholder="5XX XXX XXXX" maxLength={12}
                  className="flex-1 h-full px-3 outline-none text-body bg-transparent text-n1 placeholder:text-n4 tabular tracking-wide"
                />
              </div>
              {errors.phone && <p className="mt-1 text-caption text-ksa-red font-medium">{errors.phone}</p>}
            </label>

            <Field label={lang === "ar" ? "البريد الإلكتروني للأعمال" : "Business Email"} icon={<Mail className="w-5 h-5 text-n4" />} error={errors.email}>
              <input
                type="email" inputMode="email" dir="ltr"
                value={email} onChange={e => { setEmail(e.target.value); clr("email"); }}
                placeholder="store@example.com"
                className="flex-1 h-full outline-none text-body bg-transparent text-n1 placeholder:text-n4"
              />
            </Field>
          </>
        )}

        {step === "otp" && (
          <div className="space-y-5">
            <p className="text-center text-caption text-n3">
              {lang === "ar"
                ? `أرسلنا رمزاً إلى ${maskSaudiMobile(phone)}`
                : `We sent a 4-digit code to ${maskSaudiMobile(phone)}`}
            </p>
            <div className="flex items-center justify-center gap-3" dir="ltr">
              {otp.map((d, i) => (
                <input
                  key={i}
                  ref={el => (otpRefs.current[i] = el)}
                  value={d}
                  onChange={e => { setOtpAt(i, e.target.value); clr("otp"); }}
                  onKeyDown={e => { if (e.key === "Backspace" && !otp[i] && i > 0) otpRefs.current[i - 1]?.focus(); }}
                  inputMode="numeric" maxLength={1}
                  className={cn(
                    "w-14 h-16 text-center text-h1 font-bold rounded-input border-2 focus:outline-none bg-n8 text-n1 tabular",
                    errors.otp ? "border-ksa-red" : "border-n4 focus:border-primary",
                  )}
                />
              ))}
            </div>
            {errors.otp && <p className="text-center text-caption text-destructive font-medium">{errors.otp}</p>}
            <div className="text-center text-caption text-n3">
              {resendIn > 0 ? (
                <span>{lang === "ar" ? `إعادة الإرسال خلال ${resendIn} ث` : `Resend in ${resendIn}s`}</span>
              ) : (
                <button type="button" onClick={() => { setResendIn(45); toast.success(lang === "ar" ? "تم الإرسال" : "Code resent"); }} className="text-primary font-bold">
                  {lang === "ar" ? "إعادة إرسال الرمز" : "Resend code"}
                </button>
              )}
            </div>
          </div>
        )}

        {step === "password" && (
          <div className="space-y-5">
            <Field label={lang === "ar" ? "كلمة المرور" : "Password"} error={errors.password}>
              <input
                type={showPwd ? "text" : "password"} autoComplete="new-password" dir="ltr"
                value={password} onChange={e => { setPassword(e.target.value); clr("password"); }}
                placeholder={lang === "ar" ? "كلمة مرور قوية" : "Strong password"}
                className="flex-1 h-full outline-none text-body bg-transparent text-n1 placeholder:text-n4"
              />
              <button type="button" onClick={() => setShowPwd(s => !s)} className="text-n4 hover:text-n2 px-1">
                {showPwd ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </Field>

            <Field label={lang === "ar" ? "تأكيد كلمة المرور" : "Confirm Password"} error={errors.confirm}>
              <input
                type={showConfirm ? "text" : "password"} autoComplete="new-password" dir="ltr"
                value={confirm} onChange={e => { setConfirm(e.target.value); clr("confirm"); }}
                placeholder={lang === "ar" ? "أعد إدخال كلمة المرور" : "Re-enter password"}
                className="flex-1 h-full outline-none text-body bg-transparent text-n1 placeholder:text-n4"
              />
              <button type="button" onClick={() => setShowConfirm(s => !s)} className="text-n4 hover:text-n2 px-1">
                {showConfirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </Field>

            <ul className="space-y-1.5">
              {rules.map(r => {
                const ok = pwdChecks[r.key];
                return (
                  <li key={r.key} className="flex items-center gap-2">
                    <span className={cn("w-4 h-4 rounded-full flex items-center justify-center", ok ? "bg-success" : "bg-n6")}>
                      {ok ? <Check className="w-3 h-3 text-n8" strokeWidth={3} /> : <X className="w-3 h-3 text-n4" strokeWidth={3} />}
                    </span>
                    <span className={cn("text-caption", ok ? "text-success-text font-medium" : "text-[#616161]")}>
                      {lang === "ar" ? r.ar : r.en}
                    </span>
                  </li>
                );
              })}
            </ul>

            <button onClick={() => { setAgree(a => !a); clr("agree"); }} type="button" className="flex items-start gap-2 text-start">
              <span className={cn(
                "w-5 h-5 mt-0.5 rounded-[5px] border-2 flex items-center justify-center flex-shrink-0 transition",
                agree ? "bg-primary border-primary" : "bg-n8 border-n4"
              )}>
                {agree && <Check className="w-3.5 h-3.5 text-n8" strokeWidth={3} />}
              </span>
              <span className="text-caption text-n2">
                {lang === "ar"
                  ? "أوافق على شروط البائعين وسياسة العمولات."
                  : "I agree to the Merchant Terms and Commission Policy."}
              </span>
            </button>
            {errors.agree && <p className="text-caption text-ksa-red font-medium">{errors.agree}</p>}
          </div>
        )}

        <button
          onClick={next}
          disabled={loading}
          className="w-full h-[56px] rounded-full text-h3 font-semibold text-n8 shadow-cta active:scale-[0.98] transition disabled:opacity-60 bg-gradient-primary"
        >
          {loading ? "…" : cta}
        </button>

        <p className="text-center text-caption text-n2">
          {lang === "ar" ? "لديك حساب تاجر؟ " : "Already have a merchant account? "}
          <button onClick={() => nav("/auth")} className="text-primary font-bold">
            {lang === "ar" ? "تسجيل الدخول" : "Sign in"}
          </button>
        </p>
      </div>
    </div>
  );
};

const Field = ({
  label, error, icon, children,
}: { label: string; error?: string; icon?: React.ReactNode; children: React.ReactNode }) => (
  <label className="block">
    <span className="text-label text-n1 font-bold">{label}</span>
    <div className={cn(
      "mt-2 flex items-center gap-2 h-[52px] px-4 rounded-input border bg-n8 transition",
      error ? "border-ksa-red border-2" : "border-n4 focus-within:border-primary focus-within:border-2",
    )}>
      {icon}
      {children}
    </div>
    {error && <p className="mt-1 text-caption text-ksa-red font-medium">{error}</p>}
  </label>
);

export default MerchantRegister;
