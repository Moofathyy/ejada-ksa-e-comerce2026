import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { toast } from "sonner";
import { MobileShell } from "@/components/MobileShell";
import { TopBar } from "@/components/TopBar";
import { useI18n } from "@/lib/i18n";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import {
  Home, Briefcase, MapPin, Building2, Hash, Mail, Phone, Plus, Check,
} from "lucide-react";

type AddrType = "home" | "work" | "other";

const REGIONS = [
  { en: "Riyadh",        ar: "الرياض" },
  { en: "Makkah",        ar: "مكة المكرمة" },
  { en: "Madinah",       ar: "المدينة المنورة" },
  { en: "Eastern",       ar: "الشرقية" },
  { en: "Asir",          ar: "عسير" },
  { en: "Tabuk",         ar: "تبوك" },
  { en: "Qassim",        ar: "القصيم" },
  { en: "Hail",          ar: "حائل" },
];

const CITIES_BY_REGION: Record<string, { en: string; ar: string }[]> = {
  Riyadh:  [{ en: "Riyadh",  ar: "الرياض" }, { en: "Diriyah", ar: "الدرعية" }, { en: "Al Kharj", ar: "الخرج" }],
  Makkah:  [{ en: "Jeddah",  ar: "جدة" }, { en: "Makkah", ar: "مكة" }, { en: "Taif", ar: "الطائف" }],
  Madinah: [{ en: "Madinah", ar: "المدينة" }, { en: "Yanbu", ar: "ينبع" }],
  Eastern: [{ en: "Dammam",  ar: "الدمام" }, { en: "Khobar", ar: "الخبر" }, { en: "Dhahran", ar: "الظهران" }],
  Asir:    [{ en: "Abha",    ar: "أبها" }, { en: "Khamis Mushait", ar: "خميس مشيط" }],
  Tabuk:   [{ en: "Tabuk",   ar: "تبوك" }],
  Qassim:  [{ en: "Buraidah", ar: "بريدة" }, { en: "Unaizah", ar: "عنيزة" }],
  Hail:    [{ en: "Hail",    ar: "حائل" }],
};

// Saudi address schema
const schema = z.object({
  type:        z.enum(["home", "work", "other"]),
  label:       z.string().trim().min(1).max(40),
  region:      z.string().trim().min(1, "Region is required"),
  city:        z.string().trim().min(1, "City is required"),
  district:    z.string().trim().min(2, "District is required").max(60),
  street:      z.string().trim().min(2, "Street is required").max(80),
  building:    z.string().trim().regex(/^\d{1,6}$/, "Building must be 1-6 digits"),
  postal:      z.string().trim().regex(/^\d{5}$/, "Postal code must be 5 digits"),
  additional:  z.string().trim().regex(/^\d{0,4}$/, "Additional no. must be up to 4 digits").optional().or(z.literal("")),
  phone:       z.string().trim().regex(/^\+?9665\d{8}$/, "Use format +9665XXXXXXXX"),
  setDefault:  z.boolean(),
});

type FormState = z.infer<typeof schema>;

