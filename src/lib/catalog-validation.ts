import type { CatalogData } from '../types/catalog';
import type { Claim } from '../types/perfume';

/** Valida relações de um catálogo já tipado. Não substitui parsing de payloads externos desconhecidos. */
export function validateCatalog(data: CatalogData): string[] {
  const errors: string[] = [];
  function ids(label: string, values: readonly { id: string }[]) {
    const result = new Set<string>();
    for (const item of values) {
      if (!item.id.trim() || result.has(item.id)) errors.push(`${label}: ID vazio ou duplicado (${item.id})`);
      result.add(item.id);
    }
    return result;
  }
  ids('perfumes', data.perfumes);
  const brands = ids('marcas', data.brands);
  const notes = ids('notas', data.notes);
  const accords = ids('acordes', data.accords);
  const sources = ids('fontes', data.sources);
  const sourceMap = new Map(data.sources.map(s => [s.id, s]));
  const slugs = new Set<string>();
  const dateIsValid = (value: string) => /^\d{4}-\d{2}-\d{2}$/.test(value) &&
    Number.isFinite(Date.parse(value)) && new Date(value).toISOString().slice(0, 10) === value;
  const isWebUrl = (value: string) => {
    try { return ['https:', 'http:'].includes(new URL(value).protocol); } catch { return false; }
  };
  for (const source of data.sources) {
    if (!dateIsValid(source.checkedAt)) errors.push(`${source.id}: data de conferência inválida`);
    if (source.url ? !isWebUrl(source.url) : source.kind === 'official' || source.kind === 'community') errors.push(`${source.id}: URL de fonte ausente ou inválida`);
  }
  for (const perfume of data.perfumes) {
    const fail = (message: string) => errors.push(`${perfume.id}: ${message}`);
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(perfume.slug) || slugs.has(perfume.slug)) fail('slug inválido ou duplicado');
    slugs.add(perfume.slug);
    if (!brands.has(perfume.brandId)) fail('marca inexistente');
    if (perfume.officialUrl && !isWebUrl(perfume.officialUrl)) fail('URL oficial inválida');
    const claims: (Claim<unknown> | undefined)[] = [
      perfume.name, perfume.category, perfume.description, perfume.family, perfume.accords,
      perfume.notes?.top, perfume.notes?.heart, perfume.notes?.base,
      perfume.occasions, perfume.climates, perfume.inspiration, perfume.price,
    ];
    for (const claim of claims) {
      if (!claim) continue;
      if (!claim.sourceIds.length || claim.sourceIds.some(id => !sources.has(id))) fail('atributo sem fonte válida');
      if (perfume.dataset === 'verified' && (claim.nature === 'demonstration' ||
        claim.sourceIds.some(id => sourceMap.get(id)?.kind === 'demo'))) fail('produto verificado contém demonstração');
    }
    for (const layer of [perfume.notes?.top, perfume.notes?.heart, perfume.notes?.base]) {
      if (layer?.value.some(id => !notes.has(id))) fail('nota inexistente');
    }
    if (perfume.accords?.value.some(id => !accords.has(id))) fail('acorde inexistente');
    if (perfume.category.value === 'original' && perfume.inspiration) fail('original com referência de inspiração');
    if (perfume.dataset === 'verified' && perfume.inspiration?.value.relationship === 'demo') fail('inspiração de demonstração em produto verificado');
    if (perfume.notes?.complete && ![perfume.notes.top, perfume.notes.heart, perfume.notes.base].some(layer => layer?.value.length)) fail('lista de notas completa sem notas cadastradas');
    if (perfume.price) {
      const price = perfume.price.value;
      if (!Number.isFinite(price.amount) || price.amount < 0 || !Number.isFinite(price.volumeMl) ||
        price.volumeMl <= 0 || !dateIsValid(price.observedAt)) fail('preço, volume ou data inválidos');
    }
    for (const rating of perfume.ratings) {
      if (!sources.has(rating.sourceId) || rating.redistribution !== 'authorized' ||
        !Number.isFinite(rating.score) || !Number.isFinite(rating.scale) || rating.scale <= 0 ||
        rating.score < 0 || rating.score > rating.scale || !Number.isInteger(rating.votes) || rating.votes < 0) fail('avaliação inválida');
    }
  }
  return errors;
}
