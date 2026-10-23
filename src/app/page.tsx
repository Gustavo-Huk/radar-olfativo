import Link from 'next/link';
import { Bottle } from '@/components/bottle';
import { PerfumeCard } from '@/components/perfume-card';
import { perfumes } from '@/data/catalog';

export default function Home() {
  return <>
    <section className="shell hero">
      <div className="hero-copy"><p className="eyebrow"><span /> PERFUMARIA BRASILEIRA, NOVAS POSSIBILIDADES</p>
        <h1>Seu próximo perfume<br />começa com uma<br /><em>boa descoberta.</em></h1>
        <p className="hero-description">Explore originais e contratipos brasileiros a partir do que faz sentido para você. Um aroma, uma ocasião, um novo favorito.</p>
        <form action="/originais" className="hero-search"><label htmlFor="home-search" className="sr-only">Buscar nos originais por perfume ou marca</label><span aria-hidden="true">⌕</span><input id="home-search" name="q" placeholder="Um nome, uma marca, uma descoberta…" /><button type="submit" aria-label="Buscar originais">↗</button></form>
        <p className="search-hint">Busca em originais. <Link href="/inspirados">Procurando uma inspiração? ↗</Link></p>
      </div>
      <div className="hero-art"><span className="art-kicker">CADERNO DE DESCOBERTAS / Nº 01</span><Bottle color="#84774e" name="Figo da Manhã" large /><div className="hero-art-note"><span>01 / UM NOVO REPERTÓRIO</span><p>Notas verdes.<br />Possibilidades abertas.</p></div><span className="vertical-caption">ESTUDOS DE UM BRASIL OLFATIVO</span></div>
    </section>
    <section className="occasion-strip"><div className="shell occasion-inner"><p>O que combina<br /><strong>com o seu momento?</strong></p><div className="occasion-links">{[['academia', '↗', 'Academia'], ['escritorio', '▤', 'Escritório'], ['encontros', '✧', 'Encontros'], ['dia-a-dia', '☼', 'Dia a dia']].map(([id, icon, label]) => <Link key={id} href={`/originais?occasion=${id}`}><span aria-hidden="true">{icon}</span>{label}</Link>)}</div></div></section>
    <section className="shell section-space"><div className="section-heading"><div><p className="eyebrow">DOIS CAMINHOS, MUITAS DESCOBERTAS</p><h2>Por onde você quer começar?</h2></div><p>Do autoral à inspiração.<br />A mesma atenção em cada detalhe.</p></div>
      <div className="path-grid"><Link href="/originais" className="path-card path-original"><span className="path-index">01 / CRIAÇÕES AUTORAIS</span><h3>Identidade<br /><em>brasileira.</em></h3><p>Explore fragrâncias de criação original<br />e amplie seu repertório.</p><span className="path-link">Conhecer originais <span>↗</span></span><div className="botanical-mark" aria-hidden="true">✳</div></Link>
      <Link href="/inspirados" className="path-card path-inspired"><span className="path-index">02 / NOVAS INTERPRETAÇÕES</span><h3>Uma referência.<br /><em>Outro caminho.</em></h3><p>Encontre contratipos pela inspiração<br />e pelas notas declaradas.</p><span className="path-link">Explorar contratipos <span>↗</span></span><div className="path-rings" aria-hidden="true" /></Link></div>
    </section>
    <section className="shell section-space preview-section"><div className="section-heading"><div><p className="eyebrow">UM PRIMEIRO PASSEIO</p><h2>Perfis para explorar</h2></div><Link href="/originais" className="text-link">Ver catálogo de originais ↗</Link></div><p className="section-note">Seleção demonstrativa. Todos os produtos abaixo são fictícios.</p><div className="perfume-grid">{perfumes.slice(0, 4).map(p => <PerfumeCard key={p.id} perfume={p} />)}</div></section>
    <section className="shell future-panel"><div><p className="eyebrow">O PRÓXIMO CAPÍTULO</p><h2>Menos tentativa.<br /><em>Mais intenção.</em></h2></div><div><p>Estamos construindo recomendações por ocasião e uma coleção pessoal para descobrir o que combina com você — e o que pode ampliar suas opções.</p><span className="status-label">Recomendador e coleção · próximas entregas</span><Link href="/sobre" className="text-link">Conheça a proposta ↗</Link></div></section>
  </>;
}
