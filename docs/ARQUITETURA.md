# Revisão de arquitetura — Radar Olfativo

Data: 23/10/2026. Escopo: preparação da base para próximas funcionalidades, sem implementar comparador, recomendador ou integrações externas.

## Parecer

A arquitetura de um único aplicativo Next.js é adequada ao MVP. A revisão corrigiu acoplamentos e limites de integridade do catálogo. Não há evidência de necessidade de microsserviços, banco, mecanismo de busca externo ou cache adicional. Também não há teste de carga que permita afirmar capacidade de tráfego.

O estágio continua sendo protótipo. Bloqueios para considerá-lo pronto para produção: instalação independente e lockfile, CI, testes dos fluxos no navegador, revisão visual mobile e dados reais com procedência.

## Achados e correções

| Prioridade | Achado | Impacto | Tratamento |
| --- | --- | --- | --- |
| Alta para distribuição | `node_modules` depende de links para outro projeto; sem lockfile | Build não reproduzível em outra máquina | Pendência explícita; npm ainda falha com ENOTFOUND. Não mascarar com lockfile gerado a partir dos links |
| Média | Filtro consulta marcas do catálogo demonstrativo internamente | Busca por marca falha ao reutilizar regra com outro conjunto | Marcas recebidas como entrada; índices construídos por execução |
| Média | Integridade dos dados verificada só parcialmente nos testes | ID duplicado pode sobrescrever índice; referência quebrada aparece como desconhecida | Validação executada no ponto de acesso antes de montar índices |
| Média | Serialização da URL dentro do componente e reprodução de qualquer parâmetro | Comportamento difícil de testar e propagação de parâmetros alheios | Parsing, serialização e alternância em módulo independente, com lista de parâmetros conhecida |
| Média | Catálogo mistura formulário, critérios ativos e resultados | Crescimento do componente dificulta mudanças | Extraídos CatalogFilters e CatalogActiveFilters; Catalog mantém composição e resultados |
| Baixa | Contagem prefixada com zero fixo e tamanho da amostra escrito no estado vazio | Texto incorreto ao expandir o catálogo | padStart para contagem; estado vazio independente do tamanho |
| Baixa | CSS comprimido em linhas extensas | Dificuldade de leitura/revisão | Formatação com comparação de AST antes/depois, sem mudança semântica |
| Média | Notas marcadas completas sem nenhum conteúdo poderiam passar pela exclusão | Ausência de informação confundida com ausência de nota | Exclusão exige pelo menos uma nota cadastrada; validador recusa lista vazia marcada completa |
| Baixa | Diretório de saída de testes persistia entre execuções | Testes compilados removidos poderiam continuar rodando | Script limpa apenas `.test-build` antes de compilar |

Não foram encontradas nesta revisão razões para alterar a stack. Não é uma auditoria completa de segurança nem certificação de capacidade.

## Dependências entre módulos

- `types/*`: contratos; sem dependências de interface ou de dados.
- `data/demo-catalog.ts`: dados demonstrativos; depende só dos tipos.
- `data/taxonomy.ts`: notas, acordes e rótulos compartilhados.
- `lib/filters.ts`: regras puras, recebe perfumes e marcas; não importa os dados locais.
- `lib/filter-query.ts`: formato público dos filtros na URL; sem dependência de React/Next.
- `lib/catalog-validation.ts`: verifica relações de um `CatalogData` já tipado; sem dependência da origem.
- `data/catalog.ts`: ponto de acesso ao snapshot local; executa validação e monta índices de leitura.
- `components/catalog.tsx`: compõe dados, filtros e resultados no servidor.
- `components/catalog-filters.tsx`: formulário GET; não consulta perfumes nem executa a busca.
- `components/catalog-active-filters.tsx`: apresentação dos critérios selecionados.
- `app/*`: rotas e metadados.

Não criamos classes de repository, interfaces assíncronas vazias ou contêiner de injeção. Quando uma fonte externa existir, seu adaptador deve montar os dados esperados pelo domínio; algumas páginas precisarão mudar para consultas assíncronas e paginadas. O ponto de acesso atual reduz o espalhamento da dependência local, mas não promete migração sem alterações.

## ADR-001 — Manter um aplicativo modular

Status: aceito para o MVP.

