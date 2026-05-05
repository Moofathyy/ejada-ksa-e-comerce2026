import { ReactNode } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { LayoutDashboard, Package, ShoppingBag, User } from "lucide-react";
import { StatusBar } from "./StatusBar";
import { cn } from "@/lib/utils";

const tabs = [
  { path: "/merchant/dashboard", icon: LayoutDashboard, labelEn: "Dashboard", labelAr: "لوحة" },
  { path: "/merchant/products", icon: Package, labelEn: "Products", labelAr: "المنتجات" },
  { path: "/merchant/orders", icon: ShoppingBag, labelEn: "Orders", labelAr: "الطلبات" },
  { path: "/merchant/profile", icon: User, labelEn: "Profile", labelAr: "الحساب" },
];

export const MerchantShell = ({ children, lang = "en", hideNav }: { children: ReactNode; lang?: "en" | "ar"; hideNav?: boolean }) => {
  const nav = useNavigate();
  const loc = useLocation();
  return (
    <div className="phone-frame pb-20 bg-background">
      <StatusBar />
      <div key={loc.pathname} className="animate-fade-in">{children}</div>
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
