import { createContext, useContext, useEffect, useState, ReactNode } from "react";

type Lang = "en" | "ar";

type Dict = Record<string, { en: string; ar: string }>;

export const dict: Dict = {
  appName: { en: "Ejada", ar: "إجادة" },
  greeting: { en: "Hi", ar: "مرحباً" },
  searchPlaceholder: { en: "Search products, brands…", ar: "ابحث عن المنتجات والعلامات…" },
  deliverTo: { en: "Deliver to", ar: "التوصيل إلى" },
  riyadh: { en: "Riyadh", ar: "الرياض" },
  jeddah: { en: "Jeddah", ar: "جدة" },
  flashDeals: { en: "Flash Deals", ar: "عروض البرق" },
  endsIn: { en: "Ends in", ar: "ينتهي خلال" },
  popularKsa: { en: "Popular in Saudi Arabia", ar: "الأكثر رواجاً في السعودية" },
  recommended: { en: "Recommended For You", ar: "مقترحات لك" },
  recentlyViewed: { en: "Recently Viewed", ar: "شُوهد مؤخراً" },
  brands: { en: "Top Brands", ar: "أبرز العلامات" },
  shopByCategory: { en: "Shop by Category", ar: "تسوق حسب الفئة" },
  viewAll: { en: "View All", ar: "عرض الكل" },
  addToCart: { en: "Add to Cart", ar: "أضف للسلة" },
  buyNow: { en: "Buy Now", ar: "اشترِ الآن" },
  addedToCart: { en: "Added to cart ✓", ar: "تمت الإضافة للسلة ✓" },
  outOfStock: { en: "Out of Stock", ar: "غير متوفر" },
  notifyMe: { en: "Notify Me", ar: "أبلغني" },
  onlyXLeft: { en: "Only {x} left", ar: "تبقى {x} فقط" },
  arrivedToday: { en: "Arrives today", ar: "يصل اليوم" },
  arrivedTomorrow: { en: "Arrives tomorrow", ar: "يصل غداً" },
  freeDelivery: { en: "Free Delivery", ar: "توصيل مجاني" },
  warranty: { en: "Warranty", ar: "ضمان" },
  twoYearWarranty: { en: "2-Year Warranty", ar: "ضمان سنتين" },
  oneYearWarranty: { en: "1-Year Warranty", ar: "ضمان سنة" },
  officialWarranty: { en: "Official Warranty", ar: "ضمان رسمي" },
  trustedSeller: { en: "Trusted Seller", ar: "بائع موثوق" },
  topSeller: { en: "Top Seller in KSA", ar: "الأكثر مبيعاً في السعودية" },
  installmentsAvailable: { en: "Installments Available", ar: "تقسيط متاح" },
  expressDelivery: { en: "Express Delivery", ar: "توصيل سريع" },
  cart: { en: "Cart", ar: "السلة" },
  home: { en: "Home", ar: "الرئيسية" },
  search: { en: "Search", ar: "بحث" },
  orders: { en: "Orders", ar: "الطلبات" },
  profile: { en: "Profile", ar: "حسابي" },
  wishlist: { en: "Wishlist", ar: "المفضلة" },
  checkout: { en: "Checkout", ar: "إتمام الشراء" },
  secureCheckout: { en: "Secure Checkout", ar: "دفع آمن" },
  subtotal: { en: "Subtotal", ar: "المجموع الفرعي" },
  shipping: { en: "Shipping", ar: "الشحن" },
  vat: { en: "VAT (15%)", ar: "ضريبة القيمة (15%)" },
  total: { en: "Total", ar: "الإجمالي" },
  promoCode: { en: "Promo Code", ar: "رمز الخصم" },
  apply: { en: "Apply", ar: "تطبيق" },
  promoApplied: { en: "Promo applied", ar: "تم تطبيق الخصم" },
  invalidPromo: { en: "Invalid promo code. Try again.", ar: "رمز غير صحيح. حاول مرة أخرى." },
  discount: { en: "Discount", ar: "الخصم" },
  free: { en: "FREE", ar: "مجاناً" },
  addMoreForFreeDelivery: { en: "Add {x} {c} more to get Free Delivery", ar: "أضف {x} {c} للحصول على توصيل مجاني" },
  freeDeliveryUnlocked: { en: "🎉 Free Delivery Unlocked", ar: "🎉 تم فتح التوصيل المجاني" },
  emptyCart: { en: "Your cart is empty", ar: "سلتك فارغة" },
  startShopping: { en: "Explore Products", ar: "استكشف المنتجات" },
  clearAll: { en: "Clear All", ar: "حذف الكل" },
  removeAllConfirm: { en: "Remove all items from your cart?", ar: "حذف جميع العناصر من السلة؟" },
  cancel: { en: "Cancel", ar: "إلغاء" },
  clearCart: { en: "Clear Cart", ar: "حذف السلة" },
  orderConfirmed: { en: "Order Confirmed", ar: "تم تأكيد الطلب" },
  orderSuccess: { en: "Your order has been successfully confirmed! 🎉", ar: "تم تأكيد طلبك بنجاح! 🎉" },
  trackOrder: { en: "Track My Order", ar: "تتبع الطلب" },
  continueShopping: { en: "Continue Shopping", ar: "متابعة التسوق" },
  expectedArrival: { en: "Expected arrival", ar: "موعد الوصول المتوقع" },
  reviews: { en: "reviews", ar: "تقييم" },
  endingSoon: { en: "Ending Soon", ar: "ينتهي قريباً" },
  off: { en: "OFF", ar: "خصم" },
  next: { en: "Next", ar: "التالي" },
  skip: { en: "Skip", ar: "تخطي" },
  getStarted: { en: "Get Started", ar: "ابدأ الآن" },
  signIn: { en: "Sign In", ar: "تسجيل الدخول" },
  phoneNumber: { en: "Phone Number", ar: "رقم الجوال" },
  enterOtp: { en: "Enter the OTP sent to", ar: "أدخل الرمز المرسل إلى" },
  resendOtp: { en: "Resend OTP", ar: "إعادة الإرسال" },
  verify: { en: "Verify", ar: "تحقق" },
  language: { en: "Language", ar: "اللغة" },
  myOrders: { en: "My Orders", ar: "طلباتي" },
  addresses: { en: "My Addresses", ar: "عناويني" },
  payments: { en: "Payment Methods", ar: "وسائل الدفع" },
  helpCenter: { en: "Help Center", ar: "مركز المساعدة" },
  logout: { en: "Logout", ar: "تسجيل الخروج" },
  membershipGold: { en: "Gold Member", ar: "عضو ذهبي" },
  // Onboarding & Auth
  welcome: { en: "Welcome to Ejada", ar: "مرحباً بك في إجادة" },
  chooseLanguage: { en: "Choose your language", ar: "اختر لغتك" },
  chooseLanguageDesc: { en: "You can change this anytime in Settings.", ar: "يمكنك تغييرها لاحقاً من الإعدادات." },
  chooseCity: { en: "Where should we deliver?", ar: "إلى أين نوصّل لك؟" },
  chooseCityDesc: { en: "Pick your city for accurate delivery times.", ar: "اختر مدينتك لتقدير وقت التوصيل بدقة." },
  continueBtn: { en: "Continue", ar: "متابعة" },
  signUp: { en: "Create Account", ar: "إنشاء حساب" },
  signUpShort: { en: "Sign Up", ar: "إنشاء حساب" },
  alreadyHaveAccount: { en: "Already have an account?", ar: "لديك حساب بالفعل؟" },
  noAccount: { en: "New to Ejada?", ar: "جديد على إجادة؟" },
  signInWithEmail: { en: "Sign in to your account", ar: "سجّل الدخول إلى حسابك" },
  email: { en: "Email", ar: "البريد الإلكتروني" },
  password: { en: "Password", ar: "كلمة المرور" },
  fullName: { en: "Full Name", ar: "الاسم الكامل" },
  forgotPassword: { en: "Forgot password?", ar: "نسيت كلمة المرور؟" },
  orContinueWith: { en: "or continue with", ar: "أو تابع باستخدام" },
  agreeTerms: { en: "By continuing you agree to our Terms & Privacy Policy.", ar: "بالمتابعة فأنت توافق على الشروط وسياسة الخصوصية." },
  invalidEmail: { en: "Please enter a valid email", ar: "يرجى إدخال بريد إلكتروني صحيح" },
  passwordTooShort: { en: "Password must be at least 6 characters", ar: "كلمة المرور يجب ألا تقل عن 6 أحرف" },
  welcomeBack: { en: "Welcome back!", ar: "أهلاً بعودتك!" },
  accountCreated: { en: "Account created successfully 🎉", ar: "تم إنشاء الحساب بنجاح 🎉" },
  dammam: { en: "Dammam", ar: "الدمام" },
  mecca: { en: "Mecca", ar: "مكة المكرمة" },
  medina: { en: "Medina", ar: "المدينة المنورة" },
  khobar: { en: "Khobar", ar: "الخبر" },
  signInToContinue: { en: "Sign in to continue shopping", ar: "سجّل الدخول لمتابعة التسوق" },
  createYourAccount: { en: "Create your account", ar: "أنشئ حسابك" },
  joinEjada: { en: "Join Ejada and start shopping today", ar: "انضم إلى إجادة وابدأ التسوق اليوم" },
  enterPhone: { en: "+966 5XX XXX XXX", ar: "+966 5XX XXX XXX" },
  enterPassword: { en: "Enter your password", ar: "أدخل كلمة المرور" },
  rememberMe: { en: "Remember me", ar: "تذكرني" },
  continueWithGoogle: { en: "Continue with Google", ar: "المتابعة باستخدام Google" },
  continueWithApple: { en: "Continue with Apple ID", ar: "المتابعة باستخدام Apple ID" },
  continueAsGuest: { en: "Continue as Guest", ar: "المتابعة كضيف" },
  dontHaveAccount: { en: "Don't have an account?", ar: "ليس لديك حساب؟" },
  haveAccount: { en: "Already have an account?", ar: "لديك حساب بالفعل؟" },
  register: { en: "Register", ar: "سجّل الآن" },
  loginHint: { en: "Use: +966500000000 / demo123", ar: "جرّب: +966500000000 / demo123" },
  invalidPhone: { en: "Please enter a valid phone number", ar: "يرجى إدخال رقم جوال صحيح" },
  back: { en: "Back", ar: "رجوع" },

  // KSA / Noon-style
  soldThisMonth: { en: "{x} sold this month", ar: "تم بيع {x} هذا الشهر" },
  payInInstallments: { en: "Pay in 4 interest-free", ar: "قسّمها على 4 دفعات بدون فوائد" },
  payIn4WithTabby: { en: "or 4 × {x} with Tabby", ar: "أو 4 × {x} مع تابي" },
  payIn3WithTamara: { en: "or 3 × {x} with Tamara", ar: "أو 3 × {x} مع تمارا" },
  startingFrom: { en: "from", ar: "ابتداءً من" },
  perMonth: { en: "/mo", ar: "/شهرياً" },
  orderWithin: { en: "Order within {h}h {m}m for delivery tomorrow", ar: "اطلب خلال {h}س {m}د للتوصيل غداً" },
  todayBy10pm: { en: "Get it tomorrow • Order before 10 PM", ar: "يصل غداً • اطلب قبل 10 مساءً" },
  prayerTimeNote: { en: "We pause delivery during prayer times", ar: "نوقف التوصيل أثناء أوقات الصلاة" },
  cashOnDelivery: { en: "Cash on Delivery", ar: "الدفع عند الاستلام" },
  codFee: { en: "+15 SAR fee", ar: "+15 ر.س رسوم" },
  stcPay: { en: "STC Pay", ar: "STC Pay" },
  buyNowAction: { en: "Buy Now", ar: "اشترِ الآن" },
  saudiStocked: { en: "In stock in KSA", ar: "متوفر في السعودية" },
  freeReturns: { en: "Free returns within 15 days", ar: "إرجاع مجاني خلال 15 يوم" },
  authorizedDealer: { en: "Authorized Saudi Dealer", ar: "وكيل معتمد في السعودية" },
  visa2030: { en: "Proudly serving Vision 2030", ar: "نخدم رؤية 2030 بكل فخر" },
  hijri: { en: "Hijri", ar: "هجري" },
  district: { en: "District", ar: "الحي" },
  buildingNo: { en: "Building No.", ar: "رقم المبنى" },
  nationalAddress: { en: "Saudi National Address", ar: "العنوان الوطني السعودي" },
  estimatedArrival: { en: "Arrives", ar: "يصل" },
  megaDeals: { en: "Mega Deals", ar: "عروض كبرى" },
  saveBig: { en: "Save up to 40%", ar: "وفّر حتى 40%" },
  shopNow: { en: "Shop Now", ar: "تسوق الآن" },
  trustedByKsa: { en: "Trusted by 2M+ Saudi shoppers", ar: "موثوق من +2 مليون متسوق سعودي" },
};

interface I18nCtx {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: keyof typeof dict, vars?: Record<string, string | number>) => string;
  dir: "ltr" | "rtl";
}

const Ctx = createContext<I18nCtx | null>(null);

export const I18nProvider = ({ children }: { children: ReactNode }) => {
  const [lang, setLangState] = useState<Lang>(() => (localStorage.getItem("ejada_lang") as Lang) || "en");

  const setLang = (l: Lang) => { setLangState(l); localStorage.setItem("ejada_lang", l); };

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
  }, [lang]);

  const t = (key: keyof typeof dict, vars?: Record<string, string | number>) => {
    let s = dict[key]?.[lang] ?? String(key);
    if (vars) Object.entries(vars).forEach(([k, v]) => { s = s.replace(`{${k}}`, String(v)); });
    return s;
  };

  return <Ctx.Provider value={{ lang, setLang, t, dir: lang === "ar" ? "rtl" : "ltr" }}>{children}</Ctx.Provider>;
};

export const useI18n = () => {
  const c = useContext(Ctx);
  if (!c) throw new Error("useI18n must be used within I18nProvider");
  return c;
};
