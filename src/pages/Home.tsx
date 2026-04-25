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

/* ---------- Compare Section ---------- */
type Lang = "en" | "ar";

const COMPARE_POOL = ["p1", "p6", "p3", "p4", "p7", "p5"];

const CompareSection = ({ lang, nav }: { lang: Lang; nav: (to: string) => void }) => {
  const [leftId, setLeftId] = useState("p1");
  const [rightId, setRightId] = useState("p6");

  const left = products.find(p => p.id === leftId)!;
  const right = products.find(p => p.id === rightId)!;

  const swap = () => { const l = leftId; setLeftId(rightId); setRightId(l); };

  const shuffle = () => {
    const others = COMPARE_POOL.filter(id => id !== leftId && id !== rightId);
    const next = others[Math.floor(Math.random() * others.length)];
    setRightId(next);
  };

  const cheaper = left.price < right.price ? "left" : right.price < left.price ? "right" : null;
  const betterRated = left.rating > right.rating ? "left" : right.rating > left.rating ? "right" : null;
  const fasterDelivery = left.delivery === "today" && right.delivery !== "today" ? "left"
    : right.delivery === "today" && left.delivery !== "today" ? "right" : null;

  const Pill = ({ icon: Icon, label, win }: { icon: any; label: string; win: boolean }) => (
    <div className={cn(
      "flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-bold",
      win ? "bg-success/15 text-success-text" : "bg-n7 text-n3",
    )}>
      <Icon className="w-3 h-3" />
      <span className="truncate">{label}</span>
    </div>
  );

  const Side = ({ p, side }: { p: typeof products[number]; side: "left" | "right" }) => (
    <button
      onClick={() => nav(`/product/${p.id}`)}
      className="flex-1 min-w-0 bg-n8 rounded-card p-3 flex flex-col gap-2 active:scale-[0.99] transition text-start"
    >
      <div className="aspect-square w-full bg-n7 rounded-xl overflow-hidden flex items-center justify-center">
        <img src={p.image} alt="" className="w-full h-full object-contain p-2" />
      </div>
      <p className="text-caption font-bold text-n1 line-clamp-2 leading-tight min-h-[32px]">{p.name[lang]}</p>
      <div className="flex items-baseline gap-1">
        <Sar className="text-primary" />
        <span className="text-body font-bold text-n1 tabular">{p.price.toLocaleString()}</span>
      </div>
      <div className="flex flex-wrap gap-1">
        <Pill icon={Sar} label={lang === "ar" ? "أرخص" : "Cheaper"} win={cheaper === side} />
        <Pill icon={Star} label={p.rating.toFixed(1)} win={betterRated === side} />
        <Pill
          icon={Truck}
          label={p.delivery === "today" ? (lang === "ar" ? "اليوم" : "Today") : (lang === "ar" ? "غداً" : "Tomorrow")}
          win={fasterDelivery === side}
        />
      </div>
      <div className="flex items-center gap-1 text-[10px] text-n3 font-medium">
        <ShieldCheck className="w-3 h-3 text-primary" />
        <span className="truncate">{p.warranty || (lang === "ar" ? "ضمان" : "Warranty")}</span>
      </div>
    </button>
  );

  return (
    <section className="space-y-3">
      <div className="px-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <GitCompare className="w-5 h-5 text-primary" />
          <h3 className="text-h3 text-n1">{lang === "ar" ? "قارن المنتجات" : "Compare Products"}</h3>
        </div>
        <button onClick={shuffle} className="text-caption text-primary font-semibold flex items-center gap-1">
          <Shuffle className="w-4 h-4" />
          {lang === "ar" ? "تبديل" : "Shuffle"}
        </button>
      </div>

      <div className="px-4">
        <div className="bg-gradient-to-br from-primary/5 to-accent/5 border border-n6 rounded-card p-3 shadow-elev1 relative">
          <div className="flex gap-2 items-stretch">
            <Side p={left} side="left" />
            <div className="flex flex-col items-center justify-center px-1">
              <button
                onClick={swap}
                className="w-9 h-9 rounded-full bg-primary text-n8 font-bold text-caption shadow-elev1 flex items-center justify-center"
                aria-label="Swap"
              >
                VS
              </button>
            </div>
            <Side p={right} side="right" />
          </div>

          <button
            onClick={() => nav(`/listing`)}
            className="mt-3 w-full h-11 bg-primary text-n8 rounded-full font-bold text-caption shadow-elev1 flex items-center justify-center gap-2"
          >
            <GitCompare className="w-4 h-4" />
            {lang === "ar" ? "قارن المزيد من المنتجات" : "Compare More Products"}
          </button>
        </div>
      </div>
    </section>
  );
};

export default Home;

