import { test } from 'node:test';
import assert from 'node:assert/strict';
import { catalog } from '../data/catalog';
import { validateCatalog } from './catalog-validation';

test('catálogo atual passa e lista vazia representa ausência de registros', () => {
  assert.deepEqual(validateCatalog(catalog), []);
  assert.deepEqual(validateCatalog({ perfumes: [], brands: [], notes: [], accords: [], sources: [] }), []);
});

test('IDs e slugs duplicados são recusados antes de construir índices', () => {
  const copy = structuredClone(catalog);
  copy.perfumes.push(copy.perfumes[0]);
  const errors = validateCatalog(copy);
  assert(errors.some(e => e.includes('ID vazio ou duplicado')));
  assert(errors.some(e => e.includes('slug inválido ou duplicado')));
});

test('referências quebradas de marca, nota e procedência são identificadas', () => {
  const copy = structuredClone(catalog);
  copy.perfumes[0].brandId = 'marca-inexistente';
  copy.perfumes[0].name.sourceIds = ['fonte-inexistente'];
  copy.perfumes[0].notes!.top!.value = ['nota-inexistente'];
  const errors = validateCatalog(copy);
  assert(errors.some(e => e.includes('marca inexistente')));
  assert(errors.some(e => e.includes('atributo sem fonte válida')));
  assert(errors.some(e => e.includes('nota inexistente')));
});

test('demonstração não pode ser promovida a produto verificado apenas pelo rótulo', () => {
  const copy = structuredClone(catalog);
  copy.perfumes[0].dataset = 'verified';
  assert(validateCatalog(copy).some(e => e.includes('produto verificado contém demonstração')));
});

test('datas inexistentes e protocolos executáveis de fontes são recusados', () => {
  const copy = structuredClone(catalog);
  copy.sources[0].checkedAt = '2026-02-30';
  copy.sources[0].url = 'javascript:alert(1)';
  const errors = validateCatalog(copy);
  assert(errors.some(e => e.includes('data de conferência inválida')));
  assert(errors.some(e => e.includes('URL de fonte ausente ou inválida')));
});

test('campos opcionais ausentes permanecem válidos e não viram dados inventados', () => {
  const copy = structuredClone(catalog);
  copy.perfumes[0].notes = undefined;
  copy.perfumes[0].occasions = undefined;
  copy.perfumes[0].climates = undefined;
  copy.perfumes[0].price = undefined;
  copy.perfumes[4].inspiration = undefined;
  assert.deepEqual(validateCatalog(copy), []);
});

test('preço sem volume válido e avaliação fora da escala são recusados', () => {
  const copy = structuredClone(catalog);
  copy.perfumes[0].price = { nature: 'demonstration', sourceIds: ['demo'], value: { amount: 100, volumeMl: 0, currency: 'BRL', observedAt: '2026-10-23' } };
  copy.perfumes[0].ratings = [{ provider: 'Teste', score: 8, scale: 5, votes: 10, sourceId: 'demo', redistribution: 'authorized' }];
  const errors = validateCatalog(copy);
  assert(errors.some(e => e.includes('preço, volume ou data inválidos')));
  assert(errors.some(e => e.includes('avaliação inválida')));
});
