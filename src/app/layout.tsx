import type { Metadata } from 'next';
import Link from 'next/link';
import { Header } from '@/components/header';
import './globals.css';

export const metadata: Metadata = {
  title: { default: 'Radar Olfativo — descobertas brasileiras', template: '%s · Radar Olfativo' },
  description: 'Explore perfis, notas e ocasiões. Protótipo de descoberta de perfumes brasileiros com catálogo fictício identificado.',
  robots: { index: false, follow: false },
};
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="pt-BR"><body>
    <a href="#conteudo" className="skip-link">Pular para o conteúdo</a>
    <div className="demo-banner">PROTÓTIPO EM DESENVOLVIMENTO <span>·</span> Produtos, marcas e atributos deste catálogo são fictícios. <Link href="/sobre">Entenda os dados ↗</Link></div>
    <Header />
    <main id="conteudo">{children}</main>
    <footer className="site-footer shell"><div><span className="footer-logo">radar <em>olfativo</em></span><p>Um novo olhar para a perfumaria brasileira.</p></div><div><Link href="/sobre">Dados e metodologia ↗</Link><p>Protótipo local · outubro de 2026</p></div></footer>
  </body></html>;
}
