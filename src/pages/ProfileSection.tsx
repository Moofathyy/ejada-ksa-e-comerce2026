import { useParams } from "react-router-dom";
import { useState } from "react";
import { MobileShell } from "@/components/MobileShell";
import { TopBar } from "@/components/TopBar";
import { useI18n } from "@/lib/i18n";
import { useTheme, type Theme } from "@/lib/theme";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import {
  User, Mail, Phone, MapPin, Plus, CreditCard, Trophy, Bell, Globe, Moon,
  Lock, Smartphone, Shield, Eye, Settings as SettingsIcon, Download, Trash2,
  HelpCircle, FileText, Star, ChevronRight, Check, Sparkles, Gift, ShoppingBag,
  MessageSquare, Share2, UserPlus, TrendingUp, ArrowUpRight,
} from "lucide-react";
import { Sar } from "@/components/Sar";

type SectionConfig = {
  title: { en: string; ar: string };
  render: (lang: "en" | "ar") => JSX.Element;
};

const Field = ({ icon: Icon, label, value }: { icon: any; label: string; value: string }) => (
  <div className="flex items-center gap-3 px-4 py-3.5 border-b border-n6 last:border-0">
    <Icon className="w-5 h-5 text-primary flex-shrink-0" />
    <div className="flex-1 min-w-0">
      <p className="text-caption text-n3">{label}</p>
      <p className="text-body text-n1 font-medium truncate">{value}</p>
    </div>
    <ChevronRight className="w-5 h-5 text-n4" />
  </div>
);

const Card = ({ children }: { children: React.ReactNode }) => (
  <div className="bg-n8 rounded-card shadow-elev1 overflow-hidden">{children}</div>
);

const ToggleRow = ({ icon: Icon, label, desc, value, onChange }: any) => (
  <div className="flex items-center gap-3 px-4 py-3.5 border-b border-n6 last:border-0">
    <Icon className="w-5 h-5 text-primary flex-shrink-0" />
    <div className="flex-1 min-w-0">
      <p className="text-body text-n1 font-medium">{label}</p>
      {desc && <p className="text-caption text-n3 mt-0.5">{desc}</p>}
    </div>
    <Switch checked={value} onCheckedChange={onChange} />
  </div>
);

const ActionRow = ({ icon: Icon, label, onClick, danger }: any) => (
  <button
    onClick={onClick}
    className="w-full flex items-center gap-3 px-4 py-3.5 border-b border-n6 last:border-0 active:bg-n7 transition"
  >
    <Icon className={cn("w-5 h-5 flex-shrink-0", danger ? "text-warning-text" : "text-primary")} />
    <span className={cn("flex-1 text-start text-body font-medium", danger ? "text-warning-text" : "text-n1")}>{label}</span>
    <ChevronRight className="w-5 h-5 text-n4" />
  </button>
);

const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <h3 className="px-1 text-[11px] font-bold tracking-[0.14em] text-n3 uppercase">{children}</h3>
);

const PersonalInfo = (lang: "en" | "ar") => (
  <Card>
    <Field icon={User} label={lang === "ar" ? "الاسم الكامل" : "Full Name"} value="Sarah Al-Nemri" />
    <Field icon={Mail} label={lang === "ar" ? "البريد الإلكتروني" : "Email"} value="sarah@example.com" />
    <Field icon={Phone} label={lang === "ar" ? "رقم الجوال" : "Phone"} value="+966 5XX XXX XXX" />
  </Card>
);

