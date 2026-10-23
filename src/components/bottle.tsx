export function Bottle({ color, name, large = false }: { color: string; name: string; large?: boolean }) {
  return <div className={`bottle-scene ${large ? 'bottle-large' : ''}`} style={{ '--bottle-color': color } as React.CSSProperties} aria-hidden="true">
    <div className="bottle-orbit" /><div className="bottle-shadow" />
    <div className="bottle"><div className="bottle-cap" /><div className="bottle-neck" /><div className="bottle-glass"><div className="bottle-label"><span>ESTUDO OLFATIVO</span><strong>{name}</strong><small>RADAR · DEMONSTRAÇÃO</small></div></div></div>
    <span className="scene-caption">Ilustração conceitual</span>
  </div>;
}
