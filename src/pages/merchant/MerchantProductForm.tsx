import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, ArrowRight, ImagePlus } from "lucide-react";
import { StatusBar } from "@/components/StatusBar";
import { useI18n } from "@/lib/i18n";
import { useMerchant } from "@/lib/merchant";
import { toast } from "sonner";

const categories = ["smartphones", "laptops", "headphones", "wearables", "tvs", "gaming", "accessories"];

const MerchantProductForm = () => {
  const nav = useNavigate();
  const { id } = useParams();
  const { lang, dir } = useI18n();
  const { merchant, products, addProduct, updateProduct } = useMerchant();
  const editing = id && id !== "new" ? products.find(p => p.id === id) : null;

  const [name, setName] = useState(editing?.name || "");
  const [nameAr, setNameAr] = useState(editing?.nameAr || "");
  const [brand, setBrand] = useState(editing?.brand || "");
  const [category, setCategory] = useState(editing?.category || categories[0]);
  const [price, setPrice] = useState(editing?.price.toString() || "");
  const [originalPrice, setOriginalPrice] = useState(editing?.originalPrice?.toString() || "");
  const [stock, setStock] = useState(editing?.stock.toString() || "");
  const [image, setImage] = useState(editing?.image || "/placeholder.svg");
  const [description, setDescription] = useState(editing?.description || "");
  const [status, setStatus] = useState<"active" | "draft" | "out_of_stock">(editing?.status || "active");

  if (!merchant) { nav("/auth", { replace: true }); return null; }

  const Back = dir === "rtl" ? ArrowRight : ArrowLeft;

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setImage(reader.result as string);
    reader.readAsDataURL(file);
  };

  const submit = () => {
    if (!name.trim() || !brand.trim() || !price) {
      toast.error(lang === "ar" ? "يرجى تعبئة الحقول المطلوبة" : "Please fill required fields");
      return;
    }
    const data = {
      name: name.trim(), nameAr: nameAr.trim() || undefined, brand: brand.trim(),
      category, price: Number(price),
      originalPrice: originalPrice ? Number(originalPrice) : undefined,
      stock: Number(stock || 0), image, description: description.trim() || undefined,
      status: Number(stock || 0) === 0 && status === "active" ? "out_of_stock" as const : status,
    };
    if (editing) {
      updateProduct(editing.id, data);
      toast.success(lang === "ar" ? "تم التحديث" : "Updated");
    } else {
      addProduct(data);
      toast.success(lang === "ar" ? "تمت الإضافة" : "Product added");
    }
    nav("/merchant/products");
  };

  return (
    <div className="phone-frame bg-background flex flex-col overflow-y-auto">
      <StatusBar />
      <header className="sticky top-7 z-30 bg-primary text-n8 rounded-b-3xl shadow-elev1">
        <div className="px-4 pt-4 pb-4 flex items-center gap-3">
          <button onClick={() => nav(-1)} className="w-10 h-10 rounded-xl bg-n8/15 backdrop-blur flex items-center justify-center">
            <Back className="w-5 h-5" />
          </button>
          <div className="flex-1 min-w-0">
            <p className="text-[10px] font-semibold tracking-[0.12em] opacity-80 uppercase">
              {editing ? (lang === "ar" ? "تعديل منتج" : "Edit Product") : (lang === "ar" ? "منتج جديد" : "New Product")}
            </p>
            <p className="text-h2 font-bold truncate">{editing ? editing.name : (lang === "ar" ? "إضافة منتج" : "Add Product")}</p>
          </div>
        </div>
      </header>

      <main className="px-5 pt-5 pb-32 space-y-4">
        {/* Image */}
        <label className="block">
          <div className="w-full aspect-square max-h-[200px] rounded-card bg-n7 overflow-hidden relative cursor-pointer">
            <img src={image} alt="" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-n1/40 opacity-0 hover:opacity-100 flex items-center justify-center transition">
              <ImagePlus className="w-8 h-8 text-n8" />
            </div>
          </div>
          <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
          <p className="text-caption text-n3 mt-1.5 text-center">{lang === "ar" ? "اضغط لتغيير الصورة" : "Tap image to change"}</p>
        </label>

        <FormField label={lang === "ar" ? "اسم المنتج (إنجليزي) *" : "Product name (English) *"}>
          <input value={name} onChange={e => setName(e.target.value)} className="form-input" placeholder="iPhone 15 Pro" />
        </FormField>
        <FormField label={lang === "ar" ? "اسم المنتج (عربي)" : "Product name (Arabic)"}>
          <input value={nameAr} onChange={e => setNameAr(e.target.value)} className="form-input" dir="rtl" placeholder="آيفون 15 برو" />
        </FormField>
        <div className="grid grid-cols-2 gap-3">
          <FormField label={lang === "ar" ? "العلامة التجارية *" : "Brand *"}>
            <input value={brand} onChange={e => setBrand(e.target.value)} className="form-input" placeholder="Apple" />
          </FormField>
          <FormField label={lang === "ar" ? "الفئة" : "Category"}>
            <select value={category} onChange={e => setCategory(e.target.value)} className="form-input">
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </FormField>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <FormField label={lang === "ar" ? "السعر (ر.س) *" : "Price (SAR) *"}>
            <input value={price} onChange={e => setPrice(e.target.value)} className="form-input" inputMode="decimal" placeholder="299" />
          </FormField>
          <FormField label={lang === "ar" ? "السعر قبل الخصم" : "Compare at"}>
            <input value={originalPrice} onChange={e => setOriginalPrice(e.target.value)} className="form-input" inputMode="decimal" placeholder="399" />
          </FormField>
        </div>
        <FormField label={lang === "ar" ? "الكمية المتوفرة" : "Stock quantity"}>
          <input value={stock} onChange={e => setStock(e.target.value)} className="form-input" inputMode="numeric" placeholder="50" />
        </FormField>
        <FormField label={lang === "ar" ? "الوصف" : "Description"}>
          <textarea value={description} onChange={e => setDescription(e.target.value)} rows={3} className="form-input min-h-[88px] py-2.5" placeholder={lang === "ar" ? "وصف المنتج..." : "Product description..."} />
        </FormField>
        <FormField label={lang === "ar" ? "الحالة" : "Status"}>
          <div className="flex gap-2">
            {(["active", "draft"] as const).map(s => (
              <button
                key={s}
                onClick={() => setStatus(s)}
                className={`flex-1 h-11 rounded-input font-semibold text-caption transition ${status === s ? "bg-primary text-n8" : "bg-n7 text-n2"}`}
              >
                {s === "active" ? (lang === "ar" ? "نشط" : "Active") : (lang === "ar" ? "مسودة" : "Draft")}
              </button>
            ))}
          </div>
        </FormField>
      </main>

      <div className="fixed bottom-0 inset-x-0 mx-auto max-w-[402px] p-4 bg-n8 border-t border-n6 safe-bottom">
        <button onClick={submit} className="w-full h-[52px] bg-primary text-n8 rounded-full font-bold shadow-elev1 active:scale-[0.99] transition">
          {editing ? (lang === "ar" ? "حفظ التغييرات" : "Save Changes") : (lang === "ar" ? "إضافة المنتج" : "Add Product")}
        </button>
      </div>

      <style>{`
        .form-input { width: 100%; height: 44px; border-radius: 12px; background: hsl(var(--n7)); padding: 0 14px; outline: none; font-size: 14px; color: hsl(var(--n1)); border: 1.5px solid transparent; transition: border-color .15s; }
        .form-input:focus { border-color: hsl(var(--primary)); background: hsl(var(--n8)); }
      `}</style>
    </div>
  );
};

const FormField = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div>
    <label className="block text-caption font-semibold text-n2 mb-1.5">{label}</label>
    {children}
  </div>
);

export default MerchantProductForm;
