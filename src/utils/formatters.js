export const getYear = (date) => (date ? String(date).slice(0, 4) : "N/A");

export const formatRating = (rating) =>
  typeof rating === "number" && rating > 0 ? rating.toFixed(1) : "N/A";

export const formatRuntime = (minutes) => {
  if (!minutes) return "N/A";
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return h ? `${h}h ${m}m` : `${m}m`;
};
