import { Heart, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Product } from "@/lib/data";
import { useStore } from "@/lib/store";
import { useI18n } from "@/lib/i18n";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export const ProductCard = ({ product, compact }: { product: Product; compact?: boolean }) => {
  const nav = useNavigate();
  const { addToCart, toggleWishlist, wishlist } = useStore();
  const { t, lang } = useI18n();
  const fav = wishlist.includes(product.id);
  const discount = product.originalPrice ? Math.round((1 - product.price / product.originalPrice) * 100) : 0;
  const lowStock = product.stock > 0 && product.stock <= 3;

  return (
    <div
      onClick={() => nav(`/product/${product.id}`)}
      className={cn(
        "bg-n8 rounded-card shadow-elev1 overflow-hidden cursor-pointer active:scale-[0.98] transition relative",
        compact ? "min-w-[160px]" : "w-full"
      )}
    >
      <div className="relative aspect-square bg-n7">
        <img src={product.image} alt={product.name[lang]} className="w-full h-full object-contain p-3" loading="lazy" />
        {discount > 0 && (
          <span className="absolute top-2 start-2 bg-warning-text text-n8 text-[10px] font-bold px-2 py-0.5 rounded-full">
            -{discount}%
          </span>
        )}
        {product.stock === 0 && (
          <div className="absolute inset-0 bg-n8/70 flex items-center justify-center">
            <span className="bg-n2 text-n8 text-caption font-semibold px-3 py-1 rounded-full">{t("outOfStock")}</span>
          </div>
        )}
        {lowStock && (
          <span className="absolute bottom-2 start-2 bg-warning-text/95 text-n8 text-[10px] font-semibold px-2 py-0.5 rounded-full">
            {t("onlyXLeft", { x: product.stock })}
          </span>
        )}
        <button
          onClick={(e) => { e.stopPropagation(); toggleWishlist(product.id); }}
          className="absolute top-2 end-2 w-8 h-8 rounded-full bg-n8/90 backdrop-blur flex items-center justify-center shadow-elev1 active:scale-90 transition"
          aria-label="Wishlist"
        >
          <Heart className={cn("w-4 h-4", fav ? "fill-warning-text text-warning-text" : "text-n2")} />
        </button>
      </div>

      <div className="p-3 space-y-1.5">
        <p className="text-[10px] text-n4 uppercase tracking-wide">{product.brand}</p>
        <h3 className="text-body text-n1 line-clamp-2 leading-tight min-h-[40px]">{product.name[lang]}</h3>

        <div className="flex items-center gap-1 text-caption">
          <Star className="w-3.5 h-3.5 fill-warning text-warning" />
          <span className="text-n2 font-semibold tabular">{product.rating}</span>
          <span className="text-n4">({product.reviews})</span>
        </div>

        <div className="flex items-baseline gap-2 pt-1">
          <span className="text-h3 text-primary font-bold tabular price-sar">{product.price.toLocaleString()}</span>
          {product.originalPrice && (
            <span className="text-caption text-n4 line-through tabular">{product.originalPrice.toLocaleString()}</span>
          )}
        </div>

        <div className="flex items-center gap-1 pt-0.5">
          <span className={cn(
            "text-[10px] font-medium px-1.5 py-0.5 rounded",
            product.delivery === "today" ? "bg-success-bg text-success-text" : "bg-n7 text-n2"
          )}>
            {product.delivery === "today" ? t("arrivedToday") : t("arrivedTomorrow")}
          </span>
        </div>

        {!compact && product.stock > 0 && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              addToCart(product);
              toast.success(t("addedToCart"));
            }}
            className="w-full mt-2 h-9 bg-primary-bg text-primary text-caption font-semibold rounded-full hover:bg-primary hover:text-n8 transition"
          >
            {t("addToCart")}
          </button>
        )}
      </div>
    </div>
  );
};
