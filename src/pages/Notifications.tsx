import { useState } from "react";
import { MobileShell } from "@/components/MobileShell";
import { TopBar } from "@/components/TopBar";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import {
  Package, Tag, Bell, CreditCard, Truck, Star, CheckCheck, Trash2, BellOff,
} from "lucide-react";

type NotifType = "order" | "promo" | "system" | "payment" | "delivery" | "review";

interface Notif {
  id: string;
  type: NotifType;
  title: { en: string; ar: string };
  body: { en: string; ar: string };
  time: { en: string; ar: string };
  read: boolean;
  to?: string;
}

const ICON_MAP: Record<NotifType, { icon: any; bg: string; color: string }> = {
  order:    { icon: Package,    bg: "bg-primary/10",    color: "text-primary" },
  promo:    { icon: Tag,        bg: "bg-warning/15",    color: "text-warning-text" },
  system:   { icon: Bell,       bg: "bg-n6",            color: "text-n2" },
  payment:  { icon: CreditCard, bg: "bg-success/15",    color: "text-success-text" },
  delivery: { icon: Truck,      bg: "bg-primary/10",    color: "text-primary" },
  review:   { icon: Star,       bg: "bg-warning/15",    color: "text-warning-text" },
};

const SEED: Notif[] = [
  {
    id: "n1", type: "delivery", read: false, to: "/orders",
    title: { en: "Your order is out for delivery", ar: "طلبك في الطريق إليك" },
    body:  { en: "Order #ORD-2418 will arrive today between 2-5 PM.", ar: "سيصل الطلب #ORD-2418 اليوم بين 2-5 مساءً." },
    time:  { en: "5 min ago", ar: "قبل 5 دقائق" },
  },
  {
    id: "n2", type: "promo", read: false,
    title: { en: "Flash Sale: 30% off Apple", ar: "تخفيضات فلاش: 30% على Apple" },
    body:  { en: "Limited time offer on AirPods, Watch and more. Ends tonight!", ar: "عرض لفترة محدودة على AirPods والساعات. ينتهي الليلة!" },
    time:  { en: "1 h ago", ar: "قبل ساعة" },
  },
  {
    id: "n3", type: "order", read: false, to: "/orders",
    title: { en: "Order confirmed", ar: "تم تأكيد الطلب" },
    body:  { en: "We received your order #ORD-2418. Total: SAR 1,799.", ar: "تم استلام طلبك #ORD-2418. الإجمالي: 1,799 ريال." },
    time:  { en: "3 h ago", ar: "قبل 3 ساعات" },
  },
  {
    id: "n4", type: "payment", read: true,
    title: { en: "Payment successful", ar: "تم الدفع بنجاح" },
    body:  { en: "Mada •••• 4521 charged SAR 1,799.", ar: "تم خصم 1,799 ريال من مدى •••• 4521." },
    time:  { en: "Yesterday", ar: "أمس" },
  },
  {
    id: "n5", type: "review", read: true,
    title: { en: "How was your MacBook Pro?", ar: "كيف كان MacBook Pro؟" },
    body:  { en: "Share your experience and earn 50 loyalty points.", ar: "شاركنا تجربتك واربح 50 نقطة ولاء." },
    time:  { en: "2 days ago", ar: "قبل يومين" },
  },
  {
    id: "n6", type: "system", read: true,
    title: { en: "New sign-in detected", ar: "تسجيل دخول جديد" },
    body:  { en: "Sign-in from MacBook Pro · Riyadh. Was this you?", ar: "تسجيل دخول من MacBook Pro · الرياض. هل كان هذا أنت؟" },
    time:  { en: "3 days ago", ar: "قبل 3 أيام" },
  },
  {
    id: "n7", type: "promo", read: true,
    title: { en: "You earned 120 points", ar: "ربحت 120 نقطة" },
    body:  { en: "Your loyalty balance is now 2,450 points.", ar: "رصيد الولاء أصبح 2,450 نقطة." },
    time:  { en: "1 week ago", ar: "قبل أسبوع" },
  },
];

type Filter = "all" | "unread" | NotifType;

