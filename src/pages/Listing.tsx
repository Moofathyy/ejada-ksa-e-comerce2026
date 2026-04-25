import { useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ArrowUpDown, SlidersHorizontal } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { products, categories } from "@/lib/data";
import { MobileShell } from "@/components/MobileShell";
import { ProductCard } from "@/components/ProductCard";
import { TopBar } from "@/components/TopBar";
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
  const { lang } = useI18n();
  const nav = useNavigate();
  const [sort, setSort] = useState<"popular" | "low" | "high" | "rating">("popular");
  const [quick, setQuick] = useState<string[]>([]);

  const catName = categories.find(c => c.id === cat)?.[lang];

  const list = useMemo(() => {
    let l = cat ? products.filter(p => p.category === cat) : products;
    if (quick.includes("offers")) l = l.filter(p => p.originalPrice);
    if (quick.includes("fast")) l = l.filter(p => p.delivery === "today");
    if (quick.includes("top")) l = l.filter(p => p.rating >= 4.7);
    if (sort === "low") l = [...l].sort((a, b) => a.price - b.price);
    if (sort === "high") l = [...l].sort((a, b) => b.price - a.price);
    if (sort === "rating") l = [...l].sort((a, b) => b.rating - a.rating);
    return l;
  }, [cat, sort, quick]);

  const toggle = (id: string) => setQuick(q => q.includes(id) ? q.filter(x => x !== id) : [...q, id]);

  return (
    <MobileShell>
      <TopBar title={catName || "All Products"} />

      <div className="sticky top-[84px] z-20 bg-n8 border-b border-n6">
        <div className="px-4 py-2 flex gap-2 overflow-x-auto scrollbar-hide">
          {QUICK.map(q => (
            <button key={q.id} onClick={() => toggle(q.id)}
              className={cn("flex-shrink-0 px-3.5 py-2 rounded-full text-caption font-semibold border",
                quick.includes(q.id) ? "bg-primary text-n8 border-primary" : "bg-n8 text-n2 border-n6")}>
              {q[lang]}
            </button>
          ))}
        </div>
        <div className="px-4 py-2 flex justify-between items-center border-t border-n6">
          <span className="text-caption text-n3">{list.length} items</span>
          <div className="flex gap-2">
            <Sheet>
              <SheetTrigger asChild>
                <button className="flex items-center gap-1.5 text-caption text-n2 font-semibold">
                  <SlidersHorizontal className="w-4 h-4" /> Filter
                </button>
              </SheetTrigger>
              <SheetContent side="bottom" className="rounded-t-3xl max-h-[85vh]">
                <SheetHeader><SheetTitle>Filter</SheetTitle></SheetHeader>
                <div className="space-y-4 py-4">
                  <div><h4 className="text-h3 mb-2">Price</h4><input type="range" min={0} max={10000} className="w-full" /></div>
                  <div><h4 className="text-h3 mb-2">Brand</h4>
                    <div className="flex flex-wrap gap-2">{["Apple", "Samsung", "Sony"].map(b => <span key={b} className="px-3 py-1.5 bg-n7 rounded-full text-caption">{b}</span>)}</div>
                  </div>
                  <div><h4 className="text-h3 mb-2">Rating</h4><div className="flex gap-2">{[5,4,3].map(r => <span key={r} className="px-3 py-1.5 bg-n7 rounded-full text-caption">{r}★+</span>)}</div></div>
                </div>
              </SheetContent>
            </Sheet>
            <Sheet>
              <SheetTrigger asChild>
                <button className="flex items-center gap-1.5 text-caption text-n2 font-semibold"><ArrowUpDown className="w-4 h-4" /> Sort</button>
              </SheetTrigger>
              <SheetContent side="bottom" className="rounded-t-3xl">
                <SheetHeader><SheetTitle>Sort By</SheetTitle></SheetHeader>
                <div className="py-4 space-y-1">
                  {[
                    { k: "popular", l: "Best Sellers" }, { k: "rating", l: "Rating" },
                    { k: "low", l: "Price: Low to High" }, { k: "high", l: "Price: High to Low" },
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
