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

### Tarefa suspensa por decisão expressa do autor
**GC-UPDATE-009 — Atualizador local incremental do GameCreator**
- PR [GameCreator #7](https://github.com/apoenalore/GameCreator/pull/7), branch `feat/atualizador-local-incremental`, head `ae085d57c3245fb1c5d4956f0b0cd0399e4067c5`.
- Estado: **AGUARDANDO VALIDAÇÃO / PAUSADA** em 01/11/2026 para priorizar a solicitação do Estúdio/Apoena. A tarefa não está concluída nem integrada.
- Última evidência conhecida: [run 41116194279](https://github.com/apoenalore/GameCreator/actions/runs/41116194279) — `completed/success` no head citado.
- Permanecem pendentes a revisão dos achados CodeRabbit e as validações reais no Windows do autor, incluindo cópia de segurança e restauração da biblioteca IndexedDB. Não alterar a instalação existente.
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
- **GameCreator main:** [run #41075044875](https://github.com/apoenalore/GameCreator/actions/runs/41075044875), SHA `55052f8912b70dc8eb132b983447df1c080e63fd`, terminou `completed/success`. Build, contratos presentes, integração, runtime Godot 4.7.2, preservação do Creator, preparação da entrega e os dois uploads de artefato passaram. **O step de hidrologia foi SKIP** porque os arquivos do motor ainda não existem na main; os testes ambientais passaram nas branches/PRs correspondentes, não por esse run da main.
- **Artefatos confirmados:** pacote de origem ID \`12986794324\` (119.780.985 bytes) e diagnósticos ID \`12987043973\` (11.903.423 bytes). Os dois foram publicados no run #41075044875.
- **GameCreator PR #5:** [run #41044823914](https://github.com/apoenalore/GameCreator/actions/runs/41044823914), SHA \`00b3619f296fd821beed219f46fcc5d572bad6ea\`, success.
- **GameCreator PR #6:** [run #41045143930](https://github.com/apoenalore/GameCreator/actions/runs/41045143930), SHA \`b90be364189bd4f2145848494f285c9a6be2fed8\`, success. A correção de escopo de \`profile\` foi validada nesse SHA. O head atual da PR mudou depois por commits documentais/workflow e ainda precisa de CI no SHA atual.
- **GameCreator PR #7:** [run #41064201715](https://github.com/apoenalore/GameCreator/actions/runs/41064201715), SHA \`546aafba45140c7dfae016cd7756178b285cca7e\`, success. A suíte canônica ainda não substitui os testes específicos de instalação/atualização do GC-UPDATE-009.
- **Pixel Art main:** [run #41058053263](https://github.com/apoenalore/Apoena-pixel-art-html/actions/runs/41058053263), SHA \`cff1930b59d8\`, success.
- **Pixel Art PR #5 (clima/hidrologia):** [run #40995729054](https://github.com/apoenalore/Apoena-pixel-art-html/actions/runs/40995729054), SHA \`1507108e14dc51a33152af57ef5137571b0363d2\`, success.
- **Pixel Art PR #4 (laboratório):** [run #40995732520](https://github.com/apoenalore/Apoena-pixel-art-html/actions/runs/40995732520), SHA \`413120bcc34aca9265a3d71e999bdac9760814fd\`, success.
- **Fila atual:** main [#41081796048](https://github.com/apoenalore/GameCreator/actions/runs/41081796048) e branch ambiental [#41081917796](https://github.com/apoenalore/GameCreator/actions/runs/41081917796) terminaram success; o atualizador [#41082083233](https://github.com/apoenalore/GameCreator/actions/runs/41082083233) passou no step 17 (parser e teste de manifesto) e está parado no step 22, publicação do artefato. Não há outros jobs em progresso conhecidos.

### Erros classificados e situação
- **GC-CI-010 — build antes dos testes:** correção de ordem validada novamente pelo run #41075044875.
- **GC-CI-011 — \`ReferenceError: profile is not defined\`:** correção de código validada no run #41045143930; não reabrir como erro atual.
- **GC-CI-012 — upload de artefato \`ENOTFOUND\`:** falha transitória de DNS/serviço de artefatos no run #41066904787; os testes e a preparação do pacote tinham passado. O run posterior #41075044875 publicou os dois artefatos com sucesso.
- **Pixel PA-CI-001 — \`PSSecurityException\`:** política de execução PowerShell corrigida com \`ExecutionPolicy Bypass\`; run #40995732520 passou.
- **Pixel PA-GODOT-001 — erros de parser GDScript:** erros antigos de escopo e chamadas \`minf()\` inválidas corrigidos; run #40995729054 passou nos testes de clima, ecossistema e hidrologia Godot.

### Pull Requests — não confundir CI aprovado com integração
- **GameCreator #7:** draft, head `3233e739474b993bb33a4f5c685753591c714ba3`; branch divergente de main e mergeability em recálculo. O CI #41064201715 passou apenas no head anterior `546aafba...`; o commit `a27b1b...` foi marcado `[skip ci]`. Foi adicionado o teste estático `tests/atualizador-manifest.test.cjs`; no run #41082083233, o step 17 de sintaxe e contrato do manifesto passou; o job está finalizando o upload. Continua como WIP 1 GC-UPDATE-009.
- **GameCreator #6:** aberta, não draft, head `80b77e44723d33a469c81bda5687938edbdaae60`; branch divergente de main. O workflow foi sincronizado com main; permanecem alterações sobrepostas em `AGENTS.md` e `README.md`. O CI do head atual passou em [#41081917796](https://github.com/apoenalore/GameCreator/actions/runs/41081917796), incluindo build, contratos, testes de terreno/natureza, Godot e pacote de 76 arquivos. O step específico `hidrologia-core.js` foi SKIP porque esse motor ainda não existe nesta branch.
- **GameCreator #5:** draft, mergeable/clean; CI aprovado no head consultado. Manter o laboratório até comparar e preservar seus recursos exclusivos.
- **GameCreator #4:** draft, divergente de main; alterações sobrepostas em `.github/workflows/testar-integracao.yml`, `README.md` e `pixel-art/ponte-creator.js`; sem CI no head atual. Não integrar antes de sincronizar, validar e preservar os contratos de sessão.
- **Pixel Art #5 e #4:** mergeable/clean e testes aprovados nos SHAs indicados; continuam abertas até revisão e decisão de consolidação.
- **Pixel Art #3:** draft, mergeable/clean; validação anterior #40961954483 passou, mas LAN em dois dispositivos e gameplay real continuam pendentes.
- **Pixel Art #6:** documental, `mergeable=false/dirty`, divergente de main; há alterações sobrepostas em `AGENTS.md`, `docs/BASE_CONHECIMENTO_ERROS_RUNNER_CI.md` e `docs/PROTOCOLO_TRABALHO_SEQUENCIAL.md`. Resolver conflitos documentais antes de integrar; não declarar a documentação disponível na main.
- Permanecem 8 PRs abertas e 2 issues guarda-chuva; não são 10 tarefas independentes.

### Pacote do Creator — correção validada
- Foi identificado que o empacotador copiava documentação interna, planos, testes e arquivos de CI para o ZIP de trabalho.
- Corrigidos os workflows `.github/workflows/pixel-art.yml` em main (commit `f69a013dcc6f38267e204b50c1df90698dca54a3`) e na branch ambiental (commit `5f47b1fb2889a7116d02910da09ea9cb4d33003a`).
- A cópia agora exclui diretórios internos/documentais, testes, CI, arquivos `.md/.txt`, package de testes, scripts de publicação e versões antigas. O manifesto e o resumo de entrega ficam fora do ZIP; os documentos continuam preservados no GitHub.
- **Estado:** VALIDADO no run [#41079295445](https://github.com/apoenalore/GameCreator/actions/runs/41079295445), SHA `f69a013dcc6f38267e204b50c1df90698dca54a3`. O step de empacotamento passou, gerou 52 arquivos de runtime e publicou o artefato ID `12988218628`.
- **Inspeção independente do ZIP:** nenhum diretório `docs`, `tests`, `testes`, `.github`, `historico` ou `legacy`; nenhum `.md`, `.txt` ou `package.json`. Launcher, fonte V4.0, loader, bundle, biblioteca, editor de mapas, integração e módulos Pixel Art necessários estão presentes. SHA-256 do ZIP interno: `7a061059a7d027c45e32ce11fd78c48fd5bdf9a0b0c05e069802cb6c1d3dfda7`.
- O primeiro ZIP (#41079295445) tinha 52 arquivos e estava limpo de documentos, mas omitia a fábrica original; está supersedido e não é a distribuição final. O ZIP final da main (#41081796048) tem 76 arquivos de runtime, 47.969.681 bytes no ZIP interno e 95.672.629 bytes no artefato externo. O aumento em relação ao primeiro pacote corresponde às 24 partes necessárias da fábrica original, não a documentos internos. SHA-256 do ZIP final: `62407aaad9bd183d78bd3a29a65752f8325981a4191aa77b084be49b818eb55d`.


### Follow-up GC-PACK-002 — preservar dependência da fábrica original
- A inspeção da página `integracao/index.html` mostrou que ela aponta para `legacy/abrir-editor-v3.9.html`, que carrega 23 scripts em `legacy/v3_9_parts/parte_000.js` a `parte_022.js`. A página integrada também depende de `integracao/catalogo.js` e é aberta por `pixel-art/modulo-integrado.js`.
- O primeiro ZIP (#41079295445) excluiu toda a pasta `legacy`; embora estivesse limpo de documentos, deixava quebrado o acesso à fábrica original. O manifesto do atualizador também não incluía `integracao/index.html` nem `integracao/catalogo.js`.
- Correções aplicadas: empacotador main commit `1561a0d08b26177596fafbf21102b739aa4a2b76`; manifesto do atualizador commit `184102a9317c687485da55bc34ef0f50d5352601`; teste estático commit `c155207db4a61ce2766ebcbd5dc1a59604c5afee`; workflow de teste condicional main commit `65db2b62cc9750f50a3cc595c80466b6344fbc94`.
- O pacote agora preserva somente `legacy/abrir-editor-v3.9.html` e as 23 partes JS, excluindo `legacy/iniciador-anterior.html` e o restante do conteúdo antigo. O atualizador também inclui `integracao/index.html` e `integracao/catalogo.js`.
- **Validação do pacote na main:** [#41081796048](https://github.com/apoenalore/GameCreator/actions/runs/41081796048) terminou success no SHA `65db2b62cc9750f50a3cc595c80466b6344fbc94`; o empacotador gerou 76 arquivos. O ZIP interno foi inspecionado: contém a página da fábrica e as 23 partes, não contém `iniciador-anterior.html`, docs, testes, CI, `.md` ou `.txt`. SHA-256 do ZIP: `62407aaad9bd183d78bd3a29a65752f8325981a4191aa77b084be49b818eb55d`.
- **Validação da branch ambiental:** [#41081917796](https://github.com/apoenalore/GameCreator/actions/runs/41081917796) terminou success no head atual; o pacote também contém 76 arquivos e os testes de terreno/natureza passaram. O teste isolado de `hidrologia-core.js` foi SKIP porque esse motor não existe nessa branch.
- **Validação do atualizador:** [#41082083233](https://github.com/apoenalore/GameCreator/actions/runs/41082083233) está em execução; o teste estático do manifesto ainda precisa chegar ao step 17 e passar.
### Próximos passos, mantendo WIP = 1
1. Resolver a divergência da PR #6 ambiental e obter CI no head atual; não fazer merge automático.
2. Manter GC-UPDATE-009 como única tarefa de implementação ativa; não iniciar UX, sessão online ou novas funcionalidades até fechar os critérios do atualizador.
3. Preservar os protótipos de hidrologia até consolidar as funções exclusivas e validar o fluxo Creator → runtime.
### Próximos passos, mantendo WIP = 1
1. O CI do atualizador está aprovado no SHA `43fcf2af`; não repetir o mesmo job sem nova evidência.
2. O proprietário deve executar o atualizador em uma instalação de teste no Windows e conferir que arquivos locais, módulos e dados não são removidos nem sobrescritos.
3. Exportar a Biblioteca IndexedDB antes da atualização, restaurá-la em perfil de teste e confirmar personagens, sprites, mapas e catálogo.
4. Manter GC-UPDATE-009 como única tarefa ativa até receber evidência desses testes manuais. Somente depois liberar WIP=1 para a próxima implementação, incluindo a PR #5 de clima/hidrologia do Pixel Art.


## GC-UPDATE-009 — Atualizador enxuto do Game Creator (30/10/2026)

- **Estado:** WIP 1 / CI WINDOWS APROVADA / ACEITE MANUAL PENDENTE; não iniciar novas funcionalidades até fechar esta tarefa.
- **Objetivo:** manter documentação, auditorias, histórico, testes e workflows no repositório privado, mas materializar somente os arquivos necessários ao runtime na pasta APP.
- **Implementação:** clone parcial com --filter=blob:none, sparse-checkout por lista positiva, manifesto de arquivos essenciais, fetch explícito de origin/main, fast-forward e proteção de arquivos ignorados.
- **Preservação:** não usar reset/clean; não apagar runner, biblioteca IndexedDB, arquivos pessoais ou histórico local.
- **Revisão/sincronização:** a branch de trabalho da PR #7 foi reaplicada sobre a `main` atual; o backup `backup/gc-update-009-before-main-sync-20261030` preserva a branch anterior.
- **Testes automatizados:** o workflow Windows executa parser PowerShell 5.1 e o contrato/end-to-end do atualizador contra repositório Git temporário, cobrindo sparse-checkout, exclusão de documentos, fast-forward, referência anterior, retomada e bloqueio de conflitos.
- **Validação automatizada atual:** CI Windows aprovada no SHA `43fcf2afdbf669b4c79f0139fa73d27eb8d21fec`, run [#41950469672](https://github.com/LORECRONICASAPOENA/GameCreator/actions/runs/41950469672), tentativa 2, job `validar` (`127008498341`). Passaram parser PowerShell 5.1, manifesto, runtime Godot 4, persistência IndexedDB, backup/restauração, sincronização, preservação do Creator e todas as etapas do job. A tentativa 1 não forneceu etapas nem logs; não foi tratada como erro de código.
- **Revisão CodeRabbit:** achados sobre allowlist e atualização de `refs/apoena/anterior` corrigidos; comentários registrados como resolvidos após validação.
- **Pendências de aceite:** teste real de instalação/atualização no Windows do autor; exportação e restauração da Biblioteca IndexedDB antes de abandonar a instalação antiga.
- **Regra:** não integrar a PR nem declarar concluído até todos os critérios acima terem evidência.


## Descoberta de segurança — checkout inicial e conflitos locais (30/10/2026)

A simulação Git local identificou que sparse-checkout set --no-cone não materializa por si só um clone iniciado com --no-checkout. Foi adicionado git read-tree -mu HEAD após a verificação do manifesto.

Também foi comprovado que, em sparse-checkout, git merge --no-overwrite-ignore sozinho não é proteção suficiente contra todo arquivo local conflitante. O atualizador agora detecta tanto arquivos ignorados quanto não ignorados antes da materialização e antes do merge; qualquer colisão com o runtime remoto bloqueia a operação.

A simulação foi executada com Git 2.47.3 em Linux. O novo teste de contrato repete esses cenários na CI Windows. Nenhuma pasta do computador do autor foi alterada.


- **Proteção adicional:** antes de reduzir o worktree, o atualizador interrompe se encontrar arquivos ignorados fora da allowlist de runtime. O operador deverá fazer backup ou movê-los manualmente; o atualizador não apaga nem move dados pessoais.


## Bloqueio de arquivos locais fora do runtime

Antes de aplicar o sparse-checkout, o atualizador verifica arquivos locais ignorados e não ignorados. Se encontrar qualquer arquivo fora da allowlist de runtime, interrompe e solicita backup ou movimentação manual. Não tenta apagar, mover ou incorporar esses arquivos. Dados locais dentro de caminhos de runtime também bloqueiam a atualização se colidirem com um arquivo que venha do repositório.


## Caminhos Unicode

A leitura de árvores e arquivos locais usa core.quotePath=false para que nomes com acentos, como árvore.js, sejam comparados como caminhos reais e não como sequências octais escapadas. O teste PowerShell cria uma colisão com nome Unicode e exige que o atualizador bloqueie sem sobrescrever o arquivo local.


## Execução do atualizador PowerShell real na CI

O teste tests/atualizador-manifest.test.cjs não fica apenas na simulação de comandos Git. Ele executa integracao/atualizar-creator.ps1 com Windows PowerShell 5.1, usando um repositório bare local temporário e diretório de configuração isolado. O modo de teste permite a URL local somente quando APOENA_UPDATER_TEST_MODE=1 e a URL do remote corresponde exatamente ao parâmetro RepoUrl; a instalação normal continua limitada ao GameCreator oficial.

O teste executa primeira instalação, verifica arquivos presentes/ausentes, bloqueio de arquivos locais fora da allowlist, atualização fast-forward, preservação de refs/apoena/anterior, execução sem mudanças e bloqueio de conflitos ignorados/não ignorados, inclusive um caminho com acento. Nenhuma pasta permanente do autor é usada.




## GC-UPDATE-TEST-001 — CRLF no teste de contrato

A falha do run 41113920551 foi causada por CRLF no arquivo PowerShell lido pelo teste Node, não por ausência do guard. O teste agora normaliza CRLF para LF antes de usar indexOf e procura a linha executável completa. Correções do teste: 65c65521b0fb1595215bd70da03c4ef7b898032d e 8bbe3d7379b43da5c98c18bd1165e2d8d114a267. A nova CI do head atual ainda está pendente.

## GC-UPDATE-RECOVERY-001 — Retomada de clone interrompido

O clone --no-checkout deixa o índice vazio; o status pode apresentar remoções na primeira coluna (D ). O atualizador agora usa o marcador clone-pendente.txt e verifica git ls-files + árvore HEAD para reconhecer esse estado. Se o índice já estiver populado, somente ausências de worktree sem outras alterações são retomáveis. Modificações rastreadas bloqueiam. O teste cria esse estado e executa o PowerShell real. CI pendente.

## GC-UPDATE-TEST-002 — Parser PowerShell

A CI 41114836257 falhou no step 17 com Token '}' inesperado. A causa foi um segundo bloco de código duplicado após o catch, deixado por uma substituição anterior do trecho de validação do remote. O bloco duplicado foi removido no commit d90541bd642f17aa681ea7e623b49dba12ca2b36. Nova CI pendente; o teste end-to-end PowerShell ainda não foi considerado aprovado.


## Atualização de estado — 05/11/2026

O run [#41950469672](https://github.com/LORECRONICASAPOENA/GameCreator/actions/runs/41950469672), tentativa 2, passou integralmente no SHA `43fcf2afdbf669b4c79f0139fa73d27eb8d21fec`. A PR #7 continua draft. O aceite automatizado de backup/restauração IndexedDB passou; falta apenas o teste manual do proprietário em instalação Windows real e perfil de dados de teste. Não fazer merge até essa confirmação.

---

## Checkpoint atual — 06/11/2026 — GC-UPDATE-009 integrado; GC-CHAR-001 em reconciliação

### GC-UPDATE-009 — concluído e integrado
- PR [#7](https://github.com/LORECRONICASAPOENA/GameCreator/pull/7) foi mesclada em **2026-11-06 18:28:31 UTC**.
- Merge commit: `b23900f578be096fb731e822796fc2266e58e551`; ele permanece incorporado na `main`. Head atual da `main`: `b5996ce557e25d59987b836bff2515a4078a9833` (dois commits posteriores apenas documentais).
- Validação canônica pós-merge: [Actions #420](https://github.com/LORECRONICASAPOENA/GameCreator/actions/runs/42271036648), job `validar`, **completed/success**.
- O proprietário confirmou os testes manuais Windows, incluindo instalação isolada e exportação/restauração da Biblioteca IndexedDB. A confirmação está registrada na conversa da PR #7; não foram anexados logs locais.
- GC-UPDATE-009 deixa de ocupar WIP=1.

### WIP = 1 — GC-CHAR-001 / PR #14
- PR [#14](https://github.com/LORECRONICASAPOENA/GameCreator/pull/14): aberta, draft, base `feat/apoena-personagem-estudio-main`, head `4a5082c1db17946b03cf9a1eabf57aaa26b00261`, mergeable=true.
- Código validado no SHA `d5bea2b3c7905f00bcff2645e1b2e8b3f49a8df6`, pelo [Actions #404](https://github.com/LORECRONICASAPOENA/GameCreator/actions/runs/41906361151), completed/success. A comparação entre `d5bea2b` e o head atual `4a5082c` encontrou quatro commits e somente arquivos documentais/relatórios; nenhum código foi alterado depois do SHA validado.
- PR [#11](https://github.com/LORECRONICASAPOENA/GameCreator/pull/11) permanece aberta/draft, base main, head `a60ef6ea0549f3d30c9fd62ba1a7f716fd454142`. PR #14 está empilhada sobre essa branch e está 105 commits à frente e 2 atrás dela. Os dois commits exclusivos da base são um checkpoint documental e a alteração do gatilho do workflow; a versão atual do workflow na PR #14 já contém o filtro para a branch-base.
- PR [#13](https://github.com/LORECRONICASAPOENA/GameCreator/pull/13) permanece aberta, base main, head `34a0a722444448e384c91286affecf0f50217038`. A comparação PR #14 ↔ PR #13 mostra divergência real (105 commits à frente e 47 atrás); não mesclar nem fechar automaticamente.
- Comparação dos arquivos funcionais: PR #13 e #14 têm blobs idênticos em `personagens.html`, `personagens-core.js`, `personagens.css`, `tests/personagens.test.cjs`, `character-creator/index.html`, `integracao/build_unificado.ps1`, `integracao/build_unificado.py` e `integracao/godot/tests/test_catalogo.gd`. Nas versões divergentes, a PR #14 contém a ponte segura com nonce criptográfico de 256 bits, allowlist de WindowProxy e MessageChannel; limite do manifesto de 256 KB; guard de concorrência dos presets; fila serializada de operações do editor; e teste de navegador ampliado.
- **Lacuna de validação identificada:** o teste de navegador atual da PR #14 usa um host de biblioteca em memória (`Map`) para `saveProject/saveAsset/listProjects/listAssets`. Os testes separados de biblioteca usam `fake-indexeddb` em Node. A PR #13 usava `ApoenaLibrary.dispatch` no host do navegador. Portanto, a cobertura atual da PR #14 não comprova, por si só, a persistência end-to-end do Criador Modular no IndexedDB real do navegador. O fluxo offline `file://` também permanece sem aceite manual específico da PR #14.
- **Documentação exclusiva da PR #13 a preservar/classificar antes de encerrar a branch:** `docs/AUDITORIA_ORGANIZACAO_E_LIMPEZA_2026-11-02.md`, `docs/PESQUISA_ANTI_CHEAT_SQL_TLS_JOGOS.md`, `docs/PLANO_JOGO_ONLINE_APOENA.md`, `docs/POLITICA_INTEGRIDADE_E_EXPERIENCIA_JOGADOR.md`, `docs/REGISTRO_CONVERSAS_E_BACKUPS.md`, `docs/SEGURANCA_APOENA_500_CONTROLES.md`, `docs/registros-conversas/2026-11-02-apoena-verso-coleta-auditoria-transferencia-ia.md`, além de relatórios/checkpoints históricos em `docs/relatorios-actions/` e `docs/relatorios-conversas/`. Esses arquivos ainda não foram portados para main/PR #14; preservar ou arquivar conscientemente antes de fechar/excluir a PR #13.
- **CodeRabbit:** PR #14 ainda sem review formal e sem threads de revisão. A solicitação anterior via comentário não produziu resposta do bot. Nesta sessão o CLI não está instalado e o ambiente não conseguiu resolver o host de instalação; nenhuma revisão CodeRabbit foi executada nem substituída por revisão manual.
- Backups conferidos: main `backup/full-project-post-gc-update-009-2026-11-06` → `b23900f`; PR #14 `backup/snapshot-2026-11-05-0729-pr14` → `4a5082c`; PR #13 `backup/snapshot-2026-11-05-0729-pr13` → `34a0a72`.

### Próximas ações — manter WIP = 1
1. Obter aceite manual do fluxo PR #14 em navegador Windows/offline `file://`: abrir o Creator pela branch da PR, acessar Pixel Art → Criador Modular, importar peça, editar, salvar, atualizar a biblioteca, reabrir o projeto e gravar no Creator; salvar o projeto principal, fechar/reabrir e confirmar a persistência.
2. Executar CodeRabbit autenticado no head atual da PR #14; analisar findings sem autofix automático.
3. Preservar/classificar a documentação exclusiva da PR #13 antes de encerrar essa PR.
4. Reconciliar a base da PR #11 com main e, depois, atualizar a PR #14 sem reescrever histórico. Executar CI canônico no SHA atualizado.
5. Definir uma única rota de integração para #11/#14. Não mesclar PR draft, não fechar #13 e não excluir branches enquanto os itens exclusivos não estiverem preservados.
6. GC-ANIM-005 / issue #17 continua bloqueada até concluir a integração do Criador Modular; não iniciar outra implementação em paralelo.

**Estado desta atualização:** documentação e análise de histórico; nenhum código, branch de trabalho, workflow ou PR foi alterado nesta etapa.

## Histórico da PR #11 preservado durante a sincronização — 06/11/2026

Os trechos abaixo são snapshots históricos de 02/11/2026. Foram preservados sem sobrescrever o estado mais recente da main.

### Tarefa ativa — WIP 1
**GC-ANIM-006 — Predefinições editáveis de animação para Apoena no Estúdio Pixel Art**
- Branch: `feat/apoena-personagem-estudio-main`; implementação no GameCreator, usando os assets já preservados em `pixel-art/references/apoena/`.
- Escopo: carregar corrida multidirecional e ataques laterais como quadros editáveis; preencher ação/direção; pré-visualizar cada sequência; manter edição manual das divisórias e preservar os PNGs originais.
- A opção de “andar” é uma prévia identificada que reutiliza poses de corrida. Uma animação de caminhada fiel depende de quadros próprios.
- Critérios: testar os três imports; confirmar 16 quadros de movimento e 12 por ataque com ação/direção corretas; revisar manualmente efeitos que cruzam células; confirmar prévia, salvamento e exportação sem alterar os originais; tratar revisão CodeRabbit e CI canônica no SHA atual.
- Estado: **EM EXECUÇÃO / NÃO VALIDADA**. O CI canônico [run 41357977741](https://github.com/apoenalore/GameCreator/actions/runs/41357977741), tentativa 4 no SHA `a9c7148f01504f7be142dd0d852056dd5a9a5114`, terminou em `failure`; a API confirmou runner atribuído, mas não retornou steps e os logs ficaram inacessíveis (404). Incidente registrado em [GC-CI-013](BASE_CONHECIMENTO_ERROS_RUNNER_CI.md) e [relatório individual](relatorios-actions/2026-11-02-run-41357977741-nao-diagnosticado.md). Causa não confirmada; não repetir nem corrigir às cegas. Os commits documentais posteriores não alteram o código e não substituem validação no SHA de código.

## Atualização de continuidade — 02/11/2026 — GC-ANIM-006 / CI 41433942503

- **Tarefa ativa:** GC-ANIM-006, PR [#11](https://github.com/apoenalore/GameCreator/pull/11), branch `feat/apoena-personagem-estudio-main`, HEAD consultado `70a4e09e7243d56f0f0313a7791a849218514055`; draft, não integrada na `main`.
- **CI:** workflow canônico [run #41433942503](https://github.com/apoenalore/GameCreator/actions/runs/41433942503), evento `pull_request`, concluído em failure no SHA acima. A API retornou o job `validar` em failure, sem etapas individuais, logs, annotations ou mensagem causal.
- **Diagnóstico:** causa NÃO CONFIRMADA. Não alterar código/workflow nem repetir a execução até obter a primeira falha causal.
- **CodeRabbit:** nenhuma revisão formal ou comentário foi localizado na consulta de 02/11/2026; estado aguardando revisão, sem presumir que o bot analisou o código.
- **Relatório individual:** [2026-11-02-run-41433942503-falha-sem-steps-recuperaveis.md](relatorios-actions/2026-11-02-run-41433942503-falha-sem-steps-recuperaveis.md).
- **Próxima ação:** recuperar logs pelo GitHub Actions; se indisponíveis, obter logs locais do runner Windows no intervalo 11:05:16Z–11:17:48Z. Depois classificar, corrigir pontualmente, testar e aguardar CI automática no novo SHA.
- **WIP:** permanece 1; não iniciar A2, GC-UPDATE-009 ou outra implementação enquanto GC-ANIM-006 não for encerrada ou formalmente bloqueada conforme protocolo.

## Evidência recebida — GC-ANIM-006 / run 41433942503

Em 02/11/2026, o autor enviou captura da anotação expandida do GitHub Actions. A mensagem confirma que o executor auto-hospedado perdeu comunicação com o servidor. A categoria da falha é infraestrutura/conectividade do runner; a causa específica (rede, suspensão/desligamento, processo encerrado, CPU/memória ou bloqueio de acesso) continua pendente. Não há evidência de erro de código do Estúdio nesta anotação. Não alterar código de produto para tentar resolver a desconexão. Quando o computador estiver disponível, consultar os logs locais do runner no diretório _diag e verificar energia, rede, DNS, proxy/firewall e recursos do runner. Relatório atualizado: [GC-CI-014](relatorios-actions/2026-11-02-run-41433942503-falha-sem-steps-recuperaveis.md).


## Atualização — PR #14 / CI do Criador Modular (03/11/2026)

- **Estado:** validação do head de código concluída; PR [#14](https://github.com/apoenalore/GameCreator/pull/14) permanece aberta em draft, sem merge.
- O CI executou uma única validação por evento `pull_request` depois que o gatilho de `push` foi limitado a `main`. O run [41565001752](https://github.com/apoenalore/GameCreator/actions/runs/41565001752) passou em `03382b02e74e2b39da0924bd0ff72ddacdf27e5a`.
- Correção do teste funcional: aguardar o contador explícito de operações pendentes e o evento `apoena:character-idle`. A validação funcional no navegador, a persistência IndexedDB e as demais etapas obrigatórias do workflow passaram.
- Snapshot do Apoena Skill será registrado em `apoena-knowledge/backups/gamecreator-pr14-ci-fixes-2026-11-03/`, identificando repositório-fonte, branch, SHA, run e arquivos copiados. Esse snapshot é cópia técnica de implementação, não atualização de cânone.


## Atualização de manutenção — 04/11/2026 — PRs #11, #13 e #14

- **WIP = 1:** a linha de implementação ativa do Criador Modular é a PR #14. O workflow automático da branch-base foi corrigido e os runs #41902283423 (PR #11), #41902995635 (reconciliação) e #41906361151 (hardening da ponte) passaram. A PR #14 segue draft aguardando revisão independente CodeRabbit, verificação manual offline `file://` e reconciliação final do histórico.
- **PR #11:** continua como branch-base `feat/apoena-personagem-estudio-main`; o filtro `pull_request.branches` foi atualizado para permitir a PR #14. O run [#41902283423](https://github.com/LORECRONICASAPOENA/GameCreator/actions/runs/41902283423) passou. A branch permanece draft, 27 commits à frente e 51 atrás de `main`.
- **PR #13:** aberta, base `main`, HEAD `34a0a722444448e384c91286affecf0f50217038`; contém findings de revisão e histórico divergente. Os deltas funcionais identificados (builds, fixture/teste Godot e redirect legado) foram portados e validados na PR #14. A PR #13 permanece aberta até concluir revisão dos arquivos sobrepostos; não fechar nem mesclar automaticamente. Nota registrada no comentário [#6640862983](https://github.com/LORECRONICASAPOENA/GameCreator/pull/13#issuecomment-6640862983).
- **PR #14:** aberta/draft, base `feat/apoena-personagem-estudio-main`, HEAD de código validado `d5bea2b3c7905f00bcff2645e1b2e8b3f49a8df6`; branch 101 commits à frente e 2 atrás da base, sem conflito reportado. Run [#41906361151](https://github.com/LORECRONICASAPOENA/GameCreator/actions/runs/41906361151) passou em todos os testes obrigatórios, inclusive a ponte segura e runtime Godot 4.
- **Reconciliação:** a comparação entre PR #13 e o HEAD da #14 indicou 101 commits à frente e 47 atrás. Os deltas funcionais exclusivos encontrados foram portados; o histórico continua divergente e os arquivos sobrepostos precisam de revisão antes de fechar PR #13, retargetear ou mesclar qualquer PR. Acompanhar issue [#16](https://github.com/LORECRONICASAPOENA/GameCreator/issues/16).
- **CodeRabbit:** revisão solicitada para o hardening do HEAD `d5bea2b` no comentário [#6641314397](https://github.com/LORECRONICASAPOENA/GameCreator/pull/14#issuecomment-6641314397); nenhuma review formal foi recebida até a última consulta de 04/11/2026.
- **Correção de concorrência:** `pixel-art/preset-request-guard.js` invalida solicitações antigas de presets; somente a mais recente pode alterar o estado do Estúdio. `tests/preset-request-guard.test.cjs` verifica a semântica e a ligação HTML/JS.
- **Ajuste do teste:** run #395 falhou porque o teste exigia espaços inexistentes no JS minificado. Os regexes foram ajustados para whitespace opcional no commit `2ec3c55c1612fdb885e328bfa19f5ef64a49f010`.
- **CI final de segurança:** run [#41906361151](https://github.com/LORECRONICASAPOENA/GameCreator/actions/runs/41906361151) concluiu `success` no SHA `d5bea2b3c7905f00bcff2645e1b2e8b3f49a8df6`; passaram navegador, teste unitário do bridge, rejeição de source/token/origem inválidos, contratos, Godot 4 e preservação do Creator. Etapas opcionais de empacotamento/entrega/anexação de logs foram `skipped`. O teste de animação continua usando hook determinístico; o agendamento real de `requestAnimationFrame` requer cobertura manual separada. Logs: 17:25:36–17:27:21 BRT; avisos não bloqueantes de Node.js 20 nas actions v4 e do módulo `punycode`.
- **Backups:** pré-correção `backup/pr14-before-preset-race-fix-20261104` no SHA `4f90fc8739b4af351c929a97d8ed73c094477c36`; pós-correção `backup/pr14-after-preset-race-fix-20261104` no SHA `dca28d0065a4cc24f38d6ebff759346575b49428`; checkpoint de código validado `backup/pr14-after-test-regex-fix-20261104` no SHA `2ec3c55c1612fdb885e328bfa19f5ef64a49f010`; checkpoint final documental `backup/pr14-final-docs-20261104` no SHA `b945ba16050bfb051b2bc27d5ecdddd91c1f9348`.
- **Proteção de branches:** issue [#15](https://github.com/LORECRONICASAPOENA/GameCreator/issues/15) acompanha a exigência de checks e revisão independente na `main`.

## Ponto de situação — Criador Modular / GC-CHAR-001 (03/11/2026)

- **WIP = 1:** manter esta integração como a única tarefa de implementação ativa entre GameCreator e Apoena Pixel Art HTML.
- **PR #11:** aberta em draft, base `main`, branch `feat/apoena-personagem-estudio-main`, HEAD `0447ea9dc9d9310e985247325e3af1d1c726519a`.
- **PR #13:** aberta, fora de draft, base `main`, HEAD `34a0a722444448e384c91286affecf0f50217038`. O workflow mais recente consultado para esse SHA foi o run [#41528996973](https://github.com/LORECRONICASAPOENA/GameCreator/actions/runs/41528996973), concluído com falha; esse resultado não valida o HEAD atual se houver commits posteriores.
- **PR #14:** aberta em draft, base na branch da PR #11 (`feat/apoena-personagem-estudio-main`), HEAD consultado `98c46503ed1ec567422b947d2fec88d470a25b39`. O run automático [#41728100712](https://github.com/LORECRONICASAPOENA/GameCreator/actions/runs/41728100712) estava `in_progress` na consulta de 03/11/2026. A validação anterior [#41565001752](https://github.com/LORECRONICASAPOENA/GameCreator/actions/runs/41565001752) passou no SHA `03382b02e74e2b39da0924bd0ff72ddacdf27e5a`, que não é o HEAD consultado agora.
- **Bloqueio de integração:** PRs #13 e #14 cobrem a mesma integração do Criador Modular; a #14 também depende da branch ainda draft da #11. Não declarar concluído nem mesclar enquanto o run do HEAD atual não terminar e as diferenças entre as PRs não forem reconciliadas.
- **Próxima ação:** acompanhar o run #41728100712 sem iniciar execução duplicada. Depois, comparar os arquivos/commits das PRs #11, #13 e #14 e definir uma única rota de integração. Se houver falha, coletar logs e seguir o procedimento individual de incidente antes de alterar código.


### Atualização — falha do Criador Modular no run #41728611799 (03/11/2026)

- O run #41728100712 foi cancelado quando uma execução mais nova assumiu o mesmo grupo de concorrência; o substituto automático foi [#41728611799](https://github.com/LORECRONICASAPOENA/GameCreator/actions/runs/41728611799), no HEAD 37e7395013e6423c61fe4beb487265b97d0031b0.
- A execução substituta falhou no step 11, “Testar Criador Modular no navegador”, com timeout aguardando a mensagem de sucesso de “Gravar no Creator”. Build, DOM, sintaxe e modelo passaram; etapas seguintes foram puladas.
- O trace comprovou que o host recebeu a requisição saveAsset e armazenou manifest e png. A resposta de volta ao iframe e a conclusão da fila do editor não foram comprovadas naquele run.
- **Estado:** integração ainda não validada; causa-raiz do atraso não confirmada. Relatório: [2026-11-03-run-41728611799-character-bridge-timeout.md](relatorios-actions/2026-11-03-run-41728611799-character-bridge-timeout.md).
- **Correção aplicada no harness:** após capturar o payload, o teste espera a fila assíncrona real do editor via hook de inatividade e mantém as verificações de mensagem de sucesso, manifesto com 12 quadros e PNG. O código de produção do bridge não foi alterado.
- Aguardar somente a execução canônica automática do novo commit; não iniciar workflow duplicado nem marcar a tarefa como concluída antes de todos os steps obrigatórios passarem.


### Atualização — run #41731726616 terminou sem diagnóstico acessível (03/11/2026)

- O run [#41731726616](https://github.com/LORECRONICASAPOENA/GameCreator/actions/runs/41731726616), HEAD 71c142bc4371c1f7b1a4ca047b6c61fb1f5be0f1, terminou em failure.
- A API mostra o step 6, “Verificar DOM responsivo do Estúdio, Mapas e Biblioteca no navegador”, como in_progress sem horário de conclusão, embora o job tenha encerrado às 19:50:16 BRT. Os steps seguintes, inclusive o teste funcional do Criador Modular, ficaram pending.
- Logs do job retornaram BlobNotFound; a listagem do run não contém artefatos. Causa-raiz não confirmada, portanto essa execução não valida nem refuta a correção do harness.
- Relatório individual: [2026-11-03-run-41731726616-step6-runner-diagnostics.md](relatorios-actions/2026-11-03-run-41731726616-step6-runner-diagnostics.md).
- **Estado posterior:** o bloqueio atual foi superado pelo run #41902995635, que passou no smoke test DOM e concluiu todos os testes obrigatórios. A causa histórica de `BlobNotFound` permanece não confirmada; a coleta de logs locais pode continuar como melhoria de observabilidade, mas não bloqueia a PR #14.


- **Segurança da ponte — correção implementada e validada no CI:** `shared/creator-bridge.js` exige nonce criptográfico de 256 bits e `WindowProxy` previamente autorizado; payloads/respostas trafegam por `MessageChannel`. A origem `null` só é aceita com source+nonce autorizados. `postMessage("*")` permanece exclusivamente no handshake de transferência do `MessagePort` para origem opaca `file://`; nenhum payload do projeto trafega por esse wildcard. O nonce é passado em fragmento, removido após leitura. Testes rejeitam source não autorizado, token incorreto e origem externa. Revisão independente CodeRabbit e verificação manual offline ainda pendentes; solicitação no comentário [#6641314397](https://github.com/LORECRONICASAPOENA/GameCreator/pull/14#issuecomment-6641314397).
- **Incidentes de CI anteriores:** #41728611799, #41743357325 e #41731726616 deixaram de bloquear a PR após os runs #41840891930 e #41902995635; a causa histórica específica de #41731726616 continua não confirmada.


### Atualização — reconciliação PR13/PR14 validada no run #41902995635 (04/11/2026)

- Os checks de build PowerShell/Python agora exigem os quatro arquivos do Criador Modular.
- O teste Godot verifica o recurso `SpriteFrames` exportado e a compatibilidade da rota legada foi preservada.
- O run #41902995635 passou em todos os testes obrigatórios; o relatório está em [2026-11-04-run-41902995635-pr13-delta-reconciliation.md](relatorios-actions/2026-11-04-run-41902995635-pr13-delta-reconciliation.md).
- Não houve merge nem fechamento de PR. A próxima ação do WIP é receber a revisão CodeRabbit e tratar a segurança da ponte antes de qualquer integração final.


### Atualização — hardening da ponte V4.0/V4.1 validado (04/11/2026)

- A primeira tentativa de hardening, run #41905233755, falhou no teste de navegador porque o iframe não enviou a mensagem `ready`; o artefato mostrou `BRIDGETRACE` vazio. A causa foi tratada como falha de propagação do nonce, não como perda de dados.
- O nonce agora é transmitido também no fragmento `#apoenaBridgeToken`, que não é enviado ao servidor; o bridge remove o fragmento depois de capturá-lo. `window.name` permanece como fallback.
- O teste Node foi corrigido para simular corretamente a direção de `postMessage` e expor `URLSearchParams` no fake Window.
- Run [#41906361151](https://github.com/LORECRONICASAPOENA/GameCreator/actions/runs/41906361151) passou em todos os testes obrigatórios, inclusive browser real, protocolo privado, validação de origem opaca, Godot 4 e preservação do Creator.
- A segurança automatizada está validada; não declarar a PR pronta para merge até revisão independente CodeRabbit e teste manual do fluxo offline `file://`.

## Atualização canônica — 06/11/2026 após GC-UPDATE-009

- **Main atual:** `90879c3099ca4cce2a229d745a08f8d1c9e5bb29`. Desde o merge de GC-UPDATE-009, a main avançou três commits somente documentais; o merge commit `b23900f578be096fb731e822796fc2266e58e551` permanece ancestral.
- **GC-UPDATE-009 / PR #7:** integrada em 18:28:31 UTC, merge commit `b23900f578be096fb731e822796fc2266e58e551`; o proprietário confirmou os testes no Windows e a exportação/restauração da Biblioteca IndexedDB.
- **WIP=1 atual:** reconciliação controlada das PRs #11/#13/#14. Não iniciar outra implementação em GameCreator/Pixel Art em paralelo.
- **PR #11:** draft, base `main`, head `a60ef6ea0549f3d30c9fd62ba1a7f716fd454142`; 27 commits à frente / 83 atrás da main; CI antiga #41902283423 success, mas requer sincronização, CI nova e revisão.
- **PR #13:** aberta, base `main`, head `34a0a722444448e384c91286affecf0f50217038`; 31 commits à frente / 42 atrás; run #41528996973 falhou no teste de navegador do protótipo anterior; 9 threads CodeRabbit não resolvidas. O comentário de 05/11 informa que os deltas funcionais foram portados para #14; comprovar antes de fechar como supersedida.
- **PR #14:** draft, base exatamente igual ao head atual da #11; head `4a5082c1db17946b03cf9a1eabf57aaa26b00261`; 130 commits à frente / 83 atrás da main. Código validado no SHA `d5bea2b3c7905f00bcff2645e1b2e8b3f49a8df6` pelo run #41906361151; quatro commits posteriores são apenas documentação/relatórios. Revisão independente solicitada e aguardando resposta.
- **PR #18:** preview anterior de sincronização, baseado no main antigo `b5996ce`; permanece Draft/não mergeable e não deve ser integrada.
- **Backups:** `backup/gc-pr11-pre-reconcile-20261106` → `a60ef6ea0549f3d30c9fd62ba1a7f716fd454142`; `backup/gc-pr13-pre-reconcile-20261106` → `34a0a722444448e384c91286affecf0f50217038`; `backup/gc-pr14-pre-reconcile-20261106` → `4a5082c1db17946b03cf9a1eabf57aaa26b00261`.
- **Rota:** sincronizar a base #11 com a main atual sem reescrever histórico; executar CI e revisão; integrar #11 somente após aprovação; atualizar/retargetear #14 para main e validar; comprovar preservação dos commits úteis da #13 antes de encerrá-la.

---

## Reconciliação da cadeia PR #11 → PR #18/#19 → PR #14 — 06/11/2026

- **PR #18:** fechada sem merge. Não reabrir nem reutilizar seu head antigo.
- **PR #19:** sucessora técnica da #18, base `feat/apoena-personagem-estudio-main`, head `e16fe832adde4ab7606594b45a8395a4df6d2438`. O head contém a resolução de sincronização com a main e preserva a árvore da #11; GitHub confirma `mergeable=true`, `mergeable_state=clean`.
- **Backup pré-resolução:** `backup/gc-pr19-pre-resolution-20261106` → `bdbd6cb9cbb5901561135f70c70ce2e83147e4a8`.
- **CI:** [run 42281994131](https://github.com/LORECRONICASAPOENA/GameCreator/actions/runs/42281994131) concluiu `success` no SHA `e16fe832adde4ab7606594b45a8395a4df6d2438`. Passaram exportação pixel-perfect, IndexedDB, backup/restauração, integração, atualizador, Godot 4 e preservação do Creator.
- **Incidente da primeira tentativa:** run [42276102355](https://github.com/LORECRONICASAPOENA/GameCreator/actions/runs/42276102355) falhou porque o workflow chamava `tests/pixel-art-export.test.cjs`, ausente naquele tree. O teste foi preservado na resolução; a nova CI passou. Relatório: `docs/relatorios-actions/2026-11-06-run-42276102355-pixel-art-export-test-ausente.md`.
- **PR #11:** continua aberta/draft, head `a60ef6ea0549f3d30c9fd62ba1a7f716fd454142`; aguarda a integração da sincronização #19 à branch-base e uma nova CI no head resultante.
- **PR #14:** continua sendo a implementação escolhida do Criador Modular. Mantém sua branch/head `4a5082c1db17946b03cf9a1eabf57aaa26b00261` e sua base atual na #11 até a #11 ser integrada. Depois, retarget para `main` e validar novamente.
- **PR #13:** não será mesclada sobre a #14. Manter sua branch e os comentários de revisão como referência; preservar documentos úteis sem incorporar sua implementação concorrente.
- **Próximas ações:** (1) revisão e integração da PR #19 na branch-base #11; (2) aguardar CI canônico da PR #11 no novo SHA; (3) revisar/validar a #11 antes de sua integração à main; (4) retarget da #14 para main; (5) CodeRabbit e CI atualizados na #14; (6) teste manual offline/file:// e persistência IndexedDB real antes do merge final da #14.
- **Governança:** WIP=1 permanece na tarefa ALB-GC-CHAR-001. Nenhum merge na main foi realizado nesta etapa; nenhuma PR #13 foi mesclada ou fechada.


---

## Estado canônico após o merge da PR #19 — 06/11/2026 às 17:30 BRT

- **PR #19:** fechada com merge em 2026-11-06T19:56:11Z; merge commit `8acf515c6be8f097b05b4231608894f06740ab17`. A branch-base da PR #11 recebeu a sincronização validada.
- **PR #11 / GC-ANIM-006:** aberta, draft, base `main`, head `8acf515c6be8f097b05b4231608894f06740ab17`; GitHub informa `mergeable=true`. O Actions [#42283992136](https://github.com/LORECRONICASAPOENA/GameCreator/actions/runs/42283992136) concluiu success nesse SHA.
- **PR #14 / GC-CHAR-001:** permanece a implementação escolhida, aberta/draft e empilhada sobre a branch da #11. Seu head original `4a5082c1db17946b03cf9a1eabf57aaa26b00261` foi preservado no backup `backup/gc-pr14-pre-base-sync-20261106`. A sincronização da base foi concluída no head `fbc7aad8c6ef2de0255de5479a1f2b4c83b279c1`, com base `8acf515c6be8f097b05b4231608894f06740ab17`; GitHub confirma `mergeable=true`.
- **PR #13:** permanece aberta e não será mesclada sobre a #14. Preservar branch, comentários e documentos exclusivos até a integração final.
- **Backups:** `backup/gc-pr11-pre-sync-20261106` → `a60ef6ea0549f3d30c9fd62ba1a7f716fd454142`; `backup/gc-pr14-pre-base-sync-20261106` → `4a5082c1db17946b03cf9a1eabf57aaa26b00261`; `backup/gc-pr19-pre-resolution-20261106` → `bdbd6cb9cbb5901561135f70c70ce2e83147e4a8`.
- **Validação pendente:** CI no futuro merge SHA da #14, revisão CodeRabbit no head atualizado, inspeção visual das grades de animação e teste manual offline/file:// com persistência real no IndexedDB.
- **Limites desta sessão:** CodeRabbit CLI não está instalado e o terminal não resolve github.com; os PNGs binários não foram renderizados pelo conector GitHub. Não declarar essas revisões executadas.
- **Governança:** WIP=1 permanece na reconciliação da cadeia. Não alterar main, não fechar #13 e não iniciar outra implementação paralela.


---

## Validação da PR #14 após sincronização da base — 06/11/2026

- **Head:** `fbc7aad8c6ef2de0255de5479a1f2b4c83b279c1`; base branch `feat/apoena-personagem-estudio-main`, base SHA `8acf515c6be8f097b05b4231608894f06740ab17`.
- **Mergeabilidade:** GitHub informa `mergeable=true`; a comparação da PR #14 com a base atualizada mostra 106 commits à frente, zero atrás e 46 arquivos no diff. A #14 continua contendo a implementação escolhida do Criador Modular.
- **CI:** [run #42290101577](https://github.com/LORECRONICASAPOENA/GameCreator/actions/runs/42290101577) concluiu `completed/success` no head exato. Passaram as etapas 1–24, incluindo navegador, concorrência de presets, exportação pixel-perfect, IndexedDB, backup/restauração, manifesto do atualizador, hidrologia, runtime Godot 4 e preservação do Creator. Etapas 25–27 foram skipped pela condição do workflow; não são falhas.
- **Backup pós-sincronização:** `backup/gc-pr14-post-base-sync-20261106` → `fbc7aad8c6ef2de0255de5479a1f2b4c83b279c1`.
- **CodeRabbit:** solicitações registradas nos comentários [#6694982589](https://github.com/LORECRONICASAPOENA/GameCreator/pull/11#issuecomment-6694982589) e [#6694983194](https://github.com/LORECRONICASAPOENA/GameCreator/pull/14#issuecomment-6694983194); nenhuma nova review do bot observada até este checkpoint. O CLI não pôde ser executado porque não está instalado e o terminal não resolve `github.com`.
- **Aceite manual pendente:** revisão visual das três spritesheets no Estúdio e teste offline/file:// com persistência real no IndexedDB. Não marcar PR #14 ready nem mesclar na #11 até concluir as verificações.
- **PR #13:** permanece aberta e fora da cadeia; não foi mesclada sobre a #14.
- **Main:** não foi alterada nesta operação.

---

## Atualização 07/11/2026 — PR #13 encerrada como supersedida; PR #14 continua WIP=1

Esta atualização substitui as instruções históricas anteriores que diziam para não fechar a PR #13 antes de preservar seus arquivos.

### GC-CHAR-001 — decisão sobre a PR #13
- PR [#13](https://github.com/LORECRONICASAPOENA/GameCreator/pull/13) foi **fechada sem merge**, como supersedida pela implementação escolhida da PR [#14](https://github.com/LORECRONICASAPOENA/GameCreator/pull/14). A branch original foi mantida.
- HEAD fechado: `34a0a722444448e384c91286affecf0f50217038`.
- Inventário dos 26 caminhos alterados na PR #13: nenhum arquivo exclusivo da PR está ausente simultaneamente da `main` e da branch da PR #14. Os arquivos funcionais compartilhados foram preservados com blobs idênticos; as versões divergentes de workflow, Estúdio, módulo integrado, editor de personagens e teste de navegador são substituídas pelas versões posteriores da PR #14.
- As três spritesheets de referência já estão preservadas na `main` e na PR #14 com os mesmos blobs. Os documentos históricos (ideia, registro inicial e relatório GC-CI-013) também estão na `main`/PR #14. O relatório GC-CI-014 da PR #14 contém proveniência de commits e agora documenta os controles de PAT.
- O trecho de protótipo do README da #13 continha limites já superados; seu conteúdo útil de operação foi reescrito como **Uso rápido — Criador Modular de Personagens** no README da PR #14. Os snapshots antigos da fila continuam preservados como histórico; esta seção registra o estado atual.
- Backups confirmados: `backup/gc-pr13-pre-closeout-20261107` → `34a0a722444448e384c91286affecf0f50217038`; `backup/gc-pr14-pre-pr13-closeout-20261107` → `ce4e7a26a611f7e941ce36f2ac15837391776583`; backups anteriores também permanecem.
- Os nove threads históricos do CodeRabbit continuam preservados na PR fechada. Não foram apagados nem convertidos em aprovação da PR #14.

### Findings históricos da revisão da PR #13
- Workflow: ambos os testes de navegador incluem candidatos em Program Files e Program Files (x86).
- Corrida de presets: a PR #14 usa guard de solicitação e teste para descartar carregamentos obsoletos.
- Limite acumulado: a nova camada é aplicada a um candidato validado por `C.validate` antes de criar snapshot/confirmar a importação; o limite de 48 MB rejeita a montagem antes de alterar o projeto.
- Manifesto: a ponte valida limite de 256 KB antes de gravar no Creator.
- README: os limites obsoletos do protótipo foram substituídos por descrição e guia compatíveis com a implementação atual.
- Incidentes: a versão da PR #14 preenche a proveniência do relatório GC-CI-014 e os campos de GC-CI-013/014 com valores preservados ou limitações explícitas.
- PAT: o relatório GC-CI-014 agora exige token dedicado, curta duração, privilégio mínimo, proteção de histórico/logs e revogação após o diagnóstico. Nenhum PAT foi criado ou utilizado nesta atualização.
- Esses itens reconciliam findings antigos; **não equivalem a uma nova revisão independente do HEAD atual da PR #14**.

### PR #14 — estado atual e validação
- Continua **aberta e em Draft**, não mesclada. A branch da PR #14 continua sendo a linha única de integração do Criador Modular; a PR #13 não deve ser reaberta nem mesclada sobre ela.
- Código validado no HEAD `ce4e7a26a611f7e941ce36f2ac15837391776583`, pelo [run #42290749610](https://github.com/LORECRONICASAPOENA/GameCreator/actions/runs/42290749610), `completed/success`. As etapas funcionais 1–24 passaram; as etapas de empacotamento/logs 25–27 foram skipped pelas condições do evento PR. Os commits posteriores desta atualização são exclusivamente documentais.
- README atualizado com guia operacional; relatório GC-CI-014 atualizado com controles de PAT; este checkpoint atualiza o estado de PRs e pendências. Os commits de README/relatório/fila são apenas documentais. Nenhum run novo foi criado: o workflow carregado pela branch-base da PR #14 não inclui README nem docs em pull_request.paths; push só valida main. Isso é o comportamento esperado para esta atualização sem código, não uma falha de CI. O último SHA de código continua validado pelo run #42290749610.
- **Aceite manual ainda pendente:** executar no Windows o fluxo offline `file://` com IndexedDB real do navegador: importar peça, editar, salvar, fechar/reabrir, reabrir pela Biblioteca, gravar no Creator, salvar o projeto principal e confirmar persistência após nova abertura.
- **Revisão independente ainda pendente:** solicitar/obter review formal do CodeRabbit ou de outro revisor no HEAD atualizado da PR #14. Os findings antigos da #13 foram reconciliados, mas não substituem uma revisão nova.
- A PR #11 já foi integrada na `main` pelo merge `e9335b9527fc20c1ee6bf95c7729f8a82e68339c`; CI pós-merge [#42374165197](https://github.com/LORECRONICASAPOENA/GameCreator/actions/runs/42374165197) terminou `completed/success`.
- **Próximas ações:** concluir aceite manual offline/IndexedDB e revisão independente; depois retargetear a #14 para `main`, confirmar o diff, executar CI canônica no novo SHA e somente então avaliar sair de Draft/merge. Não mesclar a #14 antes desses critérios.
- **WIP=1 permanece ativo** em GC-CHAR-001 / PR #14. Não iniciar outro eixo de implementação em GameCreator/Pixel Art em paralelo.

