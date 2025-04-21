export const formatDate = (date: string | Date, locale = "tr-TR") => {
  const d = new Date(date);
  return d.toLocaleDateString(locale, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

export const formatDateTime = (date: string | Date, locale = "tr-TR") => {
  const d = new Date(date);
  return d.toLocaleString(locale, {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};
