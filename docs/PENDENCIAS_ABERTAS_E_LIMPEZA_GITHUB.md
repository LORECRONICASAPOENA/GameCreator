# Registro de pendências abertas e limpeza do GitHub

**Data do levantamento:** 29/10/2026  
**Escopo:** Apoena Game Creator e Apoena Pixel Art HTML  
**Objetivo:** manter uma lista única de trabalho, reduzir validações duplicadas e não encerrar tarefas sem confirmar que seu conteúdo foi preservado.

## 1. Estado geral

- [x] Inventário inicial de pull requests abertos e workflows.
- [x] Confirmar uma execução completa bem-sucedida no runner Pixel Art.
- [x] Identificar que trabalhos recentes do Game Creator permanecem sem runner atribuído.
- [ ] Consolidar os workflows duplicados e revalidar os dois projetos.
- [ ] Decidir o destino dos pull requests de protótipo de hidrologia após comparar os arquivos exclusivos.
- [ ] Confirmar os testes no runner Game Creator depois de restabelecer a atribuição de jobs.

## 2. Apoena Pixel Art HTML

### Pull requests abertos

| PR | Assunto | Estado observado | Próxima ação |
|---|---|---|---|
| [#5 Calendário regional, clima configurável e hidrologia 2D](https://github.com/apoenalore/Apoena-pixel-art-html/pull/5) | Calendário, clima, umidade, erosão e integração Godot/HTML | Aberto; mergeable; 13 arquivos. Execução CI `40949815160` passou em todas as etapas. | Principal candidato para integrar a implementação ambiental após revisão final. |
| [#4 Protótipo de hidrologia 2D](https://github.com/apoenalore/Apoena-pixel-art-html/pull/4) | Protótipo com seis níveis, chuva e erosão | Aberto; mergeable; 8 arquivos. | Comparar os arquivos exclusivos `hidrologia_floresta.js`, `hidrologia_teste.html` e `tests/testar_hidrologia.cjs` com a implementação atual. Não fechar antes de decidir se algum conteúdo deve ser preservado. |
| [#3 Modos offline e salas LAN](https://github.com/apoenalore/Apoena-pixel-art-html/pull/3) | Modos de partida e sessão LAN | Aberto; mergeable; 10 arquivos. | Trabalho distinto; manter aberto e validar separadamente. |

### Workflows encontrados na `main`

- `.github/workflows/validar-pixel-art-windows.yml`: runner Windows `pixel-art`; execução de ecossistema, JavaScript e Godot.
- `.github/workflows/validar-godot.yml`: runner Ubuntu; repete partes da mesma validação e teve execução com falha (`40949428714`), enquanto a validação Windows correspondente passou (`40949428700`).
- `feat/tempo-biomas-hidrologia` contém `.github/workflows/validar-ambiente-windows.yml`, que executou com sucesso em `40949815160`.

**Ação de limpeza:** manter um workflow principal de validação Windows e incorporar nele os testes ambientais antes de remover o workflow Ubuntu duplicado. Preservar o workflow específico da branch ambiental somente enquanto essa branch precisar de validação independente.

### Validação ambiental confirmada

Execução [`40949815160`](https://github.com/apoenalore/Apoena-pixel-art-html/actions/runs/40949815160): sucesso em sintaxe JavaScript, testes de calendário/clima e hidrologia HTML, regressão do ecossistema, importação Godot, testes Godot de clima, ecossistema e hidrologia, inicialização headless e publicação dos logs.

## 3. Apoena Game Creator

### Pull requests abertos

| PR | Assunto | Estado observado | Próxima ação |
|---|---|---|---|
| [#6 Biomas, variantes sazonais e simulação hidrológica 2D](https://github.com/apoenalore/GameCreator/pull/6) | Perfis de terreno, biomas, variantes sazonais e hidrologia | Aberto; mergeable; 5 arquivos. Validações recentes estão na fila. | Principal implementação ambiental do Creator; concluir CI e revisão. |
| [#5 Protótipo de hidrologia 2D](https://github.com/apoenalore/GameCreator/pull/5) | Motor experimental, página de teste e seis níveis | Aberto; mergeable; 7 arquivos. | Comparar `map-editor/hidrologia-core.js`, página de teste e testes com o sistema de terreno da PR #6. Decidir se é protótipo independente, conteúdo a integrar ou PR a encerrar. |
| [#4 Contratos de modos offline, salas MOBA 5v5 e sistemas de mundo](https://github.com/apoenalore/GameCreator/pull/4) | Contratos de sessão e sistemas de mundo | Aberto; mergeable; 7 arquivos. | Trabalho distinto; manter aberto e validar separadamente. |

### Workflows encontrados na `main`

- `.github/workflows/pixel-art.yml`: validação ampla do Creator, com testes de editor, biblioteca, build e runtime.
- `.github/workflows/testar-integracao.yml`: testes de contrato para catálogo, terreno, objetos de mundo e natureza; compartilha alguns gatilhos/checagens com a validação ampla, mas possui testes específicos.
- `.github/workflows/auto-validar-v41.yml`: executa a validação da branch V4.1 a cada hora. A validação por push já existe em `pixel-art.yml`, portanto a agenda horária é redundante e pode gerar fila desnecessária.
- `.github/workflows/publicar-creator-unificado.yml`: build/publicação do Creator em `main`; tem finalidade diferente e deve ser preservado.

**Ação de limpeza:** consolidar os testes específicos de integração na validação principal, garantir gatilhos para PRs e branches de trabalho, retirar a agenda horária redundante e preservar o workflow de publicação.

### Bloqueio de runner

Os trabalhos recentes do Creator aparecem como `queued`, com `runner_id = 0` e sem `runner_name`. O runner conhecido em uma execução anterior bem-sucedida é `APOENA-GAMECREATOR-RUNNER` (ID 2; execução `40942973127`). Isso significa que, no momento das consultas, o GitHub ainda não atribuiu o runner aos novos trabalhos. O estado “Listening for Jobs” no CMD, isoladamente, não confirma que o runner esteja disponível para este repositório e para os labels solicitados.

**Ação:** confirmar o registro/conexão do runner Game Creator no GitHub e só então executar uma validação de referência. Não criar novas execuções repetidas enquanto os jobs continuarem sem atribuição.

### Validação anterior

Execução [`40942973127`](https://github.com/apoenalore/GameCreator/actions/runs/40942973127) passou nos testes isolados de integração de catálogo em um commit anterior. A execução agendada [`40942880450`](https://github.com/apoenalore/GameCreator/actions/runs/40942880450) falhou na suíte automatizada; esse erro ainda precisa ser revisto no log. Os testes executados em ambiente de análise não substituem a confirmação do CI no runner real.

## 4. Ordem de fechamento

1. Corrigir a atribuição de jobs ao runner Game Creator.
2. Consolidar os workflows sem perder cobertura de testes.
3. Revalidar a branch ambiental do Pixel Art e a branch ambiental do Creator.
4. Comparar os dois PRs de protótipo de hidrologia com as implementações atuais e preservar os arquivos únicos que ainda forem necessários.
5. Revisar os resultados finais dos PRs de modos offline/LAN e sistemas de mundo.
6. Atualizar este registro com links e resultados finais; marcar uma pendência como concluída somente depois de confirmar a execução correspondente.

## 5. Regra para evitar repetição

- Não disparar outra validação enquanto a mesma branch/commit já tiver um job pendente sem runner atribuído.
- Usar concorrência por branch e cancelar somente execuções obsoletas da mesma branch.
- Manter uma validação principal por projeto, mais workflows de publicação que tenham finalidade própria.
- Não fechar PR nem apagar arquivo de protótipo sem comparar os arquivos exclusivos e decidir o que será preservado.
