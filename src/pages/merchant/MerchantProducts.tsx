import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Search, Edit2, Trash2, Package as PackageIcon } from "lucide-react";
import { MerchantShell } from "@/components/MerchantShell";
import { useI18n } from "@/lib/i18n";
import { useMerchant, MerchantProduct } from "@/lib/merchant";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const MerchantProducts = () => {
  const nav = useNavigate();
  const { lang } = useI18n();
  const { merchant, products, deleteProduct } = useMerchant();
  const [q, setQ] = useState("");
  const [tab, setTab] = useState<"all" | "active" | "out_of_stock" | "draft">("all");

  if (!merchant) { nav("/auth", { replace: true }); return null; }

  const filtered = products.filter(p =>
    (tab === "all" || p.status === tab) &&
    (p.name.toLowerCase().includes(q.toLowerCase()) || p.brand.toLowerCase().includes(q.toLowerCase()))
  );

  const tabs: { key: typeof tab; en: string; ar: string }[] = [
    { key: "all", en: "All", ar: "الكل" },
    { key: "active", en: "Active", ar: "نشط" },
    { key: "out_of_stock", en: "Out", ar: "نفذ" },
    { key: "draft", en: "Drafts", ar: "مسودات" },
  ];

  return (
    <MerchantShell lang={lang}>
      <header className="bg-primary text-n8 pt-6 pb-5 rounded-b-3xl shadow-elev1 px-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[11px] font-semibold tracking-[0.12em] opacity-80 uppercase">{lang === "ar" ? "كتالوج" : "Catalog"}</p>
            <h1 className="text-h1 font-bold">{lang === "ar" ? "المنتجات" : "Products"}</h1>
          </div>
        </div>

        <div className="mt-4 bg-n8 rounded-input flex items-center gap-2 px-3 h-11">
          <Search className="w-5 h-5 text-n4" />
          <input
            value={q} onChange={e => setQ(e.target.value)}
            placeholder={lang === "ar" ? "ابحث في المنتجات…" : "Search products…"}
            className="flex-1 h-full outline-none text-body bg-transparent text-n1 placeholder:text-n4"
          />
        </div>
      </header>

      <main className="px-4 pt-4 pb-6 space-y-3">
        <div className="flex gap-2 overflow-x-auto -mx-1 px-1 no-scrollbar">
          {tabs.map(tt => (
            <button
              key={tt.key}
              onClick={() => setTab(tt.key)}
              className={cn(
                "px-3.5 h-9 rounded-full text-caption font-semibold whitespace-nowrap transition",
                tab === tt.key ? "bg-primary text-n8" : "bg-n7 text-n2"
              )}
            >
              {lang === "ar" ? tt.ar : tt.en}
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-16 text-n3">
            <PackageIcon className="w-12 h-12 mx-auto mb-3 opacity-40" />
            <p className="text-body font-medium">{lang === "ar" ? "لا توجد منتجات" : "No products yet"}</p>
            <button onClick={() => nav("/merchant/products/new")} className="mt-4 inline-flex items-center gap-1.5 px-4 h-10 rounded-full bg-primary text-n8 font-bold">
              <Plus className="w-4 h-4" /> {lang === "ar" ? "أضف أول منتج" : "Add first product"}
            </button>
          </div>
        ) : (
          <div className="space-y-2.5">
            {filtered.map(p => (
              <ProductRow
                key={p.id} p={p} lang={lang}
                onEdit={() => nav(`/merchant/products/${p.id}`)}
                onDelete={() => {
                  if (confirm(lang === "ar" ? `حذف "${p.name}"؟` : `Delete "${p.name}"?`)) {
                    deleteProduct(p.id);
                    toast.success(lang === "ar" ? "تم الحذف" : "Deleted");
                  }
                }}
              />
            ))}
          </div>
        )}
      </main>
    </MerchantShell>
  );
};

const ProductRow = ({ p, lang, onEdit, onDelete }: { p: MerchantProduct; lang: "en" | "ar"; onEdit: () => void; onDelete: () => void }) => {
  const statusCls = p.status === "active" ? "bg-success/15 text-success"
    : p.status === "out_of_stock" ? "bg-destructive/15 text-destructive"
    : "bg-n6 text-n2";
  const statusLabel = p.status === "active" ? (lang === "ar" ? "نشط" : "Active")
    : p.status === "out_of_stock" ? (lang === "ar" ? "نفذ المخزون" : "Out of stock")
    : (lang === "ar" ? "مسودة" : "Draft");

  return (
    <div className="bg-n8 rounded-card shadow-elev1 p-3 flex items-center gap-3">
      <div className="w-16 h-16 rounded-input bg-n7 overflow-hidden flex-shrink-0">
        <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-body font-semibold text-n1 truncate">{lang === "ar" && p.nameAr ? p.nameAr : p.name}</p>
        <p className="text-caption text-n3 truncate">{p.brand}</p>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-body font-bold text-n1 tabular">{p.price} SAR</span>
          <span className={cn("text-[10px] font-bold px-2 py-0.5 rounded-full", statusCls)}>{statusLabel}</span>
          <span className="text-caption text-n3 tabular">• {p.stock} {lang === "ar" ? "قطعة" : "in stock"}</span>
        </div>
      </div>
      <div className="flex flex-col gap-1.5">
        <button onClick={onEdit} className="w-9 h-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center active:scale-95">
          <Edit2 className="w-4 h-4" />
        </button>
        <button onClick={onDelete} className="w-9 h-9 rounded-lg bg-destructive/10 text-destructive flex items-center justify-center active:scale-95">
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default MerchantProducts;
