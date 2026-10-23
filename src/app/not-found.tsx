import Link from 'next/link';
export default function NotFound() { return <div className="shell empty-state"><p className="eyebrow">PÁGINA NÃO ENCONTRADA</p><h1>Este caminho ainda não tem fragrância.</h1><p>O endereço pode estar incorreto ou o perfume não faz parte do catálogo.</p><Link href="/originais" className="button button-dark">Explorar o catálogo</Link></div>; }
