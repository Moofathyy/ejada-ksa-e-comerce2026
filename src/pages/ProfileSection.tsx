import { useParams, useNavigate } from "react-router-dom";
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
  MessageSquare, Share2, UserPlus, TrendingUp, ArrowUpRight, Home, Briefcase, ArrowLeft, ArrowRight,
} from "lucide-react";
import { Sar } from "@/components/Sar";
import { useStore } from "@/lib/store";

type SectionConfig = {
  title: { en: string; ar: string };
  render: (lang: "en" | "ar") => JSX.Element;
  hideTopBar?: boolean;
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

const PI_KEY = "ejada_personal_info";
type PIData = {
  fullName: string;
  phone: string;
  email: string;
  dob: string;
  nationalId: string;
  gender: "male" | "female" | "";
};
const PI_DEFAULT: PIData = {
  fullName: "Sarah Al-Nemri",
  phone: "+966 50 000 0000",
  email: "sarah.alnemri@example.com",
  dob: "1995-04-12",
  nationalId: "1234567890",
  gender: "female",
};

const InputRow = ({
  icon: Icon, label, children, hint,
}: { icon: any; label: string; children: React.ReactNode; hint?: string }) => (
  <div className="px-4 py-3 border-b border-n6 last:border-0">
    <label className="flex items-center gap-2 text-caption text-n3 mb-1.5">
      <Icon className="w-4 h-4 text-primary" />
      {label}
    </label>
    {children}
    {hint && <p className="text-[11px] text-n3 mt-1.5">{hint}</p>}
  </div>
);

const inputCls =
  "w-full h-11 bg-n7 rounded-input px-3 text-body text-n1 font-medium border border-transparent focus:border-primary focus:outline-none placeholder:text-n4";

const PersonalInfo = (lang: "en" | "ar") => {
  const tr = (en: string, ar: string) => (lang === "ar" ? ar : en);
  const [data, setData] = useState<PIData>(() => {
    try {
      const raw = localStorage.getItem(PI_KEY);
      return raw ? { ...PI_DEFAULT, ...JSON.parse(raw) } : PI_DEFAULT;
    } catch { return PI_DEFAULT; }
  });
  const set = <K extends keyof PIData>(k: K, v: PIData[K]) => setData(d => ({ ...d, [k]: v }));

  const maskedId = data.nationalId
    ? data.nationalId.slice(0, 3) + "****" + data.nationalId.slice(-3)
    : "";

  const onSave = () => {
    if (!data.fullName.trim()) return toast.error(tr("Full name required", "الاسم الكامل مطلوب"));
    if (!/^\+?\d[\d\s]{6,}$/.test(data.phone)) return toast.error(tr("Invalid phone", "رقم جوال غير صالح"));
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) return toast.error(tr("Invalid email", "بريد غير صالح"));
    localStorage.setItem(PI_KEY, JSON.stringify(data));
    toast.success(tr("Changes saved", "تم حفظ التغييرات"));
  };

  return (
    <div className="space-y-4">
      <Card>
        <InputRow icon={User} label={tr("Full Name", "الاسم الكامل")}>
          <input className={inputCls} value={data.fullName}
            onChange={e => set("fullName", e.target.value)}
            placeholder="Sarah Al-Nemri" maxLength={80} />
        </InputRow>
        <InputRow icon={Phone} label={tr("Phone Number", "رقم الجوال")}>
          <input className={cn(inputCls, "tabular")} value={data.phone}
            onChange={e => set("phone", e.target.value)}
            placeholder="+966 50 000 0000" inputMode="tel" maxLength={20} dir="ltr" />
        </InputRow>
        <InputRow icon={Mail} label={tr("Email Address", "البريد الإلكتروني")}>
          <input className={inputCls} value={data.email}
            onChange={e => set("email", e.target.value)}
            placeholder="name@example.com" type="email" maxLength={120} dir="ltr" />
        </InputRow>
        <InputRow icon={FileText} label={tr("Date of Birth", "تاريخ الميلاد")}>
          <input className={cn(inputCls, "tabular")} value={data.dob}
            onChange={e => set("dob", e.target.value)} type="date" />
        </InputRow>
        <InputRow
          icon={Shield}
          label={tr("National ID", "رقم الهوية الوطنية")}
          hint={tr("Contact support to update National ID", "تواصل مع الدعم لتحديث رقم الهوية")}
        >
          <input className={cn(inputCls, "tabular bg-n6 text-n3 cursor-not-allowed")}
            value={maskedId} readOnly disabled dir="ltr" />
        </InputRow>
        <InputRow icon={User} label={tr("Gender", "الجنس")}>
          <div className="grid grid-cols-2 gap-2">
            {(["male", "female"] as const).map(g => {
              const active = data.gender === g;
              return (
                <button key={g} type="button" onClick={() => set("gender", g)}
                  className={cn(
                    "h-11 rounded-input border text-body font-medium transition",
                    active
                      ? "bg-primary text-n8 border-primary"
                      : "bg-n7 text-n1 border-n6 active:bg-n6"
                  )}>
                  {g === "male" ? tr("Male", "ذكر") : tr("Female", "أنثى")}
                </button>
              );
            })}
          </div>
        </InputRow>
      </Card>

      <button onClick={onSave}
        className="w-full h-[52px] bg-primary text-n8 rounded-full font-bold shadow-elev1 active:scale-[0.99] transition flex items-center justify-center gap-2">
        <Check className="w-5 h-5" />
        {tr("Save Changes", "حفظ التغييرات")}
      </button>
    </div>
  );
};

