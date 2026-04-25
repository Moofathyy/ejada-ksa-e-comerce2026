import { useNavigate } from "react-router-dom";
import { Package, Heart, Star, MapPin, CreditCard, Settings, HelpCircle, FileText, ChevronRight, LogOut, Globe } from "lucide-react";
import { TopBar } from "@/components/TopBar";
import { MobileShell } from "@/components/MobileShell";
import { useI18n } from "@/lib/i18n";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";

const Profile = () => {
  const nav = useNavigate();
  const { t, lang, setLang, dir } = useI18n();
  const { wishlist } = useStore();
  const userName = localStorage.getItem("ejada_user") || "Ahmed";

  const items = [
    { icon: Package, label: t("myOrders"), to: "/orders" },
    { icon: Heart, label: t("wishlist"), to: "/wishlist" },
    { icon: MapPin, label: t("addresses"), to: "#" },
    { icon: CreditCard, label: t("payments"), to: "#" },
    { icon: FileText, label: "Returns & Refunds", to: "/returns" },
    { icon: Settings, label: "Settings", to: "#" },
    { icon: HelpCircle, label: t("helpCenter"), to: "#" },
  ];

  return (
    <MobileShell>
      <TopBar title={t("profile")} showBack={false} />

      {/* Profile header */}
      <div className="bg-gradient-primary px-4 pt-3 pb-6 text-n8">
        <div className="flex items-center gap-3">
          <div className="w-16 h-16 rounded-full bg-n8/20 backdrop-blur flex items-center justify-center text-h1 font-bold border-2 border-n8/40">
            {userName[0]}
          </div>
          <div className="flex-1">
            <p className="text-h2">{userName}</p>
            <p className="text-caption opacity-80 tabular">+966 50 123 4567</p>
            <span className="inline-flex items-center gap-1 mt-1 text-[11px] bg-warning text-n1 px-2 py-0.5 rounded-full font-bold">★ {t("membershipGold")}</span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 mt-5">
          {[
            { num: 12, label: "Orders" },
            { num: wishlist.length, label: "Wishlist" },
            { num: 5, label: "Reviews" },
          ].map(s => (
            <div key={s.label} className="bg-n8/10 backdrop-blur rounded-input p-3 text-center">
              <p className="text-h2 font-bold tabular">{s.num}</p>
              <p className="text-caption opacity-90">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      <main className="p-4 space-y-3">
        {/* Language */}
        <div className="bg-n8 rounded-card shadow-elev1 p-4">
          <div className="flex items-center gap-3 mb-3">
            <Globe className="w-5 h-5 text-primary" />
            <p className="text-body font-semibold text-n1 flex-1">{t("language")}</p>
          </div>
          <div className="flex bg-n7 rounded-full p-1">
            {(["en", "ar"] as const).map(l => (
              <button key={l} onClick={() => setLang(l)}
                className={cn("flex-1 py-2 rounded-full text-caption font-semibold transition",
                  lang === l ? "bg-n8 text-primary shadow-elev1" : "text-n3")}>
                {l === "en" ? "English" : "العربية"}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-n8 rounded-card shadow-elev1 overflow-hidden">
          {items.map((it, i) => {
            const Icon = it.icon;
            return (
              <button key={i} onClick={() => nav(it.to)}
                className="w-full flex items-center gap-3 px-4 py-3.5 border-b border-n6 last:border-0 active:bg-n7">
                <div className="w-9 h-9 rounded-full bg-primary-bg flex items-center justify-center"><Icon className="w-4.5 h-4.5 text-primary" /></div>
                <span className="flex-1 text-start text-body text-n1 font-medium">{it.label}</span>
                <ChevronRight className={cn("w-5 h-5 text-n4", dir === "rtl" && "rotate-180")} />
              </button>
            );
          })}
        </div>

        <button onClick={() => { localStorage.clear(); nav("/auth", { replace: true }); }}
          className="w-full h-[52px] border-2 border-warning-text text-warning-text rounded-full font-semibold flex items-center justify-center gap-2">
          <LogOut className="w-4 h-4" /> {t("logout")}
        </button>

        <p className="text-center text-caption text-n4 pt-2">Ejada v1.0.0 · Made in KSA 🇸🇦</p>
      </main>
    </MobileShell>
  );
};
export default Profile;
