# Relatório de incidente — Actions #41632223425 (Criador Modular)

## 1. Identificação
- Data/hora da ocorrência (BRT): 2026-11-03 09:10:54 BRT (log original: 12:10:54Z).
- Data/hora da investigação (BRT): 2026-11-03; horário exato não preservado.
- Repositório: apoenalore/GameCreator.
- Workflow: .github/workflows/pixel-art.yml.
- Run ID e URL: [#41632223425](https://github.com/apoenalore/GameCreator/actions/runs/41632223425).
- Job / step: validar, job 125904378492 / step 11, “Testar Criador Modular no navegador”.
- Evento: pull_request.
- Branch: feat/apoena-modular-character-creator-integration.
- Commit SHA: 37e026a8da5bd55aa823e49fa36fe81f16f20647.
- Estado final: failure.
- Responsável pela análise: Apoena Assistant.

## 2. Erro observado
- Mensagem literal: `Teste funcional do Criador Modular falhou: FAIL: Error: Timeout: Personagem gravado no projeto atual do Creator. Salve o projeto principal para guardar essa alteração.`
- Primeiro erro causal nos logs: o teste aguardou `received` por até 9 segundos depois de “Gravar no Creator”, mas não observou o payload.
- Logs consultados: log completo do job 125904378492 e resumo de steps; [run](https://github.com/apoenalore/GameCreator/actions/runs/41632223425).
- Evidência adicional: artefato `v41-ci-diagnostics` (ID 13229176704; SHA-256 `6976d81a3da6b90ffaa774f5840f0fb4e13984d8a8dcd2acc35acbb676abbf7d`) foi baixado e inspecionado. `characters-browser.html` mostra a falha no teste, status da interface indicando sucesso de gravação e host trace das operações da biblioteca sem erros.
- Dados indisponíveis: o artefato não registra `event.source`, `event.origin` nem o fluxo de mensagens do bridge; a origem do acknowledgement ainda não está comprovada.

## 3. Diagnóstico
- **Causa-raiz comprovada:** não confirmada.
- Evidência: o build, o smoke test de DOM, a sintaxe JavaScript e o teste de modelo passaram; apenas a espera pela captura do payload do bridge falhou. A mensagem de sucesso da UI indica que o handler do editor recebeu alguma resposta, mas não prova que o listener de teste correto recebeu o payload.
- **Hipótese ainda não confirmada:** o novo commit de bridge que prefere `window.parent` para editores embutidos pode ter alterado o contexto de destino/captura. O commit mais recente no head é `fix(creator-bridge): prefer parent host for embedded editor`; a execução anterior bem-sucedida (#41565001752) foi no SHA `03382b02e74e2b39da0924bd0ff72ddacdf27e5a`. Essa sequência é correlação, não prova isolada da causa.
- Informações que faltam: origem e janela alvo da requisição/resposta no momento do teste; se o listener de teste foi invocado; se o payload foi recebido por outro host.
- Classificação: teste / timeout de integração navegador.

## 4. Impacto e alcance
- Falhou a verificação funcional do botão “Gravar no Creator”.
- Steps 1–10 passaram, incluindo build nativo, smoke test, sintaxe JavaScript e teste de modelo; steps 12–25 foram pulados por dependência do step falho; coleta de logs passou.
- O modelo e o editor modular foram testados parcialmente. O caminho ponta a ponta de sincronização do personagem não está validado no head atual.
- A falha pode indicar defeito no teste ou no alvo do bridge; a evidência atual não distingue os dois.

## 5. Alternativas consideradas
| Alternativa | Benefícios | Riscos / desvantagens | Decisão |
|---|---|---|---|
| Remover a assertion de captura do bridge | Faria o teste avançar | Esconderia falha de integração | Descartada |
| Reverter o bridge imediatamente | Poderia retornar ao comportamento anterior | Pode quebrar o editor embutido que motivou a alteração | Adiada até identificar o alvo real |
| Registrar origem/janela e payload no harness, sem alterar produto | Distingue host correto de resposta inesperada | Exige nova execução canônica para confirmar | Escolhida como próximo diagnóstico |

## 6. Solução escolhida e justificativa
- Solução escolhida: adicionar instrumentação mínima ao teste funcional para registrar a origem da mensagem, a janela de destino e a captura do payload do bridge.
- Por que: o código atual e o artefato comprovam que há divergência entre o status de sucesso da interface e a variável observada pelo teste; instrumentar o harness separa defeito de produto de defeito de observabilidade, sem mascarar a assertion.
- Critérios: preservar todas as assertions e usar o workflow canônico existente.
- Riscos controlados: não alterar dados do usuário, comunicação ou segurança do bridge sem evidência.
- Alternativas descartadas: não enfraquecer o teste e não reverter a mudança do produto sem demonstrar causalidade.
- WIP = 1: esta investigação segue a solicitação atual do autor sobre pendências do GameCreator. A validação da PR do Pixel Art permanece em fila, sem runner atribuído; nenhuma execução foi repetida ou cancelada.

## 7. Execução da solução
- Estado: proposta / autorizada, instrumentação ainda não aplicada.
- Alterações realizadas: nenhuma alteração de produto ou teste nesta etapa.
- Commit SHA: não aplicável.
- Ações que dependem do autor: nenhuma para a instrumentação diagnóstica; teste manual no Creator real permanece fora do escopo desta ocorrência.

## 8. Plano e resultado da validação
- Teste focado: observar a janela alvo, origem e payload da solicitação `saveAsset` no harness.
- Execução canônica: workflow existente `.github/workflows/pixel-art.yml`, disparado automaticamente por novo commit da PR #14.
- Resultado esperado: captura explícita de um único payload com manifesto e PNG; nenhuma resposta sem listener correspondente.
- Run do incidente: [#41632223425](https://github.com/apoenalore/GameCreator/actions/runs/41632223425), commit `37e026a8da5bd55aa823e49fa36fe81f16f20647`.
- Resultado observado: falha no step 11; não resolvido.
- Estado final: aguardando instrumentação e evidência.

## 9. Prevenção e aprendizado
- Registrar eventos de bridge no harness com origem/janela, mantendo os dados limitados ao teste.
- Não marcar a integração como validada apenas pelo texto de sucesso da UI.
- Pendências relacionadas: revisão/integração da PR #14; PR #13 aberta com objetivo sobreposto; estado atualizado de ambos precisa ser reconciliado.

## 10. Resumo executivo para o autor
- Erro: o teste não observou o payload de “Gravar no Creator” e expirou.
- Causa: ainda não confirmada; o artefato mostra status de sucesso na UI, mas sem captura do payload no harness.
- Solução: instrumentar o teste para identificar quem recebeu e respondeu à mensagem.
- Alteração efetuada: relatório de incidente; nenhuma mudança de runtime.
- Validação: continua falhando no head atual; novo run não executado.
- Próxima ação: aplicar instrumentação mínima e validar uma vez no workflow canônico.


### Reprodução no run #41663786861

- Em 2026-11-03 12:33:11 BRT (15:33:11Z), o run [#41663786861](https://github.com/apoenalore/GameCreator/actions/runs/41663786861), job 126013580379, repetiu a mesma falha no step 11, SHA `1775d77f447e9e245c7a71a35327d935ebaf6bc1`.
- O único delta de código desde o run #41632223425 foi este relatório; nenhum arquivo do runtime ou do teste funcional mudou. A repetição confirma que o timeout é reproduzível no código atual, mas não identifica a origem do acknowledgement.
- Runner confirmado: `APOENA-GAMECREATOR-RUNNER`, runner 2. O restante do pipeline passou até a etapa de integração funcional; os steps posteriores foram pulados.
- Artefato `v41-ci-diagnostics`: ID 13246855533, SHA-256 `07b2a2c6f9908978bccccee87ca96da0864098293036840e44b4ecca118f046f`. Mensagem/host trace repetem o sintoma anterior.
- Próxima coleta: registrar mensagens do bridge (origin, source, action e presença do payload) no harness; preservar a assertion dos 12 frames e do PNG.
- Classificação e estado permanecem: falha de teste confirmada; causa-raiz ainda não confirmada; aguardando nova validação após instrumentação.


### Evidência do run #41665578502 e instrumentação adicional

- Ocorrência: 2026-11-03 12:36:12–12:39:00 BRT (15:36:12–15:39:00Z), run [#41665578502](https://github.com/apoenalore/GameCreator/actions/runs/41665578502), job 126019855852, PR #14, commit de teste `2a9736e87d09fe37436ee885562b1f0fe22739d9`.
- Build nativo, smoke test de DOM, sintaxe JavaScript e teste de modelo passaram; o step 11 falhou aguardando o payload após o texto de sucesso da interface.
- Traço: `message:request:sourceIsApp=true:origin=http://127.0.0.1:4173:action=saveAsset|listener:saveAsset:sourceIsApp=true:origin=http://127.0.0.1:4173`. O host concluiu `saveProject`, `listProjects`, `saveAsset`, `saveProject` e `listAssets` sem erro.
- Isso comprova que a solicitação chegou ao listener no contexto e origem esperados. Ainda não comprova se `window.__creatorReceived` ficou visível à condição de espera; causa-raiz não confirmada.
- Artefato: ID 13246616489, SHA-256 `30212e9183e8e9cfa83ad6190b215942a4cb7e13c9cfbc31c32228521c4b252e`.
- Próxima coleta acrescenta sinal explícito de armazenamento e compara os globais da janela host e do iframe no erro. Assertions de manifesto (12 frames) e PNG permanecem intactas.
- Estado: **FALHA REPRODUZIDA; ORIGEM DA MENSAGEM CONFIRMADA; VISIBILIDADE DO PAYLOAD E CAUSA-RAIZ PENDENTES**.


### Diagnóstico provável do run #41702943279

- Ocorrência: 2026-11-03 16:32:37–16:33:52 BRT (19:32:37–19:33:52Z), job 126150679613, step 11, SHA `7cfcdf6f670bb6c86ff72aac9a5d0f9c72388bd5`.
- Build, smoke test, sintaxe JS e modelo passaram; o teste do navegador expirou no passo que aguarda `window.__creatorReceived`.
- O log do catch mostra `GLOBAL_RECEIVED=true`, `FRAME_RECEIVED=false`, `stored=true:keys=manifest,png`; o trace confirma que o listener pai recebeu `saveAsset` de `sourceIsApp=true` e guardou o payload. O host terminou as operações sem erro.
- **Causa provável:** a janela host recebe e armazena o payload, mas o harness encerra sua espera curta (nove segundos) antes de observar a condição; a captura tardia coincide com o fim do limite/último intervalo de polling. A interface informou a gravação concluída. Não há evidência de payload ausente ou inválido.
- **Correção escolhida:** aumentar somente a espera dessa chamada para 30 segundos e reavaliar a condição uma vez depois do último intervalo. Preservar assertions de 12 frames, PNG e todos os demais testes.
- Artefato `v41-ci-diagnostics`: ID 13247763001; SHA-256 `f811e1431fd95ff0b701f5ca8c65cdbb63c7bb95437b7997a1e1da061a5049df`.
- Estado: correção de timing aplicada no commit seguinte; aguarda CI canônico para confirmação. Causa classificada como **PROVÁVEL**, não confirmada até a nova execução passar.
