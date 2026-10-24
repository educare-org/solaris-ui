export interface IconSearchEntry {
  name: string;
  keywords: string[];
  aliases: string[];
}

export function normalizeIconText(value: string): string {
  return value.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
}

export function matchesIconQuery(
  entry: IconSearchEntry,
  query: string,
): boolean {
  const q = normalizeIconText(query).trim();
  if (!q) return true;
  const haystack = [entry.name, ...entry.keywords, ...entry.aliases];
  return haystack.some((term) => normalizeIconText(term).includes(q));
}
