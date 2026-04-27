import { useEffect, useState } from "react";
import { Signal, Wifi, BatteryMedium } from "lucide-react";
import { useI18n } from "@/lib/i18n";

/**
 * Faux mobile OS status bar — purely visual.
 * Renders a thin bar with time, signal, wifi and battery icons,
 * matching the active TopBar color (primary by default).
 */
export const StatusBar = () => {
  const { lang } = useI18n();
  const [time, setTime] = useState("");

  useEffect(() => {
    const update = () => {
      const d = new Date();
      const locale = lang === "ar" ? "ar-SA" : "en-US";
      setTime(
        d.toLocaleTimeString(locale, {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        }),
      );
    };
    update();
    const id = setInterval(update, 30_000);
    return () => clearInterval(id);
  }, [lang]);

  return (
    <div className="sticky top-0 z-40 h-7 px-5 flex items-center justify-between text-n8 text-[12px] font-semibold tabular bg-white/0">
      <span>{time}</span>
      <div className="flex items-center gap-1.5">
        <Signal className="w-3.5 h-3.5" strokeWidth={2.5} />
        <Wifi className="w-3.5 h-3.5" strokeWidth={2.5} />
        <BatteryMedium className="w-4 h-4" strokeWidth={2.5} />
      </div>
    </div>
  );
};
