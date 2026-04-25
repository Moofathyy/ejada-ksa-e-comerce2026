import { useState } from "react";
import { TopBar } from "@/components/TopBar";
import { MobileShell } from "@/components/MobileShell";
import { Check } from "lucide-react";
import { Sar } from "@/components/Sar";
import { products } from "@/lib/data";
import { useI18n } from "@/lib/i18n";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const REASONS = ["Wrong item", "Defective product", "No longer needed", "Other"];

const Returns = () => {
  const { lang } = useI18n();
  const [step, setStep] = useState(1);
  const [item, setItem] = useState<string | null>(null);
  const [reason, setReason] = useState<string | null>(null);

  const submit = () => { setStep(3); toast.success("Return request submitted"); };

  return (
    <MobileShell>
      <TopBar title="Request Return" />
      <main className="p-4 space-y-4">
        {step === 1 && (
          <>
            <h3 className="text-h2 text-n1">Select item to return</h3>
            {products.slice(0, 3).map(p => (
              <button key={p.id} onClick={() => { setItem(p.id); setStep(2); }}
                className="w-full bg-n8 rounded-card shadow-elev1 p-3 flex gap-3 items-center text-start">
                <img src={p.image} className="w-16 h-16 object-contain bg-n7 rounded-input p-1" alt="" />
                <div className="flex-1 min-w-0">
                  <p className="text-body text-n1 line-clamp-2">{p.name[lang]}</p>
                  <p className="text-caption text-primary font-semibold tabular">{p.price.toLocaleString()} <Sar /></p>
                </div>
              </button>
            ))}
          </>
        )}
        {step === 2 && (
          <>
            <h3 className="text-h2 text-n1">Why are you returning this?</h3>
            <div className="space-y-2">
              {REASONS.map(r => (
                <button key={r} onClick={() => setReason(r)}
                  className={cn("w-full p-4 bg-n8 border-2 rounded-card flex justify-between items-center text-start",
                    reason === r ? "border-primary" : "border-n6")}>
                  <span className="text-body font-medium text-n1">{r}</span>
                  {reason === r && <Check className="w-5 h-5 text-primary" />}
                </button>
              ))}
            </div>
            <button disabled={!reason} onClick={submit}
              className="w-full h-[52px] bg-primary text-n8 rounded-full font-semibold disabled:opacity-50">
              Confirm Pickup
            </button>
          </>
        )}
        {step === 3 && (
          <div className="py-12 text-center space-y-4 animate-fade-in">
            <div className="w-20 h-20 mx-auto rounded-full bg-success flex items-center justify-center"><Check className="w-12 h-12 text-n8" strokeWidth={3} /></div>
            <h3 className="text-h1 text-n1">Return Confirmed</h3>
            <p className="text-body text-n3">Pickup scheduled within 2 days. You'll receive an SMS shortly.</p>
            <div className="bg-n8 rounded-card shadow-elev1 p-4 text-start space-y-2">
              <div className="flex justify-between"><span className="text-caption text-n3">Return ID</span><span className="text-body font-semibold tabular">#RET-29481</span></div>
              <div className="flex justify-between"><span className="text-caption text-n3">Refund</span><span className="text-body font-semibold text-success-text">3-5 business days</span></div>
            </div>
          </div>
        )}
      </main>
    </MobileShell>
  );
};
export default Returns;
