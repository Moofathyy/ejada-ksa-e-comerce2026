import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, Check } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { useStore } from "@/lib/store";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

type Mode = "signin" | "signup";

const Auth = () => {
  const nav = useNavigate();
  const { t, lang } = useI18n();
  const { signIn, city } = useStore();
  const [mode, setMode] = useState<Mode>("signin");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [remember, setRemember] = useState(true);
  const [loading, setLoading] = useState(false);

  const validatePhone = (v: string) => /^\+?[0-9\s-]{8,16}$/.test(v.trim());

  const submit = () => {
    if (!validatePhone(phone)) { toast.error(t("invalidPhone")); return; }
    if (password.length < 6) { toast.error(t("passwordTooShort")); return; }
    if (mode === "signup" && name.trim().length < 2) {
      toast.error(lang === "ar" ? "أدخل اسمك الكامل" : "Please enter your name");
      return;
    }

    setLoading(true);
    setTimeout(() => {
      const userName = mode === "signup" ? name.trim() : (lang === "ar" ? "أحمد" : "Ahmed");
      signIn({ name: userName, email: `${phone.trim()}@phone.local`, city });
      localStorage.setItem("ejada_user", userName);
      toast.success(mode === "signup" ? t("accountCreated") : t("welcomeBack"));
      setLoading(false);
      nav("/home", { replace: true });
    }, 600);
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

  return (
    <div className="phone-frame bg-background flex flex-col overflow-y-auto">
      {/* Deep blue header */}
      <header className="bg-primary text-n8 px-6 pt-10 pb-10">
        <h1 className="text-display font-bold">
          {mode === "signin" ? t("welcomeBack") : t("createYourAccount")}
        </h1>
        <p className="text-body opacity-90 mt-1.5">
          {mode === "signin" ? t("signInToContinue") : t("joinEjada")}
        </p>
      </header>

      <div className="px-6 pt-6 pb-8 flex-1 space-y-5">
        {/* Sign Up only: Full Name */}
        {mode === "signup" && (
          <Field label={t("fullName")}>
            <input
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder={lang === "ar" ? "أحمد العتيبي" : "Ahmed Al-Otaibi"}
              className="flex-1 h-full outline-none text-body bg-transparent text-n1 placeholder:text-n4"
            />
          </Field>
        )}

        {/* Phone Number */}
        <Field label={t("phoneNumber")}>
          <input
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            value={phone}
            onChange={e => setPhone(e.target.value)}
            placeholder={t("enterPhone")}
            dir="ltr"
            className="flex-1 h-full outline-none text-body bg-transparent text-n1 placeholder:text-n4"
          />
        </Field>

        {/* Password */}
        <Field label={t("password")}>
          <input
            type={showPwd ? "text" : "password"}
            autoComplete={mode === "signin" ? "current-password" : "new-password"}
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder={t("enterPassword")}
            dir="ltr"
            className="flex-1 h-full outline-none text-body bg-transparent text-n1 placeholder:text-n4"
          />
          <button type="button" onClick={() => setShowPwd(s => !s)} className="text-n4 hover:text-n2 px-1" aria-label="Toggle password">
            {showPwd ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </Field>

        {/* Remember me + Forgot */}
        {mode === "signin" && (
          <div className="flex items-center justify-between">
            <button
              onClick={() => setRemember(r => !r)}
              className="flex items-center gap-2 group"
              type="button"
            >
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
        )}

        {/* Primary CTA */}
        <button
          onClick={submit}
          disabled={loading}
          className="w-full h-[56px] rounded-full text-h3 font-semibold text-n8 shadow-cta active:scale-[0.98] transition disabled:opacity-60 bg-gradient-primary"
        >
          {loading ? "…" : (mode === "signin" ? t("signIn") : t("signUp"))}
        </button>

        {/* Divider */}
        <div className="flex items-center gap-3 pt-1">
          <div className="flex-1 h-px bg-n6" />
          <span className="text-caption text-n4">{lang === "ar" ? "أو" : "or"}</span>
          <div className="flex-1 h-px bg-n6" />
        </div>

        {/* Social */}
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

        {/* Guest */}
        <button
          onClick={guest}
          className="w-full text-body font-bold text-n1 py-3 hover:text-primary transition"
        >
          {t("continueAsGuest")}
        </button>

        {/* Switch mode */}
        <p className="text-center text-caption text-n2 pt-2">
          {mode === "signin" ? t("dontHaveAccount") : t("haveAccount")}{" "}
          <button
            onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
            className="text-primary font-bold"
          >
            {mode === "signin" ? t("register") : t("signIn")}
          </button>
        </p>

        <p className="text-center text-micro text-n4 leading-relaxed">
          {t("loginHint")}
        </p>
      </div>
    </div>
  );
};

const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <label className="block">
    <span className="text-label text-n1 font-bold">{label}</span>
    <div className="mt-2 flex items-center gap-2 h-[52px] px-4 rounded-input border border-n4 focus-within:border-primary focus-within:border-2 bg-n8 transition">
      {children}
    </div>
  </label>
);

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
