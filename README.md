# Radar Olfativo

Protótipo local de descoberta de perfumes brasileiros. Next.js App Router, React, TypeScript estrito e Tailwind 4. Primeira entrega: home, originais, contratipos, filtros combináveis por URL e fichas individuais.

**Todos os oito perfumes, marcas, inspirações e atributos são fictícios.** Ilustrações próprias em CSS. Preços, avaliações, fotografias de terceiros, comparador, recomendador e coleção ainda não estão implementados.

## Executar

Node >= 22.12, npm 10+.

```sh
npm install
npm run dev
```

Abrir http://127.0.0.1:3000. Para outra porta: `npm run dev -- --port 3001`.

```sh
npm run typecheck
npm test
npm run build
npm start
```

## Estrutura

- `src/app`: páginas e estados de erro/carregamento/404.
- `src/components`: catálogo compartilhado, cards, navegação e ilustração.
- `src/data/catalog.ts`: demonstrações, taxonomias e fontes.
- `src/types/perfume.ts`: dados com procedência por atributo.
- `src/lib/filters.ts`: busca e filtros puros.
- `docs/PLANO.md`: arquitetura, recomendador proposto, critérios de aceite e riscos.

Exemplos para validar:

- `/originais?accord=fresco&accord=frutado&climate=calor` → Figo da Manhã.
- `/inspirados?q=ceu+aberto` → Horizonte 01.
- `/originais?note=figo&exclude=figo` → estado vazio e opção de limpar.
- `/perfumes/nao-existe` → 404.

Os filtros de acordes/notas usam AND. A exclusão exige cadastro completo da lista divulgada. Ela não assegura ausência de substâncias ou alérgenos. Trocar categoria limpa filtros; atalhos da mesma categoria preservam os demais critérios.

## Ambiente desta entrega

O registro npm não resolveu DNS neste ambiente. A instalação normal e a tentativa offline falharam por metadados ausentes no cache. Para verificar esta entrega, `node_modules` usa links locais temporários para as versões já instaladas em outro projeto da máquina, sem modificar esse projeto. Esses links são ignorados pelo versionamento e não são uma estratégia de distribuição.

As versões diretas estão fixadas em `package.json`, mas **ainda não há lockfile nem instalação limpa validada**. Em ambiente com acesso ao npm, remover apenas os links temporários de `node_modules`, executar `npm install`, versionar o lockfile gerado e repetir os checks. Não preparar deploy antes dessa verificação. O projeto não possui repositório Git próprio ou remote configurados nesta sessão.

Não há banco, autenticação, APIs externas ou publicação. A documentação do Next instalada localmente foi consultada para as APIs assíncronas de `params` e `searchParams`.

## Verificação realizada

- `npm run typecheck`: passou.
- `npm test`: cinco testes passaram (combinações, busca por inspiração/acentos, dados ausentes, contradições e integridade do catálogo).
- `npm run build`: passou, com oito fichas pré-renderizadas.
- Preview HTTP: bloqueado pelo ambiente com `listen EPERM 127.0.0.1:3000`; navegação ponta a ponta e inspeção visual mobile/desktop permanecem pendentes. Não houve publicação.
