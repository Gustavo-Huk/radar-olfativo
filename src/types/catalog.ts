import type { Accord, Brand, Note, Perfume, Source } from './perfume';

/** Snapshot de domínio: pode ser montado por um arquivo local ou por uma futura consulta. */
export interface CatalogData {
  perfumes: readonly Perfume[];
  brands: readonly Brand[];
  notes: readonly Note[];
  accords: readonly Accord[];
  sources: readonly Source[];
}
