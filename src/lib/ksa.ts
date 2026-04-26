/**
 * KSA-specific helpers: Hijri date, Tabby/Tamara installments, fast-delivery cutoff,
 * Saudi phone formatting & validation, Arabic-Indic digit normalization.
 */

/** Convert Arabic-Indic (٠-٩) and Persian (۰-۹) digits to Latin (0-9). */
export const toLatinDigits = (s: string): string =>
  s.replace(/[\u0660-\u0669]/g, d => String(d.charCodeAt(0) - 0x0660))
   .replace(/[\u06F0-\u06F9]/g, d => String(d.charCodeAt(0) - 0x06F0));

/** Convert Latin digits to Arabic-Indic for display. */
export const toArabicDigits = (s: string | number): string =>
  String(s).replace(/[0-9]/g, d => String.fromCharCode(0x0660 + Number(d)));

/**
 * Extract the Saudi mobile subscriber number (9 digits starting with 5)
 * from any user input. Strips +966 / 00966 / leading 0 prefixes and
 * normalizes Arabic-Indic digits.
 */
export const parseSaudiMobile = (raw: string): string => {
  let v = toLatinDigits(raw).replace(/\D/g, "");
  if (v.startsWith("00966")) v = v.slice(5);
  else if (v.startsWith("966")) v = v.slice(3);
  else if (v.startsWith("0")) v = v.slice(1);
  return v.slice(0, 9);
};

/** Validate Saudi mobile: 9 digits starting with 5. */
export const isValidSaudiMobile = (raw: string): boolean =>
  /^5\d{8}$/.test(parseSaudiMobile(raw));

/** Format the local part as "5XX XXX XXXX". */
export const formatSaudiMobile = (local: string): string => {
  const v = parseSaudiMobile(local);
  if (v.length <= 3) return v;
  if (v.length <= 6) return `${v.slice(0, 3)} ${v.slice(3)}`;
  return `${v.slice(0, 3)} ${v.slice(3, 6)} ${v.slice(6)}`;
};

/** Full E.164: +9665XXXXXXXX */
export const toE164Saudi = (raw: string): string => `+966${parseSaudiMobile(raw)}`;

/** Mask middle digits for privacy: +966 5X XXX •• 34 */
export const maskSaudiMobile = (raw: string): string => {
  const v = parseSaudiMobile(raw);
  if (v.length < 9) return toE164Saudi(raw);
  return `+966 ${v.slice(0, 2)} ${v.slice(2, 5)} •• ${v.slice(7)}`;
};

export const formatHijri = (date: Date, lang: "en" | "ar" = "en"): string => {
  try {
    return new Intl.DateTimeFormat(
      lang === "ar" ? "ar-SA-u-ca-islamic-umalqura" : "en-u-ca-islamic-umalqura",
      { day: "numeric", month: "long", year: "numeric" },
    ).format(date);
  } catch {
    return date.toDateString();
  }
};

export const formatGregorian = (date: Date, lang: "en" | "ar" = "en"): string =>
  new Intl.DateTimeFormat(lang === "ar" ? "ar-SA" : "en-GB", {
    day: "numeric",
    month: "short",
    weekday: "short",
  }).format(date);

/** Tabby splits the price into 4 equal interest-free payments. */
export const tabbyInstallment = (price: number) => +(price / 4).toFixed(0);

/** Tamara default: 3 monthly installments. */
export const tamaraInstallment = (price: number) => +(price / 3).toFixed(0);

/**
 * Returns minutes left until the daily 22:00 (10 PM) order cutoff
 * for next-day delivery in KSA. Returns null if cutoff has passed.
 */
export const fastDeliveryCutoff = (now: Date = new Date()): { hours: number; minutes: number } | null => {
  const cutoff = new Date(now);
  cutoff.setHours(22, 0, 0, 0);
  const diff = cutoff.getTime() - now.getTime();
  if (diff <= 0) return null;
  const totalMin = Math.floor(diff / 60000);
  return { hours: Math.floor(totalMin / 60), minutes: totalMin % 60 };
};

/** Pseudo-deterministic "sold this month" count from product id. */
export const soldThisMonth = (id: string, base = 200): number => {
  let hash = 0;
  for (let i = 0; i < id.length; i++) hash = (hash * 31 + id.charCodeAt(i)) | 0;
  return base + (Math.abs(hash) % 1800);
};