const Addresses = (lang: "en" | "ar") => {
  const nav = useNavigate();
  const { addresses, removeAddress, setDefaultAddress } = useStore();
  const tr = (en: string, ar: string) => (lang === "ar" ? ar : en);

  const typeIcon = (t: string) => (t === "home" ? Home : t === "work" ? Briefcase : MapPin);

  return (
    <div className="space-y-3">
      {addresses.length === 0 ? (
        <div className="bg-n8 rounded-card shadow-elev1 p-8 text-center border border-dashed border-n5">
          <MapPin className="w-10 h-10 text-n4 mx-auto" />
          <h3 className="text-body font-bold text-n1 mt-3">
            {tr("No addresses yet", "لا توجد عناوين بعد")}
          </h3>
          <p className="text-caption text-n3 mt-1">
            {tr("Add your first delivery address to get started.",
                "أضف عنوان التوصيل الأول للبدء.")}
          </p>
        </div>
      ) : (
        addresses.map(a => {
          const Icon = typeIcon(a.type);
          const fullAddr = [a.street, a.district, a.city, a.region]
            .filter(Boolean).join(", ");
          return (
            <div key={a.id} className="bg-n8 rounded-card shadow-elev1 p-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Icon className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-body font-bold text-n1">{a.label}</p>
                    {a.isDefault && (
                      <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full font-bold">
                        {tr("DEFAULT", "افتراضي")}
                      </span>
                    )}
                  </div>
                  <p className="text-caption text-n3 mt-1 leading-relaxed">{fullAddr}</p>
                  <p className="text-caption text-n3 mt-0.5 tabular">
                    {tr("Bldg.", "مبنى")} {a.building}
                    {a.additional && ` · ${a.additional}`}
                    {` · ${a.postal}`}
                  </p>
                  <p className="text-caption text-n2 mt-1 font-medium tabular">{a.phone}</p>

                  <div className="mt-3 flex items-center gap-2">
                    {!a.isDefault && (
                      <button
                        onClick={() => { setDefaultAddress(a.id); toast.success(tr("Set as default", "تم التعيين كافتراضي")); }}
                        className="text-caption text-primary font-semibold"
                      >
                        {tr("Set as default", "تعيين كافتراضي")}
                      </button>
                    )}
                    <button
                      onClick={() => { removeAddress(a.id); toast.success(tr("Address removed", "تم حذف العنوان")); }}
                      className="text-caption text-warning-text font-semibold ms-auto"
                    >
                      {tr("Remove", "حذف")}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })
      )}
      <button onClick={() => nav("/profile/addresses/new")} className="w-full h-12 border-2 border-dashed border-n5 rounded-card flex items-center justify-center gap-2 text-primary font-semibold">
        <Plus className="w-5 h-5" /> {tr("Add Address", "إضافة عنوان")}
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

const Loyalty = (lang: "en" | "ar") => <LoyaltyScreen lang={lang} />;

const LoyaltyScreen = ({ lang }: { lang: "en" | "ar" }) => {
  const tr = (en: string, ar: string) => (lang === "ar" ? ar : en);
  const points = 2450;
  const tier = tr("GOLD", "ذهبي");
  const nextTier = tr("Platinum", "بلاتيني");
  const toNext = 550;
  const pct = Math.round((points / (points + toNext)) * 100);
  const value = (points * 0.01).toFixed(2);

  const [tab, setTab] = useState<"all" | "discounts" | "coupons" | "shipping">("all");

  const badges = [
    { id: "first",     icon: "🛍️",  name: tr("First Purchase",  "أول عملية شراء"), date: tr("Mar 10, 2025", "10 مارس 2025"), unlocked: true },
    { id: "saver",     icon: "💰",  name: tr("Big Saver",       "موفر كبير"),       date: tr("Mar 15, 2025", "15 مارس 2025"), unlocked: true },
    { id: "frequent",  icon: "🔥",  name: tr("Frequent Buyer",  "مشتري متكرر"),     date: tr("Make another purchase", "قم بعملية شراء أخرى"), unlocked: false },
    { id: "deal",      icon: "👑",  name: tr("Deal Queen",      "ملكة العروض"),     date: "",                                  unlocked: false },
    { id: "tech",      icon: "✨",  name: tr("Tech Expert",     "خبير تقني"),       date: "",                                  unlocked: false },
    { id: "vip",       icon: "💎",  name: tr("VIP",             "كبار الشخصيات"),    date: "",                                  unlocked: false },
  ];

  const activity = [
    { type: "earn",   icon: TrendingUp, title: tr("Order completed", "اكتمل الطلب"),               sub: "#EJ-2025-00123", date: tr("Wednesday, 16 Apr 2025", "الأربعاء، 16 أبريل 2025"), pts: "+120" },
    { type: "redeem", icon: Gift,       title: tr("Redeemed 10% discount coupon", "تم استبدال قسيمة خصم 10%"), sub: "",         date: tr("Monday, 14 Apr 2025", "الإثنين، 14 أبريل 2025"),        pts: "-500" },
    { type: "earn",   icon: TrendingUp, title: tr("Review submitted for MacBook Pro", "تقييم لـ MacBook Pro"), sub: "",          date: tr("Sunday, 13 Apr 2025", "الأحد، 13 أبريل 2025"),         pts: "+50" },
    { type: "earn",   icon: TrendingUp, title: tr("Order completed", "اكتمل الطلب"),               sub: "#EJ-2025-00119", date: tr("Friday, 11 Apr 2025", "الجمعة، 11 أبريل 2025"),         pts: "+85" },
  ];

  const allRewards = [
    { id: "r1", emoji: "🎟️",  cat: "discounts", title: tr("10% off your order",     "خصم 10% على طلبك"),    pts: 500,  saves: 30, expires: tr("Thu, 17 Apr", "الخميس، 17 أبريل") },
    { id: "r2", emoji: "🚚",  cat: "shipping",  title: tr("Free shipping voucher",  "قسيمة شحن مجاني"),       pts: 300,  saves: 25, expires: tr("Sat, 19 Apr", "السبت، 19 أبريل") },
    { id: "r3", emoji: "🎫",  cat: "discounts", title: tr("20% off your order",     "خصم 20% على طلبك"),    pts: 1000, saves: 60, expires: tr("Mon, 21 Apr", "الإثنين، 21 أبريل") },
    { id: "r4", emoji: "🎁",  cat: "coupons",   title: tr("SAR 50 gift card",       "بطاقة هدية 50 ريال"),    pts: 1500, saves: 50, expires: tr("Wed, 23 Apr", "الأربعاء، 23 أبريل") },
    { id: "r5", emoji: "💳",  cat: "discounts", title: tr("15% off coupon",         "قسيمة خصم 15%"),         pts: 750,  saves: 45, expires: tr("Fri, 25 Apr", "الجمعة، 25 أبريل") },
    { id: "r6", emoji: "🎀",  cat: "coupons",   title: tr("SAR 100 gift card",      "بطاقة هدية 100 ريال"),   pts: 3000, saves: 100, expires: tr("Sun, 27 Apr", "الأحد، 27 أبريل") },
  ];

  const tabs = [
    { k: "all",       l: tr("All",         "الكل") },
    { k: "discounts", l: tr("Discounts",   "خصومات") },
    { k: "coupons",   l: tr("Coupons",     "قسائم") },
    { k: "shipping",  l: tr("Free Ship.",  "شحن مجاني") },
  ] as const;

  const filtered = tab === "all" ? allRewards : allRewards.filter(r => r.cat === tab);

  return (
    <div className="-m-4 space-y-6">
      {/* Hero — full bleed */}
      <div className="bg-gradient-to-b from-primary to-primary-dark text-primary-foreground px-5 pt-6 pb-8 rounded-b-[28px]">
        <p className="text-display font-bold leading-none tabular">
          {points.toLocaleString()} <span className="text-h1 font-bold">{tr("Points", "نقطة")}</span>
        </p>
        <p className="text-caption text-s2 mt-2 font-semibold flex items-baseline gap-1">
          = <Sar className="text-s2" /> {value} {tr("value", "قيمة")}
        </p>

        {/* Tier card */}
        <div className="mt-5 bg-n1/15 backdrop-blur rounded-card p-3.5">
          <div className="flex items-center gap-2.5">
            <span className="bg-warning text-n1 text-[11px] font-extrabold tracking-wider px-2.5 py-1 rounded-md inline-flex items-center gap-1">
              <Star className="w-3 h-3 fill-n1" /> {tier}
            </span>
            <span className="text-caption font-semibold flex-1">
              {tr("Member", "عضو")}{" "}
              <span className="text-s2 font-bold">
                {toNext} {tr(`points to ${nextTier}`, `نقطة للوصول إلى ${nextTier}`)}
              </span>
            </span>
          </div>
          <div className="mt-2.5 h-1.5 bg-n1/20 rounded-full overflow-hidden">
            <div className="h-full bg-n8 rounded-full transition-all" style={{ width: `${pct}%` }} />
          </div>
        </div>

        {/* Perk pills */}
        <div className="mt-4 flex flex-wrap justify-center gap-2">
          {[tr("5% discount", "خصم 5%"), tr("Free shipping", "شحن مجاني"), tr("Priority support", "دعم أولوية")].map(p => (
            <span key={p} className="text-caption font-semibold bg-n1/15 backdrop-blur px-3 py-1.5 rounded-full">
              {p}
            </span>
          ))}
        </div>
      </div>

      {/* Your Badges */}
      <section className="px-4">
        <h2 className="text-h2 text-n1 mb-3">{tr("Your Badges", "شاراتك")}</h2>
        <div className="grid grid-cols-3 gap-2.5">
          {badges.map(b => (
            <div
              key={b.id}
              className={cn(
                "relative bg-n8 rounded-card shadow-elev1 p-3 text-center border border-n6",
                !b.unlocked && "opacity-70",
              )}
            >
              {!b.unlocked && (
                <Lock className="absolute top-2 end-2 w-3.5 h-3.5 text-n4" />
              )}
              <div className={cn("text-3xl leading-none mb-1.5", !b.unlocked && "grayscale")}>{b.icon}</div>
              <p className="text-[11px] font-bold text-n1 leading-tight">{b.name}</p>
              {b.date && (
                <p className={cn(
                  "text-[10px] mt-1 font-semibold",
                  b.unlocked ? "text-success-text" : "text-n3",
                )}>{b.date}</p>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Recent Activity */}
      <section className="px-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-h2 text-n1">{tr("Recent Activity", "النشاط الأخير")}</h2>
          <button onClick={() => toast.success(tr("Coming soon", "قريباً"))}
            className="text-caption text-primary font-bold flex items-center gap-1">
            {tr("View All Activity", "عرض الكل")} →
          </button>
        </div>
        <div className="space-y-2.5">
          {activity.map((a, i) => {
            const Icon = a.icon;
            const positive = a.pts.startsWith("+");
            return (
              <div key={i} className="bg-n8 rounded-card shadow-elev1 p-3.5 flex items-center gap-3 border border-n6">
                <div className={cn("w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0",
                  positive ? "bg-success/15" : "bg-warning/15")}>
                  <Icon className={cn("w-5 h-5", positive ? "text-success-text" : "text-warning-text")} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-body text-n1 font-bold leading-tight">
                    {a.title} {a.sub && <span className="text-primary">{a.sub}</span>}
                  </p>
                  <p className="text-caption text-n3 mt-1">{a.date}</p>
                </div>
                <span className={cn("text-h3 font-bold tabular",
                  positive ? "text-success-text" : "text-warning-text")}>{a.pts}</span>
              </div>
            );
          })}
        </div>
      </section>

      {/* Redeem Rewards */}
      <section className="px-4 pb-8">
        <h2 className="text-h2 text-n1 mb-3">{tr("Redeem Rewards", "استبدل المكافآت")}</h2>

        {/* Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
          {tabs.map(t => {
            const active = tab === t.k;
            return (
              <button
                key={t.k}
                onClick={() => setTab(t.k)}
                className={cn(
                  "h-9 px-5 rounded-full text-caption font-bold whitespace-nowrap transition border",
                  active
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-n8 text-n2 border-n6",
                )}
              >
                {t.l}
              </button>
            );
          })}
        </div>

        {/* Reward grid */}
        <div className="mt-3 grid grid-cols-2 gap-3">
          {filtered.map(r => {
            const canRedeem = points >= r.pts;
            const need = r.pts - points;
            return (
              <div key={r.id} className="bg-n8 rounded-card shadow-elev1 p-3 border border-n6 flex flex-col">
                <div className="aspect-square bg-n7 rounded-xl flex items-center justify-center text-5xl mb-3">
                  {r.emoji}
                </div>
                <p className="text-body font-bold text-n1 leading-tight min-h-[40px]">{r.title}</p>
                <p className="text-h3 text-primary font-bold mt-1 tabular">
                  {r.pts.toLocaleString()} <span className="text-caption">{tr("Points", "نقطة")}</span>
                </p>
                <p className="text-caption text-success-text font-semibold mt-0.5 inline-flex items-baseline gap-1">
                  {tr("Saves", "توفر")} <Sar /> {r.saves}
                </p>
                <p className="text-caption text-n3 mt-1">
                  {tr("Expires:", "تنتهي:")} {r.expires}
                </p>
                <button
                  disabled={!canRedeem}
                  onClick={() => toast.success(tr("Redeemed!", "تم الاستبدال!"))}
                  className={cn(
                    "mt-3 h-10 rounded-full text-caption font-bold transition active:scale-95",
                    canRedeem
                      ? "bg-primary text-primary-foreground shadow-elev1"
                      : "bg-n7 text-n3 cursor-not-allowed",
                  )}
                >
                  {canRedeem
                    ? tr("Redeem", "استبدل")
                    : tr(`Need ${need} more points`, `تحتاج ${need} نقطة إضافية`)}
                </button>
              </div>
            );
          })}
        </div>
      </section>
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
