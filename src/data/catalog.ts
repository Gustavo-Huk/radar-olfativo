import type { Accord, Brand, Claim, Climate, Note, Occasion, Perfume, Source } from '../types/perfume';

export const sources: Source[] = [{
  id: 'demo', label: 'Dados fictícios criados para testar o protótipo',
  kind: 'demo', checkedAt: '2026-10-23',
}];

// Marcas, produtos, inspirações e atributos são inteiramente fictícios.
export const brands: Brand[] = [
  { id: 'casa-aurora', name: 'Casa Aurora (fictícia)', country: 'BR' },
  { id: 'atelie-brisa', name: 'Ateliê Brisa (fictício)', country: 'BR' },
];
export const notes: Note[] = [
  ['bergamota', 'Bergamota'], ['limao', 'Limão'], ['figo', 'Figo'],
  ['pera', 'Pera'], ['cha-verde', 'Chá verde'], ['lavanda', 'Lavanda'],
  ['jasmim', 'Jasmim'], ['cedro', 'Cedro'], ['sandalo', 'Sândalo'],
  ['almiscar', 'Almíscar'], ['baunilha', 'Baunilha'], ['ambar', 'Âmbar'],
  ['cardamomo', 'Cardamomo'], ['vetiver', 'Vetiver'], ['rosa', 'Rosa'],
].map(([id, name]) => ({ id, name }));
export const accords: Accord[] = [
  ['fresco', 'Fresco'], ['frutado', 'Frutado'], ['amadeirado', 'Amadeirado'],
  ['doce', 'Doce'], ['floral', 'Floral'], ['aromatico', 'Aromático'],
].map(([id, name]) => ({ id, name }));
export const occasionLabels: Record<Occasion, string> = {
  'dia-a-dia': 'Dia a dia', escritorio: 'Escritório', academia: 'Academia', encontros: 'Encontros',
};
export const climateLabels: Record<Climate, string> = { calor: 'Calor', ameno: 'Clima ameno', frio: 'Frio' };
const demo = <T>(value: T): Claim<T> => ({ value, sourceIds: ['demo'], nature: 'demonstration' });

type Seed = {
  slug: string; name: string; category: 'original' | 'inspired'; color: string;
  description: string; family: string; accords: string[]; top: string[]; heart: string[]; base: string[];
  occasions: Occasion[]; climates: Climate[]; inspiration?: string;
};
const seeds: Seed[] = [
  { slug: 'figo-da-manha', name: 'Figo da Manhã', category: 'original', color: '#68745b',
    description: 'Um exercício de frescor verde com frutas e madeiras suaves.', family: 'Frutado amadeirado',
    accords: ['fresco', 'frutado', 'amadeirado'], top: ['bergamota', 'figo'], heart: ['cha-verde'], base: ['cedro', 'almiscar'],
    occasions: ['dia-a-dia', 'escritorio'], climates: ['calor', 'ameno'] },
  { slug: 'agua-de-lima', name: 'Água de Lima', category: 'original', color: '#b4a368',
    description: 'Cítricos luminosos e um coração aromático, imaginados para dias leves.', family: 'Cítrico aromático',
    accords: ['fresco', 'aromatico'], top: ['limao', 'bergamota'], heart: ['lavanda'], base: ['vetiver'],
    occasions: ['academia', 'dia-a-dia'], climates: ['calor'] },
  { slug: 'madeira-serena', name: 'Madeira Serena', category: 'original', color: '#99684b',
    description: 'Madeiras cremosas com especiarias e um fundo acolhedor.', family: 'Amadeirado especiado',
    accords: ['amadeirado', 'aromatico'], top: ['cardamomo'], heart: ['cedro'], base: ['sandalo', 'ambar'],
    occasions: ['escritorio', 'encontros'], climates: ['ameno', 'frio'] },
  { slug: 'jardim-tardio', name: 'Jardim Tardio', category: 'original', color: '#ac7770',
    description: 'Flores e pera em uma composição delicadamente adocicada.', family: 'Floral frutado',
    accords: ['floral', 'frutado', 'doce'], top: ['pera'], heart: ['jasmim', 'rosa'], base: ['almiscar', 'baunilha'],
    occasions: ['encontros', 'dia-a-dia'], climates: ['ameno'] },
  { slug: 'horizonte-01', name: 'Horizonte 01', category: 'inspired', color: '#687c80',
    description: 'Um estudo de cítricos e lavanda sobre madeiras secas.', family: 'Aromático amadeirado',
    accords: ['fresco', 'aromatico', 'amadeirado'], top: ['bergamota'], heart: ['lavanda'], base: ['cedro', 'vetiver'],
    occasions: ['escritorio', 'dia-a-dia'], climates: ['calor', 'ameno'], inspiration: 'Céu Aberto — referência fictícia' },
  { slug: 'pomar-02', name: 'Pomar 02', category: 'inspired', color: '#b38955',
    description: 'Frutas verdes e chá, com uma base discreta de almíscar.', family: 'Frutado fresco',
    accords: ['frutado', 'fresco'], top: ['pera', 'figo'], heart: ['cha-verde'], base: ['almiscar'],
    occasions: ['academia', 'dia-a-dia'], climates: ['calor'], inspiration: 'Pomar Verde — referência fictícia' },
  { slug: 'ambar-03', name: 'Âmbar 03', category: 'inspired', color: '#895340',
    description: 'Baunilha, âmbar e cardamomo em um perfil quente e doce.', family: 'Ambarado',
    accords: ['doce', 'amadeirado'], top: ['cardamomo'], heart: ['sandalo'], base: ['ambar', 'baunilha'],
    occasions: ['encontros'], climates: ['frio'], inspiration: 'Noite Dourada — referência fictícia' },
  { slug: 'petala-04', name: 'Pétala 04', category: 'inspired', color: '#a38683',
    description: 'Rosas e jasmim com um toque cítrico na abertura.', family: 'Floral',
    accords: ['floral', 'fresco'], top: ['bergamota'], heart: ['rosa', 'jasmim'], base: ['almiscar'],
    occasions: ['escritorio', 'encontros'], climates: ['ameno'], inspiration: 'Jardim de Seda — referência fictícia' },
];

export const perfumes: Perfume[] = seeds.map(s => ({
  id: s.slug, slug: s.slug, name: demo(s.name), brandId: s.category === 'original' ? 'casa-aurora' : 'atelie-brisa',
  category: demo(s.category), description: demo(s.description), family: demo(s.family), accords: demo(s.accords),
  notes: { top: demo(s.top), heart: demo(s.heart), base: demo(s.base), complete: true },
  occasions: demo(s.occasions), climates: demo(s.climates),
  inspiration: s.inspiration ? demo({ name: s.inspiration, brand: 'Maison Imaginária (fictícia)', relationship: 'demo' as const }) : undefined,
  ratings: [], dataset: 'demo', color: s.color,
}));

export const brandName = (id: string) => brands.find(b => b.id === id)?.name ?? 'Marca não informada';
export const noteName = (id: string) => notes.find(n => n.id === id)?.name ?? id;
export const accordName = (id: string) => accords.find(a => a.id === id)?.name ?? id;
export const getPerfume = (slug: string) => perfumes.find(p => p.slug === slug);
