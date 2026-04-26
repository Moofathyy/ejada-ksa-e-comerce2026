import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { toast } from "sonner";
import { MobileShell } from "@/components/MobileShell";
import { TopBar } from "@/components/TopBar";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { Lock, Check, CreditCard as CreditCardIcon } from "lucide-react";
import { CardVisual, detectBrand, formatCardNumber } from "@/components/CardVisual";

const luhnValid = (digits: string): boolean => {
  const d = digits.replace(/\D/g, "");
  if (d.length < 12) return false;
  let sum = 0, alt = false;
  for (let i = d.length - 1; i >= 0; i--) {
    let n = parseInt(d[i], 10);
    if (alt) { n *= 2; if (n > 9) n -= 9; }
    sum += n;
    alt = !alt;
  }
  return sum % 10 === 0;
};

const schema = z.object({
  number: z.string().refine(v => luhnValid(v), "Invalid card number"),
  holder: z.string().trim().min(2, "Cardholder name is required").max(60),
  exp:    z.string().regex(/^(0[1-9]|1[0-2])\/\d{2}$/, "Use MM/YY"),
  cvv:    z.string().regex(/^\d{3,4}$/, "3 or 4 digits"),
  setDefault: z.boolean(),
});

type FormState = z.infer<typeof schema>;

