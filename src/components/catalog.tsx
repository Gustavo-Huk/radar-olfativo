import Link from 'next/link';
import { accordName, accords, brands, climateLabels, notes, occasionLabels, perfumes } from '@/data/catalog';
import { filterPerfumes, parseFilters, type Query } from '@/lib/filters';
import type { Category } from '@/types/perfume';
import { PerfumeCard } from './perfume-card';

export function Catalog({ category, query }: { category: Category; query: Query }) {
  const f = parseFilters(query);
  const path = category === 'original' ? '/originais' : '/inspirados';
  const result = filterPerfumes(perfumes, f, category);
  const active = Boolean(f.q || f.brand || f.family || f.accords.length || f.notes.length || f.exclude.length || f.occasion || f.climate);
  const families = [...new Set(perfumes.filter(p => p.category.value === category).flatMap(p => p.family ? [p.family.value] : []))];
  const quickLink = (key: string, value: string) => {
    const p = new URLSearchParams();
    for (const [k, v] of Object.entries(query)) for (const item of Array.isArray(v) ? v : v ? [v] : []) p.append(k, item);
    if (key === 'accord') {
      const selected = p.getAll(key);
      p.delete(key);
      for (const a of selected.includes(value) ? selected.filter(x => x !== value) : [...selected, value]) p.append(key, a);
    } else { if (p.get(key) === value) p.delete(key); else p.set(key, value); }
    return `${path}?${p.toString()}`;
  };
  return <div className="shell catalog-page">
    <p className="breadcrumb"><Link href="/">Início</Link> / Explorar</p>
    <div className="catalog-heading"><div><p className="eyebrow">{category === 'original' ? 'CRIAÇÕES COM IDENTIDADE PRÓPRIA' : 'REFERÊNCIAS, NOVAS INTERPRETAÇÕES'}</p><h1>{category === 'original' ? 'Originais brasileiros' : 'Contratipos brasileiros'}<span>.</span></h1><p>{category === 'original' ? 'Descubra por perfil, notas e momento de uso.' : 'Explore por inspiração e pelas características divulgadas.'}</p></div><span className="catalog-count">0{perfumes.filter(p => p.category.value === category).length}<small>ESTUDOS FICTÍCIOS</small></span></div>
    <div className="catalog-tabs"><Link href="/originais" aria-current={category === 'original' ? 'page' : undefined}>Originais brasileiros</Link><Link href="/inspirados" aria-current={category === 'inspired' ? 'page' : undefined}>Contratipos brasileiros</Link></div>
    <div className="quick-filters"><span>Explore por</span>{Object.entries(occasionLabels).map(([id, label]) => <Link key={id} href={quickLink('occasion', id)} className={`chip ${f.occasion === id ? 'selected' : ''}`} aria-current={f.occasion === id ? 'true' : undefined}>{label}</Link>)}{['fresco', 'frutado', 'amadeirado'].map(id => <Link key={id} href={quickLink('accord', id)} className={`chip ${f.accords.includes(id) ? 'selected' : ''}`}>{accordName(id)}{f.accords.includes(id) ? ' ×' : ''}</Link>)}</div>
    <div className="catalog-layout"><aside className="filter-sidebar"><details open><summary>Refinar descoberta <span>⌄</span></summary>
      <form action={path} className="filter-form" key={JSON.stringify(query)}>
        <label>Buscar nome, marca{category === 'inspired' ? ' ou inspiração' : ''}<input type="search" name="q" defaultValue={f.q} placeholder={category === 'inspired' ? 'Ex.: Céu Aberto' : 'Ex.: Figo da Manhã'} /></label>
        <label>Marca<select name="brand" defaultValue={f.brand}><option value="">Todas as marcas</option>{brands.filter(b => perfumes.some(p => p.brandId === b.id && p.category.value === category)).map(b => <option key={b.id} value={b.id}>{b.name}</option>)}</select></label>
        <label>Família olfativa<select name="family" defaultValue={f.family}><option value="">Todas as famílias</option>{families.map(x => <option key={x}>{x}</option>)}</select></label>
        <label>Ocasião<select name="occasion" defaultValue={f.occasion}><option value="">Qualquer ocasião</option>{Object.entries(occasionLabels).map(([id, label]) => <option key={id} value={id}>{label}</option>)}</select></label>
        <label>Clima<select name="climate" defaultValue={f.climate}><option value="">Qualquer clima</option>{Object.entries(climateLabels).map(([id, label]) => <option key={id} value={id}>{label}</option>)}</select></label>
        <fieldset><legend>Acordes desejados</legend>{accords.map(a => <label className="checkbox-label" key={a.id}><input type="checkbox" name="accord" value={a.id} defaultChecked={f.accords.includes(a.id)} />{a.name}</label>)}</fieldset>
        <details className="note-filters" open={f.notes.length > 0 || f.exclude.length > 0}><summary>Incluir ou excluir notas</summary><p className="filter-help">A inclusão exige todas as notas marcadas. A exclusão considera apenas listas divulgadas completas; não indica ausência de substâncias ou alérgenos.</p><fieldset><legend>Quero estas notas</legend>{notes.map(n => <label className="checkbox-label" key={n.id}><input type="checkbox" name="note" value={n.id} defaultChecked={f.notes.includes(n.id)} />{n.name}</label>)}</fieldset><fieldset><legend>Evitar estas notas</legend>{notes.map(n => <label className="checkbox-label" key={n.id}><input type="checkbox" name="exclude" value={n.id} defaultChecked={f.exclude.includes(n.id)} />{n.name}</label>)}</fieldset></details>
        <button className="button button-dark" type="submit">Aplicar filtros ↗</button><Link href={path} className="clear-link">Limpar filtros</Link>
      </form></details></aside>
      <div className="catalog-results"><div className="results-heading"><p><strong>{result.length}</strong> {result.length === 1 ? 'perfume encontrado' : 'perfumes encontrados'}</p><span>Catálogo demonstrativo</span></div>
        {active && <div className="active-filters"><span>Filtros aplicados</span>{f.q && <span>Busca: {f.q}</span>}{f.brand && <span>Marca selecionada</span>}{f.family && <span>{f.family}</span>}{f.occasion && <span>{occasionLabels[f.occasion as keyof typeof occasionLabels] ?? f.occasion}</span>}{f.climate && <span>{climateLabels[f.climate as keyof typeof climateLabels] ?? f.climate}</span>}{f.accords.map(a => <span key={`a-${a}`}>{accordName(a)}</span>)}{f.notes.map(n => <span key={`n-${n}`}>Com {notes.find(x => x.id === n)?.name ?? n}</span>)}{f.exclude.map(n => <span key={`e-${n}`}>Evitar {notes.find(x => x.id === n)?.name ?? n}</span>)}<Link href={path}>Limpar ×</Link></div>}
        {result.length ? <div className="perfume-grid catalog-grid">{result.map(p => <PerfumeCard key={p.id} perfume={p} />)}</div> : <div className="empty-state"><span aria-hidden="true">⌕</span><h2>Uma combinação ainda não explorada.</h2><p>Não encontramos perfumes com todos esses critérios. Tente remover um filtro. Este catálogo de teste contém apenas oito registros.</p><Link href={path} className="button button-dark">Limpar filtros</Link></div>}
        <p className="catalog-footnote">As sugestões de ocasião e clima são simulações editoriais. Não representam avaliações de produtos reais. Preços e notas externas ainda não foram incorporados.</p>
      </div>
    </div>
  </div>;
}
