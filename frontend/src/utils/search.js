export function normalize(text) {
  return String(text ?? "")
    .toLowerCase()
    .replace(/[ً-ْـ]/g, "")
    .replace(/[أإآ]/g, "ا")
    .replace(/ة/g, "ه")
    .replace(/ى/g, "ي")
    .trim();
}

export function matches(query, ...fields) {
  const q = normalize(query);
  if (!q) return true;
  return fields.some((field) => normalize(field).includes(q));
}
