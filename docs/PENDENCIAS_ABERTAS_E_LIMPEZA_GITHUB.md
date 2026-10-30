# Registro de pendências abertas e limpeza do GitHub

**Data do levantamento inicial:** 29/10/2026 21:37 BRT  
**Última atualização:** 30/10/2026 (hora exata da consulta não preservada)  
**Escopo:** Apoena Game Creator e Apoena Pixel Art HTML  
**Objetivo:** manter uma lista única de trabalho, reduzir validações duplicadas e não encerrar tarefas sem confirmar que seu conteúdo foi preservado.

**Diagnóstico operacional do runner:** consultar [Relatório de erros de comunicação — GitHub Actions e Runner Windows](RELATORIO_ERROS_COMUNICACAO_RUNNER_GITHUB.md) antes de disparar ou repetir validações do Game Creator.

## 0. Controle sequencial de tarefas

**Protocolo obrigatório:** [Protocolo de trabalho sequencial](PROTOCOLO_TRABALHO_SEQUENCIAL.md) — aplicado também ao [repositório Pixel Art](https://github.com/apoenalore/Apoena-pixel-art-html/blob/main/docs/PROTOCOLO_TRABALHO_SEQUENCIAL.md). Limite de trabalho em andamento: **WIP = 1 para os dois repositórios combinados**.

### Tarefa concluída — retirada da fila ativa

- **T-001 — Registrar o protocolo sequencial nos dois repositórios**
- **Estado:** CONCLUÍDA. Os documentos estão publicados em ambos os repositórios. A validação do Pixel Art [40965795436](https://github.com/apoenalore/Apoena-pixel-art-html/actions/runs/40965795436) terminou com `completed/success` em `main`. Os ajustes posteriores foram exclusivamente documentais e não exigem nova suíte de código.
- **Critério atendido:** protocolo publicado, validação exigida aprovada, resultado registrado. Mantido somente neste histórico; não é pendência aberta.

### Tarefa concluída — T-002

- **T-002 — Estabilizar CI/runner do Game Creator e consolidar as falhas de validação.**
- **Estado:** <strong>CONCLUÍDA</strong> em 30/10/2026.
- **Runner:** ID 2, `APOENA-GAMECREATOR-RUNNER`, labels `self-hosted`, `Windows`, `X64`; recebeu e concluiu os jobs reais.
- **Fila:** o snapshot inicial tinha 17 jobs queued. Todos foram processados; os 15 antigos terminaram (12 success, 3 failure), e as duas validações antigas da PR #5 terminaram success. A consulta final retornou **0 queued e 0 in_progress**. Não foi necessário cancelar manualmente os 15 jobs.
- **Automação:** `.github/workflows/pixel-art.yml` agora dispara em push de alterações relevantes em qualquer branch, Pull Requests para `main` e a cada hora na branch padrão. `workflow_dispatch` permanece somente como fallback.
- **Consolidação:** os testes de integração e hidrologia foram reunidos no job canônico sequencial; os workflows manuais/separados redundantes foram removidos das branches PR #6 e PR #5.
- **Validações finais:** [41044696841 — main](https://github.com/apoenalore/GameCreator/actions/runs/41044696841), [41044823914 — PR #5](https://github.com/apoenalore/GameCreator/actions/runs/41044823914) e [41045143930 — PR #6](https://github.com/apoenalore/GameCreator/actions/runs/41045143930) concluíram com success.
- **Erros corrigidos e registrados:** ordem build/teste da validação agendada (GC-CI-010) e variável `profile` fora do escopo no escoamento (GC-CI-011). O motivo da indisponibilidade inicial do runner continua não diagnosticado, mas não há bloqueio ativo.
- **Documentação:** [Relatório de comunicação Runner/GitHub](RELATORIO_ERROS_COMUNICACAO_RUNNER_GITHUB.md) e [Base de conhecimento de erros](BASE_CONHECIMENTO_ERROS_RUNNER_CI.md) atualizados.

## 1. Estado geral

- [x] Inventariar Pull Requests, workflows e execuções do Actions.
- [x] Registrar o snapshot histórico de 346 execuções e 17 jobs inicialmente queued.
- [x] Confirmar o runner ID 2 Online por atribuição real e execução de jobs.
- [x] Processar a fila antiga: 15 execuções concluídas (12 success, 3 failure); duas validações antigas da PR #5 também concluídas.
- [x] Configurar CI automático para push em branches, Pull Requests para main e agenda horária na main.
- [x] Manter um único job sequencial com build antes dos testes.
- [x] Integrar os testes de hidrologia e remover workflows redundantes.
- [x] Corrigir e registrar os erros GC-CI-010 e GC-CI-011.
- [x] Validar main, PR #5 e PR #6 com sucesso.
- [x] Confirmar consulta final com 0 queued e 0 in_progress.
- [ ] Decidir o destino dos protótipos de hidrologia depois de preservar seus arquivos exclusivos; esta decisão não bloqueia mais o CI.

## 2. Apoena Pixel Art HTML

### Pull requests abertos

| PR | Assunto | Estado observado | Próxima ação |
|---|---|---|---|
| [#5 Calendário regional, clima configurável e hidrologia 2D](https://github.com/apoenalore/Apoena-pixel-art-html/pull/5) | Calendário, clima, umidade, erosão e integração Godot/HTML | Aberto; mergeable; 13 arquivos. Execução CI `40949815160` passou em todas as etapas. | Principal candidato para integrar a implementação ambiental após revisão final. |
| [#4 Protótipo de hidrologia 2D](https://github.com/apoenalore/Apoena-pixel-art-html/pull/4) | Protótipo com seis níveis, chuva e erosão | Aberto; mergeable; 8 arquivos. | Preservar ou portar as funções exclusivas do laboratório: seis níveis de bacia, edição de depressões, salvar/reimportar JSON e painel manual de chuva/secagem. Comparar `hidrologia_floresta.js`, `hidrologia_teste.html` e `tests/testar_hidrologia.cjs` com a implementação atual antes de encerrar o protótipo. |
| [#3 Modos offline e salas LAN](https://github.com/apoenalore/Apoena-pixel-art-html/pull/3) | Modos de partida e sessão LAN | Aberto; mergeable; 10 arquivos. | Trabalho distinto; manter aberto e validar separadamente. |

### Workflows encontrados na `main`

- `.github/workflows/validar-pixel-art-windows.yml`: workflow principal no runner Windows `pixel-art`; agora inclui verificações condicionais para os testes ambientais que entram com a PR #5.
- `.github/workflows/validar-godot.yml`: workflow de sessões no runner Windows `pixel-art`, restrito aos PRs de modos/sessões e execução manual; não depende mais de runner Linux.
- `feat/tempo-biomas-hidrologia` contém `.github/workflows/validar-ambiente-windows.yml`, que executou com sucesso em `40949815160`.

**Limpeza realizada:** o push da `main` é validado pelo runner Windows; o workflow Linux fica reservado aos PRs que alteram cenas/scripts de sessão. O workflow Windows foi estendido para executar os testes ambientais quando esses arquivos estiverem presentes na `main`. A branch ambiental mantém sua própria validação até ser integrada.

### Validação ambiental confirmada

Execução [`40949815160`](https://github.com/apoenalore/Apoena-pixel-art-html/actions/runs/40949815160): sucesso em sintaxe JavaScript, testes de calendário/clima e hidrologia HTML, regressão do ecossistema, importação Godot, testes Godot de clima, ecossistema e hidrologia, inicialização headless e publicação dos logs. A validação mais recente da `main` [`40961942176`](https://github.com/apoenalore/Apoena-pixel-art-html/actions/runs/40961942176) passou com o workflow Windows atualizado. A validação de sessões Godot no runner Windows também passou em [`40961954483`](https://github.com/apoenalore/Apoena-pixel-art-html/actions/runs/40961954483).

## 3. Apoena Game Creator

### Pull requests abertos

| PR | Assunto | Estado observado | Próxima ação |
|---|---|---|---|
| [#6 Biomas, variantes sazonais e simulação hidrológica 2D](https://github.com/apoenalore/GameCreator/pull/6) | Perfis de terreno, biomas, variantes sazonais e hidrologia | Aberto; mergeable; 5 arquivos. Validações recentes estão na fila. | Principal implementação ambiental do Creator; concluir CI e revisão. |
| [#5 Protótipo de hidrologia 2D](https://github.com/apoenalore/GameCreator/pull/5) | Motor experimental, página de teste e seis níveis | Aberto; mergeable; 7 arquivos. | Preservar ou portar as funções exclusivas do laboratório: seis níveis de bacia, pintura de terreno, serialização/reimportação e testes de secagem/proteção contra erosão. Comparar `map-editor/hidrologia-core.js`, `map-editor/hidrologia_teste.html` e `tests/hidrologia.test.cjs` com o sistema de terreno da PR #6 antes de encerrar o protótipo. |
| [#4 Contratos de modos offline, salas MOBA 5v5 e sistemas de mundo](https://github.com/apoenalore/GameCreator/pull/4) | Contratos de sessão e sistemas de mundo | Aberto; draft; 7 arquivos. 10 testes de modos/salas e 7 testes de sistemas de mundo passaram em execução isolada de análise; CI real ainda não confirmado. | Manter aberto; validar no runner quando a fila for limpa e o runner voltar a receber jobs. |

### Workflows ativos na main

<badge>2 workflows</badge>

- .github/workflows/pixel-art.yml: **validação canônica única**. Mantém os testes de editor, biblioteca, build, runtime Godot e contratos de integração. Gatilhos: push na branch V4.1, pull requests para main com alterações relevantes e acionamento manual. A agenda diária foi removida. A concorrência agora usa github.head_ref || github.ref_name e cancel-in-progress: true, unificando push e PR da mesma branch.
- .github/workflows/publicar-creator-unificado.yml: **build/publicação**. Preservado porque produz/atualiza a entrega integrada e tem finalidade diferente da suíte de validação.

### Workflows redundantes removidos

- .github/workflows/auto-validar-v41.yml: removido; seus testes de sintaxe, Corte Inteligente, tileset, biblioteca, backup e build já são cobertos pela validação canônica.
- .github/workflows/testar-integracao.yml: removido; os testes de catálogo, terreno, objetos de mundo e Natureza, além dos contratos opcionais de modos/sistemas de mundo, já são executados pelo step de integração do pixel-art.yml.
- A remoção dos arquivos impede novos acionamentos por esses workflows, mas **não apaga nem cancela execuções antigas** que já estavam na fila. O histórico concluído permanece no Actions e não consome runner.

### Bloqueio de runner e fila antiga

Consulta atualizada em 30/10/2026: 346 execuções em quatro páginas; **17 queued, 0 in_progress**. Os 17 jobs foram consultados individualmente: todos solicitam `self-hosted`, `Windows`, `X64`, têm `runner_id = 0`, `runner_name` vazio e zero steps executados. Isso confirma que nenhum recebeu runner. A causa específica ainda não está demonstrada; verificar status Online, grupo, autorização, labels e serviço Windows.

**Execuções que precisam ser canceladas manualmente em Actions:**

1. [40959244729 — validação agendada antiga, workflow já removido](https://github.com/apoenalore/GameCreator/actions/runs/40959244729)
2. [40949144668 — push antigo da branch V4.1](https://github.com/apoenalore/GameCreator/actions/runs/40949144668)
3. [40947634011 — validação da PR #6 no commit 80e4c0](https://github.com/apoenalore/GameCreator/actions/runs/40947634011)
4. [40947633985 — integração duplicada da PR #6](https://github.com/apoenalore/GameCreator/actions/runs/40947633985)
5. [40947625325 — integração duplicada por push da PR #6](https://github.com/apoenalore/GameCreator/actions/runs/40947625325)
6. [40947611808 — integração da PR #6 em commit anterior](https://github.com/apoenalore/GameCreator/actions/runs/40947611808)
7. [40947601170 — integração por push em commit anterior](https://github.com/apoenalore/GameCreator/actions/runs/40947601170)
8. [40944962186 — integração da PR #6 em commit anterior](https://github.com/apoenalore/GameCreator/actions/runs/40944962186)
9. [40944675654 — integração da PR #6 em commit anterior](https://github.com/apoenalore/GameCreator/actions/runs/40944675654)
10. [40944666718 — integração por push em commit anterior](https://github.com/apoenalore/GameCreator/actions/runs/40944666718)
11. [40943993233 — integração da PR #6 em commit anterior](https://github.com/apoenalore/GameCreator/actions/runs/40943993233)
12. [40943754023 — integração por push em commit anterior](https://github.com/apoenalore/GameCreator/actions/runs/40943754023)
13. [40943621289 — integração por push em commit anterior](https://github.com/apoenalore/GameCreator/actions/runs/40943621289)
14. [40994405717 — integração antiga por push da PR #6](https://github.com/apoenalore/GameCreator/actions/runs/40994405717)
15. [40994401969 — integração antiga por push da PR #6](https://github.com/apoenalore/GameCreator/actions/runs/40994401969)

**Por que ainda não foram canceladas:** a integração GitHub disponível nesta sessão não oferece a ação/API de cancelamento (somente leitura para execuções e jobs). Não posso executar o cancelamento por essa conexão. Não criei outro workflow para contornar isso, pois seria mais uma execução e contrariaria a regra de limpeza.

**Preservar — não cancelar:**
- [40996154391 — validação canônica do Creator na PR #5](https://github.com/apoenalore/GameCreator/actions/runs/40996154391)
- [40996154399 — teste específico de hidrologia da PR #5](https://github.com/apoenalore/GameCreator/actions/runs/40996154399)

**Ação necessária:** no GitHub, abrir as 15 execuções obsoletas acima e usar **Cancel workflow** enquanto estiverem `queued`. Não cancelar as duas execuções atuais da PR #5. Depois, abrir Settings → Actions → Runners e confirmar se `APOENA-GAMECREATOR-RUNNER` está Online, autorizado para o repositório e com as labels `self-hosted`, `Windows`, `X64`. “Listening for Jobs” no CMD, sozinho, não comprova que o runner esteja atribuído corretamente.

Depois de confirmar o runner, deixar as duas validações atuais da PR #5 executarem. Só então executar uma única validação canônica necessária para a PR #6, sem repetir jobs equivalentes.

### Validação anterior

Execução [`40942973127`](https://github.com/apoenalore/GameCreator/actions/runs/40942973127) passou nos testes isolados de integração de catálogo em um commit anterior.

**Diagnóstico das falhas históricas consultadas em 30/10/2026:**
- [`40942880450`](https://github.com/apoenalore/GameCreator/actions/runs/40942880450) e [`40933499154`](https://github.com/apoenalore/GameCreator/actions/runs/40933499154) falharam no teste `tests/corte-inteligente.test.cjs:99`, assertion `entrada carrega biblioteca, ponte e editor de Natureza`. A antiga `auto-validar-v41.yml` executava os testes antes de compilar o Creator; a etapa de build vinha depois. Essa definição foi removida da `main`. A `pixel-art.yml` canônica atual compila o Creator antes da suíte de testes. A correção de ordem está presente na definição atual, mas ainda falta validação canônica executada com sucesso no runner.
- [`40928443619`](https://github.com/apoenalore/GameCreator/actions/runs/40928443619) falhou com `ParserError` / `A cadeia de caracteres não tem o terminador: '`, durante a montagem do Creator. Uma execução posterior de publicação [`40928688594`](https://github.com/apoenalore/GameCreator/actions/runs/40928688594) concluiu com sucesso após correção no script PowerShell; classificar a falha anterior como histórica.
- [`40994904732`](https://github.com/apoenalore/GameCreator/actions/runs/40994904732) e [`40994904143`](https://github.com/apoenalore/GameCreator/actions/runs/40994904143), tentativas temporárias com `windows-latest`, terminaram em cerca de três segundos, sem steps e sem logs. Não há evidência suficiente para atribuir a falha ao código; causa de inicialização do job não diagnosticada.
- [`40961681593`](https://github.com/apoenalore/GameCreator/actions/runs/40961681593), tentativa pontual de limpeza usando `ubuntu-latest`, também terminou sem steps e sem logs; a fila não foi limpa e a causa permanece não diagnosticada.

Na `main` atual existem apenas dois workflows: `pixel-art.yml` (validação canônica) e `publicar-creator-unificado.yml` (build/publicação). `auto-validar-v41.yml` e `testar-integracao.yml` foram removidos da `main`; execuções antigas e jobs já criados continuam visíveis no histórico/fila. Na branch atual da PR #6, `testar-integracao.yml` está limitado a `workflow_dispatch`; os dois jobs `409944...` foram criados antes dessa alteração. A PR #5 mantém um workflow específico para hidrologia, além da validação canônica.

A ausência de logs nas execuções hospedadas não substitui a investigação do runner local. O status público do GitHub consultado durante esta análise indicava todos os sistemas operacionais; não foi confirmado incidente global ativo.

## 4. Ordem de fechamento

1. Corrigir a atribuição de jobs ao runner Game Creator.
2. [CONCLUÍDO] Resultado da validação Windows atualizada do Pixel Art: execução 40965795436 aprovada.
3. Revalidar a branch ambiental do Creator quando o runner voltar a aceitar jobs.
4. Comparar os dois PRs de protótipo de hidrologia com as implementações atuais e preservar os arquivos únicos que ainda forem necessários.
5. Revisar os resultados finais dos PRs de modos offline/LAN e sistemas de mundo.
6. Atualizar este registro com links e resultados finais; marcar uma pendência como concluída somente depois de confirmar a execução correspondente.

## 4A. Como retirar itens da lista de fluxos sem apagar o código

**Três conceitos diferentes:**
- **Execução do workflow:** `completed/success`, `completed/failure` e `completed/cancelled` são histórico e não ocupam mais runner. `queued`, `in_progress` e estados de espera requerem atenção, mas `queued` não prova erro de código.
- **Definição do workflow (`.github/workflows/*.yml`):** só desativar/remover gatilhos redundantes após identificar qual fluxo substituto preserva a cobertura necessária. Não apagar o arquivo simplesmente para esconder falhas do histórico.
- **Tarefa no registro:** retirar da lista ativa quando o commit correto passou pela validação pertinente, a entrega está salva/integrada conforme seu escopo e o resultado está documentado; mover para histórico concluído, sem perder rastreabilidade.

**Critério de limpeza da fila:** antes de cancelar, comparar nome do fluxo, branch, commit, execução mais recente e dependências da PR; cancelar apenas execuções obsoletas, não jobs válidos. Histórico encerrado pode permanecer no Actions: não consome o executor e não precisa ser excluído.

**Diagnóstico obrigatório:** ao falhar, registrar primeiro erro causal, job, logs e tipo de falha; planejar uma correção; validar local/focado; só depois fazer uma nova tentativa canônica. Repetir o mesmo commit sem alteração é reservado a falha transitória identificada (runner/conexão). Não iniciar fluxo duplicado para tentar contornar fila.

**Estado confirmado em 30/10/2026 após as validações:** Game Creator com 0 `queued` e 0 `in_progress`. O runner ID 2 concluiu as validações automáticas da main, PR #5 e PR #6 com success. O snapshot histórico de 346 execuções (158 failure, 96 success, 75 cancelled) permanece como histórico; não representa defeitos ativos.

## 5. Regra para evitar repetição

- Não disparar outra validação enquanto a mesma branch/commit já tiver um job pendente sem runner atribuído.
- Usar concorrência por branch e cancelar somente execuções obsoletas da mesma branch.
- Manter uma validação principal por projeto, mais workflows de publicação que tenham finalidade própria.
- Não fechar PR nem apagar arquivo de protótipo sem comparar os arquivos exclusivos e decidir o que será preservado.


## 6. Auditoria da fila e prioridade de execução — 30/10/2026

**Este é o snapshot mais recente consultado nesta auditoria; ele prevalece sobre os estados antigos descritos nas seções históricas acima.** Horário exato da consulta não preservado. Nenhuma PR foi mesclada, fechada ou apagada durante esta auditoria.

### Capacidade e regras
- **WIP = 1** entre GameCreator e Apoena Pixel Art HTML: uma única tarefa de implementação ativa nos dois repositórios combinados.
- A próxima fila terá no máximo **5 tarefas aprovadas**, agrupando PRs correspondentes entre Creator e runtime. Ideias novas ficam no backlog sem virar execução.
- Enquanto houver bloqueio crítico de processo/validação, não iniciar funcionalidades novas.
- Fluxo de revisão: **CodeRabbit revisa → IA de desenvolvimento analisa e corrige → GitHub Actions valida o mesmo commit**. CodeRabbit não deve aplicar autofix automaticamente nesta etapa; a IA de desenvolvimento é responsável pelas correções.
- Toda correção deve registrar ID, causa comprovada (ou hipótese explicitamente marcada), solução realmente aplicada, data/hora BRT (sem inventar horário retroativo), repositório, branch, commit SHA, testes e link/resultado do Actions.
- Uma PR aberta, um teste isolado ou um comentário de revisão não equivalem a funcionalidade integrada/concluída.

### Tarefa ativa — WIP 1
**GC-UPDATE-009 — Atualizador local incremental do GameCreator**
- PR [GameCreator #7](https://github.com/apoenalore/GameCreator/pull/7), branch `feat/atualizador-local-incremental`, head `546aafba45140c7dfae016cd7756178b285cca7e`.
- Estado: **EM VALIDAÇÃO / NÃO INTEGRADO**. PR draft e mergeable; ainda não testado no Windows do autor.
- GitHub Actions: [run 41064201715](https://github.com/apoenalore/GameCreator/actions/runs/41064201715) — `completed/success`. A suíte canônica executou com sucesso, mas ainda não contém teste específico de comportamento do novo atualizador PowerShell/CMD.
- CodeRabbit: revisão manual solicitada nesta PR com `@coderabbitai review`; o bot confirmou **“Review triggered”**. Resultado da revisão ainda não apareceu como review formal no momento do snapshot.
- Critérios pendentes: revisão CodeRabbit; teste automatizado específico do script (sintaxe e cenários seguros); primeira instalação/atualização real no Windows; confirmação de backup/restauração da biblioteca IndexedDB antes de abandonar a instalação antiga.
- Não instalar no computador do autor nem substituir a instalação antiga até concluir esses critérios e obter autorização para o teste local.

### Tamanho atual do quadro
- **8 PRs abertas:** 4 no GameCreator e 4 no Apoena Pixel Art HTML.
- **2 issues abertas de planejamento:** GameCreator #3 e Pixel Art #1. São registros guarda-chuva de decisões/aceite, não duas tarefas extras a implementar separadamente.
- As 8 PRs não são 8 frentes independentes: agrupam-se em quatro frentes de produto mais uma PR documental. Não criar issues ou PRs duplicadas para os mesmos assuntos.

### Próxima fila aprovada — máximo de 5, sem execução paralela
1. **Sistemas ambientais e integração Creator → runtime:** GameCreator [PR #6](https://github.com/apoenalore/GameCreator/pull/6) + Pixel Art [PR #5](https://github.com/apoenalore/Apoena-pixel-art-html/pull/5). A PR do Pixel Art tem [run 40995729054](https://github.com/apoenalore/Apoena-pixel-art-html/actions/runs/40995729054) success. A PR do GameCreator está com `mergeable=false`; comparação `main...feat/tempo-biomas-hidrologia` indica 44 commits à frente e 43 atrás, e não foi encontrado run de PR para o head atual `41b57659119aadbf5001daea69c4601d3e979adc`. O CodeRabbit publicou “Review skipped” nessa PR. **Bloqueada para integração** até resolver divergência, obter revisão e validar o head atual.
2. **Consolidar o laboratório de hidrologia sem perder recursos exclusivos:** GameCreator [PR #5](https://github.com/apoenalore/GameCreator/pull/5) + Pixel Art [PR #4](https://github.com/apoenalore/Apoena-pixel-art-html/pull/4). Validações consultadas: [GC run 41044823914](https://github.com/apoenalore/GameCreator/actions/runs/41044823914) e [Pixel run 40995732520](https://github.com/apoenalore/Apoena-pixel-art-html/actions/runs/40995732520), ambas success nos commits consultados. Preservar funções únicas do laboratório e reconciliar com o sistema ambiental antes de fechar protótipos.
3. **Validar modos offline, Exploração e salas LAN/MOBA:** GameCreator [PR #4](https://github.com/apoenalore/GameCreator/pull/4) + Pixel Art [PR #3](https://github.com/apoenalore/Apoena-pixel-art-html/pull/3). Pixel tem [run 40961954483](https://github.com/apoenalore/Apoena-pixel-art-html/actions/runs/40961954483) success. Não foi encontrado run de PR para o head atual do GameCreator `3370112741e112989fb5b7d0f47a01a16d28fbb7`; a PR está draft e `mergeable=false`. Validar os dois lados, LAN em dois dispositivos e limites reais antes de declarar pronto.
4. **Concluir a revisão documental do diário técnico:** Pixel Art [PR #6](https://github.com/apoenalore/Apoena-pixel-art-html/pull/6). Alteração documental; sem alegação de teste funcional. Revisar links e modelos antes de integrar.
5. **Reserva:** nenhuma quinta tarefa aprovada no momento. Ideias novas permanecem no backlog.

### Observações de revisão e CI
- GameCreator PR #7 e PR #5 têm execuções canônicas recentes com success; isso demonstra que o runner recebeu esses jobs nesses commits, mas não prova disponibilidade global em tempo real.
- Não foi encontrada execução PR para os heads atuais de GameCreator PR #4 e #6. Não afirmar que o runner inteiro está indisponível: há execuções bem-sucedidas recentes em outras PRs.
- Pixel Art PR #4 e #5 têm execuções bem-sucedidas nos heads consultados; PR #3 também tem validação anterior bem-sucedida. PR #6 é documental.
- CodeRabbit não havia emitido review formal nas PRs consultadas. Na GameCreator PR #6, publicou uma mensagem de review ignorada; na PR #7, a solicitação manual foi aceita e aguarda o resultado.
- Não criar workflow novo para contornar falta de review ou execução. Investigar gatilhos/filtros/branch e usar a validação canônica existente.


## 7. Reauditoria após retorno dos runners — 30/10/2026

**Referência temporal:** a nova validação principal foi iniciada em 30/10/2026 15:17:16 UTC (12:17:16 BRT). Esta seção substitui os estados de fila antigos da seção 6, preservando-os como histórico.

### Estado de execução e fila
- **GameCreator main:** [run #41075044875](https://github.com/apoenalore/GameCreator/actions/runs/41075044875), SHA \`55052f8912b70dc8eb132b983447df1c080e63fd\`, terminou \`completed/success\`. Build, contratos, integração, hidrologia quando presente, runtime Godot 4.7.2, preservação do Creator, preparação da entrega e os dois uploads de artefato passaram.
- **Artefatos confirmados:** pacote de origem ID \`12986794324\` (119.780.985 bytes) e diagnósticos ID \`12987043973\` (11.903.423 bytes). Os dois foram publicados no run #41075044875.
- **GameCreator PR #5:** [run #41044823914](https://github.com/apoenalore/GameCreator/actions/runs/41044823914), SHA \`00b3619f296fd821beed219f46fcc5d572bad6ea\`, success.
- **GameCreator PR #6:** [run #41045143930](https://github.com/apoenalore/GameCreator/actions/runs/41045143930), SHA \`b90be364189bd4f2145848494f285c9a6be2fed8\`, success. A correção de escopo de \`profile\` foi validada nesse SHA. O head atual da PR mudou depois por commits documentais/workflow e ainda precisa de CI no SHA atual.
- **GameCreator PR #7:** [run #41064201715](https://github.com/apoenalore/GameCreator/actions/runs/41064201715), SHA \`546aafba45140c7dfae016cd7756178b285cca7e\`, success. A suíte canônica ainda não substitui os testes específicos de instalação/atualização do GC-UPDATE-009.
- **Pixel Art main:** [run #41058053263](https://github.com/apoenalore/Apoena-pixel-art-html/actions/runs/41058053263), SHA \`cff1930b59d8\`, success.
- **Pixel Art PR #5 (clima/hidrologia):** [run #40995729054](https://github.com/apoenalore/Apoena-pixel-art-html/actions/runs/40995729054), SHA \`1507108e14dc51a33152af57ef5137571b0363d2\`, success.
- **Pixel Art PR #4 (laboratório):** [run #40995732520](https://github.com/apoenalore/Apoena-pixel-art-html/actions/runs/40995732520), SHA \`413120bcc34aca9265a3d71e999bdac9760814fd\`, success.
- Consulta de todas as páginas disponíveis após a validação: GameCreator **361 execuções históricas**, Pixel Art **92**; ambos com **0 queued e 0 in_progress**. A execução de empacotamento #41079295445 também concluiu com success.

### Erros classificados e situação
- **GC-CI-010 — build antes dos testes:** correção de ordem validada novamente pelo run #41075044875.
- **GC-CI-011 — \`ReferenceError: profile is not defined\`:** correção de código validada no run #41045143930; não reabrir como erro atual.
- **GC-CI-012 — upload de artefato \`ENOTFOUND\`:** falha transitória de DNS/serviço de artefatos no run #41066904787; os testes e a preparação do pacote tinham passado. O run posterior #41075044875 publicou os dois artefatos com sucesso.
- **Pixel PA-CI-001 — \`PSSecurityException\`:** política de execução PowerShell corrigida com \`ExecutionPolicy Bypass\`; run #40995732520 passou.
- **Pixel PA-GODOT-001 — erros de parser GDScript:** erros antigos de escopo e chamadas \`minf()\` inválidas corrigidos; run #40995729054 passou nos testes de clima, ecossistema e hidrologia Godot.

### Pull Requests — não confundir CI aprovado com integração
- **GameCreator #7:** draft, mergeable/clean; continua como WIP 1 GC-UPDATE-009. Falta teste específico do atualizador e teste real seguro na instalação Windows do autor.
- **GameCreator #6:** aberta, não draft, `mergeable=false/dirty`; head atual `907ae25d81ff3e0ba3ecffc5927a4b7970259f20`. Comparação atual com main: 46 commits à frente e 57 atrás. O código ambiental teve CI aprovado no SHA anterior `b90be364...`; o head atual contém commits posteriores de documentação/workflow e ainda não tem CI associado. Resolver a divergência e validar o head atual antes de integrar.
- **GameCreator #5:** draft, mergeable/clean; CI aprovado no head consultado. Manter o laboratório até comparar e preservar seus recursos exclusivos.
- **GameCreator #4:** draft, \`mergeable=false/dirty\`; 11 commits à frente e 57 atrás de main; sem CI no head atual. Não integrar antes de sincronizar, validar e preservar os contratos de sessão.
- **Pixel Art #5 e #4:** mergeable/clean e testes aprovados nos SHAs indicados; continuam abertas até revisão e decisão de consolidação.
- **Pixel Art #3:** draft, mergeable/clean; validação anterior #40961954483 passou, mas LAN em dois dispositivos e gameplay real continuam pendentes.
- **Pixel Art #6:** documental, \`mergeable=false/dirty\`, 2 commits à frente e 3 atrás de main. Resolver conflito documental antes de integrar; não declarar a documentação disponível na main.
- Permanecem 8 PRs abertas e 2 issues guarda-chuva; não são 10 tarefas independentes.

### Pacote do Creator — correção validada
- Foi identificado que o empacotador copiava documentação interna, planos, testes e arquivos de CI para o ZIP de trabalho.
- Corrigidos os workflows `.github/workflows/pixel-art.yml` em main (commit `f69a013dcc6f38267e204b50c1df90698dca54a3`) e na branch ambiental (commit `5f47b1fb2889a7116d02910da09ea9cb4d33003a`).
- A cópia agora exclui diretórios internos/documentais, testes, CI, arquivos `.md/.txt`, package de testes, scripts de publicação e versões antigas. O manifesto e o resumo de entrega ficam fora do ZIP; os documentos continuam preservados no GitHub.
- **Estado:** VALIDADO no run [#41079295445](https://github.com/apoenalore/GameCreator/actions/runs/41079295445), SHA `f69a013dcc6f38267e204b50c1df90698dca54a3`. O step de empacotamento passou, gerou 52 arquivos de runtime e publicou o artefato ID `12988218628`.
- **Inspeção independente do ZIP:** nenhum diretório `docs`, `tests`, `testes`, `.github`, `historico` ou `legacy`; nenhum `.md`, `.txt` ou `package.json`. Launcher, fonte V4.0, loader, bundle, biblioteca, editor de mapas, integração e módulos Pixel Art necessários estão presentes. SHA-256 do ZIP interno: `7a061059a7d027c45e32ce11fd78c48fd5bdf9a0b0c05e069802cb6c1d3dfda7`.
- O ZIP interno tem 36.047.579 bytes; o artefato anterior tinha 119.780.985 bytes. O artefato novo tem 71.896.589 bytes (pasta de runtime + ZIP + metadados), redução de 39,98% no download do artefato. Os documentos internos não foram apagados do GitHub.

### Próximos passos, mantendo WIP = 1
1. Resolver a divergência da PR #6 ambiental e obter CI no head atual; não fazer merge automático.
2. Manter GC-UPDATE-009 como única tarefa de implementação ativa; não iniciar UX, sessão online ou novas funcionalidades até fechar os critérios do atualizador.
3. Preservar os protótipos de hidrologia até consolidar as funções exclusivas e validar o fluxo Creator → runtime.
### Próximos passos, mantendo WIP = 1
1. Confirmar o resultado do run #41079295445 e verificar que o ZIP não contém documentação, testes ou CI, mas contém launcher, fonte V4.0, bundle e módulos de runtime.
2. Atualizar o registro GC-CI-012 e GC-PACK-001 com o resultado final.
3. Resolver a divergência/merge conflict da PR #6 ambiental e obter CI no head atual; não fazer merge automático.
4. Manter GC-UPDATE-009 como única tarefa de implementação ativa; não iniciar UX, sessão online ou novas funcionalidades até fechar os critérios do atualizador.
