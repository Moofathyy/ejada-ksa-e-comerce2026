import { ReactNode } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { LayoutDashboard, Package, ShoppingBag, User, Plus } from "lucide-react";
import { StatusBar } from "./StatusBar";
import { cn } from "@/lib/utils";

const tabs = [
  { path: "/merchant/dashboard", icon: LayoutDashboard, labelEn: "Dashboard", labelAr: "لوحة" },
  { path: "/merchant/products", icon: Package, labelEn: "Products", labelAr: "المنتجات" },
  { path: "/merchant/orders", icon: ShoppingBag, labelEn: "Orders", labelAr: "الطلبات" },
  { path: "/merchant/profile", icon: User, labelEn: "Profile", labelAr: "الحساب" },
];

export const MerchantShell = ({ children, lang = "en", hideNav, hideFab }: { children: ReactNode; lang?: "en" | "ar"; hideNav?: boolean; hideFab?: boolean }) => {
  const nav = useNavigate();
  const loc = useLocation();
  const showFab = !hideNav && !hideFab && !loc.pathname.startsWith("/merchant/products/");
  return (
    <div className="phone-frame pb-20 bg-background">
      <StatusBar />
      <div key={loc.pathname} className="animate-fade-in">{children}</div>
      {showFab && (
        <div className="fixed bottom-0 inset-x-0 z-50 mx-auto max-w-[402px] pointer-events-none">
          <button
            onClick={() => nav("/merchant/products/new")}
            aria-label={lang === "ar" ? "إضافة منتج" : "Add product"}
            className="pointer-events-auto absolute bottom-[88px] end-5 w-14 h-14 rounded-full bg-primary text-n8 shadow-cta flex items-center justify-center active:scale-95 transition hover:brightness-110"
          >
            <Plus className="w-7 h-7" strokeWidth={2.4} />
          </button>
        </div>
      )}
      {!hideNav && (
        <nav className="fixed bottom-0 inset-x-0 z-40 mx-auto max-w-[402px] bg-n8 border-t border-n6 safe-bottom">
          <div className="flex items-stretch justify-around h-[72px]">
            {tabs.map(({ path, icon: Icon, labelEn, labelAr }) => {
              const active = loc.pathname === path || (path === "/merchant/products" && loc.pathname.startsWith("/merchant/products"));
              return (
                <button
                  key={path}
                  onClick={() => nav(path)}
                  className={cn(
                    "flex-1 flex flex-col items-center justify-center gap-1 transition-colors relative",
                    active ? "text-primary" : "text-n4"
                  )}
                >
                  <Icon className="w-6 h-6" strokeWidth={active ? 2.4 : 1.8} />
                  <span className={cn("text-[11px]", active && "font-semibold")}>{lang === "ar" ? labelAr : labelEn}</span>
                  {active && <span className="absolute top-0 w-8 h-0.5 bg-primary rounded-full" />}
                </button>
              );
            })}
          </div>
        </nav>
      )}
    </div>
  );
};

