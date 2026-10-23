import Link from 'next/link';
import { accords, climateLabels, notes, occasionLabels } from '@/data/taxonomy';
import { serializeFilters } from '@/lib/filter-query';
import type { Filters } from '@/types/filters';
import type { Brand, Category } from '@/types/perfume';

interface Props {
  f: Filters;
  category: Category;
  path: string;
  brands: readonly Brand[];
  families: string[];
}

export function CatalogFilters({ f, category, path, brands, families }: Props) {
  return (
    <aside className="filter-sidebar">
      <details open>
        <summary>Refinar descoberta <span>⌄</span></summary>
        <form action={path} className="filter-form" key={serializeFilters(f)}>
          <label>
            Buscar nome, marca{category === 'inspired' ? ' ou inspiração' : ''}
            <input type="search" name="q" defaultValue={f.q}
              placeholder={category === 'inspired' ? 'Ex.: Céu Aberto' : 'Ex.: Figo da Manhã'} />
          </label>
          <label>
            Marca
            <select name="brand" defaultValue={f.brand}>
              <option value="">Todas as marcas</option>
              {brands.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
            </select>
          </label>
          <label>
            Família olfativa
            <select name="family" defaultValue={f.family}>
              <option value="">Todas as famílias</option>
              {families.map(x => <option key={x}>{x}</option>)}
            </select>
          </label>
          <label>
            Ocasião
            <select name="occasion" defaultValue={f.occasion}>
              <option value="">Qualquer ocasião</option>
              {Object.entries(occasionLabels).map(([id, label]) => <option key={id} value={id}>{label}</option>)}
            </select>
          </label>
          <label>
            Clima
            <select name="climate" defaultValue={f.climate}>
              <option value="">Qualquer clima</option>
              {Object.entries(climateLabels).map(([id, label]) => <option key={id} value={id}>{label}</option>)}
            </select>
          </label>
          <fieldset>
            <legend>Acordes desejados</legend>
            {accords.map(a => (
              <label className="checkbox-label" key={a.id}>
                <input type="checkbox" name="accord" value={a.id} defaultChecked={f.accords.includes(a.id)} />
                {a.name}
              </label>
            ))}
          </fieldset>
          <details className="note-filters" open={f.notes.length > 0 || f.exclude.length > 0}>
            <summary>Incluir ou excluir notas</summary>
            <p className="filter-help">
              A inclusão exige todas as notas marcadas. A exclusão considera apenas listas divulgadas
              completas; não indica ausência de substâncias ou alérgenos.
            </p>
            <fieldset>
              <legend>Quero estas notas</legend>
              {notes.map(n => (
                <label className="checkbox-label" key={n.id}>
                  <input type="checkbox" name="note" value={n.id} defaultChecked={f.notes.includes(n.id)} />
                  {n.name}
                </label>
              ))}
            </fieldset>
            <fieldset>
              <legend>Evitar estas notas</legend>
              {notes.map(n => (
                <label className="checkbox-label" key={n.id}>
                  <input type="checkbox" name="exclude" value={n.id} defaultChecked={f.exclude.includes(n.id)} />
                  {n.name}
                </label>
              ))}
            </fieldset>
          </details>
          <button className="button button-dark" type="submit">Aplicar filtros ↗</button>
          <Link href={path} className="clear-link">Limpar filtros</Link>
        </form>
      </details>
    </aside>
  );
}
