import Link from 'next/link';
import { accordName, brandName, noteName } from '@/data/catalog';
import { occasionLabels, climateLabels } from '@/data/taxonomy';
import type { Filters } from '@/types/filters';

const occasionNames = new Map(Object.entries(occasionLabels));
const climateNames = new Map(Object.entries(climateLabels));

export function CatalogActiveFilters({ f, path }: { f: Filters; path: string }) {
  const labels = [
    ...(f.q ? [`Busca: ${f.q}`] : []),
    ...(f.brand ? [brandName(f.brand)] : []),
    ...(f.family ? [f.family] : []),
    ...(f.occasion ? [occasionNames.get(f.occasion) ?? f.occasion] : []),
    ...(f.climate ? [climateNames.get(f.climate) ?? f.climate] : []),
    ...f.accords.map(accordName),
    ...f.notes.map(n => `Com ${noteName(n)}`),
    ...f.exclude.map(n => `Evitar ${noteName(n)}`),
  ];

  return (
    <div className="active-filters">
      <span>Filtros aplicados</span>
      {labels.map((label, index) => <span key={`${index}-${label}`}>{label}</span>)}
      <Link href={path}>Limpar ×</Link>
    </div>
  );
}
