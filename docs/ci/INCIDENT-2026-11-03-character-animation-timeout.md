# Incidente CI — run 41743357325: timeout ao avançar animação

- **Repositório/PR:** LORECRONICASAPOENA/GameCreator, PR #14, branch `feat/apoena-modular-character-creator-integration`.
- **Run/job/step:** [41743357325](https://github.com/LORECRONICASAPOENA/GameCreator/actions/runs/41743357325), job `validar` (126290129740), step 11 “Testar Criador Modular no navegador”.
- **Commit:** `2c656cfea31f8782299e2e0372d196ddaf3bf31b`.
- **Ocorrência:** 2026-11-03 21:00:37 BRT (log UTC: 2026-11-04 00:00:37Z).
- **Cadastro:** 2026-11-04; hora exata não preservada.

## Mensagem literal

`Timeout: Personagem gravado no projeto atual do Creator. Salve o projeto principal para guardar essa alteração.`

## Diagnóstico original

O step 11 expirou ao aguardar mudança em `frameInfo` depois do clique em `play`. O status da página continha a confirmação do Creator. A evidência anterior confirmou que o host recebeu o pedido `saveAsset` e armazenou `manifest` e `png`; portanto, essa ocorrência não demonstra falha do bridge.

O loop de produção avança quadros por `requestAnimationFrame` e respeita `document.hidden`. A hipótese de que o Chrome headless estivesse tratando o iframe como oculto era plausível, mas não foi comprovada como causa raiz.

## Correção aplicada no harness

- O runtime expõe `advanceFrame()` somente quando a página é aberta com `?test=1`; a função avança o índice interno e redesenha a prévia, sem alterar o loop de produção.
- O teste do navegador simula o iframe como visível e usa esse hook para verificar a transição de quadro de `1 / 3` para `2 / 3`.
- O agendamento real de `requestAnimationFrame` não é executado por esse hook. A correção elimina a dependência temporal do Chrome headless, mas deixa a validação do agendador real como cobertura separada.
- O fluxo de gravação no Creator e as assertions de manifesto/PNG continuam cobertos no mesmo teste funcional.

## Validação posterior

- **Commit de código validado:** `2ec3c55c1612fdb885e328bfa19f5ef64a49f010`.
- **Run:** [#41840891930](https://github.com/LORECRONICASAPOENA/GameCreator/actions/runs/41840891930).
- **Resultado:** job completo `success`; o step 11 “Testar Criador Modular no navegador” passou, assim como smoke test, sintaxe, persistência IndexedDB, backup/restauração, contratos e runtime Godot. Etapas opcionais de empacotamento/entrega foram `skipped`.
- Os arquivos de código em `bbca6f3` foram conferidos como idênticos aos do SHA validado `2ec3c55`; os commits posteriores eram documentais.

## Estado

**RESOLVIDO COMO FALHA DE VALIDAÇÃO DO CI** no fluxo automatizado da PR #14. A falha original permanece registrada como histórica. A reprodução de animação em navegador visível/dispositivo real não é comprovada por esse hook e deve ser conferida separadamente se fizer parte do aceite funcional.
