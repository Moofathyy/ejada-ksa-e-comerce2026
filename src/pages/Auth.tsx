import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, Check, X, ArrowLeft, ArrowRight, Mail } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { useStore } from "@/lib/store";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import {
  formatSaudiMobile,
  isValidSaudiMobile,
  maskSaudiMobile,
  parseSaudiMobile,
  toE164Saudi,
  toLatinDigits,
  formatHijri,
} from "@/lib/ksa";

type Mode = "signin" | "signup";
type SignupStep = "info" | "otp" | "password";

const getPasswordChecks = (pwd: string) => ({
  length: pwd.length >= 8,
  upper: /[A-Z]/.test(pwd),
  lower: /[a-z]/.test(pwd),
  number: /\d/.test(pwd),
  special: /[!@#$%^&*(),.?":{}|<>_\-+=/\\[\]~`';]/.test(pwd),
});

const isPasswordValid = (pwd: string) =>
  Object.values(getPasswordChecks(pwd)).every(Boolean);

const getPasswordStrength = (pwd: string) => {
  const passed = Object.values(getPasswordChecks(pwd)).filter(Boolean).length;
  if (pwd.length === 0) return { score: 0, label: "", color: "" };
  if (passed <= 2) return { score: 1, label: "weak", color: "bg-destructive" };
  if (passed === 3) return { score: 2, label: "fair", color: "bg-warning" };
  if (passed === 4) return { score: 3, label: "good", color: "bg-info" };
  return { score: 4, label: "strong", color: "bg-success" };
};

const Auth = () => {
  const nav = useNavigate();
  const { t, lang, dir } = useI18n();
  const { signIn, city } = useStore();
  const [mode, setMode] = useState<Mode>("signin");

  // shared
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPwd, setConfirmPwd] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [showConfirmPwd, setShowConfirmPwd] = useState(false);
  const [remember, setRemember] = useState(true);
  const [loading, setLoading] = useState(false);

  // signup flow
  const [step, setStep] = useState<SignupStep>("info");
  const [otp, setOtp] = useState<string[]>(["", "", "", ""]);
  const otpRefs = useRef<Array<HTMLInputElement | null>>([]);
  const [resendIn, setResendIn] = useState(0);

  // Inline field errors
  type FieldErrors = Partial<Record<"name" | "phone" | "email" | "password" | "confirmPwd" | "otp", string>>;
  const [errors, setErrors] = useState<FieldErrors>({});
  const clearError = (k: keyof FieldErrors) =>
    setErrors(prev => (prev[k] ? { ...prev, [k]: undefined } : prev));

  useEffect(() => {
    if (resendIn <= 0) return;
    const id = setInterval(() => setResendIn(s => Math.max(0, s - 1)), 1000);
    return () => clearInterval(id);
  }, [resendIn]);

  const validatePhone = (v: string) => isValidSaudiMobile(v);
  const onPhoneChange = (raw: string) => setPhone(parseSaudiMobile(raw));
  const ksaPhoneError = lang === "ar"
    ? "أدخل رقم جوال سعودي صحيح يبدأ بـ 5"
    : "Enter a valid Saudi mobile starting with 5";
  const validateEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());

  const resetSignup = () => {
    setStep("info");
    setOtp(["", "", "", ""]);
    setResendIn(0);
  };

  const switchMode = (next: Mode) => {
    setMode(next);
    if (next === "signup") resetSignup();
  };

  // ---- Sign in ----
  const submitSignin = () => {
    const next: FieldErrors = {};
    if (!validatePhone(phone)) next.phone = ksaPhoneError;
    if (password.length < 6) next.password = String(t("passwordTooShort"));
    setErrors(next);
    if (Object.keys(next).length) return;
    setLoading(true);
    setTimeout(() => {
      signIn({ name: lang === "ar" ? "أحمد" : "Ahmed", email: `${toE164Saudi(phone)}@phone.local`, city });
      localStorage.setItem("ejada_user", lang === "ar" ? "أحمد" : "Ahmed");
      toast.success(t("welcomeBack"));
      setLoading(false);
      nav("/home", { replace: true });
    }, 600);
  };

  // ---- Sign up steps ----
  const goNextSignup = () => {
    if (step === "info") {
      const next: FieldErrors = {};
      if (name.trim().length < 2) next.name = lang === "ar" ? "أدخل اسمك الكامل" : "Please enter your name";
      if (!validatePhone(phone)) next.phone = ksaPhoneError;
      if (!validateEmail(email)) next.email = lang === "ar" ? "أدخل بريداً إلكترونياً صحيحاً" : "Please enter a valid email";
      setErrors(next);
      if (Object.keys(next).length) return;
      setStep("otp");
      setResendIn(45);
      setTimeout(() => otpRefs.current[0]?.focus(), 50);
      return;
    }
    if (step === "otp") {
      if (otp.some(d => d.length !== 1)) {
        setErrors({ otp: lang === "ar" ? "أدخل رمز التحقق المكون من 4 أرقام" : "Enter the 4-digit verification code" });
        return;
      }
      setErrors({});
      setStep("password");
      return;
    }
    // password step → finalize
    const next: FieldErrors = {};
    if (!isPasswordValid(password)) {
      next.password = lang === "ar" ? "كلمة المرور لا تستوفي جميع المتطلبات" : "Password does not meet all requirements";
    }
    if (password !== confirmPwd) {
      next.confirmPwd = lang === "ar" ? "كلمتا المرور غير متطابقتين" : "Passwords do not match";
    }
    setErrors(next);
    if (Object.keys(next).length) return;
    setLoading(true);
    setTimeout(() => {
      signIn({ name: name.trim(), email: email.trim() || `${toE164Saudi(phone)}@phone.local`, city });
      localStorage.setItem("ejada_user", name.trim());
      toast.success(t("accountCreated"));
      setLoading(false);
      nav("/home", { replace: true });
    }, 600);
  };

  const handleBack = () => {
    if (mode === "signup") {
      if (step === "password") { setStep("otp"); return; }
      if (step === "otp") { setStep("info"); return; }
    }
    nav(-1);
  };

  const setOtpAt = (i: number, val: string) => {
    const cleaned = toLatinDigits(val).replace(/\D/g, "");
    // Paste support: if user pasted multiple digits, fill from current index
    if (cleaned.length > 1) {
      setOtp(prev => {
        const next = [...prev];
        for (let k = 0; k < cleaned.length && i + k < 4; k++) next[i + k] = cleaned[k];
        return next;
      });
      const lastIdx = Math.min(i + cleaned.length - 1, 3);
      otpRefs.current[lastIdx]?.focus();
      return;
    }
    const v = cleaned.slice(-1);
    setOtp(prev => {
      const next = [...prev];
      next[i] = v;
      return next;
    });
    if (v && i < 3) otpRefs.current[i + 1]?.focus();
  };

  const onOtpKeyDown = (i: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[i] && i > 0) otpRefs.current[i - 1]?.focus();
  };

  const social = (provider: "Apple" | "Google") => {
    setLoading(true);
    setTimeout(() => {
      signIn({ name: provider === "Apple" ? "Ahmed" : "Sara", email: `demo@${provider.toLowerCase()}.com`, city });
      localStorage.setItem("ejada_user", provider === "Apple" ? "Ahmed" : "Sara");
      toast.success(t("welcomeBack"));
      nav("/home", { replace: true });
    }, 500);
  };

  const guest = () => {
    signIn({ name: lang === "ar" ? "ضيف" : "Guest", email: "guest@ejada.local", city });
    localStorage.setItem("ejada_user", lang === "ar" ? "ضيف" : "Guest");
    nav("/home", { replace: true });
  };

  const BackIcon = dir === "rtl" ? ArrowRight : ArrowLeft;

  // Header copy per state
  const headerEyebrow =
    mode === "signin"
      ? (lang === "ar" ? "تسجيل الدخول" : "Sign In")
      : (lang === "ar" ? "حساب جديد" : "Create Account");

  const headerTitle =
    mode === "signin"
      ? t("welcomeBack")
      : step === "info"
        ? (lang === "ar" ? "المعلومات الشخصية" : "Personal Information")
        : step === "otp"
          ? (lang === "ar" ? "تحقق من رقمك" : "Verify Your Number")
          : (lang === "ar" ? "إنشاء كلمة المرور" : "Create Password");

  const headerSub =
    mode === "signin"
      ? t("signInToContinue")
      : step === "info"
        ? (lang === "ar" ? "أخبرنا قليلاً عن نفسك" : "Tell us a bit about yourself")
        : step === "otp"
          ? (lang === "ar" ? `أرسلنا رمزاً مكوناً من 4 أرقام إلى ${maskSaudiMobile(phone)}` : `We sent a 4-digit code to ${maskSaudiMobile(phone)}`)
          : (lang === "ar" ? "اختر كلمة مرور آمنة" : "Choose a secure password");

  const ctaLabel =
    mode === "signin"
      ? t("signIn")
      : step === "password"
        ? t("signUp")
        : (lang === "ar" ? "متابعة" : "Continue");

  return (
    <div className="phone-frame bg-background flex flex-col overflow-y-auto">
      {/* Sticky primary header — matches Home style */}
      <header className="sticky top-0 z-30 bg-primary text-n8 rounded-b-3xl shadow-elev1">
        <div className="px-4 pt-4 pb-2 flex items-center gap-3">
          <button
            onClick={handleBack}
            aria-label="Back"
            className="w-11 h-11 rounded-xl bg-n8/15 backdrop-blur flex items-center justify-center border border-n8/20 active:scale-95 transition"
          >
            <BackIcon className="w-5 h-5" />
          </button>
          <div className="leading-tight flex-1 min-w-0">
            <p className="text-[10px] font-semibold tracking-[0.12em] opacity-80 uppercase">{headerEyebrow}</p>
            <p className="text-h1 font-bold truncate">{headerTitle}</p>
          </div>
        </div>
      </header>

      <div className="px-6 pt-6 pb-8 flex-1 space-y-5">
        {/* SIGN IN */}
        {mode === "signin" && (
          <>
            <SaudiPhoneField
              label={t("phoneNumber")}
              value={phone}
              onChange={(v) => { onPhoneChange(v); clearError("phone"); }}
              lang={lang}
              error={errors.phone}
            />

            <Field label={t("password")} error={errors.password}>
              <input
                type={showPwd ? "text" : "password"} autoComplete="current-password"
                value={password} onChange={e => { setPassword(e.target.value); clearError("password"); }}
                placeholder={t("enterPassword")} dir="ltr"
                className="flex-1 h-full outline-none text-body bg-transparent text-n1 placeholder:text-n4"
              />
              <button type="button" onClick={() => setShowPwd(s => !s)} className="text-n4 hover:text-n2 px-1" aria-label="Toggle password">
                {showPwd ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </Field>

            <div className="flex items-center justify-between">
              <button onClick={() => setRemember(r => !r)} className="flex items-center gap-2" type="button">
                <span className={cn(
                  "w-5 h-5 rounded-[5px] border-2 flex items-center justify-center transition",
                  remember ? "bg-primary border-primary" : "bg-n8 border-n4"
                )}>
                  {remember && <Check className="w-3.5 h-3.5 text-n8" strokeWidth={3} />}
                </span>
                <span className="text-caption text-n2 font-medium">{t("rememberMe")}</span>
              </button>
              <button
                type="button"
                onClick={() => toast(lang === "ar" ? "ميزة قادمة قريباً" : "Coming soon")}
                className="text-caption text-primary font-bold"
              >
                {t("forgotPassword")}
              </button>
            </div>
          </>
        )}

        {/* SIGN UP — Step 1: Personal info */}
        {mode === "signup" && step === "info" && (
          <>
            <Field label={t("fullName")}>
              <input
                value={name} onChange={e => setName(e.target.value)}
                placeholder={lang === "ar" ? "أحمد العتيبي" : "Ahmed Al-Otaibi"}
                className="flex-1 h-full outline-none text-body bg-transparent text-n1 placeholder:text-n4"
              />
            </Field>
            <SaudiPhoneField
              label={t("phoneNumber")}
              value={phone}
              onChange={onPhoneChange}
              lang={lang}
            />
            <Field label={lang === "ar" ? "البريد الإلكتروني" : "Email"}>
              <Mail className="w-5 h-5 text-n4" />
              <input
                type="email" inputMode="email" autoComplete="email"
                value={email} onChange={e => setEmail(e.target.value)}
                placeholder={lang === "ar" ? "name@example.com" : "name@example.com"}
                dir="ltr"
                className="flex-1 h-full outline-none text-body bg-transparent text-n1 placeholder:text-n4"
              />
            </Field>
          </>
        )}

        {/* SIGN UP — Step 2: OTP */}
        {mode === "signup" && step === "otp" && (
          <div className="space-y-5">
            <div className="flex items-center justify-center gap-3" dir="ltr">
              {otp.map((d, i) => (
                <input
                  key={i}
                  ref={el => (otpRefs.current[i] = el)}
                  value={d}
                  onChange={e => setOtpAt(i, e.target.value)}
                  onKeyDown={e => onOtpKeyDown(i, e)}
                  inputMode="numeric"
                  maxLength={1}
                  className="w-14 h-16 text-center text-h1 font-bold rounded-input border-2 border-n4 focus:border-primary focus:outline-none bg-n8 text-n1 tabular"
                />
              ))}
            </div>
            <div className="text-center text-caption text-n3">
              {resendIn > 0 ? (
                <span>
                  {lang === "ar" ? `يمكنك إعادة الإرسال خلال ${resendIn} ث` : `Resend code in ${resendIn}s`}
                </span>
              ) : (
                <button
                  type="button"
                  onClick={() => { setResendIn(45); toast.success(lang === "ar" ? "تم إرسال الرمز" : "Code resent"); }}
                  className="text-primary font-bold"
                >
                  {lang === "ar" ? "إعادة إرسال الرمز" : "Resend code"}
                </button>
              )}
            </div>
          </div>
        )}

        {/* SIGN UP — Step 3: Password */}
        {mode === "signup" && step === "password" && (() => {
          const checks = getPasswordChecks(password);
          const strength = getPasswordStrength(password);
          const rules: { key: keyof typeof checks; en: string; ar: string }[] = [
            { key: "length",  en: "At least 8 characters",         ar: "8 أحرف على الأقل" },
            { key: "upper",   en: "One uppercase letter (A-Z)",    ar: "حرف كبير واحد (A-Z)" },
            { key: "lower",   en: "One lowercase letter (a-z)",    ar: "حرف صغير واحد (a-z)" },
            { key: "number",  en: "One number (0-9)",              ar: "رقم واحد (0-9)" },
            { key: "special", en: "One special character (!@#…)",  ar: "رمز خاص واحد (!@#…)" },
          ];
          return (
            <div className="space-y-5">
              <div>
                <Field label={t("password")}>
                  <input
                    type={showPwd ? "text" : "password"} autoComplete="new-password"
                    value={password} onChange={e => setPassword(e.target.value)}
                    placeholder={t("enterPassword")} dir="ltr"
                    className="flex-1 h-full outline-none text-body bg-transparent text-n1 placeholder:text-n4"
                  />
                  <button type="button" onClick={() => setShowPwd(s => !s)} className="text-n4 hover:text-n2 px-1" aria-label="Toggle password">
                    {showPwd ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </Field>

                {/* Strength meter */}
                {password.length > 0 && (
                  <div className="mt-2">
                    <div className="flex gap-1.5">
                      {[1, 2, 3, 4].map(i => (
                        <div
                          key={i}
                          className={cn(
                            "h-1 flex-1 rounded-full transition-colors",
                            i <= strength.score ? strength.color : "bg-n6",
                          )}
                        />
                      ))}
                    </div>
                    {strength.label && (
                      <p className={cn(
                        "text-caption font-semibold mt-1.5 capitalize",
                        strength.score === 1 && "text-destructive",
                        strength.score === 2 && "text-warning-text",
                        strength.score === 3 && "text-info-text",
                        strength.score === 4 && "text-success-text",
                      )}>
                        {lang === "ar"
                          ? ({ weak: "ضعيفة", fair: "مقبولة", good: "جيدة", strong: "قوية" } as Record<string, string>)[strength.label]
                          : strength.label}
                      </p>
                    )}
                  </div>
                )}

              </div>

              <div>
                <Field label={lang === "ar" ? "تأكيد كلمة المرور" : "Confirm Password"}>
                  <input
                    type={showConfirmPwd ? "text" : "password"} autoComplete="new-password"
                    value={confirmPwd} onChange={e => setConfirmPwd(e.target.value)}
                    placeholder={lang === "ar" ? "أعد إدخال كلمة المرور" : "Re-enter password"} dir="ltr"
                    className="flex-1 h-full outline-none text-body bg-transparent text-n1 placeholder:text-n4"
                  />
                  <button type="button" onClick={() => setShowConfirmPwd(s => !s)} className="text-n4 hover:text-n2 px-1" aria-label="Toggle confirm password">
                    {showConfirmPwd ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </Field>
                {confirmPwd.length > 0 && password !== confirmPwd && (
                  <p className="text-caption text-destructive font-medium mt-1">
                    {lang === "ar" ? "كلمتا المرور غير متطابقتين" : "Passwords do not match"}
                  </p>
                )}
                {confirmPwd.length > 0 && password === confirmPwd && isPasswordValid(password) && (
                  <p className="text-caption text-success-text font-medium mt-1 flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" strokeWidth={3} />
                    {lang === "ar" ? "كلمتا المرور متطابقتان" : "Passwords match"}
                  </p>
                )}

                {/* Rules checklist */}
                <ul className="mt-3 space-y-1.5">
                  {rules.map(r => {
                    const ok = checks[r.key];
                    return (
                      <li key={r.key} className="flex items-center gap-2">
                        <span className={cn(
                          "w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 transition",
                          ok ? "bg-success" : "bg-n6",
                        )}>
                          {ok
                            ? <Check className="w-3 h-3 text-n8" strokeWidth={3} />
                            : <X className="w-3 h-3 text-n4" strokeWidth={3} />}
                        </span>
                        <span className={cn(
                          "text-caption transition",
                          ok ? "text-success-text font-medium" : "text-[#616161]",
                        )}>
                          {lang === "ar" ? r.ar : r.en}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          );
        })()}

        {/* Primary CTA */}
        <button
          onClick={mode === "signin" ? submitSignin : goNextSignup}
          disabled={loading}
          className="w-full h-[56px] rounded-full text-h3 font-semibold text-n8 shadow-cta active:scale-[0.98] transition disabled:opacity-60 bg-gradient-primary"
        >
          {loading ? "…" : ctaLabel}
        </button>

        {/* Social + guest + switch — only on entry views (signin or signup step 1) */}
        {(mode === "signin" || (mode === "signup" && step === "info")) && (
          <>
            <div className="flex items-center gap-3 pt-1">
              <div className="flex-1 h-px bg-n6" />
              <span className="text-caption text-n4">{lang === "ar" ? "أو" : "or"}</span>
              <div className="flex-1 h-px bg-n6" />
            </div>

            <div className="space-y-3">
              <SocialBtn onClick={() => social("Google")}>
                <GoogleIcon />
                <span className="text-body font-bold text-n1">{t("continueWithGoogle")}</span>
              </SocialBtn>
              <SocialBtn onClick={() => social("Apple")}>
                <AppleIcon />
                <span className="text-body font-bold text-n1">{t("continueWithApple")}</span>
              </SocialBtn>
            </div>

            <button
              onClick={guest}
              className="w-full text-body font-bold text-n1 py-3 hover:text-primary transition"
            >
              {t("continueAsGuest")}
            </button>

            <p className="text-center text-caption text-n2 pt-2">
              {mode === "signin" ? t("dontHaveAccount") : t("haveAccount")}{" "}
              <button
                onClick={() => switchMode(mode === "signin" ? "signup" : "signin")}
                className="text-primary font-bold"
              >
                {mode === "signin" ? t("register") : t("signIn")}
              </button>
            </p>

            <p className="text-center text-micro text-n4 leading-relaxed">
              {t("loginHint")}
            </p>
          </>
        )}
      </div>
    </div>
  );
};

const Field = ({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) => (
  <label className="block">
    <span className="text-label text-n1 font-bold">{label}</span>
    <div className={cn(
      "mt-2 flex items-center gap-2 h-[52px] px-4 rounded-input border bg-n8 transition",
      error
        ? "border-destructive border-2"
        : "border-n4 focus-within:border-primary focus-within:border-2",
    )}>
      {children}
    </div>
    {error && (
      <p className="mt-1 text-caption text-destructive font-medium" role="alert">{error}</p>
    )}
  </label>
);

const SaudiPhoneField = ({
  label, value, onChange, lang, error,
}: {
  label: string;
  value: string;
  onChange: (raw: string) => void;
  lang: "en" | "ar";
  error?: string;
}) => {
  const display = formatSaudiMobile(value);
  return (
    <label className="block">
      <span className="text-label text-n1 font-bold">{label}</span>
      <div className={cn(
        "mt-2 flex items-stretch h-[52px] rounded-input border bg-n8 transition overflow-hidden",
        error
          ? "border-destructive border-2"
          : "border-n4 focus-within:border-primary focus-within:border-2",
      )} dir="ltr">
        <div className="flex items-center gap-1.5 px-3 bg-n7 border-e border-n6 text-n1">
          <span className="text-lg leading-none" aria-hidden>🇸🇦</span>
          <span className="text-body font-bold tabular">+966</span>
        </div>
        <input
          type="tel"
          inputMode="numeric"
          autoComplete="tel-national"
          value={display}
          onChange={e => onChange(e.target.value)}
          placeholder="5XX XXX XXXX"
          maxLength={12} // "5XX XXX XXXX" = 12 chars
          aria-label={label}
          className="flex-1 h-full px-3 outline-none text-body bg-transparent text-n1 placeholder:text-n4 tabular tracking-wide"
        />
      </div>
      {error ? (
        <p className="mt-1 text-caption text-destructive font-medium" role="alert">{error}</p>
      ) : (
        <p className="mt-1 text-caption text-[#616161]">
          {lang === "ar" ? "نرسل رمز التحقق عبر رسالة نصية" : "We'll text you a verification code"}
        </p>
      )}
    </label>
  );
};

const SocialBtn = ({ children, onClick }: { children: React.ReactNode; onClick: () => void }) => (
  <button
    onClick={onClick}
    className="w-full h-[52px] rounded-full border border-primary/30 bg-n8 flex items-center justify-center gap-2.5 hover:bg-primary-bg active:scale-[0.99] transition"
  >
    {children}
  </button>
);

const GoogleIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.99.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
    <path fill="#FBBC05" d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.83z"/>
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.83C6.71 7.31 9.14 5.38 12 5.38z"/>
  </svg>
);

const AppleIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5 fill-n1">
    <path d="M16.365 12.717c-.013-2.55 2.082-3.77 2.176-3.83-1.187-1.736-3.034-1.972-3.69-2-1.566-.158-3.06.92-3.857.92-.81 0-2.027-.9-3.336-.873-1.715.025-3.297.997-4.18 2.532-1.785 3.094-.456 7.677 1.282 10.197.85 1.232 1.86 2.611 3.184 2.563 1.281-.052 1.764-.83 3.31-.83 1.547 0 1.984.83 3.337.804 1.378-.025 2.249-1.252 3.09-2.49.973-1.43 1.373-2.815 1.397-2.886-.03-.013-2.682-1.029-2.713-4.107zM13.91 5.82c.71-.86 1.187-2.054 1.057-3.241-1.022.041-2.26.68-2.992 1.539-.658.762-1.23 1.977-1.075 3.144 1.139.088 2.3-.578 3.01-1.442z"/>
  </svg>
);

export default Auth;
