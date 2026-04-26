/**
 * KSA-specific helpers: Hijri date, Tabby/Tamara installments, fast-delivery cutoff.
 */

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
