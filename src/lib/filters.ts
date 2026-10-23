import type { Category, Perfume } from '../types/perfume';
import { brandName } from '../data/catalog';

export type Query = Record<string, string | string[] | undefined>;
export interface Filters {
  q: string; brand: string; family: string; accords: string[];
  notes: string[]; exclude: string[]; occasion: string; climate: string;
}
export const normalize = (s: string) => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
export const allNotes = (p: Perfume) => [...new Set([
  ...(p.notes?.top?.value ?? []), ...(p.notes?.heart?.value ?? []), ...(p.notes?.base?.value ?? []),
])];
const first = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v) ?? '';
const many = (v: string | string[] | undefined) => [...new Set((Array.isArray(v) ? v : v ? [v] : []).filter(Boolean))];
export function parseFilters(q: Query): Filters {
  return { q: first(q.q), brand: first(q.brand), family: first(q.family), accords: many(q.accord),
    notes: many(q.note), exclude: many(q.exclude), occasion: first(q.occasion), climate: first(q.climate) };
}
export function filterPerfumes(items: Perfume[], filters: Filters, category?: Category): Perfume[] {
  return items.filter(p => {
    if (category && p.category.value !== category) return false;
    const text = normalize([p.name.value, brandName(p.brandId), p.inspiration?.value.name, p.inspiration?.value.brand].filter(Boolean).join(' '));
    if (filters.q && !text.includes(normalize(filters.q))) return false;
    if (filters.brand && p.brandId !== filters.brand) return false;
    if (filters.family && p.family?.value !== filters.family) return false;
    if (!filters.accords.every(a => p.accords?.value.includes(a))) return false;
    const declared = allNotes(p);
    if (!filters.notes.every(n => declared.includes(n))) return false;
    // Exclusão estrita: lista incompleta não comprova ausência da nota.
    if (filters.exclude.length && (!p.notes?.complete || filters.exclude.some(n => declared.includes(n)))) return false;
    if (filters.occasion && !p.occasions?.value.some(o => o === filters.occasion)) return false;
    if (filters.climate && !p.climates?.value.some(c => c === filters.climate)) return false;
    return true;
  });
}
