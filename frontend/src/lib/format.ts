export const nf = new Intl.NumberFormat("en-IN");

/** "S Dave, J Das, B Varshney" → ["S Dave", "J Das", "B Varshney"] */
export function splitAuthors(authors: string): string[] {
  return authors
    .split(/,\s*/)
    .map((a) => a.trim())
    .filter(Boolean);
}

const SELF = /^(s\.?\s*dave|sushma\s+dave|d\s+sushma|dave\s+s|dr\.?\s*sushma\s+dave)$/i;
export const isSelf = (name: string) => SELF.test(name.replace(/\s+/g, " ").trim());

export function formatDate(iso: string, opts: Intl.DateTimeFormatOptions = { day: "numeric", month: "short", year: "numeric" }) {
  return new Date(iso).toLocaleDateString("en-GB", opts);
}

export function doiUrl(doi: string) {
  return doi.startsWith("http") ? doi : `https://doi.org/${doi}`;
}
