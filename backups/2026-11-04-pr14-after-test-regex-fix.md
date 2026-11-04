# Backup pós-ajuste do teste — GameCreator PR #14

**Data:** 2026-11-04
**Repositório:** `LORECRONICASAPOENA/GameCreator`
**PR:** #14
**Branch funcional:** `feat/apoena-modular-character-creator-integration`
**SHA preservado:** `2ec3c55c1612fdb885e328bfa19f5ef64a49f010`
**Branch de backup:** `backup/pr14-after-test-regex-fix-20261104`

## Ajuste desta etapa

O run #395 identificou falha no teste `tests/preset-request-guard.test.cjs`: os regexes exigiam espaços que não existem no estilo minificado de `estudio.js`, embora a implementação estivesse usando o guard. Os padrões foram ajustados para aceitar whitespace opcional sem relaxar as verificações semânticas.

## Conteúdo preservado

- Guard de concorrência em `pixel-art/preset-request-guard.js`.
- Integração no `pixel-art/estudio.js` e carregamento prévio em `pixel-art/estudio.html`.
- Teste Node `tests/preset-request-guard.test.cjs` com regexes tolerantes a espaços.
- Workflow com validação de sintaxe, teste do guard e rota obrigatória.
- Atualizações documentais dos incidentes e pendências.

## Validação

- Run #395: `failure` no teste do guard, por regex incompatível com o estilo minificado. Não foi falha de sintaxe nem de execução do browser.
- Run #398: https://github.com/LORECRONICASAPOENA/GameCreator/actions/runs/41840891930 — concluiu `success` no SHA `2ec3c55c1612fdb885e328bfa19f5ef64a49f010`; todas as etapas de validação passaram, e as etapas opcionais de empacotamento/entrega foram `skipped`.
- Aguardando resultado do run #398 antes de marcar o ajuste como validado.

## Limites

PR #14 continua draft, não mesclada; a branch de backup preserva o SHA acima.

## Aditivo — resultado posterior

O run #398 concluiu `success` no SHA preservado. O job validou a integração do guard, o teste de concorrência dos presets, o Estúdio no navegador, exportação, biblioteca IndexedDB, backup/restauração e runtime Godot. A PR #14 permanece draft e não foi mesclada.
