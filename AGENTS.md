# Radar Olfativo — instruções do projeto

## Contexto

Plataforma de descoberta de perfumes brasileiros, com originais e contratipos. A categoria pertence à fragrância. O catálogo atual é inteiramente fictício e precisa continuar identificado como demonstração.

Leia `docs/PLANO.md` para entregas e `docs/ARQUITETURA.md` para decisões e limites. Stack: Next.js App Router, React, TypeScript estrito e Tailwind. As regras de domínio não devem importar dados demonstrativos ou componentes React.

## Skills do projeto

As fontes estão versionadas em `skills/vendor`, com revisão de origem, licenças e hashes em `skills/manifest.json`. Antes de aplicar uma skill, leia seu SKILL.md e as referências pertinentes. Não carregue todas por padrão.

| Situação | Skill e caminho |
| --- | --- |
| Implementação que cruza arquivos ou próxima entrega do plano | `skills/vendor/addy/skills/incremental-implementation/SKILL.md` |
| Revisão antes de concluir uma mudança de código | `skills/vendor/addy/skills/code-review-and-quality/SKILL.md` |
| Simplificação de código funcional com complexidade desnecessária | `skills/vendor/addy/skills/code-simplification/SKILL.md` |
| Criação ou alteração de pipeline de verificação/deploy | `skills/vendor/addy/skills/ci-cd-and-automation/SKILL.md` |
| Planejamento, implementação ou revisão de UI/UX | `skills/vendor/impeccable/SKILL.md` |

Quando `.agents/skills` estiver disponível após `npm run skills:install`, as mesmas skills podem ser descobertas nativamente pelo Codex. Até lá, os caminhos acima são a rota explícita. Não confunda instruções disponíveis com execução de ferramentas: comandos de CLI e integrações precisam ter sua disponibilidade conferida.

Para Impeccable, o diretório base desta cópia é `skills/vendor/impeccable`. Resolva seus caminhos de launcher e referências a partir dele, conforme a própria skill determina. O motor binário é um recurso separado; se indisponível, siga o fallback textual descrito na skill. Não habilite hooks ou integrações de navegador como efeito colateral da instalação das instruções.

Instruções do usuário e regras do ambiente prevalecem sobre sugestões das skills. Use workflows proporcionalmente à mudança: esta base ainda não tem lint, cobertura, feature flags ou pipeline. Não invente comandos ou resultados para preencher checklists. Testes de mutação fazem sentido em mudanças de lógica; não invente mutações para uma entrega só de documentação/instalação.

## Dados e produto

- Não converter compartilhamento de notas em porcentagem de semelhança de aroma.
- Separar fatos, curadoria editorial e comunidade; preservar fonte e data.
- Ausência de informação é desconhecida, não falsa ou zero.
- Não incorporar avaliações ou imagens externas sem verificar direitos de uso.
- Preservar as três tarefas de validação: descoberta por intenção, busca por inspiração e complementaridade da coleção.
- Sem banco, autenticação ou API externa antes de uma necessidade concreta.

## Verificação e entrega

- `npm test`: regras do catálogo e filtros.
- `npm run typecheck`: TypeScript.
- `npm run build`: build de produção.
- `npm run skills:verify`: integridade e referências das skills.
- `npm run skills:test`: testes do instalador e verificador.
- Não repetir checks aprovados sem mudanças que os afetem. Para mudanças só nas skills e seu instalador, use os checks das skills; para lógica/UI, use os checks da aplicação e navegador quando disponível.
- Instalação independente e package-lock ainda pendentes: não afirmar que npm ci foi validado.
- Registrar limitações de teste e de ambiente. Não substituir verificação visual por compilação bem-sucedida.
- Revisar os arquivos antes de commit. Nunca versionar node_modules, .next, credenciais ou cópias geradas em .agents.
- Commit e push não são deploy. Não publicar em produção sem autorização do usuário. Antes de conectar hospedagem, explicar se pushes futuros dispararão deploy automático.

## Manutenção das skills

Não editar fontes em `skills/vendor` para customizar o projeto; use este arquivo para adaptações. Atualizações devem ser explícitas, com revisão de origem, referências/licenças preservadas e novos hashes no manifest. Não atualizar silenciosamente para a branch mais recente dos fornecedores.
