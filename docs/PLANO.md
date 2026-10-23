# Radar Olfativo — plano de implementação

Data: 23/10/2026. Estado inicial: diretório vazio, Node 22.12.0 e npm 10.9.0 disponíveis.

## Produto e hipótese

Descoberta de perfumes brasileiros por intenção de uso, preferências e repertório pessoal. Originais e contratipos compartilham busca, ficha e regras. A categoria pertence à fragrância: uma marca pode ter produtos das duas categorias.

Hipótese a validar: pessoas encontram opções relevantes sem conhecer previamente marcas nacionais. Uma interface bonita não confirma essa hipótese. O catálogo fictício permite avaliar navegação e compreensão; utilidade das recomendações e confiança para compras exigem dados reais.

## Arquitetura

Next.js App Router, React, TypeScript estrito e Tailwind 4. Páginas e dados são renderizados no servidor; interações locais usam componentes cliente apenas quando necessário. Formulários GET mantêm filtros na URL e funcionam sem JavaScript. Catálogo local tipado; sem banco, login ou API externa. Fontes tipográficas locais do sistema nesta entrega evitam dependência de rede. Ilustrações CSS próprias substituem fotografias até haver imagens com direito de uso documentado.

- `src/app`: home, originais, inspirados, perfumes/[slug], sobre. Próximas: comparar, descobrir, minha-colecao.
- `src/components`: Header, Bottle, PerfumeCard e Catalog compartilhado.
- `src/data`: catálogo, taxonomia e fontes; sem lógica visual.
- `src/types`: contratos do domínio.
- `src/lib`: filtros; depois comparison, recommendations e storage.
- `docs`: decisões, etapas e critérios de aceite.

Dependências de execução: Next, React e React DOM. Ferramentas: TypeScript e Tailwind/PostCSS. Testes usam o runner nativo do Node após compilação; sem biblioteca de testes adicional.

## Modelo de dados

| Entidade | Contrato e finalidade |
| --- | --- |
| Perfume | ID estável, slug, marca, categoria por fragrância, dados opcionais e status demo/verified |
| Claim<T> | Valor, fontes e natureza factual/editorial/community/demonstration por atributo |
| Brand | ID, nome, país; não impõe categoria aos produtos |
| Note / Accord | Taxonomias por ID; rótulos em PT-BR |
| Source | Origem, URL quando aplicável, tipo e data de conferência |
| Inspiration | Nome/marca de referência e relação declarada/documentada/demo |
| ExternalRating | Provedor, nota, escala, votos e fonte com permissão de redistribuição |
| UserCollection | Versão de esquema, IDs possuídos e favoritos; persistência futura no navegador |

Campos ausentes significam desconhecidos. Listas de notas registram se o cadastro da lista divulgada está completo. Uma pirâmide divulgada completa não descreve toda a formulação: exclusão por nota não serve para alergias. Preços futuros incluem volume, moeda e data de observação. Avaliações ficam separadas por provedor. Inspiração editorial não poderá ser apresentada como declaração da marca.

Antes de aceitar dados reais: validar IDs únicos, referências, URLs, natureza dos atributos, direitos de imagens e licença de avaliações. O rótulo geral verified exige conferir todos os fatos exibidos, sem promover opiniões a fatos. A interface deverá indicar a procedência de cada atributo real; o conjunto atual usa uma única fonte demo explícita.

## Páginas e componentes

| Página | Objetivo e componentes |
| --- | --- |
| `/` | Proposta, busca, atalhos por ocasião, duas experiências e seleção demonstrativa |
| `/originais` | Catálogo compartilhado limitado a originais |
| `/inspirados` | Catálogo compartilhado com busca por nome/marca da inspiração |
| `/perfumes/[slug]` | Ficha, pirâmide, ocasiões, clima, procedência e campos desconhecidos |
| `/sobre` | Explicação dos dados fictícios, curadoria e limites |
| `/comparar` (E2) | Dois seletores, tabela acessível e notas declaradas em comum |
| `/descobrir` (E3) | Formulário guiado e resultados justificados |
| `/minha-colecao` (E3) | Adicionar/remover, favoritos, backup e sugestões por semelhança de perfil ou complementaridade |

## Recomendador inicial (E3)

Função pura e determinística, independente da interface. Regras internas versionadas; pontos não aparecem como porcentagem de compatibilidade.

1. Aplicar restrições: categoria quando escolhida; remover já possuídos; excluir notas indesejadas apenas se lista divulgada completa; respeitar teto de preço somente com preço conhecido, volume indicado e data recente (janela inicial proposta: 90 dias). Dados faltantes entram em um grupo separado de informação insuficiente e nunca contam como correspondência positiva.
2. Avaliar evidências: ocasião compatível +4; clima +3; cada acorde preferido +2, até +4; notas desejadas +1, até +2. Pesos são heurísticas iniciais de produto, não resultados científicos. Classificações editoriais identificadas como tal; demonstrações nunca são misturadas silenciosamente a produtos verificados.
3. Só recomendar para uma ocasião se houver informação explícita de ocasião e clima quando ambos forem pedidos. Sem evidência suficiente, dizer que não é possível recomendar; não preencher a lista a qualquer custo.
4. Ordenar por soma interna, quantidade de critérios atendidos e ID estável. Exibir motivos concretos: “classificado editorialmente para calor”, “possui acorde fresco declarado”. Exibir também critérios desconhecidos e ressalvas.
5. Encontrar perfil próximo: usar favoritos escolhidos explicitamente, combinando ocasião, clima e acordes. Sobreposição de notas é informação secundária e não representa aroma semelhante. Sem favoritos, pedir seleção; posse não implica preferência.
6. Complementar: calcular cobertura das combinações de ocasião/clima que a pessoa pretende usar. Priorizar combinações desejadas ainda não atendidas pelos perfumes cadastrados. Se atributos da coleção estiverem ausentes, dizer “cobertura desconhecida”, nunca “lacuna comprovada”. A falta de um perfume para frio não é uma necessidade se a pessoa só pretende usar no calor.
7. Testar: exclusões, orçamento com preço ausente, coleção vazia, item sem atributos, favoritos, já possuídos, cobertura parcial, empate estável e ausência de recomendações. Não usar notas externas para ordenar inicialmente.

