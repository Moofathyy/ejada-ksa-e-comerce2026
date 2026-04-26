import { useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ArrowUpDown, SlidersHorizontal, ArrowLeft, ArrowRight, Search as SearchIcon, Mic, PackageSearch } from "lucide-react";
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
  const title = catName || (lang === "ar" ? "كل المنتجات" : "All Products");
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
            className="w-10 h-10 rounded-xl bg-n8/15 backdrop-blur flex items-center justify-center active:scale-95 transition"
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
            <SheetContent
              side="bottom"
              className="rounded-t-3xl max-h-[85vh] p-0 inset-x-0 mx-auto max-w-[402px] bg-n8 border-t-0"
            >
              <div className="mx-auto mt-3 h-1.5 w-12 rounded-full bg-n6" />
              <SheetHeader className="px-5 pt-4 pb-2">
                <SheetTitle className="text-h2 text-n1">{lang === "ar" ? "تصفية" : "Filter"}</SheetTitle>
              </SheetHeader>
              <div className="px-5 pb-6 space-y-6 overflow-y-auto">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-h3 text-n1">{lang === "ar" ? "السعر" : "Price"}</h4>
                    <span className="text-caption text-n3 font-medium">0 — 10,000</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={10000}
                    defaultValue={5000}
                    className="w-full accent-primary"
                  />
                </div>

                <div>
                  <h4 className="text-h3 text-n1 mb-3">{lang === "ar" ? "الماركة" : "Brand"}</h4>
                  <div className="flex flex-wrap gap-2">
                    {["Apple", "Samsung", "Sony"].map(b => (
                      <button
                        key={b}
                        className="px-4 h-9 rounded-full text-caption font-semibold bg-n7 text-n2 border border-n6 hover:bg-primary-bg hover:text-primary hover:border-primary transition active:scale-95"
                      >
                        {b}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-h3 text-n1 mb-3">{lang === "ar" ? "التقييم" : "Rating"}</h4>
                  <div className="flex gap-2">
                    {[5, 4, 3].map(r => (
                      <button
                        key={r}
                        className="px-4 h-9 rounded-full text-caption font-semibold bg-n7 text-n2 border border-n6 hover:bg-primary-bg hover:text-primary hover:border-primary transition active:scale-95"
                      >
                        {r}★+
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="sticky bottom-0 inset-x-0 bg-n8 border-t border-n6 px-5 py-3 flex items-center gap-3">
                <button className="flex-1 h-12 rounded-full border border-n5 text-n2 font-semibold active:scale-[0.98] transition">
                  {lang === "ar" ? "إعادة تعيين" : "Reset"}
                </button>
                <button className="flex-1 h-12 rounded-full bg-gradient-primary text-n8 font-semibold shadow-cta active:scale-[0.98] transition">
                  {lang === "ar" ? "تطبيق" : "Apply"}
                </button>
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {/* Quick filter chips */}
        <div className="-mx-4 px-4 overflow-x-auto no-scrollbar">
          <div className="flex gap-2 w-max pb-1">
            {QUICK.map(qf => {
              const active = quick.includes(qf.id);
              return (
                <button
                  key={qf.id}
                  onClick={() => toggle(qf.id)}
                  className={cn(
                    "px-4 h-9 rounded-full text-caption font-bold whitespace-nowrap transition",
                    active ? "bg-n8 text-primary shadow-elev1" : "bg-n8/15 text-n8 border border-n8/20",
                  )}
                >
                  {qf[lang]}
                </button>
              );
            })}
          </div>
        </div>
      </header>

      <main className="p-4">
        {list.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 px-8 text-center">
            <div className="w-[120px] h-[120px] rounded-full bg-gradient-primary shadow-cta flex items-center justify-center mb-6">
              <PackageSearch className="w-12 h-12 text-n8" strokeWidth={2} />
            </div>
            <h2 className="text-h1 text-n1 mb-2">{lang === "ar" ? "لا توجد منتجات" : "No products found"}</h2>
            <p className="text-body text-n3 mb-8">{lang === "ar" ? "جرّب تصفية مختلفة أو تصفّح الفئات" : "Try different filters or browse categories"}</p>
            <button onClick={() => nav("/home")} className="px-10 h-[52px] bg-gradient-primary text-n8 rounded-full font-semibold shadow-cta active:scale-[0.98]">{lang === "ar" ? "تصفّح الفئات" : "Browse Categories"}</button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">{list.map(p => <ProductCard key={p.id} product={p} />)}</div>
        )}
      </main>
    </MobileShell>
  );
};
export default Listing;
