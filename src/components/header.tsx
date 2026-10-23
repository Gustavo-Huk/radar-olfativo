'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  return <header className="site-header"><div className="shell header-inner">
    <Link href="/" className="wordmark" onClick={() => setOpen(false)} aria-label="Radar Olfativo, início"><span className="logo-symbol">◉</span><span>radar <em>olfativo</em><small>DESCOBERTAS BRASILEIRAS</small></span></Link>
    <button type="button" className="menu-toggle" aria-expanded={open} aria-controls="main-nav" onClick={() => setOpen(!open)}>{open ? 'Fechar ×' : 'Menu ☰'}</button>
    <nav id="main-nav" aria-label="Navegação principal" className={open ? 'nav-open' : ''}>
      {[['/originais', 'Originais brasileiros'], ['/inspirados', 'Contratipos'], ['/sobre', 'Sobre a curadoria']].map(([href, label]) => <Link key={href} href={href} onClick={() => setOpen(false)} aria-current={pathname === href ? 'page' : undefined}>{label}</Link>)}
      <Link href="/originais" className="nav-cta" onClick={() => setOpen(false)}>Explorar perfumes <span aria-hidden="true">↗</span></Link>
    </nav>
  </div></header>;
}
