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


## Atualização após run #41702943279

- Resultado: o step de navegador falhou, embora o log final mostre `GLOBAL_RECEIVED=true`, `FRAME_RECEIVED=false` e `stored=true:keys=manifest,png`.
- Evidência aponta para timeout de observação no harness: o callback do host armazenou o payload manifest+PNG, mas a condição de espera não o viu a tempo.
- Correção enviada no commit 
7cfcdf6f670bb6c86ff72aac9a5d0f9c72388bd5. Foi ampliado para 30 s apenas o limite da espera da captura do bridge, com checagem final; as assertions permanecem.
- Run [#41702943279](https://github.com/apoenalore/GameCreator/actions/runs/41702943279) falhou antes dessa correção. A execução automática seguinte decide se o problema está resolvido.


## Atualização após run #41704904027

- A espera de 30 s ainda expirou. O log confirmou que o callback do host recebeu e armazenou `manifest` e `png`, mas a condição de polling não percebeu o valor.
- Commit seguinte substitui o polling por Promise resolvida no callback, mantendo 30 s de timeout e todas as assertions.
- Run [#41704904027](https://github.com/apoenalore/GameCreator/actions/runs/41704904027) falhou antes dessa mudança; a correção ainda precisa passar no workflow canônico.


## Retomada após o acesso à organização — 03/11/2026

- O usuário forneceu a página de repositórios de `LORECRONICASAPOENA`. A conexão GitHub `apoena` listou o GameCreator com permissão administrativa, incluindo leitura e escrita.
- Estado observado da [PR #14](https://github.com/LORECRONICASAPOENA/GameCreator/pull/14): aberta, draft, sem merge, base `feat/apoena-personagem-estudio-main`; head em `68b849ecd12afbf600b970bc91b0a37c2c22555f).
- O run [#41705785826](https://github.com/LORECRONICASAPOENA/GameCreator/actions/runs/41705785826), no head anterior `7e5bdb0`, falhou no step 11 do teste de navegador. O log registrou `GLOBAL_RECEIVED=true`, com manifesto e PNG recebidos pelo host, enquanto a etapa aguardava a fila ociosa do iframe.
- Foi enviado o commit [`7a6b717`](https://github.com/LORECRONICASAPOENA/GameCreator/commit/7a6b717ffcccfa52fcb32c4d2d4a197d9354efc6), que faz o teste do botão “Gravar no Creator” aguardar o payload e a mensagem de conclusão da interface, preservando as assertions de 12 frames e PNG.
- Um commit subsequente, [`68b849e`](https://github.com/LORECRONICASAPOENA/GameCreator/commit/68b849ecd12afbf600b970bc91b0a37c2c22555f), ajustou o teste para aguardar diretamente a fila de operações do personagem.
- O run [#41726951760](https://github.com/LORECRONICASAPOENA/GameCreator/actions/runs/41726951760), para `7a6b717`, foi cancelado quando o novo commit chegou. O run [#41727053903](https://github.com/LORECRONICASAPOENA/GameCreator/actions/runs/41727053903), no head `68b849e`, estava em andamento na etapa de diagnóstico do runner no momento deste registro; ainda não há resultado da validação do Criador Modular.
- A conversa também inclui a imagem enviada do sprite da personagem Blin, identificada como `image(1).png` no histórico de arquivos da conversa.
- As PRs #13 e #14 permanecem com escopo sobreposto. Nenhuma delas foi mesclada e a integração não deve ser declarada concluída até a CI do head atual passar e a sobreposição ser reconciliada.
