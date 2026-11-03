# Backup da conversa — Pendências do GameCreator — 03-11-2026

**Data:** 3 de novembro de 2026 (BRT)  
**Projeto:** Apoena Game Creator / Criador Modular de Personagens  
**Repositório:** [apoenalore/GameCreator](https://github.com/apoenalore/GameCreator)

## Pedido do usuário

“Como Amigo Apoena, resolva as pendências do Creator e faça backup dessa conversa.” O usuário também reforçou anteriormente que os poderes/botões do Apoena Agar devem ser levados ao Pixel Art HTML, que será jogo Android em Godot; esta sessão ficou focada na pendência aberta do Creator.

## Estado encontrado

- PR #14, [Integrate Apoena Modular Character Creator into Pixel Art](https://github.com/apoenalore/GameCreator/pull/14), continua draft e aberta, base `feat/apoena-personagem-estudio-main`.
- PR #13 está aberta com escopo sobreposto; precisa ser reconciliada antes de integração.
- Validação histórica passou em SHA `03382b02e74e2b39da0924bd0ff72ddacdf27e5`; não vale como validação do head atual.
- Falha corrente: o teste de navegador espera o payload de “Gravar no Creator” e expira, embora a interface indique sucesso.

## Evidências e ações nesta conversa

1. PR #14 falhou no run [#41632223425](https://github.com/apoenalore/GameCreator/actions/runs/41632223425), step 11, aguardando payload do bridge.
2. Incidente documentado em `docs/relatorios-actions/2026-11-03-run-41632223425-character-bridge-timeout.md`.
3. Run [#41663786861](https://github.com/apoenalore/GameCreator/actions/runs/41663786861) reproduziu o timeout no mesmo código funcional.
4. Commit `2a9736e87d09fe37436ee885562b1f0fe22739d9` adicionou instrumentação do bridge. No run [#41665578502](https://github.com/apoenalore/GameCreator/actions/runs/41665578502), build, smoke, sintaxe e teste de modelo passaram; navegador falhou.
5. O log comprova que `saveAsset` chegou ao listener com `sourceIsApp=true` e origem `http://127.0.0.1:4173`; operações do host terminaram. Falta comprovar por que a variável observada pelo teste permanece vazia.
6. Causa-raiz permanece **não confirmada**. A próxima coleta compara visibilidade do payload na janela host e no iframe, sem retirar a validação de 12 frames/PNG.

## Pendências preservadas

- Fechar o diagnóstico e corrigir o teste ou o fluxo real de bridge com evidência.
- Executar e revisar o workflow canônico no novo commit; não declarar resolvido antes de CI verde.
- Reconciliar PRs #13 e #14 antes de concluir integração.
- Acompanhar a PR do Pixel Art que aguarda runner, sem repetição idêntica.
- Outras pendências de tilesets, biblioteca, controles e integração continuam no backlog.

## Decisões

- Não remover nem afrouxar assertions.
- Manter WIP = 1 entre GameCreator e Apoena Pixel Art HTML.
- Não mesclar PRs automaticamente.
- Manter relatórios de CI e planos técnicos no repositório; este documento registra o resumo da conversa.
