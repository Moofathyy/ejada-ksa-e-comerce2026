import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search as SearchIcon, MapPin, Bell, ShoppingBag, ChevronDown, Mic, ScanLine, ChevronRight, GitCompare, Star, Truck, ShieldCheck, Check, X, Shuffle } from "lucide-react";
import { Sar } from "@/components/Sar";
import { useI18n } from "@/lib/i18n";
import { useStore } from "@/lib/store";
import { categories, products, brands } from "@/lib/data";
import { ProductCard } from "@/components/ProductCard";
import { MobileShell } from "@/components/MobileShell";
import banner1 from "@/assets/banner-iphone.jpg";
import banner2 from "@/assets/banner-gaming.jpg";
import banner3 from "@/assets/banner-ramadan.jpg";
import { cn } from "@/lib/utils";

const banners = [
  { img: banner1, title: { en: "Latest iPhone Deals", ar: "أحدث عروض آيفون" }, sub: { en: "Up to 20% off", ar: "حتى 20% خصم" } },
  { img: banner2, title: { en: "Gaming Week", ar: "أسبوع الألعاب" }, sub: { en: "PS5 · RTX · Headsets", ar: "بلايستيشن · RTX · سماعات" } },
  { img: banner3, title: { en: "Ramadan Offers", ar: "عروض رمضان" }, sub: { en: "Special savings", ar: "خصومات خاصة" } },
];

