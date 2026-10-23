import Link from 'next/link';
import { accordName, brands, occasionLabels, perfumes } from '@/data/catalog';
import { filterPerfumes } from '@/lib/filters';
import { hasFilters, parseFilters, serializeFilters, toggleQuickFilter, type Query } from '@/lib/filter-query';
import type { Category } from '@/types/perfume';
import { CatalogFilters } from './catalog-filters';
import { CatalogActiveFilters } from './catalog-active-filters';
import { PerfumeCard } from './perfume-card';

export function Catalog({ category, query }: { category: Category; query: Query }) {
  const f = parseFilters(query);
  const path = category === 'original' ? '/originais' : '/inspirados';
  const result = filterPerfumes(perfumes, f, category, brands);
  const categoryItems = perfumes.filter(p => p.category.value === category);
  const brandIds = new Set(categoryItems.map(p => p.brandId));
  const availableBrands = brands.filter(b => brandIds.has(b.id));
  const families = [...new Set(categoryItems.flatMap(p => p.family ? [p.family.value] : []))];

  const quickLink = (key: 'accord' | 'occasion', value: string) => {
    const search = serializeFilters(toggleQuickFilter(f, key, value));
    return search ? `${path}?${search}` : path;
  };

  return (
    <div className="shell catalog-page">
      <p className="breadcrumb"><Link href="/">Início</Link> / Explorar</p>
      <div className="catalog-heading">
        <div>
          <p className="eyebrow">
            {category === 'original' ? 'CRIAÇÕES COM IDENTIDADE PRÓPRIA' : 'REFERÊNCIAS, NOVAS INTERPRETAÇÕES'}
          </p>
          <h1>{category === 'original' ? 'Originais brasileiros' : 'Contratipos brasileiros'}<span>.</span></h1>
          <p>
            {category === 'original'
              ? 'Descubra por perfil, notas e momento de uso.'
              : 'Explore por inspiração e pelas características divulgadas.'}
          </p>
        </div>
        <span className="catalog-count">
          {String(categoryItems.length).padStart(2, '0')}<small>ESTUDOS FICTÍCIOS</small>
        </span>
      </div>
      <div className="catalog-tabs">
        <Link href="/originais" aria-current={category === 'original' ? 'page' : undefined}>Originais brasileiros</Link>
        <Link href="/inspirados" aria-current={category === 'inspired' ? 'page' : undefined}>Contratipos brasileiros</Link>
      </div>
      <div className="quick-filters">
        <span>Explore por</span>
        {Object.entries(occasionLabels).map(([id, label]) => (
          <Link key={id} href={quickLink('occasion', id)}
            className={`chip ${f.occasion === id ? 'selected' : ''}`}
            aria-current={f.occasion === id ? 'true' : undefined}>
            {label}
          </Link>
        ))}
        {['fresco', 'frutado', 'amadeirado'].map(id => (
          <Link key={id} href={quickLink('accord', id)}
            className={`chip ${f.accords.includes(id) ? 'selected' : ''}`}
            aria-current={f.accords.includes(id) ? 'true' : undefined}>
            {accordName(id)}{f.accords.includes(id) ? ' ×' : ''}
          </Link>
        ))}
      </div>
      <div className="catalog-layout">
        <CatalogFilters f={f} category={category} path={path} brands={availableBrands} families={families} />
        <div className="catalog-results">
          <div className="results-heading">
            <p><strong>{result.length}</strong> {result.length === 1 ? 'perfume encontrado' : 'perfumes encontrados'}</p>
            <span>Catálogo demonstrativo</span>
          </div>
          {hasFilters(f) && <CatalogActiveFilters f={f} path={path} />}
          {result.length ? (
            <div className="perfume-grid catalog-grid">
              {result.map(p => <PerfumeCard key={p.id} perfume={p} />)}
            </div>
          ) : (
            <div className="empty-state">
              <span aria-hidden="true">⌕</span>
              <h2>Uma combinação ainda não explorada.</h2>
              <p>Não encontramos perfumes com todos esses critérios. Tente remover um filtro.</p>
              <Link href={path} className="button button-dark">Limpar filtros</Link>
            </div>
          )}
          <p className="catalog-footnote">
            As sugestões de ocasião e clima são simulações editoriais. Não representam avaliações de
            produtos reais. Preços e notas externas ainda não foram incorporados.
          </p>
        </div>
      </div>
    </div>
  );
}
