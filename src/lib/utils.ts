export const formatSEK = (amount: number): string => {
  return new Intl.NumberFormat("sv-SE", {
    style: "currency",
    currency: "SEK",
    maximumFractionDigits: 0,
  })
    .format(amount)
    .replace("SEK", "kr");
};
