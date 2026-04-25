import { ReactNode } from "react";
import { BottomNav } from "./BottomNav";
import { StatusBar } from "./StatusBar";

export const MobileShell = ({ children, hideNav }: { children: ReactNode; hideNav?: boolean }) => (
  <div className="phone-frame pb-20">
    <StatusBar />
    {children}
    {!hideNav && <BottomNav />}
  </div>
);
