import { useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ArrowUpDown, SlidersHorizontal, ArrowLeft, ArrowRight, Search as SearchIcon, Mic } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { products, categories } from "@/lib/data";
import { MobileShell } from "@/components/MobileShell";
import { ProductCard } from "@/components/ProductCard";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

const QUICK = [
  { id: "offers", en: "Offers", ar: "عروض" },
  { id: "fast", en: "Fast Delivery", ar: "توصيل سريع" },
  { id: "top", en: "Top Rated", ar: "الأعلى تقييماً" },
];

const Listing = () => {
  const [params] = useSearchParams();
  const cat = params.get("cat");
  const { lang, dir } = useI18n();
  const nav = useNavigate();
  const [sort, setSort] = useState<"popular" | "low" | "high" | "rating">("popular");
  const [quick, setQuick] = useState<string[]>([]);
  const [q, setQ] = useState("");

  const catName = categories.find(c => c.id === cat)?.[lang];
  const title = catName || (lang === "ar" ? "الفئات" : "Categories");
  const BackIcon = dir === "rtl" ? ArrowRight : ArrowLeft;

  const list = useMemo(() => {
    let l = cat ? products.filter(p => p.category === cat) : products;
    if (q) l = l.filter(p => p.name[lang].toLowerCase().includes(q.toLowerCase()) || p.brand.toLowerCase().includes(q.toLowerCase()));
    if (quick.includes("offers")) l = l.filter(p => p.originalPrice);
    if (quick.includes("fast")) l = l.filter(p => p.delivery === "today");
    if (quick.includes("top")) l = l.filter(p => p.rating >= 4.7);
    if (sort === "low") l = [...l].sort((a, b) => a.price - b.price);
    if (sort === "high") l = [...l].sort((a, b) => b.price - a.price);
    if (sort === "rating") l = [...l].sort((a, b) => b.rating - a.rating);
    return l;
  }, [cat, sort, quick, q, lang]);

  const setCat = (id: string | null) => {
    if (id) nav(`/listing?cat=${id}`); else nav("/listing");
  };
  const toggle = (id: string) => setQuick(qq => qq.includes(id) ? qq.filter(x => x !== id) : [...qq, id]);

  return (
    <MobileShell>
      <header className="sticky top-7 z-30 bg-primary text-n8 px-4 pt-4 pb-3 rounded-b-3xl shadow-elev1 space-y-3">
        <div className="flex items-center gap-3">
          <button
            onClick={() => nav(-1)}
            aria-label="Back"
            className="w-10 h-10 rounded-input bg-n8/15 backdrop-blur flex items-center justify-center active:scale-95 transition"
          >
            <BackIcon className="w-5 h-5" />
          </button>
          <h1 className="text-h1 font-bold leading-none truncate">{title}</h1>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex-1 h-11 bg-n8/15 backdrop-blur rounded-full flex items-center px-4 gap-2 border border-n8/20">
            <SearchIcon className="w-5 h-5 text-n8/70" />
            <input
              value={q}
              onChange={e => setQ(e.target.value)}
              placeholder={lang === "ar" ? "ابحث عن المنتجات…" : "Search products..."}
              className="flex-1 bg-transparent outline-none text-body text-n8 placeholder:text-n8/60"
            />
            <Mic className="w-5 h-5 text-n8" />
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

        {/* Category chips */}
        <div className="-mx-4 px-4 overflow-x-auto no-scrollbar">
          <div className="flex gap-2 w-max pb-1">
            <button
              onClick={() => setCat(null)}
              className={cn(
                "px-4 h-9 rounded-full text-caption font-bold whitespace-nowrap transition",
                !cat ? "bg-n8 text-primary shadow-elev1" : "bg-n8/15 text-n8 border border-n8/20",
              )}
            >
              {lang === "ar" ? "الكل" : "All"}
            </button>
            {categories.map(c => {
              const active = cat === c.id;
              return (
                <button
                  key={c.id}
                  onClick={() => setCat(c.id)}
                  className={cn(
                    "px-4 h-9 rounded-full text-caption font-bold whitespace-nowrap transition",
                    active ? "bg-n8 text-primary shadow-elev1" : "bg-n8/15 text-n8 border border-n8/20",
                  )}
                >
                  {c[lang]}
                </button>
              );
            })}
          </div>
        </div>
      </header>

      {/* Quick filters + count/sort */}
      <div className="bg-n8 border-b border-n6">
        <div className="px-4 py-2 flex gap-2 overflow-x-auto no-scrollbar">
          {QUICK.map(qf => (
            <button key={qf.id} onClick={() => toggle(qf.id)}
              className={cn("flex-shrink-0 px-3.5 py-2 rounded-full text-caption font-semibold border",
                quick.includes(qf.id) ? "bg-primary text-n8 border-primary" : "bg-n8 text-n2 border-n6")}>
              {qf[lang]}
            </button>
          ))}
        </div>
        <div className="px-4 py-2 flex justify-between items-center border-t border-n6">
          <span className="text-caption text-n3">{list.length} {lang === "ar" ? "عنصر" : "items"}</span>
          <Sheet>
            <SheetTrigger asChild>
              <button className="flex items-center gap-1.5 text-caption text-n2 font-semibold"><ArrowUpDown className="w-4 h-4" /> {lang === "ar" ? "ترتيب" : "Sort"}</button>
            </SheetTrigger>
            <SheetContent side="bottom" className="rounded-t-3xl">
              <SheetHeader><SheetTitle>{lang === "ar" ? "ترتيب حسب" : "Sort By"}</SheetTitle></SheetHeader>
              <div className="py-4 space-y-1">
                {[
                  { k: "popular", l: lang === "ar" ? "الأكثر مبيعاً" : "Best Sellers" },
                  { k: "rating",  l: lang === "ar" ? "التقييم" : "Rating" },
                  { k: "low",     l: lang === "ar" ? "السعر: من الأقل للأعلى" : "Price: Low to High" },
                  { k: "high",    l: lang === "ar" ? "السعر: من الأعلى للأقل" : "Price: High to Low" },
                ].map(o => (
                  <button key={o.k} onClick={() => setSort(o.k as any)}
                    className={cn("w-full text-start py-3 px-4 rounded-input", sort === o.k && "bg-primary-bg text-primary font-semibold")}>
                    {o.l}
                  </button>
                ))}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      <main className="p-4">
        {list.length === 0 ? (
          <div className="py-16 text-center space-y-4">
            <div className="text-6xl">📭</div>
            <h3 className="text-h2 text-n1">No products found</h3>
            <button onClick={() => nav("/home")} className="px-6 py-3 bg-primary text-n8 rounded-full font-semibold">Browse Categories</button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">{list.map(p => <ProductCard key={p.id} product={p} />)}</div>
        )}
      </main>
    </MobileShell>
  );
};
export default Listing;
