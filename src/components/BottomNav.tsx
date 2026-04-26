import { useNavigate, useLocation } from "react-router-dom";
import { Home, Heart, ShoppingBag, Package, User } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";

const tabs = [
  { path: "/home", icon: Home, key: "home" as const },
  { path: "/wishlist", icon: Heart, key: "wishlist" as const },
  { path: "/cart", icon: ShoppingBag, key: "cart" as const },
  { path: "/orders", icon: Package, key: "orders" as const },
  { path: "/profile", icon: User, key: "profile" as const },
];

export const BottomNav = () => {
  const nav = useNavigate();
  const loc = useLocation();
  const { t } = useI18n();
  const { cartCount } = useStore();

  return (
    <nav className="fixed bottom-0 inset-x-0 z-40 mx-auto max-w-[402px] bg-n8 border-t border-n6 safe-bottom">
      <div className="flex items-stretch justify-around h-[72px]">
        {tabs.map(({ path, icon: Icon, key }) => {
          const active = loc.pathname === path || (path === "/orders" && loc.pathname.startsWith("/order"));
          return (
            <button
              key={path}
              onClick={() => nav(path)}
              className={cn(
                "flex-1 flex flex-col items-center justify-center gap-1 transition-colors relative",
                active ? "text-primary" : "text-n4"
              )}
              aria-label={t(key)}
            >
              <div className="relative">
                <Icon className="w-6 h-6" strokeWidth={active ? 2.4 : 1.8} />
                {key === "cart" && cartCount > 0 && (
                  <span className="absolute -top-1.5 -end-2 min-w-[18px] h-[18px] px-1 rounded-full bg-warning-text text-n8 text-[10px] font-semibold flex items-center justify-center animate-bounce-cart">
                    {cartCount}
                  </span>
                )}
              </div>
              <span className={cn("text-[11px]", active && "font-semibold")}>{t(key)}</span>
              {active && <span className="absolute top-0 w-8 h-0.5 bg-primary rounded-full" />}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
