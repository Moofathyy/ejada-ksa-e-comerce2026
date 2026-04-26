import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search as SearchIcon, Mic, X, TrendingUp, ArrowLeft, ArrowRight, SlidersHorizontal } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { products } from "@/lib/data";
import { MobileShell } from "@/components/MobileShell";
import { ProductCard } from "@/components/ProductCard";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

const TRENDING = ["iPhone 15", "AirPods Pro", "PS5", "MacBook Pro", "Galaxy S24"];

const CATEGORIES: { key: string; en: string; ar: string }[] = [
  { key: "all",       en: "All",       ar: "الكل" },
  { key: "phones",    en: "Phones",    ar: "هواتف" },
  { key: "laptops",   en: "Laptops",   ar: "لابتوبات" },
  { key: "tvs",       en: "TVs",       ar: "تلفزيونات" },
  { key: "audio",     en: "Audio",     ar: "صوتيات" },
  { key: "gaming",    en: "Gaming",    ar: "ألعاب" },
  { key: "wearables", en: "Wearables", ar: "أجهزة ارتداء" },
];

const Search = () => {
  const nav = useNavigate();
  const { t, lang, dir } = useI18n();
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("all");
  const [recent, setRecent] = useState<string[]>(["Sony WH-1000XM5", "iPhone 15 Pro", "Apple Watch"]);

  const filtered = q ? products.filter(p =>
    p.name[lang].toLowerCase().includes(q.toLowerCase()) ||
    p.brand.toLowerCase().includes(q.toLowerCase())
  ) : [];

  const BackIcon = dir === "rtl" ? ArrowRight : ArrowLeft;

  return (
    <MobileShell>
      <header className="sticky top-7 z-30 bg-primary text-n8 px-4 pt-4 pb-3 rounded-b-3xl shadow-elev1 space-y-3">
        <div className="flex items-center gap-3">
          <button
            onClick={() => nav(-1)}
            aria-label="Back"
            className="w-10 h-10 rounded-xl bg-n8/15 backdrop-blur flex items-center justify-center active:scale-95 transition"
          >
            <BackIcon className="w-5 h-5" />
          </button>
          <h1 className="text-h1 font-bold leading-none">{lang === "ar" ? "الفئات" : "Categories"}</h1>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex-1 h-11 bg-n8/15 backdrop-blur rounded-full flex items-center px-4 gap-2 border border-n8/20">
            <SearchIcon className="w-5 h-5 text-n8/70" />
            <input
              autoFocus
              value={q}
              onChange={e => setQ(e.target.value)}
              placeholder={t("searchPlaceholder")}
              className="flex-1 bg-transparent outline-none text-body text-n8 placeholder:text-n8/60"
            />
            {q ? (
              <button onClick={() => setQ("")} aria-label="Clear"><X className="w-4 h-4 text-n8/80" /></button>
            ) : (
              <Mic className="w-5 h-5 text-n8" />
            )}
          </div>
          <Sheet>
            <SheetTrigger asChild>
              <button
                aria-label="Filters"
                className="w-11 h-11 rounded-input bg-n8/15 backdrop-blur border border-n8/20 flex items-center justify-center active:scale-95 transition"
              >
                <SlidersHorizontal className="w-5 h-5 text-n8" />
              </button>
            </SheetTrigger>
            <SheetContent side="bottom" className="rounded-t-3xl max-h-[85vh]">
              <SheetHeader><SheetTitle>{lang === "ar" ? "تصفية" : "Filter"}</SheetTitle></SheetHeader>
              <div className="space-y-4 py-4">
                <div><h4 className="text-h3 mb-2">{lang === "ar" ? "السعر" : "Price"}</h4><input type="range" min={0} max={10000} className="w-full" /></div>
                <div><h4 className="text-h3 mb-2">{lang === "ar" ? "الماركة" : "Brand"}</h4>
                  <div className="flex flex-wrap gap-2">{["Apple", "Samsung", "Sony"].map(b => <span key={b} className="px-3 py-1.5 bg-n7 rounded-full text-caption">{b}</span>)}</div>
                </div>
                <div><h4 className="text-h3 mb-2">{lang === "ar" ? "التقييم" : "Rating"}</h4><div className="flex gap-2">{[5,4,3].map(r => <span key={r} className="px-3 py-1.5 bg-n7 rounded-full text-caption">{r}★+</span>)}</div></div>
              </div>
            </SheetContent>
          </Sheet>
        </div>

        <div className="-mx-4 px-4 overflow-x-auto no-scrollbar">
          <div className="flex gap-2 w-max pb-1">
            {CATEGORIES.map(c => {
              const active = cat === c.key;
              return (
                <button
                  key={c.key}
                  onClick={() => setCat(c.key)}
                  className={cn(
                    "px-4 h-9 rounded-full text-caption font-bold whitespace-nowrap transition",
                    active
                      ? "bg-n8 text-primary shadow-elev1"
                      : "bg-n8/15 text-n8 border border-n8/20",
                  )}
                >
                  {c[lang]}
                </button>
              );
            })}
          </div>
        </div>
      </header>

      <main className="p-4 space-y-5">
        {q ? (
          filtered.length > 0 ? (
            <>
              <p className="text-caption text-n3">{filtered.length} results</p>
              <div className="grid grid-cols-2 gap-3">{filtered.map(p => <ProductCard key={p.id} product={p} />)}</div>
            </>
          ) : (
            <div className="py-16 text-center space-y-4">
              <div className="text-6xl">🔍</div>
              <h3 className="text-h2 text-n1">No results for "{q}"</h3>
              <p className="text-body text-n3">Try another keyword or check spelling</p>
              <div className="flex flex-wrap gap-2 justify-center">
                {TRENDING.slice(0, 3).map(s => (
                  <button key={s} onClick={() => setQ(s)} className="px-3 py-1.5 bg-primary-bg text-primary rounded-full text-caption font-semibold">{s}</button>
                ))}
              </div>
            </div>
          )
        ) : (
          <>
            {recent.length > 0 && (
              <section className="space-y-2">
                <h3 className="text-h3 text-n1">Recent</h3>
                <div className="flex flex-wrap gap-2">
                  {recent.map(r => (
                    <div key={r} className="flex items-center gap-2 bg-n7 rounded-full ps-3 pe-2 py-1.5">
                      <button onClick={() => setQ(r)} className="text-caption text-n2">{r}</button>
                      <button onClick={() => setRecent(rs => rs.filter(x => x !== r))}><X className="w-3.5 h-3.5 text-n4" /></button>
                    </div>
                  ))}
                </div>
              </section>
            )}
            <section className="space-y-2">
              <h3 className="text-h3 text-n1 flex items-center gap-2"><TrendingUp className="w-4 h-4 text-warning-text" /> Trending in KSA</h3>
              <div className="flex flex-wrap gap-2">
                {TRENDING.map(t => (
                  <button key={t} onClick={() => setQ(t)} className="px-3 py-2 bg-n8 border border-n6 text-n2 rounded-full text-caption font-medium">{t}</button>
                ))}
              </div>
            </section>
            <section className="space-y-3">
              <h3 className="text-h3 text-n1">Popular Products</h3>
              <div className="grid grid-cols-2 gap-3">{products.slice(0, 4).map(p => <ProductCard key={p.id} product={p} />)}</div>
            </section>
          </>
        )}
      </main>
    </MobileShell>
  );
};
export default Search;
