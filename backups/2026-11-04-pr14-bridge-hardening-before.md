# Checkpoint — bridge antes do hardening por capability token + MessageChannel

- Data: 2026-11-04 (BRT); hora exata não preservada.
- Repositório: LORECRONICASAPOENA/GameCreator
- Branch: `feat/apoena-modular-character-creator-integration`
- HEAD anterior: `fbcc033cf258f0833208e3eacadd59457d28e1c7`
- Findings: aceitação de `event.origin === "null"` sem allowlist de origem/janela e transporte de payload por `postMessage("*")`.
- Correção planejada: token aleatório de 256 bits por janela autorizada, allowlist de `WindowProxy`, handshake mínimo e transferência de `MessagePort`; payloads e respostas passam exclusivamente pelo canal privado.
- Compatibilidade: preservar uso offline `file://` com validação source+token quando a origem é opaca; exigir origem exata quando não é opaca.
- Blobs anteriores:
  - `shared/creator-bridge.js`: `f9f067577c8f23645521e1a53512618ec87815f4`
  - `pixel-art/modulo-integrado.js`: `104fd81b4eaf087be6dd055be529d0e2e2dc3ce0`
  - `tests/personagens-browser.html`: `3b18ba65a56b578c61e7c423af37959fe6481a10`
  - `tests/creator-bridge.test.cjs`: `75fd45c42cc7889a53f3cf0638dd78d3bf76a051`
  - `README.md`: `b5e91b6aca6ad4636b408c7e6fb09fb2e64b0f13`
- Nenhum merge, fechamento de PR ou force-push.
