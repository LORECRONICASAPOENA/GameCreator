# Checkpoint — teste de handshake por fragmento antes do ajuste do ambiente fake

- Data: 2026-11-04 (BRT); hora exata não preservada.
- Repositório: LORECRONICASAPOENA/GameCreator
- Branch: `feat/apoena-modular-character-creator-integration`
- HEAD: `8417b37e44242fce1cd3ffb00bdbe38a3b88ae45`
- Arquivo: `tests/creator-bridge.test.cjs`
- Blob anterior: `1b5a2ecd57c2915456b7947f83294155f6952853`
- Diagnóstico: o fake Window já simula a direção correta de `postMessage`, mas não expõe `URLSearchParams` no objeto `window` simulado. A leitura do fragmento ocorre; a limpeza do nonce precisa usar a API de URL disponível no fake.
- Correção: expor `URLSearchParams` no fake Window para testar leitura e remoção do fragmento, sem alterar o runtime de produção.
