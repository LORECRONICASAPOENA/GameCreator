# Relatório de erros de comunicação — GitHub Actions e Runner Windows

**Projeto:** Apoena Game Creator  
**Repositório:** `apoenalore/GameCreator`  
**Documento:** registro operacional para diagnóstico por pessoas e agentes de IA  
**Última atualização:** 30/10/2026  
**Fuso de referência:** UTC; quando houver conversão, BRT = UTC−03:00  
**Regra:** nunca registrar hipótese como causa comprovada e nunca marcar como resolvido sem uma validação posterior.

---

## 1. Objetivo

Este documento concentra incidentes de comunicação e execução entre GitHub Actions, o agendador do GitHub e os runners Windows do projeto. Ele deve permitir que uma IA futura:

1. reconheça o erro pelo sintoma e pelos campos do GitHub;
2. identifique em qual etapa a comunicação parou;
3. diferencie indisponibilidade do runner de falha de código;
4. aplique a menor correção possível;
5. registre data/hora, causa, solução aplicada e evidência;
6. evite repetir pesquisas, reiniciar serviços sem diagnóstico ou criar runners duplicados.

Leia também:
- [Base de conhecimento de erros de CI e runners](BASE_CONHECIMENTO_ERROS_RUNNER_CI.md)
- [Protocolo de trabalho sequencial](PROTOCOLO_TRABALHO_SEQUENCIAL.md)
- [Pendências abertas e limpeza do GitHub](PENDENCIAS_ABERTAS_E_LIMPEZA_GITHUB.md)

## 2. Diagnóstico rápido: em qual camada o erro ocorreu?

| Estado/sintoma | Onde parou | Interpretação | Próxima ação |
|---|---|---|---|
| Job `queued`, `runner_id=0`, runner vazio, sem steps | Atribuição do job | Nenhum runner compatível recebeu o job | Conferir runner Online, labels, grupo e autorização |
| Job `in_progress` com `Listening for Jobs` no CMD | Runner recebeu o job | O runner está trabalhando; a falha pode ser interna | Abrir o job e localizar o primeiro step com falha |
| `pwsh: command not found` | Inicialização do shell | O runner não encontrou PowerShell 7 no PATH | Declarar shell Windows compatível ou instalar/configurar pwsh conscientemente |
| `ParserError` | Execução do PowerShell | Script foi recebido, mas não foi interpretado | Corrigir a sintaxe real e validar com Parser::ParseFile |
| `AssertionError` / teste reprovado | Testes da aplicação | O runner executou o código e um critério falhou | Corrigir a causa do teste; não enfraquecer a assertion |
| `No files were found` no upload | Publicação do artefato | O diretório esperado não foi produzido ou está vazio | Verificar a etapa geradora antes do upload |

**Regra fundamental:** um job `queued` não é uma falha do Game Creator. Enquanto não houver atribuição do runner, checkout, PowerShell, Node.js e testes ainda não começaram.

---

## 3. Incidente GC-COMM-001 — GitHub sem atribuição de runner

**Classificação:** bloqueio de atribuição CONFIRMADO no snapshot inicial; runner RECUPERADO OPERACIONALMENTE; causa raiz da interrupção original ainda NÃO DIAGNOSTICADA.  
**Data/hora do relato:** 30/10/2026 10:42:01 UTC (07:42:01 BRT).  
**Repositório:** `apoenalore/GameCreator`.

### 3.1 Evidência do bloqueio inicial

No snapshot inicial de 30/10/2026:
- 346 execuções consultadas;
- 17 jobs em `queued`;
- 0 em `in_progress`;
- 329 `completed` (158 `failure`, 96 `success`, 75 `cancelled`).

Os 17 jobs em fila solicitavam labels `self-hosted`, `Windows`, `X64`, mas apresentavam `runner_id = 0`, `runner_name` vazio e nenhum step executado. Portanto, naquele instante o GitHub não havia atribuído os jobs ao runner; o checkout e os testes ainda não tinham começado.

### 3.2 Evidência de recuperação do runner

A fila começou a ser processada pelo runner real. As seguintes execuções confirmam a atribuição:

