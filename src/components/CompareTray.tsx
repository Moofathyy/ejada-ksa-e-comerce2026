import { useNavigate } from "react-router-dom";
import { X, GitCompareArrows, ArrowRight } from "lucide-react";
import { useStore } from "@/lib/store";
import { useI18n } from "@/lib/i18n";
import { getProduct } from "@/lib/data";
import { cn } from "@/lib/utils";

export const CompareTray = () => {
  const { compareList, removeCompare, clearCompare } = useStore();
  const { lang } = useI18n();
  const nav = useNavigate();

  if (compareList.length === 0) return null;

  const items = compareList.map(getProduct).filter(Boolean) as ReturnType<typeof getProduct>[];
  const canCompare = items.length >= 2;

  return (
    <div className="fixed bottom-[72px] inset-x-0 z-30 mx-auto max-w-[402px] px-3 pb-2 animate-slide-in-bottom">
      <div className="bg-n8 border border-n6 rounded-2xl shadow-elev3 overflow-hidden">
        <div className="flex items-center justify-between px-3 pt-2.5 pb-1.5">
          <div className="flex items-center gap-1.5 text-n1">
            <GitCompareArrows className="w-4 h-4 text-primary" />
            <span className="text-caption font-bold">
              {lang === "ar" ? `المقارنة (${items.length}/4)` : `Compare (${items.length}/4)`}
            </span>
          </div>
          <button
            onClick={clearCompare}
            className="text-[11px] text-n4 font-semibold active:scale-95 transition"
          >
            {lang === "ar" ? "مسح" : "Clear"}
          </button>
        </div>

        <div className="flex items-center gap-2 px-3 pb-3">
          <div className="flex gap-1.5 flex-1 overflow-x-auto no-scrollbar">
            {items.map(p => (
              <div key={p!.id} className="relative shrink-0 w-12 h-12 rounded-lg bg-n7 border border-n6 overflow-hidden">
                <img src={p!.image} alt={p!.name[lang]} className="w-full h-full object-contain p-1" />
                <button
                  onClick={() => removeCompare(p!.id)}
                  className="absolute -top-1 -end-1 w-4 h-4 rounded-full bg-n1 text-n8 flex items-center justify-center shadow-elev1 active:scale-90 transition"
                  aria-label="Remove"
                >
                  <X className="w-2.5 h-2.5" strokeWidth={3} />
                </button>
              </div>
            ))}
            {Array.from({ length: Math.max(0, 2 - items.length) }).map((_, i) => (
              <div key={`ph-${i}`} className="shrink-0 w-12 h-12 rounded-lg border-2 border-dashed border-n6 flex items-center justify-center text-n5">
                <span className="text-[10px] font-bold">+</span>
              </div>
            ))}
          </div>

          <button
            disabled={!canCompare}
            onClick={() => nav("/compare")}
            className={cn(
              "h-10 px-4 rounded-full text-caption font-extrabold flex items-center gap-1.5 transition shadow-sm",
              canCompare
                ? "bg-gradient-primary text-n8 active:scale-[0.97]"
                : "bg-n6 text-n4 cursor-not-allowed"
            )}
          >
            {lang === "ar" ? "قارن الآن" : "Compare"}
            <ArrowRight className="w-4 h-4 rtl:rotate-180" />
          </button>
        </div>
      </div>
    </div>
  );
};
