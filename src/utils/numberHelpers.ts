export const formatCurrency = (amount: number, currency = "TRY") => {
  return new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency,
  }).format(amount);
};

export const formatNumber = (number: number) => {
  return new Intl.NumberFormat("tr-TR").format(number);
};
