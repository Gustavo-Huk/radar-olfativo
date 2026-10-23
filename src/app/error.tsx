'use client';
export default function ErrorPage({ reset }: { reset: () => void }) {
  return <div className="shell empty-state"><h1>Não foi possível carregar esta descoberta.</h1><p>Tente novamente em instantes.</p><button className="button button-dark" onClick={reset}>Tentar novamente</button></div>;
}