const AddAddress = () => {
  const nav = useNavigate();
  const { lang } = useI18n();
  const tr = (en: string, ar: string) => (lang === "ar" ? ar : en);

  const [form, setForm] = useState<FormState>({
    type: "home",
    label: tr("Home", "المنزل"),
    region: "",
    city: "",
    district: "",
    street: "",
    building: "",
    postal: "",
    additional: "",
    phone: "+9665",
    setDefault: true,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  const set = <K extends keyof FormState>(k: K, v: FormState[K]) => {
    setForm(prev => ({ ...prev, [k]: v }));
    if (errors[k as string]) setErrors(prev => ({ ...prev, [k as string]: "" }));
  };

  const setType = (t: AddrType) => {
    const labels: Record<AddrType, { en: string; ar: string }> = {
      home:  { en: "Home",  ar: "المنزل" },
      work:  { en: "Work",  ar: "العمل" },
      other: { en: "Other", ar: "أخرى" },
    };
    setForm(p => ({ ...p, type: t, label: labels[t][lang] }));
  };

  const cities = form.region ? CITIES_BY_REGION[form.region] || [] : [];

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
    setSubmitting(true);
    addAddress({
      type: form.type,
      label: form.label,
      region: form.region,
      city: form.city,
      district: form.district,
      street: form.street,
      building: form.building,
      postal: form.postal,
      additional: form.additional || undefined,
      phone: form.phone,
      isDefault: form.setDefault,
    });
    setTimeout(() => {
      toast.success(tr("Address saved", "تم حفظ العنوان"));
      nav(-1);
    }, 300);
  };

  const types: { k: AddrType; icon: any; label: string }[] = [
    { k: "home",  icon: Home,      label: tr("Home", "المنزل") },
    { k: "work",  icon: Briefcase, label: tr("Work", "العمل") },
    { k: "other", icon: MapPin,    label: tr("Other", "أخرى") },
  ];

  return (
    <MobileShell>
      <TopBar title={tr("Add New Address", "إضافة عنوان جديد")} />
      <form onSubmit={onSubmit} className="p-4 pb-8 space-y-5" noValidate>
        {/* Address Type */}
        <Field label={tr("Address Type", "نوع العنوان")}>
          <div className="grid grid-cols-3 gap-2">
            {types.map(t => {
              const Icon = t.icon;
              const active = form.type === t.k;
              return (
                <button
                  key={t.k}
                  type="button"
                  onClick={() => setType(t.k)}
                  className={cn(
                    "h-20 rounded-card border-2 flex flex-col items-center justify-center gap-1.5 transition active:scale-95",
                    active
                      ? "border-primary bg-primary/5 text-primary"
                      : "border-n6 bg-n8 text-n2",
                  )}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-caption font-bold">{t.label}</span>
                </button>
              );
            })}
          </div>
        </Field>

        {/* Custom label */}
        <Field
          label={tr("Address Label", "اسم العنوان")}
          hint={tr("e.g., Home, Work, Other", "مثل: المنزل، العمل، أخرى")}
          error={errors.label}
        >
          <Input
            value={form.label}
            onChange={e => set("label", e.target.value)}
            maxLength={40}
            placeholder={tr("Home", "المنزل")}
          />
        </Field>

        {/* Region + City */}
        <div className="grid grid-cols-2 gap-3">
          <Field label={tr("Region", "المنطقة")} error={errors.region}>
            <Select
              value={form.region}
              onChange={e => { set("region", e.target.value); set("city", ""); }}
              placeholder={tr("Select region", "اختر المنطقة")}
            >
              {REGIONS.map(r => (
                <option key={r.en} value={r.en}>{r[lang]}</option>
              ))}
            </Select>
          </Field>

          <Field label={tr("City", "المدينة")} error={errors.city}>
            <Select
              value={form.city}
              onChange={e => set("city", e.target.value)}
              placeholder={tr("Select city", "اختر المدينة")}
              disabled={!form.region}
            >
              {cities.map(c => (
                <option key={c.en} value={c.en}>{c[lang]}</option>
              ))}
            </Select>
          </Field>
        </div>

        {/* District */}
        <Field
          label={tr("District / Neighborhood", "الحي")}
          hint={tr("e.g., Al Olaya", "مثل: العليا")}
          error={errors.district}
        >
          <Input
            value={form.district}
            onChange={e => set("district", e.target.value)}
            maxLength={60}
            placeholder={tr("Al Olaya", "العليا")}
          />
        </Field>

        {/* Street */}
        <Field
          label={tr("Street Name", "اسم الشارع")}
          hint={tr("e.g., King Fahd Road", "مثل: طريق الملك فهد")}
          error={errors.street}
        >
          <Input
            value={form.street}
            onChange={e => set("street", e.target.value)}
            maxLength={80}
            placeholder={tr("King Fahd Road", "طريق الملك فهد")}
          />
        </Field>

        {/* Building + Postal */}
        <div className="grid grid-cols-2 gap-3">
          <Field
            label={tr("Building Number", "رقم المبنى")}
            hint={tr("e.g., 1234", "مثل: 1234")}
            error={errors.building}
          >
            <Input
              value={form.building}
              onChange={e => set("building", e.target.value.replace(/\D/g, "").slice(0, 6))}
              inputMode="numeric"
              placeholder="1234"
            />
          </Field>

          <Field
            label={tr("Postal Code", "الرمز البريدي")}
            hint={tr("e.g., 12213", "مثل: 12213")}
            error={errors.postal}
          >
            <Input
              value={form.postal}
              onChange={e => set("postal", e.target.value.replace(/\D/g, "").slice(0, 5))}
              inputMode="numeric"
              placeholder="12213"
            />
          </Field>
        </div>

        {/* Additional No. */}
        <Field
          label={tr("Additional No.", "الرقم الإضافي")}
          hint={tr("e.g., 5678 (optional)", "مثل: 5678 (اختياري)")}
          error={errors.additional}
        >
          <Input
            value={form.additional || ""}
            onChange={e => set("additional", e.target.value.replace(/\D/g, "").slice(0, 4))}
            inputMode="numeric"
            placeholder="5678"
          />
        </Field>

        {/* Phone */}
        <Field
          label={tr("Phone Number", "رقم الجوال")}
          hint={tr("e.g., +966 50 000 0000", "مثل: +966 50 000 0000")}
          error={errors.phone}
        >
          <Input
            value={form.phone}
            onChange={e => set("phone", e.target.value)}
            inputMode="tel"
            placeholder="+966500000000"
            maxLength={13}
          />
        </Field>

        {/* Default */}
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
            {tr("Set as default address", "تعيين كعنوان افتراضي")}
          </span>
        </button>

        {/* Submit */}
        <button
          type="submit"
          disabled={submitting}
          className="w-full h-[52px] bg-primary text-primary-foreground rounded-full font-bold shadow-cta flex items-center justify-center gap-2 disabled:opacity-60 mt-2"
        >
          <Plus className="w-5 h-5" />
          {submitting
            ? tr("Saving…", "جارٍ الحفظ…")
            : tr("Save Address", "حفظ العنوان")}
        </button>
      </form>
    </MobileShell>
  );
};

/* ---------- Reusable inputs ---------- */
const Field = ({
  label, hint, error, children,
}: { label: string; hint?: string; error?: string; children: React.ReactNode }) => (
  <div>
    <label className="text-caption text-n2 font-bold">{label}</label>
    {children}
    {error
      ? <p className="text-caption text-warning-text mt-1">{error}</p>
      : hint && <p className="text-caption text-n3 mt-1">{hint}</p>}
  </div>
);

const baseInput = "w-full mt-1.5 h-12 px-4 bg-n8 border border-n5 rounded-input text-body text-n1 placeholder:text-n4 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition";

const Input = (props: React.InputHTMLAttributes<HTMLInputElement>) => (
  <input {...props} className={cn(baseInput, props.className)} />
);

const Select = ({
  placeholder, children, ...props
}: React.SelectHTMLAttributes<HTMLSelectElement> & { placeholder?: string }) => (
  <select {...props} className={cn(baseInput, "appearance-none disabled:opacity-50", props.className)}>
    <option value="" disabled>{placeholder}</option>
    {children}
  </select>
);

export default AddAddress;
