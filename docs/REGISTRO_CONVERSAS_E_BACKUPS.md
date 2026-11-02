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

## Checkpoint — 01/11/2026, 20:32 BRT

**Origem:** conversa de acompanhamento de prioridades do projeto em 01/11/2026 e consulta autenticada ao GitHub. **Natureza:** registro documental de diagnóstico e recomendações; nenhuma nova decisão de produto foi confirmada pelo autor nesta conversa.

- **Pergunta do autor:** quais tarefas têm prioridade e estariam travando o sistema. A resposta distinguiu o bloqueio de validação da PR #11 de pendências de produto. Foi **recomendado**, sem autorização para implementar, tratar primeiro o CI da PR #11, depois aperfeiçoar animações e integração com Godot; retomar GC-UPDATE-009 somente após a frente atual. Essa sequência é recomendação de análise, não decisão formal nem evidência de defeito em produção.
- **Estado da main consultado:** head `0cbb4fdd8f1a437565c52a91a44ca031e8905524` (commit documental do checkpoint anterior); nenhum commit novo encontrado desde o registro de 20:03 BRT. O último commit de código identificado continua `993a8a6bfef714029a0d58c76d2b008b4b2f226a`, cuja CI já tinha passado. A main validada **não valida** automaticamente a PR #11.
- **Frente ativa:** [PR #11](https://github.com/apoenalore/GameCreator/pull/11) continua `open/draft`, head `a9c7148f01504f7be142dd0d852056dd5a9a5114`, não integrada. A consulta à execução [41357977741](https://github.com/apoenalore/GameCreator/actions/runs/41357977741) confirmou `completed/failure` no job `validar` (job ID `125003291009`). A consulta de detalhes do job retornou lista de etapas vazia; a tentativa de obter logs retornou erro GitHub/API `404 BlobNotFound`. **Não é possível afirmar a causa da falha**, nem classificá-la como erro do código, runner ou armazenamento sem novas evidências.
- **Demais frentes:** [PR #7](https://github.com/apoenalore/GameCreator/pull/7) permanece aberta em rascunho e pausada como trabalho ativo; PRs #6, #5 e #4 continuam abertas e não foram integradas nesta verificação. Conflitos/validações dessas frentes não devem ser misturados à falha da PR #11.
- **Skills:** o commit mais recente encontrado em `apoenalore/apoenaskil` permanece `9f7b138687e5eea6c587d6f71693f3d51c7cd71e`; sem mudança nova detectada após o checkpoint anterior.
- **Preservação:** nenhuma alteração de código, assets, CI, runner, branch de funcionalidade, merge, instalação Windows ou biblioteca IndexedDB foi executada. O GitHub guarda o código rastreado e este registro, mas **não** copia automaticamente conversas integrais, arquivos locais, binários não enviados nem os dados da biblioteca do navegador.

**Próxima ação da frente ativa:** obter diagnóstico verificável da falha do job da PR #11, sem repetição cega de workflow; somente após identificar causa e validar correção, avançar para revisão dos spritesheets, caminhada fiel, ataques e integração no gameplay. Manter WIP = 1.


## Evidência adicional — falha do Runner na PR #11 (01/11/2026, aproximadamente 21:24 BRT)

**Origem:** captura de tela enviada pelo autor, exibindo o job `validar` da execução #265 do workflow `.github/workflows/pixel-art.yml`, associado à PR `GC-ANIM-006` (PR #11).

- A anotação visível no GitHub informa: **“The self-hosted runner lost communication w…”**. A mensagem identifica perda de comunicação do executor self-hosted com o servidor do GitHub durante o job.
- **Atualização do diagnóstico:** há agora evidência direta de uma falha de comunicação do Runner. Portanto, a falha dessa execução não deve ser tratada como prova de erro nos fontes ou nos testes das animações. O status vermelho indica que o job falhou, mas não demonstra que os testes de código tenham encontrado defeitos.
- **Causa-raiz ainda não identificada:** a captura não informa se houve queda de internet, encerramento/travamento do processo ou serviço do Runner, suspensão/reinicialização do Windows, nem outro problema de rede/host. Não escolher uma dessas hipóteses sem consultar o histórico local do Runner e o estado do computador no horário da falha.
- **Ação recomendada:** verificar no Windows se o serviço/processo `APOENA-GAMECREATOR-RUNNER` está em execução e online, conferir conectividade e logs locais do Runner no intervalo do job e observar se houve suspensão, reinicialização ou desligamento. Depois de restabelecer a comunicação, executar uma única validação controlada da PR #11, sem alterar código apenas para tentar corrigir a desconexão.
- **Estado da PR:** permanece aberta em rascunho e não integrada. A captura não comprova aprovação de testes, nem validação funcional das animações no Godot.
- **Preservação:** esta atualização é documental. Nenhum código, workflow, configuração do Runner ou arquivo local foi alterado. A captura é evidência fornecida nesta conversa; ela não foi adicionada como arquivo binário ao repositório.

**Correção de interpretação do checkpoint anterior:** a causa da falha estava indeterminada porque os logs não puderam ser recuperados. Com a nova captura, a classificação sustentada pela evidência passa a ser **perda de comunicação do self-hosted runner**; a causa-raiz operacional permanece pendente de investigação.


## Política permanente — relatório para cada erro do GitHub Actions (01/11/2026)

- **Solicitação explícita do autor:** a cada erro do Actions, a IA deve produzir um relatório com a causa, a solução, o motivo da escolha e as evidências.
- **Regra implementada em `AGENTS.md`:** toda falha/anotação de erro exige investigação e relatório individual antes de corrigir, repetir ou contornar. O relatório deve identificar run/job/step/branch/SHA; preservar a mensagem literal; separar causa comprovada, hipóteses e lacunas; explicar impacto; comparar alternativas; justificar a solução escolhida; distinguir proposta de ação aplicada; registrar commit e validação; e indicar prevenção e participação necessária do autor.
- **Modelo criado:** `docs/relatorios-actions/MODELO_RELATORIO_FALHA_ACTIONS.md`.
- **Incidente atual documentado:** `docs/relatorios-actions/2026-11-01-run-41357977741-runner-perdeu-comunicacao.md`. A captura enviada pelo autor mostra a annotation “The self-hosted runner lost communication w…”. A perda de comunicação está comprovada pela captura; a causa-raiz operacional (rede, serviço/processo, suspensão/reinicialização ou outra) continua não confirmada. Nenhum código ou configuração foi alterado. Próxima ação é verificar o runner no Windows antes de uma única nova validação controlada.
- **Commits documentais:** `5f198f452427265c6a01f10b89cbb9d442f4c2a4` (AGENTS.md); `66a6335ec0a39aeea6fa8c273729fc3149493523` (modelo); `31cde018cad9016eeaf938721e9d47a60e38c4de` (relatório do incidente atual).
- **Limite:** esta regra orienta agentes que leem `AGENTS.md`; não significa que o GitHub Actions, sozinho, esteja configurado para chamar uma IA ou gerar relatórios automaticamente. A IA precisa consultar e seguir as instruções durante cada investigação.
