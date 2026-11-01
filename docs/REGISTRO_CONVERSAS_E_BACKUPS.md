# Game Creator — registro de conversas, checkpoints e backup no GitHub

Este documento registra fatos novos comprováveis e decisões do autor associados ao Game Creator. Ele complementa `docs/PENDENCIAS_ABERTAS_E_LIMPEZA_GITHUB.md`, `docs/ATUALIZACOES_PENDENTES_LEIA_ANTES_DE_COMECAR.md` e o histórico Git. **Não substitui o código, os assets originais, o backup exportado da biblioteca IndexedDB nem um arquivo integral de conversas.**

## Critérios de registro

1. Registrar data/hora de consulta em BRT, origem, decisão/relato, estado (conversa, planejado, código em branch, integrado, validado), evidência e pendência.
2. Diferenciar claramente o SHA da `main` dos SHAs de PRs e do repositório de Skills.
3. Não presumir acesso a conversas privadas, arquivos locais, anexos ou imagens que não estejam efetivamente disponíveis.
4. Não fazer commits repetidos quando nenhuma informação nova tiver sido encontrada; manter o histórico de versões do GitHub como checkpoint dos arquivos rastreados.
5. Não alterar código, CI, runner, instalações ou recursos do editor apenas para registrar um backup. Respeitar WIP = 1 entre GameCreator e Apoena Pixel Art HTML.
6. Consultar atualizações de `apoenalore/apoenaskil` e registrar apenas as mudanças relevantes, sem misturar o cânone narrativo com funcionalidades implementadas no Creator.

## Checkpoint — 01/11/2026, 20:03 BRT

**Repositório verificado:** [apoenalore/GameCreator](https://github.com/apoenalore/GameCreator), privado, branch padrão `main`.

**Snapshot do código rastreado na main:** commit [`993a8a6bfef714029a0d58c76d2b008b4b2f226a`](https://github.com/apoenalore/GameCreator/commit/993a8a6bfef714029a0d58c76d2b008b4b2f226a), de 01/11/2026 18:32:36 BRT. Esse commit ajusta `.github/workflows/pixel-art.yml` para evitar duplicação de arquivos no artefato de entrega. A validação automática da main [run 41357561095](https://github.com/apoenalore/GameCreator/actions/runs/41357561095), no mesmo SHA, terminou `completed/success`. Isso **não** comprova validação de PRs com código diferente nem teste em dispositivo físico.

### Novidades recentes recuperadas de conversas e GitHub

- **Personagem Apoena e animações — decisão do autor em conversa em 01/11/2026:** acrescentar ao fluxo do Estúdio Pixel Art o personagem principal Apoena e permitir trabalhar movimentos de andar/correr e atacar. A [PR #11](https://github.com/apoenalore/GameCreator/pull/11), `GC-ANIM-006`, está **aberta em rascunho**, head `a9c7148f01504f7be142dd0d852056dd5a9a5114`, **não integrada na main**. A descrição da PR registra corrida multidirecional em grade 4×4 e predefinições de ataque lateral em grades iniciais 6×2; estas grades de ataque são aproximadas devido a efeitos que cruzam células. A prévia de “andar” reutiliza poses de corrida e **não** constitui caminhada fiel. PNGs originais devem ser preservados. Edição, prévia e exportação no Estúdio não comprovam animações funcionais no gameplay/Godot.
- **Estado da validação da PR #11:** [run 41357977741](https://github.com/apoenalore/GameCreator/actions/runs/41357977741), no head citado, terminou `completed/failure`; [run 41357968979](https://github.com/apoenalore/GameCreator/actions/runs/41357968979) foi cancelado. A causa técnica da falha **não foi diagnosticada nesta consulta**. Não declarar a PR pronta, não repetir CI cegamente e não fazer merge sem revisão e validação.
- **Controle sequencial:** a descrição da PR #11 registra que o trabalho no atualizador `GC-UPDATE-009` foi **pausado por solicitação expressa do autor** para priorizar a animação do personagem. Isso atualiza o contexto do registro central datado de 30/10, que ainda mostrava o atualizador como tarefa ativa. A PR #11 permanece a frente de implementação em curso; não iniciar uma segunda frente por causa deste checkpoint.
- **Biblioteca de Skills consultada:** [apoenalore/apoenaskil](https://github.com/apoenalore/apoenaskil), branch `main`, head observado [`9f7b138687e5eea6c587d6f71693f3d51c7cd71e`](https://github.com/apoenalore/apoenaskil/commit/9f7b138687e5eea6c587d6f71693f3d51c7cd71e), de 01/11/2026 20:02:16 BRT. O commit mais recente amplia o registro de recuperação de conversa sobre história e geografia de Apoena. Commits imediatamente anteriores da mesma data integraram conhecimento recuperado de conversas. O repositório declara expressamente que a recuperação integral de todas as conversas e a cópia dos anexos binários **não foram concluídas**. Conteúdo narrativo de Skills não deve ser tratado como recurso já programado no Game Creator.
- **Preservação da base:** `APOENA_GAME_CREATOR_V4_0_BANCADA_INTEGRADA.html` continua presente na raiz da main; `README.md` descreve V4.1 em desenvolvimento e distingue editor, biblioteca, ponte e runtime. A presença desses arquivos no GitHub é confirmada; nenhum backup da instalação Windows, dados IndexedDB, arquivos não enviados ou pasta local foi realizado nesta consulta.

### Limites e próxima conferência

Esta captura registra o **estado remoto comprovado** e o resumo de decisões recentes acessíveis. Não representa cópia literal/integral de todas as conversas nem sincronização automática de alterações que existam somente no computador do autor. Na próxima conferência, comparar o SHA da `main`, a PR #11 e o head de `apoenaskil`; acrescentar um novo checkpoint somente diante de mudanças relevantes. Investigar a falha de CI da PR #11 dentro da tarefa ativa, sem criar workflow paralelo.
