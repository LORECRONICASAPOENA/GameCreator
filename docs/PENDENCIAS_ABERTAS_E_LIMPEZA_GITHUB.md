# Registro de pendências abertas e limpeza do GitHub

**Data do levantamento:** 29/10/2026  
**Escopo:** Apoena Game Creator e Apoena Pixel Art HTML  
**Objetivo:** manter uma lista única de trabalho, reduzir validações duplicadas e não encerrar tarefas sem confirmar que seu conteúdo foi preservado.

## 1. Estado geral

- [x] Inventário inicial de pull requests abertos e workflows.
- [x] Confirmar uma execução completa bem-sucedida no runner Pixel Art.
- [x] Identificar que trabalhos recentes do Game Creator permanecem sem runner atribuído.
- [x] Reduzir gatilhos duplicados: agenda horária do Creator removida; validação de integração consolidada no workflow principal; workflow Linux do Pixel Art restrito a PRs de sessão.
- [ ] Decidir o destino dos pull requests de protótipo de hidrologia após comparar os arquivos exclusivos.
- [ ] Confirmar os testes no runner Game Creator depois de restabelecer a atribuição de jobs.

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

### Workflows encontrados na `main`

- `.github/workflows/pixel-art.yml`: validação ampla do Creator, com testes de editor, biblioteca, build, runtime e agora os contratos de integração.
- `.github/workflows/testar-integracao.yml`: permanece como opção manual; os gatilhos automáticos foram retirados para não executar a mesma suíte em paralelo.
- `.github/workflows/auto-validar-v41.yml`: agora é manual; a agenda horária e o gatilho de push redundantes foram removidos.
- `.github/workflows/publicar-creator-unificado.yml`: build/publicação do Creator em `main`; tem finalidade diferente e deve ser preservado.

**Limpeza realizada:** os testes de integração foram incorporados à validação principal; o workflow dedicado ficou manual; a agenda horária redundante foi removida. O workflow de publicação permanece separado porque altera/constrói a entrega do Creator.

### Bloqueio de runner

Os trabalhos recentes do Creator aparecem como `queued`, com `runner_id = 0` e sem `runner_name`. O runner conhecido em uma execução anterior bem-sucedida é `APOENA-GAMECREATOR-RUNNER` (ID 2; execução `40942973127`). Na última consulta havia 13 execuções queued. A agenda horária já foi removida, mas isso não cancela os jobs criados antes da alteração. A tentativa de limpeza automática [`40961681593`](https://github.com/apoenalore/GameCreator/actions/runs/40961681593) falhou antes do primeiro step por não receber runner; o workflow temporário foi removido para não deixar outro fluxo permanente.

**Execuções antigas ainda na fila — cancelar manualmente em Actions:**
- [40959244729 — validação agendada antiga](https://github.com/apoenalore/GameCreator/actions/runs/40959244729)
- [40949144668 — validação da branch V4.1](https://github.com/apoenalore/GameCreator/actions/runs/40949144668)
- [40947634011 — validação Pixel Art, PR ambiental](https://github.com/apoenalore/GameCreator/actions/runs/40947634011)
- [40947633985 — integração, PR ambiental](https://github.com/apoenalore/GameCreator/actions/runs/40947633985)
- [40947625325 — integração, push ambiental](https://github.com/apoenalore/GameCreator/actions/runs/40947625325)
- [40947611808 — integração, PR ambiental anterior](https://github.com/apoenalore/GameCreator/actions/runs/40947611808)
- [40947601170 — integração, push ambiental anterior](https://github.com/apoenalore/GameCreator/actions/runs/40947601170)
- [40944962186 — integração, PR ambiental antigo](https://github.com/apoenalore/GameCreator/actions/runs/40944962186)
- [40944675654 — integração, PR ambiental antigo](https://github.com/apoenalore/GameCreator/actions/runs/40944675654)
- [40944666718 — integração, push ambiental antigo](https://github.com/apoenalore/GameCreator/actions/runs/40944666718)
- [40943993233 — integração, PR ambiental antigo](https://github.com/apoenalore/GameCreator/actions/runs/40943993233)
- [40943754023 — integração, push ambiental antigo](https://github.com/apoenalore/GameCreator/actions/runs/40943754023)
- [40943621289 — integração, push ambiental antigo](https://github.com/apoenalore/GameCreator/actions/runs/40943621289)

O estado “Listening for Jobs” no CMD, isoladamente, não confirma que o runner esteja disponível para este repositório e para os labels solicitados.

**Ação:** cancelar manualmente as execuções antigas ainda na fila em Actions antes de reativar o runner para que ele não processe commits obsoletos em sequência. Depois, confirmar o registro/conexão do runner Game Creator no GitHub e executar uma única validação de referência. Não criar novas execuções enquanto os jobs continuarem sem atribuição.

### Validação anterior

Execução [`40942973127`](https://github.com/apoenalore/GameCreator/actions/runs/40942973127) passou nos testes isolados de integração de catálogo em um commit anterior. A execução agendada [`40942880450`](https://github.com/apoenalore/GameCreator/actions/runs/40942880450) falhou na suíte automatizada; esse erro ainda precisa ser revisto no log. Os testes executados em ambiente de análise não substituem a confirmação do CI no runner real.

## 4. Ordem de fechamento

1. Corrigir a atribuição de jobs ao runner Game Creator.
2. Confirmar o resultado final da validação Windows atualizada do Pixel Art.
3. Revalidar a branch ambiental do Creator quando o runner voltar a aceitar jobs.
4. Comparar os dois PRs de protótipo de hidrologia com as implementações atuais e preservar os arquivos únicos que ainda forem necessários.
5. Revisar os resultados finais dos PRs de modos offline/LAN e sistemas de mundo.
6. Atualizar este registro com links e resultados finais; marcar uma pendência como concluída somente depois de confirmar a execução correspondente.

## 5. Regra para evitar repetição

- Não disparar outra validação enquanto a mesma branch/commit já tiver um job pendente sem runner atribuído.
- Usar concorrência por branch e cancelar somente execuções obsoletas da mesma branch.
- Manter uma validação principal por projeto, mais workflows de publicação que tenham finalidade própria.
- Não fechar PR nem apagar arquivo de protótipo sem comparar os arquivos exclusivos e decidir o que será preservado.
