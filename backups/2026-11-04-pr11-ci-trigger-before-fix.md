# Checkpoint — workflow da branch-base PR #11 antes da correção

- Data: 2026-11-04 (BRT); hora exata não preservada.
- Repositório: LORECRONICASAPOENA/GameCreator
- Branch: `feat/apoena-personagem-estudio-main`
- Commit-base: `0447ea9dc9d9310e985247325e3af1d1c726519a`
- Arquivo: `.github/workflows/pixel-art.yml`
- Blob anterior: `43b1ba1369b274fd63c45b100a2358a5e44ab3a8`
- Estado anterior: `pull_request.branches: [main]`; a PR #14 usa esta branch como base, portanto o evento de pull request da PR #14 não correspondia ao filtro.
- Correção planejada: incluir `feat/apoena-personagem-estudio-main` no filtro de branches do evento `pull_request`, mantendo o filtro de paths, permissões, runner e concurrency existentes.
- Recuperação: restaurar o blob anterior `43b1ba1369b274fd63c45b100a2358a5e44ab3a8` ou reverter o commit de correção.
- Nenhum merge ou force-push será realizado.