## Entregas e critérios de conclusão

### E1 — Base e exploração (implementada nesta sessão)

- Home editorial responsiva, catálogos de duas categorias, ficha e página de metodologia.
- Oito produtos fictícios, quatro por categoria, sem preços ou avaliações inventadas.
- Busca por nome/marca/inspiração, marca, família, acordes, ocasião, clima, inclusão e exclusão de notas.
- Critérios combinam por AND; múltiplas notas/acordes exigem todos os selecionados.
- GET preserva filtros ao recarregar, compartilhar URL e navegar pelo histórico. Trocar categoria inicia nova descoberta, limpando filtros.
- Estado vazio com limpeza, 404, erro, carregamento, teclado e menu mobile.
- Typecheck, testes de filtros e build. Inspeção visual desktop/mobile quando disponível.

### E2 — Comparação

- Seleção limitada a dois perfumes, editável, preservada em URL.
- Tabela compara categoria, família, acordes, notas por camada, notas comuns/exclusivas, ocasião, clima e preço/volume/data quando conhecidos.
- Notas ausentes ou pirâmide incompleta explicitadas; sem porcentagens de aroma.
- Testes de dados ausentes, duplicação de notas, seleção inválida e duas listas vazias.

### E3 — Descoberta e coleção

- Formulário de ocasião, clima, preferências, exclusões e orçamento.
- Regras acima, justificativas legíveis e ausência de resultado tratada.
- Coleção local versionada e validada ao carregar; favoritos separados de posse.
- Falha de localStorage não pode apagar coleção nem simular salvamento; informar modo temporário. Considerar backup JSON por ser dado apenas local.
- Testes das regras e fluxo manual de recarga/remoção/recomendação.

### E4 — Catálogo verificado

- Ampliar progressivamente para 24–40 registros, equilibrando categorias.
- Selecionar um lote pequeno com dados e permissão suficientes antes de expandir.
- Pesquisa em fontes oficiais; trilha por atributo; divergências registradas.
- Sem scraping ou avaliações externas redistribuídas sem autorização verificada.
- Sem imagens de produto até haver direito de uso documentado.

### E5 — Preview e validação

- Verificar teclado, contraste, largura 360 px, sem overflow e desempenho.
- Build reproduzível com lockfile e instalação limpa antes de Vercel.
- Preparar preview; produção depende de autorização explícita do Huk.
- Sem publicação nesta sessão.

## Critérios do primeiro protótipo completo (E1–E3)

- Usuário encontra fresco/frutado para calor; localiza um inspirado por sua referência; monta coleção de três perfumes e recebe sugestão complementar explicada.
- Todos os links de ações disponíveis têm destino implementado; próximos recursos rotulados sem simular funcionamento.
- Comparação não transforma sobreposição de notas em equivalência de aroma.
- Testes de regras passam, build passa, coleção persiste e falhas de armazenamento são visíveis.
- Mobile e teclado permitem completar as mesmas tarefas do desktop.
- Conteúdo fictício fica explícito na home, nos cards e nas fichas; não pode validar qualidade de recomendações reais.

## Validação com pessoas

Proposta de teste exploratório com cinco pessoas (meta de produto, não evidência já coletada): ao menos quatro completam cada tarefa sem ajuda e todas distinguem dados fictícios, sugestão editorial e fonte factual. Registrar tempo, onde travam, por que confiam/desconfiam e se voltariam. Não usar cinco pessoas para inferência estatística de mercado. Repetir os cenários com catálogo real antes de concluir utilidade comercial.

## Riscos e decisões abertas

| Risco | Consequência | Tratamento |
| --- | --- | --- |
| Catálogo pequeno | Filtros vazios com frequência | Explicar dimensão da amostra e permitir limpeza |
| Ocasiões como verdades | Recomendação enganosa | Natureza editorial e justificativa por atributo |
| Referências de contratipos ambíguas | Associação falsa | Aceitar declaração/documentação com fonte; demo explicitamente fictícia |
| Pirâmides incompletas | Falsa garantia de exclusão | Excluir desconhecidos da seleção estrita e explicar o limite |
| Faixas de preço sem volume/data | Comparações injustas | Desativar até haver evidência suficiente |
| Dados externos e imagens | Redistribuição sem permissão | Links e ilustrações próprias como fallback |
| Coleção local | Perda ao limpar navegador | Persistência validada e futuro backup; login fora do MVP |
| Dependências de rede | Instalação não reproduzível | Resolver instalação limpa e lockfile antes do preview hospedado |
| Muitos filtros no mobile | Abandono | Atalhos, painel recolhível, observar testes reais |

Decisões não bloqueantes: nome definitivo, marcas prioritárias do lote real e pesos do recomendador após testes. O nome Radar Olfativo permanece provisório. Não há dados que comprovem adequação de qualquer produto real nesta entrega.

## Resultado desta sessão

Implementação E1 concluída em código. Typecheck, cinco testes e build passaram. Validação visual e navegação ponta a ponta pendentes: o ambiente recusou a abertura da porta 3000 com EPERM. Instalação limpa e lockfile também pendentes por DNS do npm indisponível; verificações usaram dependências locais temporárias. Não houve publicação nem alteração em repositórios externos. Comparador, recomendador e coleção permanecem planejados para E2/E3.
