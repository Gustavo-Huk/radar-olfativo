import Link from 'next/link';
import type { Perfume } from '@/types/perfume';
import { accordName, brandName } from '@/data/catalog';
import { Bottle } from './bottle';

export function PerfumeCard({ perfume: p }: { perfume: Perfume }) {
  return <article className="perfume-card">
    <Link href={`/perfumes/${p.slug}`} className="card-art" aria-label={`Conhecer ${p.name.value}`}><Bottle color={p.color} name={p.name.value} /><span className="demo-tag">Fictício</span><span className="art-arrow">↗</span></Link>
    <div className="card-meta"><span>{p.category.value === 'original' ? 'Criação original' : 'Inspirado'}</span><span>DEMO</span></div>
    <h3><Link href={`/perfumes/${p.slug}`}>{p.name.value}</Link></h3>
    <p className="brand-name">{brandName(p.brandId)}</p>
    <div className="card-accords">{p.accords?.value.map(a => <span key={a}>{accordName(a)}</span>)}</div>
    {p.inspiration && <p className="inspiration-line">Referência: {p.inspiration.value.name}</p>}
  </article>;
}
