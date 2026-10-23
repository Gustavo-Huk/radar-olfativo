/** Ponto de acesso ao catálogo local. As regras de domínio não importam este módulo. */
import { perfumes, brands, sources } from './demo-catalog';
import { notes, accords } from './taxonomy';
import { validateCatalog } from '../lib/catalog-validation';

export { perfumes, brands, sources, notes, accords };
export { occasionLabels, climateLabels } from './taxonomy';

export const catalog = { perfumes, brands, sources, notes, accords };
const errors = validateCatalog(catalog);
if (errors.length) throw new Error(`Catálogo inválido:\n${errors.join('\n')}`);

const brandsById = new Map(brands.map(b => [b.id, b.name]));
const notesById = new Map(notes.map(n => [n.id, n.name]));
const accordsById = new Map(accords.map(a => [a.id, a.name]));
const perfumesBySlug = new Map(perfumes.map(p => [p.slug, p]));

export const brandName = (id: string) => brandsById.get(id) ?? 'Marca não informada';
export const noteName = (id: string) => notesById.get(id) ?? id;
export const accordName = (id: string) => accordsById.get(id) ?? id;
export const getPerfume = (slug: string) => perfumesBySlug.get(slug);
