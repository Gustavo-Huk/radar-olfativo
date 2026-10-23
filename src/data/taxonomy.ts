import type { Accord, Climate, Note, Occasion } from '../types/perfume';

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
