# Checkpoint — reconciliação dos deltas exclusivos da PR #13 antes da portabilidade

- Data: 2026-11-04 (BRT); hora exata não preservada.
- Repositório: LORECRONICASAPOENA/GameCreator
- Branch de trabalho: `feat/apoena-modular-character-creator-integration`
- HEAD antes da portabilidade: `ceec4ddc752455e13650d051037aa8a2f9dd9e33`
- PR de origem: #13, SHA `34a0a722444448e384c91286affecf0f50217038`
- PR de destino: #14.

## Estado anterior na PR #14
- `integracao/build_unificado.ps1`: blob `9b79962fa2f530f5de4816782c865e4214e2a8f8`; faltavam as verificações de presença dos quatro arquivos do Criador Modular.
- `integracao/build_unificado.py`: blob `5457bd6039fb83d902ba55cc5580dd115033bb29`; faltavam as mesmas verificações.
- `integracao/godot/tests/test_catalogo.gd`: blob `b20063098b71d27f3fea28c7ab1925bdb32fd586`; faltava o teste do recurso `SpriteFrames` exportado.
- `integracao/godot/character-test.tres`: ausente na PR #14; origem PR #13 blob `181cd5e2f7e935b44ae6d13fb8c37a13620bc2e2`.
- `character-creator/index.html`: ausente na PR #14; origem PR #13 blob `ad08dba827a32aed26aa1dea9efa373f58d16885`; página de compatibilidade que redireciona para `pixel-art/personagens.html`.

## Alterações planejadas
1. Portar os checks do criador modular para os dois scripts de build.
2. Portar o teste de exportação Godot e o fixture SpriteFrames.
3. Preservar a rota antiga `character-creator/index.html` como redirect.
4. Validar pelo workflow canônico depois que a branch-base PR #11 habilitar o evento pull_request da PR #14.

## Recuperação
Os blobs anteriores e a origem da PR #13 estão identificados acima. Não alterar a `main`, não fechar PR #13 e não fazer merge automático.
