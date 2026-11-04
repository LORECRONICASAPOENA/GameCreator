# Backup pós-correção — GameCreator PR #14

**Data:** 2026-11-04
**Repositório:** `LORECRONICASAPOENA/GameCreator`
**PR:** #14
**Branch de trabalho:** `feat/apoena-modular-character-creator-integration`
**SHA preservado:** `dca28d0065a4cc24f38d6ebff759346575b49428`
**Branch de backup:** `backup/pr14-after-preset-race-fix-20261104`

## Alterações preservadas

- `pixel-art/preset-request-guard.js`: helper monotônico `begin()/isCurrent()` para invalidar carregamentos antigos.
- `pixel-art/estudio.js`: cada carregamento de preset recebe ID; somente o callback `onload`/`onerror` da solicitação mais recente pode alterar estado ou status.
- `pixel-art/estudio.html`: carrega o helper antes de `estudio.js`.
- `tests/preset-request-guard.test.cjs`: teste Node que verifica a semântica de concorrência e a integração do helper no HTML/JS.
- `.github/workflows/pixel-art.yml`: valida sintaxe de `estudio.js`/helper, executa o teste do guard e exige a rota do helper no smoke test.

## Commits da etapa

- Helper: `5a80e099549024692f0a3600679e95a022935f64`.
- Teste: `a2ef0da88e70884dab140b7828628fc640191f93`.
- Guard no Estúdio: `8f354b3711330ae18e8b1e4cbe8ed3cc344ee6f5`.
- Script incluído no HTML: `6fda0abd763f33412be7b454bdd6e8c055320bb4`.
- Workflow: `dca28d0065a4cc24f38d6ebff759346575b49428`.

## Validação

- O commit intermediário `a2ef0da...` gerou run #393, que foi cancelado pelo workflow durante o smoke test após um commit posterior; não é validação final.
- O commit final `dca28d...` gerou run #395: https://github.com/LORECRONICASAPOENA/GameCreator/actions/runs/41840382239. Estado observado: `in_progress`.
- Aguardando conclusão do run #395; não declarar a correção validada antes do `success`.

## Backups anteriores

- Backup pré-correção: `backup/pr14-before-preset-race-fix-20261104`, base `4f90fc8739b4af351c929a97d8ed73c094477c36`.

## Limites

PR #14 continua draft e não foi mesclada. O backup preserva código Git, não dados locais, IndexedDB nem pacote Android.

## Aditivo — resultado posterior do run #395

O run #395 terminou `failure` na etapa `Testar concorrência dos presets Apoena` porque o teste exigia espaços que não existem no JavaScript minificado. A implementação do guard não foi apontada como falha. Os padrões do teste foram ajustados no SHA `2ec3c55c1612fdb885e328bfa19f5ef64a49f010`; o run #398 desse SHA concluiu `success`.
