import Link from 'next/link';
export const metadata = { title: 'Dados e curadoria' };
export default function About() {
  return <article className="shell prose-page"><p className="eyebrow">DADOS E CURADORIA</p><h1>Descobrir com<br /><em>mais clareza.</em></h1><p className="lead">O Radar Olfativo nasce para facilitar a descoberta de perfumes brasileiros. A confiança nas informações faz parte do produto desde o começo.</p>
    <h2>Este catálogo é uma demonstração</h2><p>Os oito perfumes, suas marcas, referências de inspiração e características são fictícios. As ilustrações são conceituais, feitas para este protótipo. Nenhum registro deve orientar uma compra real.</p>
    <h2>Três tipos de informação</h2><div className="method-grid"><div><span>01 / FACTUAL</span><h3>O que foi divulgado</h3><p>Nome, marca, notas, volume e inspiração precisam de fonte verificável e data de conferência.</p></div><div><span>02 / EDITORIAL</span><h3>Uma interpretação</h3><p>Sugestões de ocasião e clima serão identificadas como curadoria, com justificativa. Não são garantias de desempenho.</p></div><div><span>03 / COMUNIDADE</span><h3>Uma percepção coletiva</h3><p>Avaliações exigem origem, escala, número de votos, data e autorização de redistribuição. Ainda não há notas externas neste protótipo.</p></div></div>
    <h2>Notas em comum não são aromas iguais</h2><p>Uma pirâmide olfativa não informa proporções, matérias-primas e evolução na pele. O comparador mostrará notas declaradas em comum, sem porcentagens de similaridade de aroma.</p>
    <h2>Ausência de informação continua sendo desconhecida</h2><p>Não informamos preços, fixação ou projeção quando não há evidência. O filtro de exclusão de notas considera apenas listas declaradas completas. Ele não comprova ausência de substâncias e não serve como orientação para alergias.</p>
    <h2>O que vem a seguir</h2><p>Comparação entre dois perfumes; recomendador com motivos legíveis; coleção salva no navegador; pesquisa de um catálogo real com procedência. Dados externos serão incorporados somente após verificar as condições de uso.</p>
    <Link href="/originais" className="button button-dark">Explorar o protótipo ↗</Link>
  </article>;
}
