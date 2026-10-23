# Skills do Radar Olfativo

Integração local em 23/10/2026. Cinco skills selecionadas; nenhuma dependência de runtime do site foi adicionada.

| Skill | Quando usar |
| --- | --- |
| incremental-implementation | Implementação em incrementos verificáveis |
| code-review-and-quality | Revisão de correção, arquitetura, clareza, segurança e desempenho |
| code-simplification | Reduzir complexidade preservando comportamento |
| ci-cd-and-automation | Configurar checks automáticos e estratégia de deploy quando esse trabalho for iniciado |
| impeccable | UX, hierarquia visual, responsividade, acessibilidade e refinamento |

## Como estão integradas

O `AGENTS.md` contém o roteamento por tarefa e os caminhos de leitura. As quatro skills do Addy estão em `skills/vendor/addy/skills`, preservando `../../references` com os checklists compartilhados. Impeccable está em `skills/vendor/impeccable`, com suas referências, agentes e scripts.

As fontes são cópias oficiais não modificadas. `skills/manifest.json` registra os commits upstream, versões e hashes Git de cada arquivo. Addy: MIT; Impeccable: Apache-2.0 com NOTICE. Instruções específicas do Radar ficam em AGENTS.md, separadas das fontes.

Não instalamos Superpowers, Ponytail, UI/UX Pro Max ou os demais pacotes da lista: o conjunto selecionado já cobre as necessidades atuais, sem sobrepor metodologias inteiras. Instalações globais preexistentes na máquina não foram alteradas.

## Verificar e instalar no Codex

```sh
npm run skills:verify
npm run skills:test
npm run skills:install
```

O último comando copia as cinco skills para `.agents/skills` deste projeto. Para o Addy, copia os checklists para dentro de cada skill e ajusta apenas os caminhos relativos da cópia gerada. Cada cópia leva sua licença. A pasta gerada fica ignorada pelo Git; a fonte versionada continua íntegra.

O instalador pode ser repetido; sobrescreve apenas arquivos dessas cinco skills e não apaga arquivos alheios. Após a instalação, abra uma nova conversa do projeto para atualizar a descoberta nativa. A presença em AGENTS.md permite a leitura explícita sem depender desse catálogo da interface.

Nesta sessão, o sandbox bloqueou a criação de `.agents`. A instalação foi testada em pasta temporária, incluindo repetição, preservação de arquivo alheio, licenças e referências. Rode `npm run skills:install` no Terminal do macOS para concluir a descoberta nativa. Não alegamos que ela está habilitada nesta sessão.

## Motor do Impeccable

A skill está disponível em texto com todos os playbooks. O launcher incluído depende de um motor binário separado (a versão esperada está em `scripts/VERSION`). Ele procura uma instalação compatível ou tenta baixar o binário oficial no primeiro uso e confere o checksum. O binário não foi baixado nem executado nesta instalação; ele não é dependência do site.

Sem motor, o próprio SKILL.md define um fallback para ler contexto e referências diretamente. Funcionalidades de CLI, detectores, live mode e hooks não estão validadas/ativadas aqui. A leitura dos playbooks continua possível. Instalar as skills não equivale a executar auditoria visual ou criar uma pipeline.

## Publicação

- Commit: registra uma versão no Git local.
- Push: envia commits ao GitHub.
- Deploy: cria/atualiza a aplicação hospedada.

Uma integração externa pode disparar deploy ao receber um push. Não há configuração de Vercel ou workflow de deploy nos arquivos atuais; isso não prova a ausência de uma integração criada fora do repositório. Nenhuma hospedagem foi configurada nesta sessão.

Preview de teste pode ser disponibilizado antes do MVP completo, com catálogo fictício claramente identificado e instalação reproduzível. Publicação destinada a orientar compras deve esperar os três fluxos principais, revisão mobile, checks e um lote real com procedência. Login, banco e catálogo grande não são pré-requisitos para validar um preview.

## Atualização

Revisar o diff upstream antes de trocar a revisão. Obter novamente arquivos, referências, scripts e licenças da revisão escolhida; atualizar o manifest e conferir os hashes. Executar os checks e reinstalar cópias geradas. Commitar as fontes e o manifest juntos. Não editar hashes para aceitar modificações locais não revisadas.
