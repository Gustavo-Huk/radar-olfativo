import type { Brand, Category, Perfume } from '../types/perfume';
import type { Filters } from '../types/filters';

export const normalize = (s: string) => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
export const allNotes = (p: Perfume) => [...new Set([
  ...(p.notes?.top?.value ?? []), ...(p.notes?.heart?.value ?? []), ...(p.notes?.base?.value ?? []),
])];
export function filterPerfumes(items: readonly Perfume[], filters: Filters, category?: Category, brands: readonly Brand[] = []): Perfume[] {
  const brandNames = new Map(brands.map(b => [b.id, b.name]));
  const query = normalize(filters.q);
  return items.filter(p => {
    if (category && p.category.value !== category) return false;
    const text = normalize([p.name.value, brandNames.get(p.brandId), p.inspiration?.value.name, p.inspiration?.value.brand].filter(Boolean).join(' '));
    if (query && !text.includes(query)) return false;
    if (filters.brand && p.brandId !== filters.brand) return false;
    if (filters.family && p.family?.value !== filters.family) return false;
    if (!filters.accords.every(a => p.accords?.value.includes(a))) return false;
    const declared = allNotes(p);
    if (!filters.notes.every(n => declared.includes(n))) return false;
    // Exclusão estrita: lista incompleta não comprova ausência da nota.
    if (filters.exclude.length && (!p.notes?.complete || !declared.length || filters.exclude.some(n => declared.includes(n)))) return false;
    if (filters.occasion && !p.occasions?.value.some(o => o === filters.occasion)) return false;
    if (filters.climate && !p.climates?.value.some(c => c === filters.climate)) return false;
    return true;
  });
}
