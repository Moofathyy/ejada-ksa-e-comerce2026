import { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight } from "lucide-react";
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
  const Back = dir === "rtl" ? ArrowRight : ArrowLeft;

  return (
    <header
      className={`sticky top-7 z-30 h-14 px-4 flex items-center justify-between ${
        transparent
          ? "bg-transparent text-n1"
          : "bg-primary text-primary-foreground rounded-b-3xl shadow-elev1"
      }`}
    >
      <div className="w-10 flex items-center">
        {showBack && (
          <button
            onClick={() => (onBack ? onBack() : nav(-1))}
            className={`w-10 h-10 rounded-xl flex items-center justify-center active:scale-95 transition ${transparent ? "bg-n1/10" : "bg-n8/15 backdrop-blur"}`}
            aria-label="Back"
          >
            <Back className="w-5 h-5" />
          </button>
        )}
      </div>
      {title && <h1 className="text-h3 truncate flex-1 text-center px-2">{title}</h1>}
      <div className="w-10 flex items-center justify-end">{right}</div>
    </header>
  );
};