const Home = () => {
  const nav = useNavigate();
  const { t, lang, setLang, dir } = useI18n();
  const { cartCount } = useStore();
  const [bannerIdx, setBannerIdx] = useState(0);
  const [loading, setLoading] = useState(true);
  const [city] = useState(lang === "ar" ? "الرياض" : "Riyadh");
  const [timer, setTimer] = useState(3 * 3600 + 47 * 60 + 12);
  const userName = localStorage.getItem("ejada_user") || "Ahmed";

  useEffect(() => { const t = setTimeout(() => setLoading(false), 700); return () => clearTimeout(t); }, []);
  useEffect(() => { const i = setInterval(() => setBannerIdx(x => (x + 1) % banners.length), 4000); return () => clearInterval(i); }, []);
  useEffect(() => { const i = setInterval(() => setTimer(s => s > 0 ? s - 1 : 0), 1000); return () => clearInterval(i); }, []);

  const fmtTime = (s: number) => {
    const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), sec = s % 60;
    return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${sec.toString().padStart(2, "0")}`;
  };

  return (
    <MobileShell>
      {/* Sticky Header — primary blue */}
      <header className="sticky top-7 z-30 bg-primary text-n8 rounded-b-3xl shadow-elev1">
        <div className="px-4 pt-4 pb-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full bg-n8/15 backdrop-blur flex items-center justify-center text-body font-bold border border-n8/20">
              {userName[0]}
            </div>
            <div className="leading-tight">
              <p className="text-[10px] font-semibold tracking-[0.12em] opacity-80">{lang === "ar" ? "مرحباً بعودتك" : "WELCOME BACK"}</p>
              <p className="text-body font-bold">{userName}</p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button onClick={() => nav("/notifications")} className="relative w-10 h-10 flex items-center justify-center bg-n8/15 rounded-xl" aria-label="Notifications">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 end-2 w-2 h-2 bg-accent rounded-full" />
            </button>
          </div>
        </div>

        <div className="px-4">
          <button onClick={() => nav("/search")} className="w-full h-12 bg-n8/15 backdrop-blur rounded-2xl flex items-center px-4 gap-3 text-n8/80 text-body">
            <SearchIcon className="w-5 h-5" />
            <span className="flex-1 text-start">{lang === "ar" ? "ابحث عن أحدث الأجهزة..." : "Search latest devices..."}</span>
            <Mic className="w-5 h-5" />
            <ScanLine className="w-5 h-5" />
          </button>
        </div>

        <div className="px-4 py-3 flex items-center gap-1.5">
          <MapPin className="w-4 h-4" />
          <span className="text-caption opacity-90">{lang === "ar" ? "التوصيل إلى:" : "Delivery to:"}</span>
          <button className="text-caption font-bold flex items-center gap-0.5">
            {city}
            <ChevronRight className={cn("w-4 h-4", dir === "rtl" && "rotate-180")} />
          </button>
        </div>
      </header>

      <main className="pb-4 space-y-5">
        {/* Banner carousel */}
        <div className="px-4 my-[24px]">
          <div className="relative rounded-card overflow-hidden h-[150px] shadow-elev1">
            {banners.map((b, i) => (
              <div key={i} className={cn("absolute inset-0 transition-opacity duration-500", i === bannerIdx ? "opacity-100" : "opacity-0")}>
                <img src={b.img} alt="" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-3 start-4 text-n8">
                  <h3 className="text-h2 drop-shadow">{b.title[lang]}</h3>
                  <p className="text-caption opacity-90">{b.sub[lang]}</p>
                </div>
              </div>
            ))}
            <div className="absolute bottom-2 end-3 flex gap-1.5">
              {banners.map((_, i) => (
                <span key={i} className={cn("h-1.5 rounded-full transition-all", i === bannerIdx ? "w-5 bg-n8" : "w-1.5 bg-n8/50")} />
              ))}
            </div>
          </div>
        </div>

        {/* Categories */}
        <section className="space-y-3">
          <div className="px-4 flex justify-between items-center">
            <h3 className="text-h3 text-n1">{t("shopByCategory")}</h3>
          </div>
          <div className="flex gap-2.5 overflow-x-auto px-4 pb-1 scrollbar-hide py-[4px]">
            {categories.map(c => (
              <button
                key={c.id}
                onClick={() => nav(`/listing?cat=${c.id}`)}
                className="flex-shrink-0 flex items-center gap-2 h-11 px-4 rounded-full shadow-elev1 text-primary border-n4 bg-n8"
              >
                <span className="text-lg leading-none">{c.icon}</span>
                <span className="text-caption font-bold text-n1 whitespace-nowrap">{c[lang]}</span>
              </button>
            ))}
          </div>
        </section>

        {/* Flash Deals */}
        <section className="space-y-3">
          <div className="px-4 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <h3 className="text-h3 text-n1">⚡ {t("flashDeals")}</h3>
              <span className="text-[11px] bg-warning-text text-n8 font-bold px-2 py-0.5 rounded-md tabular">
                {t("endsIn")} {fmtTime(timer)}
              </span>
            </div>
          </div>
          <div className="flex gap-3 overflow-x-auto px-4 pb-2 scrollbar-hide">
            {loading
              ? Array.from({ length: 4 }).map((_, i) => <div key={i} className="min-w-[160px] h-[260px] rounded-card skeleton-shimmer" />)
              : products.slice(0, 5).map(p => <ProductCard key={p.id} product={p} compact />)}
          </div>
        </section>

        {/* Popular in KSA - 2 col */}
        <section className="space-y-3">
          <div className="px-4 flex justify-between items-center">
            <h3 className="text-h3 text-n1">🇸🇦 {t("popularKsa")}</h3>
            <button className="text-caption text-p2 font-semibold">{t("viewAll")}</button>
          </div>
          <div className="px-4 grid grid-cols-2 gap-3">
            {loading
              ? Array.from({ length: 4 }).map((_, i) => <div key={i} className="aspect-[3/4] rounded-card skeleton-shimmer" />)
              : products.slice(0, 4).map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        </section>

        {/* Compare Products */}
        <CompareSection lang={lang} nav={nav} />


        {/* Recommended */}
        <section className="space-y-3">
          <div className="px-4 flex justify-between items-center">
            <h3 className="text-h3 text-n1">✨ {t("recommended")}</h3>
          </div>
          <div className="flex gap-3 overflow-x-auto px-4 pb-2 scrollbar-hide">
            {products.slice(2, 7).map(p => <ProductCard key={p.id} product={p} compact />)}
          </div>
        </section>

        {/* Brands */}
        <section className="space-y-3">
          <div className="px-4 flex justify-between items-center">
            <h3 className="text-h3 text-n1">{t("brands")}</h3>
          </div>
          <div className="flex gap-3 overflow-x-auto px-4 pb-2 scrollbar-hide">
            {brands.map(b => (
              <div key={b} className="flex-shrink-0 w-20 h-20 bg-n8 rounded-2xl shadow-elev1 flex items-center justify-center">
                <span className="text-body font-bold text-n1">{b}</span>
              </div>
            ))}
          </div>
        </section>
      </main>
    </MobileShell>
  );
};
export default Home;
