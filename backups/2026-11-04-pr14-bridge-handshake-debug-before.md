# Checkpoint — diagnóstico do handshake da ponte

- Data: 2026-11-04 (BRT); hora exata não preservada.
- Repositório: LORECRONICASAPOENA/GameCreator
- Branch: `feat/apoena-modular-character-creator-integration`
- HEAD anterior: `64d0fc4551fcb2037fcfd791cf3dd240f2f47701`
- Run com falha: [#41905233755](https://github.com/LORECRONICASAPOENA/GameCreator/actions/runs/41905233755).
- Evidência do artefato `v41-ci-diagnostics.zip`: os fluxos de biblioteca passaram; `HOSTTRACE` mostrou `saveProject/listProjects/saveAsset/listAssets`, mas `BRIDGETRACE` ficou vazio e o payload não chegou ao host.
- Diagnóstico: a origem da falha é anterior ao handshake; a janela filha não enviou `ready`. O iframe tinha o atributo `name` com nonce, mas o nonce não foi observado pelo bridge da janela filha. Não assumir que `iframe.name` sempre será refletido em `window.name` em todos os contextos.
- Correção planejada: transportar o nonce também no fragmento da URL (`#apoenaBridgeToken=...`), que não é enviado ao servidor; remover o fragmento após leitura; manter `window.name` como fallback. Corrigir o fake Window do teste para simular corretamente as direções de `postMessage`.
- Blobs anteriores:
  - `shared/creator-bridge.js`: `772daec8d1ce803f5b05f87801c027a4c9bea003`
  - `pixel-art/modulo-integrado.js`: `42530a118a8459bf91a5b1dc4f117d47c2bc4c3f`
  - `tests/personagens-browser.html`: `7264f96c68a3d4990b03c5de72d5a447165e1a91`
  - `tests/creator-bridge.test.cjs`: `00509824820ed9a6e10432cb8b9690e72cc84276`
- Nenhum merge, fechamento de PR ou force-push.