| Execução | Job | Runner atribuído | Início (UTC / BRT) | Fim (UTC / BRT) | Resultado |
|---|---:|---|---|---|---|
| [40996154399](https://github.com/apoenalore/GameCreator/actions/runs/40996154399) | 123869646067 | ID 2 — `APOENA-GAMECREATOR-RUNNER` | 10:44:56 / 07:44:56 | 10:45:20 / 07:45:20 | success |
| [40996154391](https://github.com/apoenalore/GameCreator/actions/runs/40996154391) | 123869650074 | ID 2 — `APOENA-GAMECREATOR-RUNNER` | 10:53:08 / 07:53:08 | 10:55:51 / 07:55:51 | success |
| [41044696841](https://github.com/apoenalore/GameCreator/actions/runs/41044696841) | 124025821184 | ID 2 — `APOENA-GAMECREATOR-RUNNER` | 10:58:56 / 07:58:56 | 11:01:18 / 08:01:18 | success |

Nas três execuções, as labels do runner eram `self-hosted`, `Windows`, `X64`. A execução 41044696841 validou o workflow canônico atualizado na branch `main`, com todos os steps concluídos com sucesso.

### 3.3 Destino da fila antiga

As 15 execuções antigas inicialmente identificadas terminaram de ser processadas até 30/10/2026 10:57:42 UTC. Resultado: 12 success e 3 failure. As três falhas não foram falhas de comunicação do runner:
- [40959244729](https://github.com/apoenalore/GameCreator/actions/runs/40959244729): ordem incorreta entre build e testes — GC-CI-010.
- [40994401969](https://github.com/apoenalore/GameCreator/actions/runs/40994401969): `ReferenceError: profile is not defined` — GC-CI-011.
- [40994405717](https://github.com/apoenalore/GameCreator/actions/runs/40994405717): o mesmo `ReferenceError: profile is not defined` — GC-CI-011.

Não foi necessário cancelar manualmente esses 15 jobs: o runner os recebeu e concluiu. As duas validações atuais foram substituídas por execuções do fluxo canônico após a consolidação.

### 3.4 Causa raiz e solução

**Causa raiz da indisponibilidade inicial:** NÃO DIAGNOSTICADA. A evidência comprova que os jobs não tinham runner atribuído; não comprova se a origem foi serviço parado, estado Offline, grupo, permissão, labels ou configuração local.

**Solução de runner efetivamente aplicada:** nenhuma alteração de instalação, registro, grupo ou labels foi feita por esta investigação. A recuperação foi observada quando o runner voltou a receber jobs. Não registrar como causa resolvida sem identificar o que provocou a indisponibilidade original.

**Estado atual comprovado:** runner ID 2 recebeu e concluiu três jobs reais, incluindo a validação canônica da `main`. Não há necessidade de reinstalar ou duplicar o runner enquanto continuar Online e recebendo jobs.

### 3.5 Procedimento se o bloqueio voltar

1. Consultar a execução e conferir `status`, `runner_id`, `runner_name`, labels e steps.
2. Se `queued`, `runner_id=0` e steps vazios, parar a investigação do código: o job ainda não executou.
3. Abrir `https://github.com/apoenalore/GameCreator/settings/actions/runners` e conferir Online/Offline, grupo e labels.
4. No Windows, verificar o serviço existente e os logs `_diag/Runner_*.log` e `_diag/Worker_*.log`.
5. Não iniciar cópias da mesma instalação, apagar `_work` ou registrar outro runner sem evidência.
6. Registrar o horário exato em UTC e BRT, run/job IDs e o primeiro log causal.

**Pasta do runner informada no projeto:** `C:\ApoenaHub\GAME CREATOR\RUNNER`. É uma referência do usuário, não uma confirmação permanente do diretório ativo.

---

### 3.6 Estado após a recuperação e a automação

Consulta posterior às validações de 30/10/2026: **0 jobs queued e 0 in_progress**.

- [41044696841 — main / CI automático](https://github.com/apoenalore/GameCreator/actions/runs/41044696841): success; 10:58:56–11:01:18 UTC (07:58:56–08:01:18 BRT).
- [41044823914 — PR #5 / hidrologia integrada](https://github.com/apoenalore/GameCreator/actions/runs/41044823914): success; job 124026252566; 11:01:20–11:03:40 UTC (08:01:20–08:03:40 BRT). O teste hidrológico condicional passou no mesmo job.
- [41045143930 — PR #6 / correção de runoff](https://github.com/apoenalore/GameCreator/actions/runs/41045143930): success; job 124027289979; 11:03:43–11:05:57 UTC (08:03:43–08:05:57 BRT). A suíte de contratos do catálogo e simulação hidrológica passou, assim como Godot e as etapas de entrega.

**Conclusão:** o runner está operacional e o pipeline automático foi validado na main e nas duas branches de desenvolvimento. A causa da indisponibilidade inicial do runner continua sem diagnóstico histórico, mas não há bloqueio ativo neste snapshot.

---

## 4. Correções internas já aplicadas em incidentes anteriores

### GC-RUN-002 — `pwsh: command not found`

- **Data/hora original:** 28/10/2026 18:24:18 BRT (21:24:18 UTC).
- **Run:** [40771579313](https://github.com/apoenalore/GameCreator/actions/runs/40771579313).
- **Erro:** `pwsh: command not found`.
- **Causa comprovada:** o job foi recebido pelo runner Windows, mas o executável `pwsh` não estava disponível no ambiente/PATH da conta que executava o job.
- **Correção interna aplicada:** declarar explicitamente Windows PowerShell no workflow, em vez de depender do shell `pwsh` padrão.
- **Arquivo de referência:** `.github/workflows/pixel-art.yml`, configuração atual da branch `main`.
- **Efeito colateral identificado:** o upload de `_delivery/` também avisou que não encontrou arquivos porque as etapas anteriores não iniciaram após a falha de shell. Não tratar o aviso como uma segunda causa independente.
- **Estado:** configuração alterada; ainda é necessário confirmar por uma execução real bem-sucedida no runner.

### GC-RUN-004 — upload sem arquivos em `_delivery/`

- **Data/hora original:** 28/10/2026 18:24:18 BRT (21:24:18 UTC).
- **Causa comprovada:** consequência do shell não encontrado em GC-RUN-002; as etapas que deveriam gerar os arquivos não executaram.
- **Correção:** mesma correção de shell de GC-RUN-002.
- **Estado:** correção de configuração aplicada; artefato ainda precisa de confirmação em execução posterior.

### Controle de concorrência

O workflow canônico atual do Creator usa grupo de concorrência por branch e `cancel-in-progress: true` para evitar execuções equivalentes concorrentes na mesma branch. Isso reduz duplicidade futura, mas **não limpa automaticamente toda a fila histórica nem corrige runner offline/sem autorização**.

---

### GC-CI-009 — Validação de integração exigia clique manual

- **Data/hora do relato:** 30/10/2026 10:55:05 UTC (07:55:05 BRT).
- **Evidência:** na branch `feat/tempo-biomas-hidrologia`, `.github/workflows/testar-integracao.yml` continha somente `on: workflow_dispatch`; isso significa execução exclusivamente manual. O `pixel-art.yml` da `main` também limitava o evento `push` a uma única branch de desenvolvimento. O workflow antigo `auto-validar-v41.yml` não estava presente na `main`; a agenda horária que existia na branch não era a agenda ativa da branch padrão.
- **Causa raiz comprovada:** cobertura incompleta de eventos automáticos e workflow de integração separado com gatilho exclusivamente manual.
- **Correção efetivamente aplicada:** em 30/10/2026 10:58:51 UTC (07:58:51 BRT), commit [e861c534](https://github.com/apoenalore/GameCreator/commit/e861c5348cd9849800571a4d31c6bfeff0ede8ed) atualizou `.github/workflows/pixel-art.yml` para disparar em pushes relevantes de todas as branches, Pull Requests para `main` e agenda horária `0 * * * *` na branch padrão. O `workflow_dispatch` foi mantido apenas como alternativa de emergência.
- **Consolidação:** em 10:59:40 UTC (07:59:40 BRT), commit [acc6c293](https://github.com/apoenalore/GameCreator/commit/acc6c2938a365a992fffaa13c6e11854527cd24c) removeu o workflow manual duplicado da PR #6. Em 10:59:50 UTC (07:59:50 BRT), commit [00b3619](https://github.com/apoenalore/GameCreator/commit/00b3619f296fd821beed219f46fcc5d572bad6ea) removeu o workflow separado de hidrologia da PR #5. Os testes foram reunidos em um único job sequencial do fluxo canônico.
- **Validação automática sem clique:** [run 41044696841](https://github.com/apoenalore/GameCreator/actions/runs/41044696841) na main — success, 10:58:56–11:01:18 UTC (07:58:56–08:01:18 BRT).
- **Validação da PR #5:** [run 41044823914](https://github.com/apoenalore/GameCreator/actions/runs/41044823914) — success, 11:01:20–11:03:40 UTC (08:01:20–08:03:40 BRT), incluindo o teste de hidrologia no fluxo único.
- **Validação da PR #6:** [run 41045143930](https://github.com/apoenalore/GameCreator/actions/runs/41045143930) — success, 11:03:43–11:05:57 UTC (08:03:43–08:05:57 BRT), incluindo contratos de integração, simulação hidrológica, runtime Godot e entrega de artefatos.
- **Estado:** CORRIGIDO E VALIDADO. Consulta final: 0 queued e 0 in_progress.
- **Prevenção:** não criar workflow duplicado com `workflow_dispatch` para testes já cobertos pelo fluxo canônico. Manter push/PR automáticos, concorrência por branch e uma única suíte sequencial.

### GC-CI-010 — Validação agendada executava testes antes de compilar o Creator

- **Data/hora da falha:** 30/10/2026 10:48:40.053 UTC (07:48:40.053 BRT).
- **Execução/job:** [40959244729](https://github.com/apoenalore/GameCreator/actions/runs/40959244729), job 123747361508, workflow antigo `auto-validar-v41.yml`.
- **Erro literal:** `AssertionError [ERR_ASSERTION]: entrada nativa carrega biblioteca, ponte e editor de Natureza` em `tests/corte-inteligente.test.cjs:100`.
- **Causa raiz comprovada:** o workflow antigo executava `Executar testes automatizados` antes de `Verificar integridade e compilar Creator nativo`. O teste exigia a entrada nativa já compilada; como falhou primeiro, a etapa de build foi marcada como skipped.
- **Correção efetivamente aplicada:** a agenda antiga foi substituída pelo agendamento horário do workflow canônico `pixel-art.yml`, que executa `Preservar loader e compilar Creator nativo V4.0` antes da suíte de testes. A nova configuração foi publicada no commit [e861c534](https://github.com/apoenalore/GameCreator/commit/e861c5348cd9849800571a4d31c6bfeff0ede8ed).
- **Evidência de validação:** no [run 41044696841](https://github.com/apoenalore/GameCreator/actions/runs/41044696841), o build terminou success às 10:59:11 UTC (07:59:11 BRT), antes dos testes; todos os testes e steps seguintes terminaram success.
- **Estado:** RESOLVIDO para a ordem de build/teste do fluxo canônico.
- **Prevenção:** qualquer workflow agendado deve reutilizar a mesma ordem do CI canônico; nunca manter uma segunda suíte reduzida com ordem diferente.

### GC-CI-011 — ReferenceError: profile is not defined no cálculo de escoamento

- **Data/hora das falhas:** 30/10/2026 10:57:20.037 UTC (07:57:20.037 BRT) e 10:57:37.247 UTC (07:57:37.247 BRT).
- **Execuções/jobs:** [40994401969 / job 123864045768](https://github.com/apoenalore/GameCreator/actions/runs/40994401969) e [40994405717 / job 123864058010](https://github.com/apoenalore/GameCreator/actions/runs/40994405717).
- **Erro literal:** `ReferenceError: profile is not defined`; stack em `map-editor/terrain-system.js:415:132`, função `stepHydrology`, chamada por `simulateHydrology` a partir de `integracao/testes/catalogo.test.js`.
- **Causa raiz comprovada:** `profile` era declarado dentro do primeiro loop por célula, mas o loop posterior de escoamento (`for y/for x`) usava `profile.runoff` fora daquele escopo. O teste de runoff/hidrologia acionava a referência sem variável definida.
- **Correção efetivamente aplicada:** em 30/10/2026 11:00:44 UTC (08:00:44 BRT), commit [de5f5e9](https://github.com/apoenalore/GameCreator/commit/de5f5e9db7808c1eb0c3b5c18aec3686a10ea77b), branch `feat/tempo-biomas-hidrologia`, adicionou `const profile = sim.profiles[i] || defaultHydrology();` dentro do loop de escoamento, após a verificação de água da célula e antes de acessar `profile.runoff`.
- **Validação específica:** no [run 41045143930](https://github.com/apoenalore/GameCreator/actions/runs/41045143930), o step `Testar contratos do catálogo e simulação hidrológica` terminou success às 11:04:58 UTC (08:04:58 BRT).
- **Validação canônica completa:** o mesmo run terminou success às 11:05:57 UTC (08:05:57 BRT), incluindo Godot, preservação dos módulos e artefatos.
- **Estado:** RESOLVIDO E VALIDADO no commit que contém a correção.
- **Prevenção:** manter o teste que simula escoamento com diferentes coeficientes `runoff`; toda variável usada dentro de loops deve ser declarada no escopo correto da célula.

## 5. Regras obrigatórias para futuras IAs

1. Antes de disparar Actions, consultar runs recentes e jobs ativos/queued.
2. Não disparar uma nova tentativa se já existir uma execução equivalente aguardando o mesmo runner.
3. Para cada job, conferir `status`, `conclusion`, `runner_id`, `runner_name`, labels e steps.
4. Se `queued` e `runner_id=0`, parar a investigação de código: primeiro resolver a atribuição do runner.
5. Se `in_progress`, abrir os logs e localizar a primeira falha causal.
6. Nunca interpretar `Listening for Jobs` como prova suficiente de que o runner está autorizado e compatível com o repositório.
7. Não criar runner duplicado, não mudar para `windows-latest` sem decisão explícita de custo e arquitetura, não remover labels para “fazer funcionar”.
8. Não enfraquecer testes, assertions ou critérios de build para obter X verde.
9. Fazer uma correção por vez e guardar a evidência.
10. Manter WIP = 1 entre Game Creator e Apoena Pixel Art HTML.
11. Atualizar este documento e `docs/BASE_CONHECIMENTO_ERROS_RUNNER_CI.md` depois de cada incidente.
12. Marcar RESOLVIDO somente após o job real executar e a validação relevante passar.

## 6. Modelo obrigatório para registrar novos incidentes

Copiar e preencher este bloco a cada novo erro:

- **ID do incidente:**
- **Projeto/repositório:**
- **Data/hora da ocorrência (UTC):**
- **Data/hora local e fuso:**
- **Data/hora do registro:**
- **Run ID / job ID / URL:**
- **Branch / commit SHA:**
- **Workflow / job / step:**
- **Status do job:**
- **Runner ID / nome / labels:**
- **Mensagem literal do erro:**
- **Camada onde parou:** agendamento / atribuição / serviço / checkout / shell / dependência / teste / build / artefato.
- **Causa raiz comprovada:**
- **Hipóteses ainda não confirmadas:**
- **Causas descartadas e evidência:**
- **Correção efetivamente aplicada:**
- **Arquivos/serviços alterados:**
- **Teste específico executado:**
- **Validação canônica e resultado:**
- **Evidência (commit, log, captura ou link):**
- **Estado final:** BLOQUEADO / PENDENTE / CORRIGIDO-AGUARDANDO-VALIDAÇÃO / RESOLVIDO.
- **Como evitar recorrência:**

**Não preencher “correção efetivamente aplicada” com uma recomendação ainda não executada. Se não houve correção, escrever “Nenhuma correção aplicada; diagnóstico pendente”.**


## GC-COMM-002 — Upload de artefatos: timeout + ENOTFOUND

- **Ocorrencia:** 30/10/2026 10:55:01 -03:00 a 10:55:09 -03:00 (UTC 13:55:01Z a 13:55:09Z).
- **Run/job:** [41066904787](https://github.com/apoenalore/GameCreator/actions/runs/41066904787) / 124100579029.
- **Commit:** 55052f8912b70dc8eb132b983447df1c080e63fd na main.
- **Etapas:** 21 — disponibilizar pacote; 22 — anexar logs de diagnostico.
- **Mensagem literal:** Request timeout: /twirp/github.actions.results.api.v1.ArtifactService/CreateArtifact; depois Failed to CreateArtifact: Unable to make request: ENOTFOUND.
- **O que passou:** todos os testes anteriores e a preparacao local do ZIP. O log registrou 128 arquivos para o artefato principal e 22 arquivos de diagnostico.
- **Causa imediata:** falha de resolucao/conectividade com o servico remoto de artefatos do GitHub. A origem exata (DNS, proxy, rede ou rota) nao foi identificada.
- **Solucao aplicada:** nenhuma correcao tecnica foi aplicada. A run [41075044875](https://github.com/apoenalore/GameCreator/actions/runs/41075044875), no mesmo commit, concluiu com sucesso depois; registrar como recuperacao/intermitencia, nao como correcao comprovada.
- **Estado:** INTERMITENTE; nao confundir com defeito do codigo do Creator.
- **Proxima verificacao:** com o computador online, fazer uma unica verificacao de conectividade do runner aos endpoints de artefatos antes de repetir a suite completa.
