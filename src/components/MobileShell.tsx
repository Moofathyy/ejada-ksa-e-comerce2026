import { ReactNode } from "react";
import { BottomNav } from "./BottomNav";

export const MobileShell = ({ children, hideNav }: { children: ReactNode; hideNav?: boolean }) => (
  <div className="phone-frame pb-20">
    {children}
    {!hideNav && <BottomNav />}
  </div>
);
