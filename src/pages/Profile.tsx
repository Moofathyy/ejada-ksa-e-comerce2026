import { useNavigate } from "react-router-dom";
import {
  User, MapPin, CreditCard, Trophy, Package, Heart,
  Bell, Globe, Moon,
  Lock, Smartphone, Shield, Eye,
  Settings as SettingsIcon, Download, Trash2,
  HelpCircle, Mail, FileText, Star,
  Camera, ChevronRight, LogOut, CheckCircle2,
} from "lucide-react";
import { MobileShell } from "@/components/MobileShell";
import { useI18n } from "@/lib/i18n";
import { useStore } from "@/lib/store";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { useState } from "react";

type Row = {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  to?: string;
  trailing?: React.ReactNode;
  danger?: boolean;
  toggle?: { value: boolean; onChange: (v: boolean) => void };
};

const Profile = () => {
  const nav = useNavigate();
  const { t, lang, dir } = useI18n();
  const { wishlist } = useStore();
  const userName = localStorage.getItem("ejada_user") || "Sarah Al-Nemri";
  const userId = "ATEL-8892-OX";

  const [biometric, setBiometric] = useState(false);
  const [twoFA, setTwoFA] = useState(false);

  const stats = [
    { icon: MapPin, label: lang === "ar" ? "العناوين" : "Addresses", value: "2" },
    { icon: CreditCard, label: lang === "ar" ? "الدفع" : "Payment", value: "Mada" },
    { icon: Trophy, label: lang === "ar" ? "المستوى" : "Tier", value: lang === "ar" ? "ذهبي" : "Gold" },
    { icon: CheckCircle2, label: lang === "ar" ? "الحالة" : "Status", value: lang === "ar" ? "نشط" : "Active", success: true },
  ];

  const shopping: Row[] = [
    { icon: User, label: lang === "ar" ? "المعلومات الشخصية" : "Personal Information", to: "/profile/personal-info" },
    { icon: MapPin, label: lang === "ar" ? "العناوين المحفوظة" : "Saved Addresses", to: "/profile/addresses" },
    { icon: CreditCard, label: lang === "ar" ? "وسائل الدفع" : "Payment Methods", to: "/profile/payments" },
    { icon: Trophy, label: lang === "ar" ? "نقاط الولاء" : "Loyalty Rewards", to: "/profile/loyalty", trailing: <span className="text-caption text-n3 tabular">2450 pts</span> },
    { icon: Package, label: lang === "ar" ? "سجل الطلبات" : "Order History", to: "/orders" },
    { icon: Heart, label: t("wishlist"), to: "/wishlist", trailing: wishlist.length ? <span className="text-caption text-n3 tabular">{wishlist.length}</span> : undefined },
  ];

  const preferences: Row[] = [
    { icon: Bell, label: lang === "ar" ? "الإشعارات" : "Notifications", to: "/profile/notifications" },
    { icon: Globe, label: lang === "ar" ? "اللغة وإمكانية الوصول" : "Language & Accessibility", to: "/profile/language" },
    { icon: Moon, label: lang === "ar" ? "المظهر" : "Appearance", to: "/profile/appearance", trailing: <span className="text-caption text-n3">{lang === "ar" ? "فاتح" : "Light"}</span> },
  ];

  const security: Row[] = [
    { icon: Lock, label: lang === "ar" ? "تغيير كلمة المرور" : "Change Password", to: "/profile/change-password" },
    { icon: Smartphone, label: lang === "ar" ? "تسجيل الدخول البيومتري" : "Biometric Login", toggle: { value: biometric, onChange: setBiometric } },
    { icon: Shield, label: lang === "ar" ? "المصادقة الثنائية" : "Two-Factor Authentication", toggle: { value: twoFA, onChange: setTwoFA } },
    { icon: Eye, label: lang === "ar" ? "الأجهزة المرتبطة" : "Linked Devices", to: "/profile/devices" },
  ];

  const privacy: Row[] = [
    { icon: SettingsIcon, label: lang === "ar" ? "إعدادات الخصوصية" : "Privacy Settings", to: "/profile/privacy-settings" },
    { icon: Download, label: lang === "ar" ? "تنزيل بياناتي" : "Download My Data", to: "/profile/download-data" },
    { icon: Trash2, label: lang === "ar" ? "حذف الحساب" : "Delete Account", to: "/profile/delete-account", danger: true },
  ];

  const about: Row[] = [
    { icon: HelpCircle, label: lang === "ar" ? "مركز المساعدة" : "Help Center", to: "/profile/help" },
    { icon: Mail, label: lang === "ar" ? "تواصل معنا" : "Contact Us", to: "/profile/contact" },
    { icon: FileText, label: lang === "ar" ? "الشروط والأحكام" : "Terms & Conditions", to: "/profile/terms" },
    { icon: FileText, label: lang === "ar" ? "سياسة الخصوصية" : "Privacy Policy", to: "/profile/privacy" },
    { icon: Star, label: lang === "ar" ? "قيّم التطبيق" : "Rate App", to: "/profile/rate" },
  ];

  const Section = ({ title, rows }: { title: string; rows: Row[] }) => (
    <section className="space-y-2">
      <h3 className="px-1 text-[11px] font-bold tracking-[0.14em] text-n3 uppercase">{title}</h3>
      <div className="bg-n8 rounded-card shadow-elev1 overflow-hidden">
        {rows.map((r, i) => {
          const Icon = r.icon;
          const content = (
            <>
              <Icon className={cn("w-5 h-5 flex-shrink-0", r.danger ? "text-warning-text" : "text-primary")} />
              <span className={cn("flex-1 text-start text-body font-medium", r.danger ? "text-warning-text" : "text-n1")}>{r.label}</span>
              {r.trailing}
              {r.toggle ? (
                <Switch checked={r.toggle.value} onCheckedChange={r.toggle.onChange} />
              ) : (
                <ChevronRight className={cn("w-5 h-5 text-n4", dir === "rtl" && "rotate-180")} />
              )}
            </>
          );
          const baseCls = "w-full flex items-center gap-3 px-4 py-3.5 border-b border-n6 last:border-0";
          if (r.toggle) {
            return <div key={i} className={baseCls}>{content}</div>;
          }
          return (
            <button key={i} onClick={() => r.to && r.to !== "#" && nav(r.to)} className={cn(baseCls, "active:bg-n7 transition-colors")}>
              {content}
            </button>
          );
        })}
      </div>
    </section>
  );

  return (
    <MobileShell>
      {/* Blue header */}
      <header className="bg-primary text-n8 pt-6 pb-5 rounded-b-3xl shadow-elev1">
        <div className="flex flex-col items-center px-4">
          <div className="relative">
            <div className="w-[88px] h-[88px] rounded-full bg-n8/15 backdrop-blur border-4 border-n8/30 flex items-center justify-center text-display font-bold overflow-hidden">
              {userName[0]}
            </div>
            <button aria-label="Change photo" className="absolute -bottom-1 -end-1 w-7 h-7 rounded-full bg-primary border-2 border-n8 flex items-center justify-center">
              <Camera className="w-3.5 h-3.5 text-n8" />
            </button>
          </div>
          <h1 className="mt-3 text-h1 font-bold">{userName}</h1>
          <p className="text-caption opacity-80 tabular tracking-wider">ID: {userId}</p>
          <span className="mt-2 inline-flex items-center gap-1 bg-warning text-n1 px-3 py-1 rounded-full text-caption font-bold">
            ★ {t("membershipGold")}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2.5 px-4 mt-5">
          {stats.map(s => {
            const Icon = s.icon;
            return (
              <div key={s.label} className="bg-n8/10 backdrop-blur rounded-input px-3 py-2.5">
                <div className="flex items-center gap-1.5 text-[11px] opacity-80">
                  <Icon className="w-3.5 h-3.5" />
                  <span>{s.label}</span>
                </div>
                <p className={cn("text-body font-bold mt-0.5", s.success && "text-success-text")}>{s.value}</p>
              </div>
            );
          })}
        </div>
      </header>

      <main className="px-4 pt-5 pb-6 space-y-5">
        <Section title={lang === "ar" ? "التسوق" : "SHOPPING"} rows={shopping} />
        <Section title={lang === "ar" ? "التفضيلات" : "PREFERENCES"} rows={preferences} />
        <Section title={lang === "ar" ? "الأمان" : "SECURITY"} rows={security} />
        <Section title={lang === "ar" ? "الخصوصية" : "PRIVACY"} rows={privacy} />
        <Section title={lang === "ar" ? "عن التطبيق" : "ABOUT"} rows={about} />

        <div className="flex items-center justify-between px-1 text-caption text-n3">
          <span>{lang === "ar" ? "الإصدار" : "Version"}</span>
          <span className="tabular">v2.4.1</span>
        </div>

        <button
          onClick={() => { localStorage.clear(); nav("/auth", { replace: true }); }}
          className="w-full h-[52px] bg-warning text-n1 rounded-full font-bold flex items-center justify-center gap-2 shadow-elev1 active:scale-[0.99] transition"
        >
          <LogOut className="w-5 h-5" /> {lang === "ar" ? "تسجيل الخروج" : "Sign Out"}
        </button>
      </main>
    </MobileShell>
  );
};

export default Profile;
