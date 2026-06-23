const CURRENCY_LOCALE: Record<string, string> = {
  USD: "en-US",
  EUR: "en-IE",
  GBP: "en-GB",
  INR: "en-IN",
  BRL: "pt-BR",
};

export function formatSalary(amount: number, currency: string): string {
  const locale = CURRENCY_LOCALE[currency] ?? "en-US";
  return amount.toLocaleString(locale);
}
