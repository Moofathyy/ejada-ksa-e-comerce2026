import { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useI18n } from "@/lib/i18n";

interface Props {
  title?: string;
  right?: ReactNode;
  showBack?: boolean;
  onBack?: () => void;
  transparent?: boolean;
}

export const TopBar = ({ title, right, showBack = true, onBack, transparent }: Props) => {
  const nav = useNavigate();
  const { dir } = useI18n();
  const Back = dir === "rtl" ? ChevronRight : ChevronLeft;

  return (
    <header
      className={`sticky top-0 z-30 h-14 px-4 flex items-center justify-between ${
        transparent ? "bg-transparent text-n1" : "bg-primary text-n8 shadow-elev1"
      }`}
    >
      <div className="w-10 flex items-center">
        {showBack && (
          <button
            onClick={() => (onBack ? onBack() : nav(-1))}
            className="w-10 h-10 -ms-2 flex items-center justify-center rounded-full hover:bg-n8/15 active:scale-95 transition"
            aria-label="Back"
          >
            <Back className="w-6 h-6" />
          </button>
        )}
      </div>
      {title && <h1 className="text-h3 truncate flex-1 text-center px-2">{title}</h1>}
      <div className="w-10 flex items-center justify-end">{right}</div>
    </header>
  );
};