const AddCard = () => {
  const nav = useNavigate();
  const { lang } = useI18n();
  const tr = (en: string, ar: string) => (lang === "ar" ? ar : en);

  const [form, setForm] = useState<FormState>({
    number: "",
    holder: "",
    exp: "",
    cvv: "",
    setDefault: true,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [cvvFocused, setCvvFocused] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const set = <K extends keyof FormState>(k: K, v: FormState[K]) => {
    setForm(p => ({ ...p, [k]: v }));
    if (errors[k as string]) setErrors(p => ({ ...p, [k as string]: "" }));
  };

  const brand = useMemo(() => detectBrand(form.number), [form.number]);
  const maxNumberLen = brand === "amex" ? 17 : 19; // including spaces
  const maxCvvLen = brand === "amex" ? 4 : 3;

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = schema.safeParse(form);
    if (!result.success) {
      const fe: Record<string, string> = {};
      result.error.issues.forEach(i => { fe[i.path[0] as string] = i.message; });
      setErrors(fe);
      toast.error(tr("Please fix the errors", "يرجى تصحيح الأخطاء"));
      return;
    }
    // Validate expiry not in the past
    const [mm, yy] = form.exp.split("/").map(Number);
    const expDate = new Date(2000 + yy, mm, 0, 23, 59, 59);
    if (expDate < new Date()) {
      setErrors(p => ({ ...p, exp: tr("Card has expired", "البطاقة منتهية") }));
      toast.error(tr("Card has expired", "البطاقة منتهية"));
      return;
    }
    setSubmitting(true);
    setTimeout(() => {
      toast.success(tr("Card saved securely", "تم حفظ البطاقة بأمان"));
      nav(-1);
    }, 400);
  };

  return (
    <MobileShell>
      <TopBar title={tr("Add New Card", "إضافة بطاقة جديدة")} />
      <form onSubmit={onSubmit} className="p-4 pb-8 space-y-5" noValidate>
        {/* Live card preview */}
        <div className="px-1">
          <CardVisual
            number={form.number}
            holder={form.holder}
            expiry={form.exp}
            cvv={form.cvv}
            flipped={cvvFocused}
            lang={lang}
          />
        </div>

        {/* Card number */}
        <Field
          label={tr("Card Number", "رقم البطاقة")}
          error={errors.number}
        >
          <div className="relative">
            <Input
              value={form.number}
              onChange={e => set("number", formatCardNumber(e.target.value))}
              placeholder="1234 5678 9012 3456"
              inputMode="numeric"
              autoComplete="cc-number"
              maxLength={maxNumberLen}
              dir="ltr"
            />
            <CreditCardIcon className="w-5 h-5 text-n4 absolute end-4 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </Field>

        {/* Cardholder */}
        <Field
          label={tr("Cardholder Name", "اسم حامل البطاقة")}
          hint={tr("Exactly as printed on the card", "كما هو مكتوب على البطاقة")}
          error={errors.holder}
        >
          <Input
            value={form.holder}
            onChange={e => set("holder", e.target.value.toUpperCase().replace(/[^A-Z\u0600-\u06FF\s]/g, "").slice(0, 60))}
            placeholder={tr("AHMED AL-OTAIBI", "أحمد العتيبي")}
            autoComplete="cc-name"
          />
        </Field>

        {/* Expiry + CVV */}
        <div className="grid grid-cols-2 gap-3">
          <Field label={tr("Expiry", "تاريخ الانتهاء")} error={errors.exp}>
            <Input
              value={form.exp}
              onChange={e => {
                let v = e.target.value.replace(/\D/g, "").slice(0, 4);
                if (v.length >= 3) v = `${v.slice(0, 2)}/${v.slice(2)}`;
                set("exp", v);
              }}
              placeholder="MM/YY"
              inputMode="numeric"
              autoComplete="cc-exp"
              maxLength={5}
              dir="ltr"
            />
          </Field>

          <Field label="CVV" error={errors.cvv}>
            <Input
              value={form.cvv}
              onChange={e => set("cvv", e.target.value.replace(/\D/g, "").slice(0, maxCvvLen))}
              onFocus={() => setCvvFocused(true)}
              onBlur={() => setCvvFocused(false)}
              placeholder={brand === "amex" ? "1234" : "123"}
              inputMode="numeric"
              autoComplete="cc-csc"
              maxLength={maxCvvLen}
              type="password"
              dir="ltr"
            />
          </Field>
        </div>

        {/* Default toggle */}
        <button
          type="button"
          onClick={() => set("setDefault", !form.setDefault)}
          className="w-full flex items-center gap-3 px-4 py-3.5 bg-n8 rounded-card border border-n6 active:bg-n7"
        >
          <div className={cn(
            "w-5 h-5 rounded border-2 flex items-center justify-center transition flex-shrink-0",
            form.setDefault ? "bg-primary border-primary" : "border-n5",
          )}>
            {form.setDefault && <Check className="w-3.5 h-3.5 text-primary-foreground" strokeWidth={3} />}
          </div>
          <span className="flex-1 text-start text-body font-medium text-n1">
            {tr("Set as default payment method", "تعيين كوسيلة دفع افتراضية")}
          </span>
        </button>

        {/* Security notice */}
        <div className="flex items-start gap-2.5 px-3.5 py-3 bg-info/5 border border-info/20 rounded-card">
          <Lock className="w-4 h-4 text-info-text flex-shrink-0 mt-0.5" />
          <p className="text-caption text-info-text leading-relaxed">
            {tr(
              "Your card details are encrypted end-to-end and never stored on our servers.",
              "بيانات بطاقتك مشفرة بالكامل ولا يتم تخزينها على خوادمنا.",
            )}
          </p>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={submitting}
          className="w-full h-[52px] bg-primary text-primary-foreground rounded-full font-bold shadow-cta flex items-center justify-center gap-2 disabled:opacity-60 mt-2"
        >
          <Lock className="w-4 h-4" />
          {submitting
            ? tr("Saving…", "جارٍ الحفظ…")
            : tr("Save Card Securely", "حفظ البطاقة بأمان")}
        </button>
      </form>
    </MobileShell>
  );
};

/* ---------- Reusable inputs (mirror AddAddress styling) ---------- */
const Field = ({
  label, hint, error, children,
}: { label: string; hint?: string; error?: string; children: React.ReactNode }) => (
  <div>
    <label className="block text-label text-n1 font-bold">{label}</label>
    {error
      ? React.Children.map(children, (child) =>
          React.isValidElement(child)
            ? React.cloneElement(child as React.ReactElement<any>, {
                className: cn((child.props as any).className, "border-ksa-red border-2 focus:border-ksa-red focus:ring-0"),
              })
            : child)
      : children}
    {error
      ? <p className="mt-1 text-caption font-medium text-ksa-red" role="alert">{error}</p>
      : hint && <p className="mt-1 text-caption text-[#616161]">{hint}</p>}
  </div>
);

const baseInput = "w-full mt-2 h-[52px] px-4 bg-n8 border border-n4 rounded-input text-body text-n1 placeholder:text-n4 focus:border-primary focus:border-2 focus:ring-0 outline-none transition tabular";

const Input = (props: React.InputHTMLAttributes<HTMLInputElement>) => (
  <input {...props} className={cn(baseInput, props.className)} />
);

export default AddCard;
