import Link from 'next/link';
import { notFound } from 'next/navigation';
import { accordName, brandName, climateLabels, getPerfume, noteName, occasionLabels, perfumes, sources } from '@/data/catalog';
import { Bottle } from '@/components/bottle';
import { PerfumeCard } from '@/components/perfume-card';

export function generateStaticParams() { return perfumes.map(p => ({ slug: p.slug })); }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const p = getPerfume((await params).slug);
  return { title: p ? `${p.name.value} (fictício)` : 'Perfume não encontrado' };
}
export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const p = getPerfume((await params).slug);
  if (!p) notFound();
  const path = p.category.value === 'original' ? '/originais' : '/inspirados';
  return <div className="shell detail-page"><p className="breadcrumb"><Link href="/">Início</Link> / <Link href={path}>{p.category.value === 'original' ? 'Originais' : 'Contratipos'}</Link> / {p.name.value}</p>
    <div className="detail-hero"><div className="detail-art"><Bottle color={p.color} name={p.name.value} large /><span className="demo-tag">Fragrância fictícia</span></div><div className="detail-copy"><p className="eyebrow">{brandName(p.brandId)}</p><h1>{p.name.value}</h1><p className="detail-family">{p.family?.value ?? 'Família não informada'} · {p.category.value === 'original' ? 'Original' : 'Inspirado'}</p><p className="detail-description">{p.description?.value ?? 'Descrição ainda não disponível.'}</p><div className="card-accords detail-accords">{p.accords?.value.map(a => <span key={a}>{accordName(a)}</span>)}</div>
      {p.inspiration && <div className="inspiration-box"><span className="eyebrow">REFERÊNCIA FICTÍCIA</span><p>{p.inspiration.value.name}</p><small>Uma relação de inspiração não comprova semelhança de aroma.</small></div>}
      <div className="data-notice"><strong>Um estudo, por enquanto.</strong><p>Nome, marca, notas e sugestões foram criados para testar a experiência. Este perfume não está à venda.</p></div>
    </div></div>
    <div className="detail-sections"><section><p className="eyebrow">A COMPOSIÇÃO EM CAMADAS</p><h2>Pirâmide olfativa</h2><p className="section-note">Notas simuladas. Notas compartilhadas não garantem aromas semelhantes.</p><div className="pyramid">{([['top', '01', 'Topo', 'A primeira impressão'], ['heart', '02', 'Coração', 'O centro da composição'], ['base', '03', 'Fundo', 'A base do perfil']] as const).map(([key, num, title, subtitle]) => <div className="pyramid-row" key={key}><span>{num}</span><div><h3>{title}</h3><small>{subtitle}</small></div><p>{p.notes?.[key]?.value.map(noteName).join(' · ') || 'Não informado'}</p></div>)}</div></section>
      <section><p className="eyebrow">POSSIBILIDADES DE USO</p><h2>Em que momento?</h2><p className="section-note">Classificações editoriais simuladas, sem validação por uso.</p><h3 className="mini-heading">Ocasiões</h3><div className="tag-list">{p.occasions?.value.map(o => <span key={o}>{occasionLabels[o]}</span>) ?? 'Não informado'}</div><h3 className="mini-heading">Clima</h3><div className="tag-list">{p.climates?.value.map(c => <span key={c}>{climateLabels[c]}</span>) ?? 'Não informado'}</div><p className="unknown-data">Preço, intensidade, fixação e avaliações: não informados.</p></section>
    </div>
    <section className="source-panel"><div><p className="eyebrow">TRANSPARÊNCIA PRIMEIRO</p><h2>De onde vêm os dados?</h2></div><div>{sources.filter(s => s.id === 'demo').map(s => <div key={s.id}><strong>{s.label}</strong><p>Natureza: demonstração · Registro: {s.checkedAt.split('-').reverse().join('/')}</p></div>)}<Link href="/sobre" className="text-link">Entenda nossa metodologia ↗</Link></div></section>
    <section className="section-space"><div className="section-heading"><h2>Continue explorando</h2><Link href={path} className="text-link">Voltar ao catálogo ↗</Link></div><p className="section-note">Outros estudos do catálogo. Esta seleção não representa recomendação de similaridade.</p><div className="perfume-grid">{perfumes.filter(x => x.category.value === p.category.value && x.id !== p.id).map(x => <PerfumeCard key={x.id} perfume={x} />)}</div></section>
  </div>;
}
