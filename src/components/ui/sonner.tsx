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
            "group/toast pointer-events-auto",
            "flex items-start gap-3 w-full p-4 pe-10",
            "rounded-2xl border shadow-[0_10px_40px_-12px_hsl(var(--n1)/0.25)]",
            "backdrop-blur-xl",
            "bg-n8/95 border-n6 text-n1",
            "before:content-[''] before:absolute before:inset-y-3 before:start-0 before:w-1 before:rounded-full before:bg-primary",
            "data-[type=success]:before:bg-success",
            "data-[type=error]:before:bg-warning-text",
            "data-[type=warning]:before:bg-warning",
            "data-[type=info]:before:bg-primary",
            "ps-5",
          ].join(" "),
          title: "text-body font-bold text-n1 leading-snug",
          description: "text-caption text-n3 mt-0.5 leading-snug",
          icon: [
            "flex items-center justify-center w-8 h-8 rounded-full flex-shrink-0",
            "group-data-[type=success]/toast:bg-success/15 group-data-[type=success]/toast:text-success-text",
            "group-data-[type=error]/toast:bg-warning-bg group-data-[type=error]/toast:text-warning-text",
            "group-data-[type=warning]/toast:bg-warning-bg group-data-[type=warning]/toast:text-warning-text",
            "group-data-[type=info]/toast:bg-primary/10 group-data-[type=info]/toast:text-primary",
            "group-data-[type=loading]/toast:bg-primary/10 group-data-[type=loading]/toast:text-primary",
            "group-[&:not([data-type])]/toast:bg-primary/10 group-[&:not([data-type])]/toast:text-primary",
          ].join(" "),
          content: "flex-1 min-w-0",
          actionButton: "rounded-full bg-primary text-n8 px-3 py-1.5 text-caption font-bold",
          cancelButton: "rounded-full bg-n7 text-n2 px-3 py-1.5 text-caption font-semibold",
          closeButton: [
            "!start-auto !end-2 !top-2 !-translate-y-0 !-translate-x-0",
            "!w-6 !h-6 !rounded-full !bg-n7 !border-n6 !text-n3",
            "hover:!bg-n6 hover:!text-n1 transition-colors",
          ].join(" "),
        },
      }}
      {...props}
    />
  );
};

export { Toaster, toast };