const Notifications = () => {
  const { lang } = useI18n();
  const nav = useNavigate();
  const [items, setItems] = useState<Notif[]>(SEED);
  const [filter, setFilter] = useState<Filter>("all");

  const unreadCount = items.filter(i => !i.read).length;

  const filtered = items.filter(i => {
    if (filter === "all") return true;
    if (filter === "unread") return !i.read;
    return i.type === filter;
  });

  const markAllRead = () => {
    setItems(items.map(i => ({ ...i, read: true })));
    toast.success(lang === "ar" ? "تم تعليم الكل كمقروء" : "All marked as read");
  };

  const clearAll = () => {
    setItems([]);
    toast.success(lang === "ar" ? "تم مسح الإشعارات" : "Notifications cleared");
  };

  const handleClick = (n: Notif) => {
    setItems(items.map(i => (i.id === n.id ? { ...i, read: true } : i)));
    if (n.to) nav(n.to);
  };

  const removeOne = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setItems(items.filter(i => i.id !== id));
  };

  const filters: { k: Filter; l: { en: string; ar: string } }[] = [
    { k: "all",      l: { en: "All",       ar: "الكل" } },
    { k: "unread",   l: { en: "Unread",    ar: "غير مقروء" } },
    { k: "order",    l: { en: "Orders",    ar: "الطلبات" } },
    { k: "promo",    l: { en: "Offers",    ar: "العروض" } },
    { k: "delivery", l: { en: "Delivery",  ar: "التوصيل" } },
    { k: "system",   l: { en: "System",    ar: "النظام" } },
  ];

  return (
    <MobileShell>
      <TopBar
        title={lang === "ar" ? "الإشعارات" : "Notifications"}
        right={
          unreadCount > 0 ? (
            <button
              onClick={markAllRead}
              className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-n8/15 active:scale-95 transition"
              aria-label="Mark all read"
            >
              <CheckCheck className="w-5 h-5" />
            </button>
          ) : items.length > 0 ? (
            <button
              onClick={clearAll}
              className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-n8/15 active:scale-95 transition"
              aria-label="Clear all"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          ) : null
        }
      />

      {/* Summary bar */}
      <div className="px-4 pt-4">
        <div className="bg-n8 rounded-card shadow-elev1 p-4 flex items-center gap-3">
          <div className="w-11 h-11 rounded-full bg-primary/10 flex items-center justify-center">
            <Bell className="w-5 h-5 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-body font-bold text-n1">
              {unreadCount > 0
                ? lang === "ar"
                  ? `لديك ${unreadCount} إشعارات جديدة`
                  : `You have ${unreadCount} new notifications`
                : lang === "ar"
                ? "لا توجد إشعارات جديدة"
                : "You're all caught up"}
            </p>
            <p className="text-caption text-n3 mt-0.5">
              {lang === "ar" ? "اضغط على إشعار لعرض التفاصيل" : "Tap any notification to view details"}
            </p>
          </div>
        </div>
      </div>

      {/* Filter chips */}
      <div className="mt-3 overflow-x-auto scrollbar-none">
        <div className="flex gap-2 px-4 pb-1">
          {filters.map(f => {
            const active = filter === f.k;
            return (
              <button
                key={f.k}
                onClick={() => setFilter(f.k)}
                className={cn(
                  "h-9 px-4 rounded-full text-caption font-semibold whitespace-nowrap transition border",
                  active
                    ? "bg-primary text-n8 border-primary"
                    : "bg-n8 text-n2 border-n5 hover:border-primary",
                )}
              >
                {f.l[lang]}
                {f.k === "unread" && unreadCount > 0 && (
                  <span
                    className={cn(
                      "ms-1.5 px-1.5 py-0.5 rounded-full text-[10px] font-bold",
                      active ? "bg-n8/20 text-n8" : "bg-primary/10 text-primary",
                    )}
                  >
                    {unreadCount}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* List */}
      <main className="p-4 pb-8 space-y-2">
        {filtered.length === 0 ? (
          <div className="text-center py-16">
            <BellOff className="w-16 h-16 text-n5 mx-auto" />
            <h2 className="text-h2 text-n1 mt-4">
              {lang === "ar" ? "لا توجد إشعارات" : "No notifications"}
            </h2>
            <p className="text-body text-n3 mt-2 px-8">
              {lang === "ar"
                ? "ستظهر الإشعارات الجديدة هنا"
                : "New notifications will appear here"}
            </p>
          </div>
        ) : (
          filtered.map(n => {
            const cfg = ICON_MAP[n.type];
            const Icon = cfg.icon;
            return (
              <button
                key={n.id}
                onClick={() => handleClick(n)}
                className={cn(
                  "w-full text-start bg-n8 rounded-card shadow-elev1 p-4 flex gap-3 active:scale-[0.99] transition relative",
                  !n.read && "ring-1 ring-primary/20",
                )}
              >
                <div className={cn("w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0", cfg.bg)}>
                  <Icon className={cn("w-5 h-5", cfg.color)} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start gap-2">
                    <p className={cn("flex-1 text-body text-n1 leading-snug", !n.read && "font-bold")}>
                      {n.title[lang]}
                    </p>
                    {!n.read && <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />}
                  </div>
                  <p className="text-caption text-n3 mt-1 line-clamp-2">{n.body[lang]}</p>
                  <p className="text-[11px] text-n4 mt-1.5 font-medium">{n.time[lang]}</p>
                </div>
                <span
                  onClick={(e) => removeOne(n.id, e)}
                  role="button"
                  className="absolute top-2 end-2 w-7 h-7 flex items-center justify-center rounded-full text-n4 hover:text-warning-text hover:bg-n7"
                  aria-label="Remove"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </span>
              </button>
            );
          })
        )}
      </main>
    </MobileShell>
  );
};

export default Notifications;