Decisão: Next.js com renderização no servidor para catálogo/fichas, componentes cliente apenas para interações que precisem deles, regras independentes da UI e dados locais enquanto suficientes.

Alternativas: separar backend agora adicionaria contratos remotos e implantação sem resolver uma demanda atual; aplicação exclusivamente cliente enviaria mais responsabilidade e dados ao navegador sem benefício comprovado.

Consequência: implantação e desenvolvimento simples. Banco, paginação e cache serão introduzidos por necessidades medidas, não pelo tamanho imaginado do produto.

## ADR-002 — Integridade antes dos índices

Status: aceito.

O catálogo de domínio deve ser verificado antes de expor índices. A validação atual detecta IDs/slugs duplicados, referências quebradas, fontes ausentes, datas inválidas, URLs com protocolos impróprios, produto verificado com demonstrações, preços/volumes inconsistentes e avaliações fora da escala.

Isso não verifica se uma fonte está dizendo a verdade, se houve autorização real de redistribuição ou se uma opinião está correta. O campo `authorized` é uma declaração interna, não evidência jurídica. A autorização precisa ser documentada no processo de curadoria.

O validador recebe objetos já tipados. Antes de consumir JSON de terceiros, será necessário validar o formato do payload desconhecido no adaptador (incluindo strings, enums, arrays, limites e campos obrigatórios). TypeScript não valida entradas em runtime. Não tratamos o validador atual como um parser universal.

Campos opcionais ausentes continuam válidos. Um inspirado pode não ter referência cadastrada: a aplicação deve mostrar desconhecido, não criar uma inspiração para satisfazer um requisito técnico.

Falha de integridade interrompe a leitura do catálogo, em vez de publicar informação parcial silenciosamente. Na fonte local isso aparece no build; quando houver carga externa dinâmica, será necessário definir política de quarentena de registros inválidos e de último catálogo válido.

## ADR-003 — Filtros como estado de URL

Status: aceito.

Formulários GET mantêm recarga, compartilhamento e histórico. Serialização preserva parâmetros repetidos e só propaga filtros reconhecidos. Valores de filtro não reconhecidos mantêm o comportamento conservador de não encontrar correspondências; não são convertidos silenciosamente em correspondências amplas.

Atalhos alteram somente o critério selecionado. Trocar categoria continua limpando a descoberta. Nenhum filtro exige estado global no cliente.

## Escala e gatilhos de evolução

| Dimensão | Situação | Reavaliar quando |
| --- | --- | --- |
| Tráfego | Fichas pré-renderizadas, catálogos filtrados no servidor | Medições mostrarem latência/custo problemáticos; definir metas antes de otimizar |
| Volume de dados | Snapshot local e varredura linear por busca | Tamanho/tempo de build, payloads ou busca ficarem inadequados; então índices, consultas e paginação |
| Manutenção | Uma aplicação, responsabilidades separadas | Curadores precisarem editar/publicar sem alterar código; avaliar CMS ou fluxo de importação |
| Coleção | Ainda planejada; localStorage sem servidor | Sincronização entre dispositivos se tornar requisito validado; então identidade e persistência remota |
| Recomendações | Ainda planejadas; funções puras | Regras e evidências reais exigirem mais atributos; manter explicações e testes |

Sem metas de tráfego e medição, não há número de usuários suportados validado. O primeiro gargalo provável do produto é obter e manter dados confiáveis, hipótese a confirmar durante a curadoria.

## Verificação e pendências

- 17 testes unitários/de integridade: filtros combinados, busca com marcas recebidas, desconhecidos, round-trip de URL, atalhos sem mutação, referências, duplicatas, procedência, datas e valores inválidos.
- Typecheck e build devem passar após as alterações.
- CSS: comparação de AST confirma preservação da estrutura semântica na formatação.
- Instalação independente/lockfile: pendentes por DNS indisponível no ambiente.
- CI: configurar após instalação limpa e lockfile; não anunciar pipeline inexistente.
- Testes de navegador/mobile: pendentes, sem reabrir o servidor bloqueado na etapa anterior.
- Antes do catálogo real: parsing de entrada externa, validação de enums e taxonomias, evidências por atributo, política de atualização e direitos de uso de imagens/avaliações.
