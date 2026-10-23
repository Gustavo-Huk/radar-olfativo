import type { Filters } from '../types/filters';

export type Query = Record<string, string | string[] | undefined>;
const first = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v)?.trim() ?? '';
const many = (v: string | string[] | undefined) =>
  [...new Set((Array.isArray(v) ? v : v ? [v] : []).map(s => s.trim()).filter(Boolean))];

export function parseFilters(q: Query): Filters {
  return {
    q: first(q.q), brand: first(q.brand), family: first(q.family), accords: many(q.accord),
    notes: many(q.note), exclude: many(q.exclude), occasion: first(q.occasion), climate: first(q.climate),
  };
}

/** Serializa só os filtros conhecidos; parâmetros alheios não se propagam pelos atalhos. */
export function serializeFilters(filters: Filters): string {
  const params = new URLSearchParams();
  for (const key of ['q', 'brand', 'family', 'occasion', 'climate'] as const) {
    if (filters[key]) params.set(key, filters[key]);
  }
  for (const [key, values] of [['accord', filters.accords], ['note', filters.notes], ['exclude', filters.exclude]] as const) {
    for (const value of values) params.append(key, value);
  }
  return params.toString();
}

export function toggleQuickFilter(filters: Filters, key: 'accord' | 'occasion', value: string): Filters {
  if (key === 'occasion') return { ...filters, occasion: filters.occasion === value ? '' : value };
  return {
    ...filters,
    accords: filters.accords.includes(value)
      ? filters.accords.filter(a => a !== value)
      : [...filters.accords, value],
  };
}

export function hasFilters(filters: Filters): boolean {
  return Boolean(filters.q || filters.brand || filters.family || filters.accords.length ||
    filters.notes.length || filters.exclude.length || filters.occasion || filters.climate);
}
