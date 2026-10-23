import { test } from 'node:test';
import assert from 'node:assert/strict';
import { perfumes } from '../data/catalog';
import { filterPerfumes, parseFilters } from './filters';

test('combina categoria, perfil, clima e nota sem perder parâmetros repetidos', () => {
  const f = parseFilters({ accord: ['fresco', 'frutado'], climate: 'calor', note: 'figo' });
  assert.deepEqual(filterPerfumes(perfumes, f, 'original').map(p => p.id), ['figo-da-manha']);
});
test('busca ignora acentos e inclui a inspiração', () => {
  assert.equal(filterPerfumes(perfumes, parseFilters({ q: 'ambar' }))[0].id, 'ambar-03');
  assert.equal(filterPerfumes(perfumes, parseFilters({ q: 'ceu aberto' }))[0].id, 'horizonte-01');
});
test('excluir nota não transforma dado ausente em ausência confirmada', () => {
  const incomplete = { ...perfumes[0], notes: undefined };
  assert.equal(filterPerfumes([incomplete], parseFilters({ exclude: 'baunilha' })).length, 0);
  assert.equal(filterPerfumes([incomplete], parseFilters({})).length, 1);
  assert.equal(filterPerfumes(perfumes, parseFilters({ exclude: 'baunilha', q: 'jardim' }), 'original').length, 0);
});
test('filtros incompatíveis retornam vazio e limpeza recupera catálogo', () => {
  assert.equal(filterPerfumes(perfumes, parseFilters({ note: 'figo', exclude: 'figo' })).length, 0);
  assert.equal(filterPerfumes(perfumes, parseFilters({})).length, 8);
});
test('referências de procedência e notas de todos os registros são válidas', async () => {
  const { sources, notes, brands, accords } = await import('../data/catalog');
  const sourceIds = new Set(sources.map(s => s.id));
  for (const p of perfumes) {
    assert(brands.some(b => b.id === p.brandId));
    assert(allClaims(p).every(c => c.sourceIds.length && c.sourceIds.every(id => sourceIds.has(id))));
    assert([...p.notes!.top!.value, ...p.notes!.heart!.value, ...p.notes!.base!.value].every(n => notes.some(x => x.id === n)));
    assert(p.accords!.value.every(a => accords.some(x => x.id === a)));
    assert.equal(p.dataset, 'demo');
    assert.equal(p.price, undefined);
  }
});
function allClaims(value: unknown): { sourceIds: string[] }[] {
  if (!value || typeof value !== 'object') return [];
  if ('sourceIds' in value) return [value as { sourceIds: string[] }];
  return Object.values(value).flatMap(allClaims);
}
