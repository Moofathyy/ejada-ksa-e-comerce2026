import { useNavigate } from "react-router-dom";
import { Store, Mail, Phone, MapPin, FileText, LogOut, ArrowLeftRight, Wallet, ChevronRight } from "lucide-react";
import { MerchantShell } from "@/components/MerchantShell";
import { useI18n } from "@/lib/i18n";
import { useMerchant } from "@/lib/merchant";
import { toast } from "sonner";

const MerchantProfile = () => {
  const nav = useNavigate();
  const { lang } = useI18n();
  const { merchant, products, orders, signOutMerchant } = useMerchant();

  if (!merchant) { nav("/auth", { replace: true }); return null; }

  const revenue = orders.filter(o => o.status === "delivered").reduce((s, o) => s + o.total, 0);

  const rows = [
    { icon: Mail, label: lang === "ar" ? "البريد" : "Email", value: merchant.email },
    { icon: Phone, label: lang === "ar" ? "الجوال" : "Phone", value: merchant.phone },
    { icon: MapPin, label: lang === "ar" ? "المدينة" : "City", value: merchant.city },
    { icon: FileText, label: lang === "ar" ? "السجل التجاري" : "CR Number", value: merchant.crNumber },
    { icon: Store, label: lang === "ar" ? "الفئة" : "Category", value: merchant.category },
  ];

  return (
    <MerchantShell lang={lang}>
      <header className="bg-primary text-n8 pt-6 pb-5 rounded-b-3xl shadow-elev1">
        <div className="flex flex-col items-center px-4">
          <div className="w-[88px] h-[88px] rounded-2xl bg-n8/15 backdrop-blur border-4 border-n8/30 flex items-center justify-center text-display font-bold">
            <Store className="w-10 h-10" />
          </div>
          <h1 className="mt-3 text-h1 font-bold text-center">{merchant.businessName}</h1>
          <p className="text-caption opacity-80">{merchant.ownerName}</p>
          <span className="mt-2 inline-flex items-center gap-1 bg-warning text-n1 px-3 py-1 rounded-full text-caption font-bold">
            ⚡ {lang === "ar" ? "حساب تاجر" : "Merchant Account"}
          </span>
        </div>

        <div className="grid grid-cols-3 gap-2.5 px-4 mt-5">
          <div className="bg-n8/10 backdrop-blur rounded-input px-3 py-2.5 text-center">
            <p className="text-[11px] opacity-80">{lang === "ar" ? "منتجات" : "Products"}</p>
            <p className="text-h2 font-bold mt-0.5">{products.length}</p>
          </div>
          <div className="bg-n8/10 backdrop-blur rounded-input px-3 py-2.5 text-center">
            <p className="text-[11px] opacity-80">{lang === "ar" ? "طلبات" : "Orders"}</p>
            <p className="text-h2 font-bold mt-0.5">{orders.length}</p>
          </div>
          <div className="bg-n8/10 backdrop-blur rounded-input px-3 py-2.5 text-center">
            <p className="text-[11px] opacity-80">{lang === "ar" ? "إيرادات" : "Revenue"}</p>
            <p className="text-body font-bold mt-0.5 tabular">{(revenue / 1000).toFixed(1)}K</p>
          </div>
        </div>
      </header>

      <main className="px-4 pt-5 pb-6 space-y-4">
        <section className="bg-n8 rounded-card shadow-elev1 overflow-hidden">
          {rows.map((r, i) => {
            const Icon = r.icon;
            return (
              <div key={i} className="flex items-center gap-3 px-4 py-3.5 border-b border-n6 last:border-0">
                <Icon className="w-5 h-5 text-primary flex-shrink-0" />
                <span className="flex-1 text-caption text-n3">{r.label}</span>
                <span className="text-body font-semibold text-n1 truncate max-w-[55%] text-end">{r.value}</span>
              </div>
            );
          })}
        </section>

        <button
          onClick={() => { nav("/home"); toast(lang === "ar" ? "تم التحويل لوضع المتسوق" : "Switched to shopper mode"); }}
          className="w-full h-[52px] bg-n7 text-n1 rounded-full font-bold flex items-center justify-center gap-2 active:scale-[0.99] transition"
        >
          <ArrowLeftRight className="w-5 h-5" /> {lang === "ar" ? "التبديل لوضع المتسوق" : "Switch to Shopper Mode"}
        </button>

        <button
          onClick={() => { signOutMerchant(); nav("/auth", { replace: true }); }}
          className="w-full h-[52px] bg-warning text-n1 rounded-full font-bold flex items-center justify-center gap-2 shadow-elev1 active:scale-[0.99] transition"
        >
          <LogOut className="w-5 h-5" /> {lang === "ar" ? "تسجيل الخروج" : "Sign Out"}
        </button>
      </main>
    </MerchantShell>
  );
};

export default MerchantProfile;
