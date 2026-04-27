import { Heart, Star, Zap, ShieldCheck, GitCompareArrows } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Product } from "@/lib/data";
import { useStore } from "@/lib/store";
import { useI18n } from "@/lib/i18n";
import { Sar } from "@/components/Sar";
import { tabbyInstallment, soldThisMonth } from "@/lib/ksa";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export const ProductCard = ({ product, compact }: { product: Product; compact?: boolean }) => {
  const nav = useNavigate();
  const { addToCart, toggleWishlist, wishlist, compareList, toggleCompare } = useStore();
  const { t, lang } = useI18n();
  const fav = wishlist.includes(product.id);
  const inCompare = compareList.includes(product.id);
  const discount = product.originalPrice ? Math.round((1 - product.price / product.originalPrice) * 100) : 0;
  const lowStock = product.stock > 0 && product.stock <= 3;
  const sold = soldThisMonth(product.id);
  const tabby = tabbyInstallment(product.price);

  return (
    <div
      onClick={() => nav(`/product/${product.id}`)}
      className={cn(
        "bg-n8 rounded-card shadow-elev1 overflow-hidden cursor-pointer active:scale-[0.98] transition relative border border-n6/60",
        compact ? "min-w-[170px] w-[170px]" : "w-full",
      )}
    >
      <div className="relative aspect-square bg-n7">
        <img src={product.image} alt={product.name[lang]} className="w-full h-full object-contain p-3" loading="lazy" />

        {/* Discount badge — Noon-style yellow */}
        {discount > 0 && (
          <span className="absolute top-2 start-2 bg-ksa-yellow text-n1 text-[10px] font-extrabold px-2 py-0.5 rounded-md shadow-sm">
            -{discount}%
          </span>
        )}

        {/* Top-seller / sold ribbon */}
        {product.topSeller && (
          <span className="absolute bottom-2 start-2 bg-ksa-red text-n8 text-[10px] font-bold px-2 py-0.5 rounded-md shadow-sm">
            🔥 {lang === "ar" ? "الأكثر مبيعاً" : "Bestseller"}
          </span>
        )}

        {product.stock === 0 && (
          <div className="absolute inset-0 bg-n8/70 flex items-center justify-center">
            <span className="bg-n2 text-n8 text-caption font-semibold px-3 py-1 rounded-full">{t("outOfStock")}</span>
          </div>
        )}
        {lowStock && !product.topSeller && (
          <span className="absolute bottom-2 start-2 bg-ksa-red/95 text-n8 text-[10px] font-semibold px-2 py-0.5 rounded-md">
            {t("onlyXLeft", { x: product.stock })}
          </span>
        )}

        <button
          onClick={(e) => { e.stopPropagation(); toggleWishlist(product.id); }}
          className="absolute top-2 end-2 w-8 h-8 rounded-full bg-n8/95 backdrop-blur flex items-center justify-center shadow-elev1 active:scale-90 transition"
          aria-label="Wishlist"
        >
          <Heart className={cn("w-4 h-4", fav ? "fill-ksa-red text-ksa-red" : "text-n2")} />
        </button>
      </div>

      <div className="p-2.5 space-y-1">
        <p className="text-[10px] text-n4 uppercase tracking-wide font-semibold">{product.brand}</p>
        <h3 className="text-caption text-n1 line-clamp-2 leading-tight min-h-[34px] font-medium">{product.name[lang]}</h3>

        {/* Price block */}
        <div className="flex items-baseline gap-1.5 pt-0.5">
          <span className="text-h3 text-n1 font-extrabold tabular price-sar">{product.price.toLocaleString()}</span>
          {product.originalPrice && (
            <span className="text-[11px] text-n4 line-through tabular">{product.originalPrice.toLocaleString()}</span>
          )}
        </div>

        {/* Tabby installment */}
        {product.installments && (
          <div className="flex items-center gap-1 text-[10px] font-semibold">
            <span className="bg-tabby text-tabby-text px-1.5 py-0.5 rounded">tabby</span>
            <span className="text-n2">4 × <span className="tabular price-sar font-bold">{tabby.toLocaleString()}</span></span>
          </div>
        )}

        {/* Rating + sold (social proof) */}
        <div className="flex items-center gap-1.5 text-[11px]">
          <div className="flex items-center gap-0.5">
            <Star className="w-3 h-3 fill-ksa-yellow text-ksa-yellow" />
            <span className="text-n2 font-bold tabular">{product.rating}</span>
          </div>
          <span className="text-n4">·</span>
          <span className="text-n4 tabular">{sold.toLocaleString()} {lang === "ar" ? "مُباع" : "sold"}</span>
        </div>

        {/* Fast delivery chip */}
        <div className="flex items-center gap-1 pt-0.5">
          {product.delivery === "today" ? (
            <span className="inline-flex items-center gap-1 text-[10px] font-bold px-1.5 py-0.5 rounded bg-success-bg text-success-text">
              <Zap className="w-2.5 h-2.5 fill-current" />
              {t("arrivedToday")}
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 text-[10px] font-bold px-1.5 py-0.5 rounded bg-primary-bg text-primary">
              {t("arrivedTomorrow")}
            </span>
          )}
          {product.warranty && !compact && (
            <span className="inline-flex items-center gap-0.5 text-[10px] text-n3">
              <ShieldCheck className="w-2.5 h-2.5" />
            </span>
          )}
        </div>

        {/* CTA */}
        {product.stock > 0 && (
          <div className="flex items-center gap-1.5 mt-1.5">
            <button
              onClick={(e) => {
                e.stopPropagation();
                addToCart(product);
                toast.success(t("addedToCart"));
              }}
              className="flex-1 h-9 bg-gradient-primary text-n8 text-caption font-extrabold rounded-full active:scale-[0.97] transition shadow-sm"
            >
              {t("addToCart")}
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                const added = toggleCompare(product.id);
                if (added) toast.success(lang === "ar" ? "تمت الإضافة للمقارنة" : "Added to compare");
                else if (!inCompare) toast.error(lang === "ar" ? "الحد الأقصى 4 منتجات" : "Max 4 products");
                else toast(lang === "ar" ? "تمت الإزالة من المقارنة" : "Removed from compare");
              }}
              aria-label="Compare"
              aria-pressed={inCompare}
              className={cn(
                "w-9 h-9 shrink-0 rounded-full border flex items-center justify-center active:scale-90 transition",
                inCompare
                  ? "bg-primary border-primary text-n8"
                  : "bg-n7 border-n6 text-n2"
              )}
            >
              <GitCompareArrows className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
