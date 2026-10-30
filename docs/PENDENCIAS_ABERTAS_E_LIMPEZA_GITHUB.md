# Registro de pendências abertas e limpeza do GitHub

**Data do levantamento:** 29/10/2026 21:37 BRT  
**Escopo:** Apoena Game Creator e Apoena Pixel Art HTML  
**Objetivo:** manter uma lista única de trabalho, reduzir validações duplicadas e não encerrar tarefas sem confirmar que seu conteúdo foi preservado.

## 0. Controle sequencial de tarefas

**Protocolo obrigatório:** [Protocolo de trabalho sequencial](PROTOCOLO_TRABALHO_SEQUENCIAL.md) — aplicado também ao [repositório Pixel Art](https://github.com/apoenalore/Apoena-pixel-art-html/blob/main/docs/PROTOCOLO_TRABALHO_SEQUENCIAL.md). Limite de trabalho em andamento: **WIP = 1 para os dois repositórios combinados**.

### Tarefa concluída — retirada da fila ativa

- **T-001 — Registrar o protocolo sequencial nos dois repositórios**
- **Estado:** CONCLUÍDA. Os documentos estão publicados em ambos os repositórios. A validação do Pixel Art [40965795436](https://github.com/apoenalore/Apoena-pixel-art-html/actions/runs/40965795436) terminou com `completed/success` em `main`. Os ajustes posteriores foram exclusivamente documentais e não exigem nova suíte de código.
- **Critério atendido:** protocolo publicado, validação exigida aprovada, resultado registrado. Mantido somente neste histórico; não é pendência aberta.

### Tarefa ativa única

- **T-002 — Estabilizar CI/runner do Game Creator e consolidar as falhas de validação.**
- **Estado:** BLOQUEADA — cancelamento manual da fila antiga é necessário; nenhuma nova validação foi disparada.
- **Levantamento completo:** consulta das 324 execuções do Game Creator (4 páginas da API): **13 queued, 0 in_progress**. As outras 311 execuções estavam concluídas/canceladas. Amostra de jobs confirma runner_id = 0, runner_name vazio e labels exigidos self-hosted, Windows, X64.
- **Limitação operacional:** a conexão GitHub disponível nesta sessão permite consultar execuções, jobs e logs, mas não expõe uma operação de cancelamento de workflow. Não declarar fila limpa nem fingir cancelamento. É necessária a ação manual de cancelamento dos 13 IDs abaixo no GitHub Actions.
- **Escopo:** cancelar a fila obsoleta/duplicada; confirmar runner e labels; executar uma única validação canônica da branch atual; diagnosticar e corrigir qualquer falha antes de repetir; concluir a revisão de CI e dos erros conhecidos do Creator. Nenhuma funcionalidade nova pode começar antes do encerramento de T-002.

## 1. Estado geral

- [x] Inventário de pull requests, workflows e execuções do Actions.
- [x] Confirmar validações recentes bem-sucedidas no Pixel Art.
- [x] Consultar todas as 324 execuções do Game Creator: 13 em fila, nenhuma em andamento.
- [x] Escolher um workflow canônico de validação do Creator.
- [x] Remover a agenda periódica redundante do workflow principal.
- [x] Unificar concorrência por branch para eventos push e pull_request.
- [x] Remover dois workflows manuais redundantes após conferir que os testes estão cobertos pela validação canônica.
- [x] Preservar o workflow separado de build/publicação, que tem finalidade própria.
- [ ] Cancelar manualmente os 13 jobs antigos ainda queued.
- [ ] Confirmar disponibilidade do runner Game Creator com labels compatíveis.
- [ ] Executar uma única validação canônica e resolver eventuais falhas antes de repetir.
- [ ] Decidir o destino dos protótipos de hidrologia depois de preservar seus arquivos exclusivos.

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

Consulta completa em 29/10/2026 21:37 BRT: 324 execuções consultadas em quatro páginas; **13 queued, 0 in_progress**. Nas execuções representativas, os jobs solicitam labels self-hosted, Windows, X64, mas aparecem com runner_id = 0 e runner_name vazio. Isso confirma que nenhum runner foi atribuído; a causa pode ser runner offline, labels incompatíveis ou registro/permissão, e ainda precisa ser verificada.

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

**Por que ainda não foram canceladas:** a integração GitHub disponível nesta sessão não oferece a ação/API de cancelamento (somente leitura para execuções e jobs). Não posso executar o cancelamento por essa conexão. Não criei outro workflow para contornar isso, pois seria mais uma execução e contrariaria a regra de limpeza.

**Ação necessária:** no GitHub, abrir cada execução acima e usar **Cancel workflow** enquanto o estado ainda for Queued. Depois, consultar novamente todas as páginas e confirmar zero queued e zero in_progress. Em seguida, verificar em Settings → Actions → Runners se APOENA-GAMECREATOR-RUNNER está online e possui os labels exigidos. O texto “Listening for Jobs” no CMD, sozinho, não comprova a atribuição ao repositório.

Não disparar nenhuma nova validação antes dessas duas verificações. Depois da fila zerada e do runner confirmado, executar uma única validação canônica da PR #6; se falhar, diagnosticar o primeiro erro causal e corrigir antes de nova tentativa.

### Validação anterior

Execução [`40942973127`](https://github.com/apoenalore/GameCreator/actions/runs/40942973127) passou nos testes isolados de integração de catálogo em um commit anterior. A execução agendada [`40942880450`](https://github.com/apoenalore/GameCreator/actions/runs/40942880450) falhou na suíte automatizada; esse erro ainda precisa ser revisto no log. Os testes executados em ambiente de análise não substituem a confirmação do CI no runner real.

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

**Estado confirmado (29/10/2026 21:37 BRT):** Pixel Art: 68 execuções consultadas; 0 queued e 0 in_progress; validação principal [40965795436](https://github.com/apoenalore/Apoena-pixel-art-html/actions/runs/40965795436) aprovada. Game Creator: 324 execuções consultadas; 13 queued e 0 in_progress. A limpeza da fila continua bloqueada até o cancelamento manual dos 13 IDs acima.

## 5. Regra para evitar repetição

- Não disparar outra validação enquanto a mesma branch/commit já tiver um job pendente sem runner atribuído.
- Usar concorrência por branch e cancelar somente execuções obsoletas da mesma branch.
- Manter uma validação principal por projeto, mais workflows de publicação que tenham finalidade própria.
- Não fechar PR nem apagar arquivo de protótipo sem comparar os arquivos exclusivos e decidir o que será preservado.
