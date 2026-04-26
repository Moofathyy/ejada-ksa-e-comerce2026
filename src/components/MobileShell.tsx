import { ReactNode } from "react";
import { useLocation } from "react-router-dom";
import { BottomNav } from "./BottomNav";
import { StatusBar } from "./StatusBar";

export const MobileShell = ({ children, hideNav }: { children: ReactNode; hideNav?: boolean }) => {
  const { pathname } = useLocation();
  return (
    <div className="phone-frame pb-20">
      <StatusBar />
      {/* key on pathname re-triggers the entrance animation on route change */}
      <div key={pathname} className="animate-fade-in">
        {children}
      </div>
      {!hideNav && <BottomNav />}
    </div>
  );
};
