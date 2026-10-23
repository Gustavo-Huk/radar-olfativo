import { test } from 'node:test';
import assert from 'node:assert/strict';
import { hasFilters, parseFilters, serializeFilters, toggleQuickFilter } from './filter-query';

test('URL preserva filtros repetidos e texto com acentos em ida e volta', () => {
  const filters = parseFilters({ q: ' chá & figo ', accord: ['fresco', 'frutado', 'fresco'], note: ['figo', 'pera'], exclude: 'baunilha', climate: 'calor' });
  const query: Record<string, string[]> = {};
  new URLSearchParams(serializeFilters(filters)).forEach((value, key) => (query[key] ??= []).push(value));
  assert.deepEqual(parseFilters(query), filters);
});

test('atalho alterna apenas o critério escolhido e não modifica os filtros de origem', () => {
  const original = parseFilters({ accord: ['fresco', 'frutado'], note: 'figo', occasion: 'escritorio' });
  const changed = toggleQuickFilter(original, 'accord', 'fresco');
  assert.deepEqual(changed.accords, ['frutado']);
  assert.deepEqual(changed.notes, ['figo']);
  assert.equal(changed.occasion, 'escritorio');
  assert.deepEqual(original.accords, ['fresco', 'frutado']);
  assert.equal(toggleQuickFilter(original, 'occasion', 'escritorio').occasion, '');
  assert.equal(toggleQuickFilter(original, 'occasion', 'academia').occasion, 'academia');
});

test('parâmetros desconhecidos não são propagados e vazios não ativam filtros', () => {
  const filters = parseFilters({ q: ' ', note: ['', '  '], tracking: 'ignorar', page: '99' });
  assert.equal(hasFilters(filters), false);
  assert.equal(serializeFilters(filters), '');
});
