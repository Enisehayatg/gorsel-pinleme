export const capitalizeFirstLetter = (text: string) => {
  if (!text) return "";
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
};

export const truncate = (text: string, limit: number) => {
  return text.length > limit ? `${text.substring(0, limit)}...` : text;
};
