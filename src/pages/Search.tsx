import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search as SearchIcon, Mic, X, TrendingUp } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { products } from "@/lib/data";
import { MobileShell } from "@/components/MobileShell";
import { ProductCard } from "@/components/ProductCard";

const TRENDING = ["iPhone 15", "AirPods Pro", "PS5", "MacBook Pro", "Galaxy S24"];

const Search = () => {
  const nav = useNavigate();
  const { t, lang, dir } = useI18n();
  const [q, setQ] = useState("");
  const [recent, setRecent] = useState<string[]>(["Sony WH-1000XM5", "iPhone 15 Pro", "Apple Watch"]);

  const filtered = q ? products.filter(p =>
    p.name[lang].toLowerCase().includes(q.toLowerCase()) ||
    p.brand.toLowerCase().includes(q.toLowerCase())
  ) : [];

  return (
    <MobileShell>
      <header className="sticky top-7 z-30 bg-n8 border-b border-n6 px-4 py-3 flex items-center gap-2">
        <button onClick={() => nav(-1)} className="text-primary font-semibold text-body">{dir === "rtl" ? "←" : "←"}</button>
        <div className="flex-1 h-11 bg-n7 rounded-full flex items-center px-4 gap-2">
          <SearchIcon className="w-5 h-5 text-n4" />
          <input autoFocus value={q} onChange={e => setQ(e.target.value)}
            placeholder={t("searchPlaceholder")} className="flex-1 bg-transparent outline-none text-body" />
          {q ? <button onClick={() => setQ("")}><X className="w-4 h-4 text-n4" /></button> : <Mic className="w-5 h-5 text-primary" />}
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