const Addresses = (lang: "en" | "ar") => {
  const nav = useNavigate();
  return (
  <div className="space-y-3">
    {[
      { name: lang === "ar" ? "المنزل" : "Home", addr: lang === "ar" ? "الرياض، حي العليا، شارع الملك فهد" : "Riyadh, Al Olaya, King Fahd Rd", def: true },
      { name: lang === "ar" ? "العمل" : "Work", addr: lang === "ar" ? "الرياض، حي الملز، شارع صلاح الدين" : "Riyadh, Al Malaz, Salah Al-Din St" },
    ].map((a, i) => (
      <div key={i} className="bg-n8 rounded-card shadow-elev1 p-4">
        <div className="flex items-start gap-3">
          <MapPin className="w-5 h-5 text-primary mt-0.5" />
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <p className="text-body font-bold text-n1">{a.name}</p>
              {a.def && <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full font-bold">{lang === "ar" ? "افتراضي" : "DEFAULT"}</span>}
            </div>
            <p className="text-caption text-n3 mt-1">{a.addr}</p>
          </div>
        </div>
      </div>
    ))}
    <button onClick={() => nav("/profile/addresses/new")} className="w-full h-12 border-2 border-dashed border-n5 rounded-card flex items-center justify-center gap-2 text-primary font-semibold">
      <Plus className="w-5 h-5" /> {lang === "ar" ? "إضافة عنوان" : "Add Address"}
    </button>
  </div>
  );
};

const PaymentMethods = (lang: "en" | "ar") => (
  <div className="space-y-3">
    {[
      { brand: "Mada", last4: "4521", exp: "08/27" },
      { brand: "Visa", last4: "1248", exp: "11/26" },
    ].map((c, i) => (
      <div key={i} className="bg-gradient-to-br from-primary to-primary/80 text-n8 rounded-card shadow-elev1 p-5">
        <div className="flex justify-between items-start">
          <CreditCard className="w-8 h-8" />
          <span className="text-body font-bold">{c.brand}</span>
        </div>
        <p className="text-h2 tabular tracking-widest mt-6">•••• {c.last4}</p>
        <p className="text-caption opacity-80 mt-1">{lang === "ar" ? "الانتهاء" : "Expires"} {c.exp}</p>
      </div>
    ))}
    <button onClick={() => toast.success(lang === "ar" ? "إضافة بطاقة جديدة" : "Add new card")} className="w-full h-12 border-2 border-dashed border-n5 rounded-card flex items-center justify-center gap-2 text-primary font-semibold">
      <Plus className="w-5 h-5" /> {lang === "ar" ? "إضافة بطاقة" : "Add Card"}
    </button>
  </div>
);

const Loyalty = (lang: "en" | "ar") => {
  const points = 2450;
  const tier = lang === "ar" ? "ذهبي" : "Gold";
  const nextTier = lang === "ar" ? "بلاتيني" : "Platinum";
  const toNext = 550;
  const pct = Math.round((points / (points + toNext)) * 100);
  const value = (points * 0.1).toFixed(1); // 1 SAR per 10 points

  const activity = [
    { icon: ShoppingBag, label: lang === "ar" ? "شراء MacBook Pro" : "MacBook Pro purchase", date: lang === "ar" ? "قبل يومين" : "2 days ago", pts: "+950" },
    { icon: Star,        label: lang === "ar" ? "تقييم منتج" : "Product review",            date: lang === "ar" ? "قبل 5 أيام" : "5 days ago", pts: "+50" },
    { icon: Gift,        label: lang === "ar" ? "استبدال قسيمة" : "Voucher redeemed",        date: lang === "ar" ? "قبل أسبوع" : "1 week ago", pts: "-500" },
    { icon: ShoppingBag, label: lang === "ar" ? "شراء AirPods Pro" : "AirPods Pro purchase",  date: lang === "ar" ? "قبل أسبوعين" : "2 weeks ago", pts: "+90" },
  ];

  const earn = [
    { icon: ShoppingBag,   label: lang === "ar" ? "تسوق واربح" : "Shop & earn",           desc: lang === "ar" ? "10 نقاط لكل ريال" : "10 pts per SAR spent" },
    { icon: MessageSquare, label: lang === "ar" ? "اكتب تقييمات" : "Write reviews",       desc: lang === "ar" ? "50 نقطة لكل تقييم" : "50 pts per review" },
    { icon: UserPlus,      label: lang === "ar" ? "ادعُ صديقاً" : "Invite a friend",       desc: lang === "ar" ? "500 نقطة لكل تسجيل" : "500 pts per signup" },
    { icon: Share2,        label: lang === "ar" ? "شارك المنتجات" : "Share products",      desc: lang === "ar" ? "25 نقطة لكل مشاركة" : "25 pts per share" },
  ];

  const rewards = [
    { pts: 500,  label: lang === "ar" ? "خصم 50 ريال" : "SAR 50 off",   locked: false },
    { pts: 1000, label: lang === "ar" ? "خصم 100 ريال" : "SAR 100 off", locked: false },
    { pts: 2500, label: lang === "ar" ? "شحن مجاني" : "Free shipping",  locked: false },
    { pts: 5000, label: lang === "ar" ? "خصم 600 ريال" : "SAR 600 off", locked: true },
  ];

  return (
    <div className="space-y-5">
      {/* Hero — points balance */}
      <div className="text-center pt-2">
        <div className="w-24 h-24 mx-auto rounded-full bg-warning/15 flex items-center justify-center">
          <Trophy className="w-11 h-11 text-warning-text" />
        </div>
        <h2 className="text-h1 text-n1 mt-4">{lang === "ar" ? `عضوية ${tier}ية` : `${tier} Member`}</h2>
        <p className="text-caption text-n3 mt-1">{lang === "ar" ? "استمر في التسوق لربح المزيد" : "Keep shopping to earn more"}</p>
      </div>

      {/* Points summary card */}
      <div className="bg-n8 rounded-card shadow-elev1 p-5 space-y-4">
        <div className="flex items-baseline justify-between">
          <div>
            <p className="text-caption text-n3 font-semibold">{lang === "ar" ? "النقاط المتاحة" : "Available Points"}</p>
            <p className="text-display font-bold text-n1 tabular leading-tight mt-1">{points.toLocaleString()}</p>
          </div>
          <div className="text-end">
            <p className="text-caption text-n3 font-semibold">{lang === "ar" ? "القيمة" : "Value"}</p>
            <p className="text-h2 text-success-text tabular flex items-center gap-1">
              <Sar /> {value}
            </p>
          </div>
        </div>

        <div>
          <div className="flex justify-between text-caption mb-1.5">
            <span className="text-n3">{tier}</span>
            <span className="text-n3">{nextTier}</span>
          </div>
          <div className="h-2.5 bg-n7 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-warning to-warning-text rounded-full transition-all"
              style={{ width: `${pct}%` }}
            />
          </div>
          <p className="text-caption text-n3 mt-2">
            {lang === "ar" ? `${toNext} نقطة للوصول إلى ${nextTier}` : `${toNext} points to ${nextTier}`}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-2 pt-1">
          <button onClick={() => toast.success(lang === "ar" ? "قريباً" : "Coming soon")}
            className="h-11 bg-primary text-primary-foreground rounded-full font-bold text-caption shadow-elev1">
            {lang === "ar" ? "استبدال النقاط" : "Redeem"}
          </button>
          <button onClick={() => toast.success(lang === "ar" ? "قريباً" : "Coming soon")}
            className="h-11 border border-primary text-primary rounded-full font-bold text-caption">
            {lang === "ar" ? "إرسال نقاط" : "Send Points"}
          </button>
        </div>
      </div>

      {/* Earning hero */}
      <div className="rounded-card overflow-hidden bg-gradient-to-br from-warning to-warning-text text-n1 p-5 relative">
        <Sparkles className="absolute end-3 top-3 w-20 h-20 opacity-20" />
        <div className="flex items-center gap-2">
          <Star className="w-5 h-5 fill-n1" />
          <span className="text-[11px] font-bold tracking-[0.14em] uppercase">{lang === "ar" ? "اربح المزيد" : "Earn More"}</span>
        </div>
        <p className="text-h1 font-bold mt-2 leading-tight">
          {lang === "ar" ? "ضاعف نقاطك هذا الأسبوع" : "Double points this week"}
        </p>
        <p className="text-caption opacity-90 mt-1">
          {lang === "ar" ? "على جميع طلبات الإلكترونيات" : "On all electronics orders"}
        </p>
        <button onClick={() => toast.success(lang === "ar" ? "ابدأ التسوق" : "Start shopping")}
          className="mt-3 inline-flex items-center gap-1 text-caption font-bold underline underline-offset-2">
          {lang === "ar" ? "تسوق الآن" : "Shop now"} <ArrowUpRight className="w-4 h-4" />
        </button>
      </div>

      {/* Recent Activity */}
      <div>
        <SectionTitle>{lang === "ar" ? "النشاط الأخير" : "Recent Activity"}</SectionTitle>
        <div className="mt-2">
          <Card>
            {activity.map((a, i) => {
              const Icon = a.icon;
              const positive = a.pts.startsWith("+");
              return (
                <div key={i} className="flex items-center gap-3 px-4 py-3.5 border-b border-n6 last:border-0">
                  <div className={cn("w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0",
                    positive ? "bg-success/15" : "bg-warning/15")}>
                    <Icon className={cn("w-4 h-4", positive ? "text-success-text" : "text-warning-text")} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-body text-n1 font-medium truncate">{a.label}</p>
                    <p className="text-caption text-n3">{a.date}</p>
                  </div>
                  <span className={cn("text-body font-bold tabular",
                    positive ? "text-success-text" : "text-warning-text")}>{a.pts}</span>
                </div>
              );
            })}
          </Card>
        </div>
      </div>

      {/* Available Rewards */}
      <div>
        <SectionTitle>{lang === "ar" ? "المكافآت المتاحة" : "Available Rewards"}</SectionTitle>
        <div className="mt-2 grid grid-cols-2 gap-3">
          {rewards.map((r, i) => {
            const canRedeem = !r.locked && points >= r.pts;
            return (
              <button
                key={i}
                disabled={!canRedeem}
                onClick={() => toast.success(lang === "ar" ? "تم الاستبدال" : "Redeemed!")}
                className={cn(
                  "bg-n8 rounded-card shadow-elev1 p-4 text-start border transition active:scale-95",
                  canRedeem ? "border-primary/30" : "border-n6 opacity-60",
                )}
              >
                <Gift className={cn("w-6 h-6", canRedeem ? "text-primary" : "text-n4")} />
                <p className="text-body font-bold text-n1 mt-2">{r.label}</p>
                <p className="text-caption text-n3 mt-0.5 tabular">{r.pts.toLocaleString()} {lang === "ar" ? "نقطة" : "pts"}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Ways to earn */}
      <div>
        <SectionTitle>{lang === "ar" ? "طرق ربح النقاط" : "Ways to Earn"}</SectionTitle>
        <div className="mt-2">
          <Card>
            {earn.map((e, i) => {
              const Icon = e.icon;
              return (
                <div key={i} className="flex items-center gap-3 px-4 py-3.5 border-b border-n6 last:border-0">
                  <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-4 h-4 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-body text-n1 font-medium">{e.label}</p>
                    <p className="text-caption text-n3">{e.desc}</p>
                  </div>
                  <TrendingUp className="w-4 h-4 text-success-text" />
                </div>
              );
            })}
          </Card>
        </div>
      </div>

      {/* Footer actions */}
      <Card>
        <ActionRow icon={FileText} label={lang === "ar" ? "سجل النقاط الكامل" : "Full Points History"} onClick={() => {}} />
        <ActionRow icon={HelpCircle} label={lang === "ar" ? "كيف يعمل البرنامج؟" : "How the program works"} onClick={() => {}} />
      </Card>
    </div>
  );
};

const Notifications = (lang: "en" | "ar") => {
  const [s, setS] = useState({ orders: true, deals: true, push: true, email: false, sms: true });
  const items = [
    { k: "orders", icon: Bell, label: lang === "ar" ? "تحديثات الطلبات" : "Order Updates" },
    { k: "deals", icon: Star, label: lang === "ar" ? "العروض والخصومات" : "Deals & Promotions" },
    { k: "push", icon: Smartphone, label: lang === "ar" ? "إشعارات الجوال" : "Push Notifications" },
    { k: "email", icon: Mail, label: lang === "ar" ? "البريد الإلكتروني" : "Email Notifications" },
    { k: "sms", icon: Phone, label: lang === "ar" ? "رسائل SMS" : "SMS Notifications" },
  ];
  return (
    <Card>
      {items.map(i => (
        <ToggleRow key={i.k} icon={i.icon} label={i.label} value={(s as any)[i.k]} onChange={(v: boolean) => setS({ ...s, [i.k]: v })} />
      ))}
    </Card>
  );
};

const LanguageA11y = (lang: "en" | "ar") => {
  const { setLang } = useI18n();
  const [large, setLarge] = useState(false);
  return (
    <div className="space-y-4">
      <div>
        <SectionTitle>{lang === "ar" ? "اللغة" : "Language"}</SectionTitle>
        <Card>
          {[{ k: "en", l: "English" }, { k: "ar", l: "العربية" }].map(o => (
            <button key={o.k} onClick={() => { setLang(o.k as any); toast.success("Updated"); }} className="w-full flex items-center gap-3 px-4 py-3.5 border-b border-n6 last:border-0 active:bg-n7">
              <Globe className="w-5 h-5 text-primary" />
              <span className="flex-1 text-start text-body font-medium text-n1">{o.l}</span>
              {lang === o.k && <Check className="w-5 h-5 text-success-text" />}
            </button>
          ))}
        </Card>
      </div>
      <div>
        <SectionTitle>{lang === "ar" ? "إمكانية الوصول" : "Accessibility"}</SectionTitle>
        <Card>
          <ToggleRow icon={Eye} label={lang === "ar" ? "نص كبير" : "Large Text"} value={large} onChange={setLarge} />
        </Card>
      </div>
    </div>
  );
};

const Appearance = (lang: "en" | "ar") => {
  const { theme, setTheme } = useTheme();
  const opts: { k: Theme; l: string }[] = [
    { k: "light", l: lang === "ar" ? "فاتح" : "Light" },
    { k: "dark", l: lang === "ar" ? "داكن" : "Dark" },
    { k: "system", l: lang === "ar" ? "تلقائي" : "System" },
  ];
  return (
    <Card>
      {opts.map(o => (
        <button
          key={o.k}
          onClick={() => { setTheme(o.k); toast.success(lang === "ar" ? "تم تحديث المظهر" : "Appearance updated"); }}
          className="w-full flex items-center gap-3 px-4 py-3.5 border-b border-n6 last:border-0 active:bg-n7"
        >
          <Moon className="w-5 h-5 text-primary" />
          <span className="flex-1 text-start text-body font-medium text-n1">{o.l}</span>
          {theme === o.k && <Check className="w-5 h-5 text-success-text" />}
        </button>
      ))}
    </Card>
  );
};

const ChangePassword = (lang: "en" | "ar") => {
  const [f, setF] = useState({ c: "", n: "", r: "" });
  return (
    <form onSubmit={(e) => { e.preventDefault(); toast.success(lang === "ar" ? "تم تحديث كلمة المرور" : "Password updated"); }} className="space-y-4">
      {[
        { k: "c", l: lang === "ar" ? "كلمة المرور الحالية" : "Current Password" },
        { k: "n", l: lang === "ar" ? "كلمة المرور الجديدة" : "New Password" },
        { k: "r", l: lang === "ar" ? "تأكيد كلمة المرور" : "Confirm Password" },
      ].map(i => (
        <div key={i.k}>
          <label className="text-caption text-n3 font-medium">{i.l}</label>
          <input type="password" value={(f as any)[i.k]} onChange={e => setF({ ...f, [i.k]: e.target.value })}
            className="w-full mt-1 h-12 px-4 bg-n8 border border-n5 rounded-input text-body focus:border-primary outline-none" />
        </div>
      ))}
      <button type="submit" className="w-full h-[52px] bg-primary text-n8 rounded-full font-bold shadow-elev1">{lang === "ar" ? "تحديث" : "Update Password"}</button>
    </form>
  );
};

const LinkedDevices = (lang: "en" | "ar") => (
  <Card>
    {[
      { name: "iPhone 15 Pro", info: lang === "ar" ? "هذا الجهاز • نشط الآن" : "This device • Active now", current: true },
      { name: "MacBook Pro", info: lang === "ar" ? "نشط منذ ساعتين" : "Active 2 hours ago" },
      { name: "iPad Air", info: lang === "ar" ? "نشط منذ 3 أيام" : "Active 3 days ago" },
    ].map((d, i) => (
      <div key={i} className="flex items-center gap-3 px-4 py-3.5 border-b border-n6 last:border-0">
        <Smartphone className="w-5 h-5 text-primary" />
        <div className="flex-1 min-w-0">
          <p className="text-body text-n1 font-medium">{d.name}</p>
          <p className="text-caption text-n3">{d.info}</p>
        </div>
        {d.current ? (
          <span className="text-[10px] bg-success/20 text-success-text px-2 py-1 rounded-full font-bold">{lang === "ar" ? "حالي" : "CURRENT"}</span>
        ) : (
          <button onClick={() => toast.success("Removed")} className="text-caption text-warning-text font-semibold">{lang === "ar" ? "إزالة" : "Remove"}</button>
        )}
      </div>
    ))}
  </Card>
);

const Privacy = (lang: "en" | "ar") => {
  const [s, setS] = useState({ analytics: true, ads: false, share: false });
  const items = [
    { k: "analytics", label: lang === "ar" ? "تحليلات الاستخدام" : "Usage Analytics", desc: lang === "ar" ? "ساعدنا في تحسين التطبيق" : "Help us improve the app" },
    { k: "ads", label: lang === "ar" ? "إعلانات مخصصة" : "Personalized Ads", desc: lang === "ar" ? "استخدام بياناتك للإعلانات" : "Use data for advertising" },
    { k: "share", label: lang === "ar" ? "مشاركة البيانات" : "Data Sharing", desc: lang === "ar" ? "مشاركة مع الشركاء" : "Share with partners" },
  ];
  return (
    <Card>
      {items.map(i => (
        <ToggleRow key={i.k} icon={SettingsIcon} label={i.label} desc={i.desc} value={(s as any)[i.k]} onChange={(v: boolean) => setS({ ...s, [i.k]: v })} />
      ))}
    </Card>
  );
};

const DownloadData = (lang: "en" | "ar") => (
  <div className="space-y-4">
    <div className="bg-n8 rounded-card shadow-elev1 p-5">
      <Download className="w-10 h-10 text-primary" />
      <h3 className="text-h2 text-n1 mt-3">{lang === "ar" ? "تنزيل بياناتك" : "Download Your Data"}</h3>
      <p className="text-body text-n3 mt-2">
        {lang === "ar" ? "احصل على نسخة من جميع بياناتك بما في ذلك الطلبات والعناوين والتفضيلات." : "Get a copy of all your data including orders, addresses, and preferences."}
      </p>
    </div>
    <button onClick={() => toast.success(lang === "ar" ? "سيتم إرسال البيانات للبريد" : "Data will be emailed within 48 hours")}
      className="w-full h-[52px] bg-primary text-n8 rounded-full font-bold shadow-elev1">
      {lang === "ar" ? "طلب التنزيل" : "Request Download"}
    </button>
  </div>
);

const DeleteAccount = (lang: "en" | "ar") => (
  <div className="space-y-4">
    <div className="bg-warning/10 border border-warning rounded-card p-5">
      <Trash2 className="w-10 h-10 text-warning-text" />
      <h3 className="text-h2 text-n1 mt-3">{lang === "ar" ? "حذف الحساب" : "Delete Account"}</h3>
      <p className="text-body text-n3 mt-2">
        {lang === "ar" ? "هذا الإجراء دائم. سيتم حذف جميع بياناتك وطلباتك ولا يمكن استرجاعها." : "This action is permanent. All your data and orders will be deleted and cannot be recovered."}
      </p>
    </div>
    <button onClick={() => toast.error(lang === "ar" ? "هذه نسخة تجريبية" : "This is a demo")}
      className="w-full h-[52px] bg-warning text-n1 rounded-full font-bold shadow-elev1">
      {lang === "ar" ? "حذف حسابي نهائياً" : "Permanently Delete My Account"}
    </button>
  </div>
);

const HelpCenter = (lang: "en" | "ar") => {
  const faqs = [
    { q: lang === "ar" ? "كيف أتتبع طلبي؟" : "How do I track my order?", a: lang === "ar" ? "من قسم الطلبات اضغط على الطلب لرؤية التتبع." : "Go to Orders and tap any order to see tracking." },
    { q: lang === "ar" ? "ما هي سياسة الإرجاع؟" : "What is the return policy?", a: lang === "ar" ? "يمكنك إرجاع المنتجات خلال 14 يوماً." : "Returns accepted within 14 days." },
    { q: lang === "ar" ? "كيف أغير عنواني؟" : "How do I change my address?", a: lang === "ar" ? "من حسابي > العناوين المحفوظة." : "Profile > Saved Addresses." },
  ];
  return (
    <Card>
      {faqs.map((f, i) => (
        <details key={i} className="border-b border-n6 last:border-0 group">
          <summary className="flex items-center gap-3 px-4 py-3.5 cursor-pointer list-none">
            <HelpCircle className="w-5 h-5 text-primary" />
            <span className="flex-1 text-body font-medium text-n1">{f.q}</span>
            <ChevronRight className="w-5 h-5 text-n4 group-open:rotate-90 transition" />
          </summary>
          <p className="px-4 pb-4 text-body text-n3 ps-12">{f.a}</p>
        </details>
      ))}
    </Card>
  );
};

const ContactUs = (lang: "en" | "ar") => (
  <div className="space-y-3">
    <Card>
      <ActionRow icon={Phone} label={lang === "ar" ? "اتصل بنا: 920000000" : "Call: 920 000 000"} onClick={() => toast.success("Calling…")} />
      <ActionRow icon={Mail} label="support@ejada.sa" onClick={() => toast.success("Opening email…")} />
    </Card>
    <div>
      <SectionTitle>{lang === "ar" ? "أرسل رسالة" : "Send a message"}</SectionTitle>
      <textarea placeholder={lang === "ar" ? "اكتب رسالتك..." : "Write your message..."} rows={6}
        className="w-full mt-2 p-4 bg-n8 border border-n5 rounded-card text-body focus:border-primary outline-none resize-none" />
      <button onClick={() => toast.success(lang === "ar" ? "تم الإرسال" : "Message sent")}
        className="w-full h-[52px] mt-3 bg-primary text-n8 rounded-full font-bold shadow-elev1">
        {lang === "ar" ? "إرسال" : "Send"}
      </button>
    </div>
  </div>
);

const LegalDoc = (title: { en: string; ar: string }) => (lang: "en" | "ar") => (
  <div className="bg-n8 rounded-card shadow-elev1 p-5 space-y-3 text-body text-n2 leading-relaxed">
    <h2 className="text-h2 text-n1">{title[lang]}</h2>
    <p className="text-caption text-n3">{lang === "ar" ? "آخر تحديث: 1 يناير 2026" : "Last updated: Jan 1, 2026"}</p>
    {[1, 2, 3, 4].map(i => (
      <p key={i}>
        {lang === "ar"
          ? "هذه نسخة تجريبية من المستند. يحتوي على الشروط الكاملة عند الإطلاق الرسمي للتطبيق وفقاً للأنظمة المعمول بها في المملكة العربية السعودية."
          : "This is a demo version of the document. The full terms will be provided at official app launch in compliance with applicable Saudi Arabian regulations."}
      </p>
    ))}
  </div>
);

const RateApp = (lang: "en" | "ar") => {
  const [r, setR] = useState(0);
  return (
    <div className="space-y-4 text-center py-6">
      <Star className="w-16 h-16 text-warning mx-auto" fill="currentColor" />
      <h2 className="text-h1 text-n1">{lang === "ar" ? "هل تستمتع بإجادة؟" : "Enjoying Ejada?"}</h2>
      <p className="text-body text-n3 px-6">{lang === "ar" ? "قيّمنا في المتجر وساعدنا في الوصول لمزيد من المتسوقين." : "Rate us on the store to help us reach more shoppers."}</p>
      <div className="flex justify-center gap-2">
        {[1, 2, 3, 4, 5].map(i => (
          <button key={i} onClick={() => setR(i)}>
            <Star className={cn("w-10 h-10", i <= r ? "text-warning fill-warning" : "text-n5")} />
          </button>
        ))}
      </div>
      <button onClick={() => toast.success(lang === "ar" ? "شكراً لتقييمك!" : "Thanks for rating!")} disabled={!r}
        className="w-full h-[52px] bg-primary text-n8 rounded-full font-bold shadow-elev1 disabled:opacity-50">
        {lang === "ar" ? "إرسال التقييم" : "Submit Rating"}
      </button>
    </div>
  );
};

const SECTIONS: Record<string, SectionConfig> = {
  "personal-info": { title: { en: "Personal Information", ar: "المعلومات الشخصية" }, render: PersonalInfo },
  addresses: { title: { en: "Saved Addresses", ar: "العناوين المحفوظة" }, render: Addresses },
  payments: { title: { en: "Payment Methods", ar: "وسائل الدفع" }, render: PaymentMethods },
  loyalty: { title: { en: "Loyalty Rewards", ar: "نقاط الولاء" }, render: Loyalty },
  notifications: { title: { en: "Notifications", ar: "الإشعارات" }, render: Notifications },
  language: { title: { en: "Language & Accessibility", ar: "اللغة وإمكانية الوصول" }, render: LanguageA11y },
  appearance: { title: { en: "Appearance", ar: "المظهر" }, render: Appearance },
  "change-password": { title: { en: "Change Password", ar: "تغيير كلمة المرور" }, render: ChangePassword },
  devices: { title: { en: "Linked Devices", ar: "الأجهزة المرتبطة" }, render: LinkedDevices },
  "privacy-settings": { title: { en: "Privacy Settings", ar: "إعدادات الخصوصية" }, render: Privacy },
  "download-data": { title: { en: "Download My Data", ar: "تنزيل بياناتي" }, render: DownloadData },
  "delete-account": { title: { en: "Delete Account", ar: "حذف الحساب" }, render: DeleteAccount },
  help: { title: { en: "Help Center", ar: "مركز المساعدة" }, render: HelpCenter },
  contact: { title: { en: "Contact Us", ar: "تواصل معنا" }, render: ContactUs },
  terms: { title: { en: "Terms & Conditions", ar: "الشروط والأحكام" }, render: LegalDoc({ en: "Terms & Conditions", ar: "الشروط والأحكام" }) },
  privacy: { title: { en: "Privacy Policy", ar: "سياسة الخصوصية" }, render: LegalDoc({ en: "Privacy Policy", ar: "سياسة الخصوصية" }) },
  rate: { title: { en: "Rate App", ar: "قيّم التطبيق" }, render: RateApp },
};

const ProfileSection = () => {
  const { section } = useParams();
  const { lang } = useI18n();
  const config = section ? SECTIONS[section] : null;

  if (!config) {
    return (
      <MobileShell>
        <TopBar title="Not Found" />
        <main className="p-4 text-center text-n3">Section not found.</main>
      </MobileShell>
    );
  }

  return (
    <MobileShell>
      <TopBar title={config.title[lang]} />
      <main className="p-4 pb-8">{config.render(lang)}</main>
    </MobileShell>
  );
};

export default ProfileSection;
