import { useTheme } from "next-themes";
import { Toaster as Sonner, toast } from "sonner";
import { CheckCircle2, AlertCircle, AlertTriangle, Info, Loader2, X } from "lucide-react";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();
  const dir = (typeof document !== "undefined" && document.documentElement.dir === "rtl") ? "rtl" : "ltr";

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      dir={dir}
      position="top-center"
      offset={20}
      closeButton
      visibleToasts={3}
      className="toaster group"
      icons={{
        success: <CheckCircle2 className="w-5 h-5" />,
        error: <AlertCircle className="w-5 h-5" />,
        warning: <AlertTriangle className="w-5 h-5" />,
        info: <Info className="w-5 h-5" />,
        loading: <Loader2 className="w-5 h-5 animate-spin" />,
        close: <X className="w-3.5 h-3.5" />,
      }}
      toastOptions={{
        unstyled: false,
        classNames: {
          toast: [
            "group/toast pointer-events-auto relative",
            "flex items-start gap-3 w-full p-4 pe-10",
            "rounded-2xl border shadow-[0_10px_40px_-12px_hsl(var(--n1)/0.25)]",
            "backdrop-blur-xl",
            // Default (mint/success look from reference)
            "bg-[hsl(var(--tabby-mint))] border-[hsl(var(--tabby-mint-text)/0.2)] text-n1",
            // Type-specific surfaces
            "data-[type=success]:bg-[hsl(var(--tabby-mint))] data-[type=success]:border-[hsl(var(--tabby-mint-text)/0.2)] data-[type=success]:text-n1",
            "data-[type=error]:bg-error-bg data-[type=error]:border-destructive/30 data-[type=error]:text-n1",
            "data-[type=warning]:bg-warning-bg data-[type=warning]:border-warning/30 data-[type=warning]:text-n1",
            "data-[type=info]:bg-primary-bg data-[type=info]:border-primary/20 data-[type=info]:text-n1",
          ].join(" "),
          title: "text-body font-bold text-n1 leading-snug",
          description: "text-caption text-n2/80 mt-0.5 leading-snug",
          icon: [
            "flex items-center justify-center w-6 h-6 rounded-full flex-shrink-0 mt-0.5",
            "bg-[hsl(var(--s2))] text-n8",
            "group-data-[type=success]/toast:bg-[hsl(var(--s2))] group-data-[type=success]/toast:text-n8",
            "group-data-[type=error]/toast:bg-destructive group-data-[type=error]/toast:text-n8",
            "group-data-[type=warning]/toast:bg-warning group-data-[type=warning]/toast:text-n1",
            "group-data-[type=info]/toast:bg-primary group-data-[type=info]/toast:text-n8",
            "group-data-[type=loading]/toast:bg-primary group-data-[type=loading]/toast:text-n8",
          ].join(" "),
          content: "flex-1 min-w-0",
          actionButton: "rounded-full bg-primary text-n8 px-3 py-1.5 text-caption font-bold",
          cancelButton: "rounded-full bg-n7 text-n2 px-3 py-1.5 text-caption font-semibold",
          closeButton: [
            "!start-auto !end-3 !top-1/2 !-translate-y-1/2 !translate-x-0",
            "!w-6 !h-6 !rounded-full !bg-transparent !border-0 !text-n1/70",
            "hover:!bg-n1/5 hover:!text-n1 transition-colors",
          ].join(" "),
        },
      }}
      {...props}
    />
  );
};

export { Toaster, toast };
