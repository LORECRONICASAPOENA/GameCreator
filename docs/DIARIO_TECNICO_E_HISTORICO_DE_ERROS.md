# Diário técnico, progresso e histórico de erros — Apoena Game Creator

**Repositório:** `apoenalore/GameCreator`  
**Finalidade:** memória técnica compartilhada por desenvolvedores e agentes de IA.  
**Fuso padrão dos registros:** America/Sao_Paulo (UTC−03:00). Sempre informar também o deslocamento UTC.  
**Regra:** este diário é parte obrigatória do processo de desenvolvimento. Não é um documento opcional nem um relatório feito apenas quando há falhas.

## Documentos técnicos relacionados

- [AGENTS.md](../AGENTS.md) — instruções obrigatórias para agentes.
- [Padrão de integração e prevenção de regressões](PADRAO_DE_INTEGRACAO_E_PREVENCAO_DE_REGRESSOES.md) — investigação, compatibilidade e validação.
- [Base de conhecimento de erros Runner/CI](BASE_CONHECIMENTO_ERROS_RUNNER_CI.md) — diagnósticos históricos especializados.
- [Relatório de erros de comunicação Runner/GitHub](RELATORIO_ERROS_COMUNICACAO_RUNNER_GITHUB.md) — evidências de comunicação e fila.
- [Pendências e limpeza do GitHub](PENDENCIAS_ABERTAS_E_LIMPEZA_GITHUB.md) — estado de tarefas e fila.
- [Protocolo de trabalho sequencial](PROTOCOLO_TRABALHO_SEQUENCIAL.md) — WIP, execução e encerramento.

## 1. Como este diário deve ser usado

Toda pessoa ou IA que executar uma tarefa significativa no Game Creator deve atualizar este arquivo antes de encerrar a tarefa ou entregar o trabalho a outra pessoa.

Isso inclui:
- implementar ou alterar funcionalidades;
- investigar ou corrigir erros;
- alterar arquitetura, contratos, schemas, integrações ou persistência;
- modificar workflows, testes, build ou configuração do Runner;
- fazer auditoria técnica, refatoração ou documentação que afete decisões do projeto.

### Obrigações mínimas

1. **Registrar progresso:** o que foi analisado, feito, alterado e o que continua pendente.
2. **Registrar erros:** cada erro relevante recebe um identificador único e um registro próprio, mesmo se ainda não houver solução.
3. **Registrar a investigação:** sintomas, evidências, reprodução, arquivos/funções envolvidos, hipóteses avaliadas, verificações realizadas e o que descartou cada hipótese.
4. **Registrar a justificativa técnica:** explicar por que a causa identificada faz sentido e por que a correção escolhida resolve o problema sem quebrar contratos existentes.
5. **Registrar a solução:** arquivos alterados, comportamento anterior e posterior, testes e prevenção de recorrência.
6. **Registrar data e rastreabilidade:** data/hora com fuso, branch, commit SHA, PR, workflow/run e links relevantes.
7. **Registrar o estado real:** concluído, em andamento, bloqueado, parcialmente resolvido ou aguardando validação.
8. **Atualizar o registro quando houver nova evidência:** hipóteses podem mudar. Não apague a história; acrescente uma atualização datada explicando a correção.
9. **Não declarar resolvido sem evidência:** código escrito, execução iniciada ou teste isolado aprovado não equivalem à validação final.
10. **Se não puder escrever no GitHub:** informar explicitamente o bloqueio e entregar o registro completo para publicação. Nunca afirmar que o diário foi atualizado se não foi.

### Sobre “raciocínio” e transparência técnica

O diário deve registrar o **raciocínio técnico verificável**, não pensamentos privados internos de uma IA. Registre:
- evidência observada;
- hipótese formulada;
- teste ou consulta usada para verificá-la;
- resultado encontrado;
- hipótese confirmada ou descartada;
- decisão técnica e sua justificativa;
- como outra pessoa pode reproduzir o diagnóstico.

O objetivo é permitir que outro desenvolvedor refaça o caminho de investigação e critique ou melhore a solução, sem depender de uma conversa privada.

### Regras de qualidade e segurança

- Diferencie claramente **fato**, **hipótese** e **conclusão**.
- Não transforme coincidência temporal em causa raiz.
- Não atribua falha de comunicação ao Runner se os logs mostram erro de aplicação; classifique cada camada separadamente.
- Não registre tokens, senhas, chaves, cookies, dados pessoais ou segredos.
- Use trechos curtos de log e links para a execução completa.
- Não reescreva entradas antigas para esconder diagnósticos incorretos. Acrescente uma correção histórica datada.
- Use identificadores estáveis: `GC-COMM-###` para comunicação/CI, `GC-BUG-###` para defeitos de código, `GC-INT-###` para integração/contratos e `GC-ARCH-###` para arquitetura. Se a categoria mudar, preserve o ID e explique.

## 2. Modelo obrigatório — relatório de progresso

Copie este modelo para cada tarefa ou sessão significativa:

```markdown
### PROGRESSO — AAAA-MM-DD — título curto

- Data/hora de início e atualização: AAAA-MM-DD HH:mm:ss UTC−03:00 (HH:mm:ssZ)
- Responsável/agente:
- Objetivo:
- Estado: EM ANDAMENTO | CONCLUÍDO | BLOQUEADO | AGUARDANDO VALIDAÇÃO
- Repositório/branch:
- PR e commit(s):
- Escopo analisado:
- Arquivos/componentes consultados:
- Trabalho realizado:
- Decisões técnicas e justificativas:
- Testes/verificações executados:
- Resultado comprovado:
- Riscos/limitações:
- Pendências e próximo passo:
- Links de evidência:
```

Um registro de progresso deve ser útil mesmo quando nada foi concluído: informe o que foi investigado, o que se aprendeu, o bloqueio e como continuar sem repetir trabalho.

## 3. Modelo obrigatório — relatório de erro/incidente

```markdown
### [ID] — título objetivo

- Primeira ocorrência:
- Última atualização:
- Estado: ABERTO | INVESTIGANDO | CORRIGIDO, AGUARDANDO TESTE | VALIDADO | NÃO REPRODUZIDO
- Severidade/impacto:
- Ambiente, versão e plataforma:
- Branch, commit, PR, workflow e Run ID:
- Sintoma observado:
- Passos para reproduzir:
- Mensagem/log relevante:
- Arquivos, funções e linhas:
- Evidências coletadas:
- Hipóteses avaliadas:
  - Hipótese:
  - Como foi testada:
  - Resultado: confirmada | descartada | inconclusiva
- Causa raiz confirmada (ou “ainda não confirmada”):
- Caminho de identificação: sequência objetiva de verificações que levou ao diagnóstico:
- Solução aplicada:
- Por que a solução funciona:
- Compatibilidade/dependências verificadas:
- Testes de regressão e integração:
- Resultado no commit corrigido:
- Prevenção para não voltar a ocorrer:
- O que ainda falta validar:
- Links para código, logs, PR e workflow:
```

## 4. Como classificar a conclusão

- **ABERTO:** problema observado; investigação ainda não começou ou não avançou.
- **INVESTIGANDO:** existem hipóteses, mas a causa raiz não foi demonstrada.
- **CORRIGIDO, AGUARDANDO TESTE:** alteração enviada, mas workflow/teste relevante ainda não terminou.
- **VALIDADO:** teste relevante passou no SHA exato que contém a correção e a evidência está vinculada.
- **NÃO REPRODUZIDO:** não foi possível reproduzir; não significa que o problema foi corrigido.

Se um teste falhar por um segundo defeito, abra ou vincule outro ID. Não misture defeitos de código com falhas de Runner/rede apenas porque apareceram na mesma execução.

## 5. Índice de incidentes

| ID | Área | Resumo | Estado |
|---|---|---|---|
| GC-COMM-001 | Runner / GitHub Actions | Fila, repetição de jobs e diagnóstico da comunicação | INVESTIGAÇÃO PARCIAL |
| GC-BUG-001 | Hidrologia / integração | `ReferenceError: profile is not defined` em `stepHydrology` | VALIDADO no SHA registrado |

## 6. Incidentes e investigações registrados

### GC-COMM-001 — Fila de jobs e diagnóstico da comunicação Runner/GitHub

- **Primeiro relato:** 2026-10-30 07:46:32 UTC−03:00 (10:46:32Z).
- **Última atualização deste registro:** 2026-10-30 08:11:06 UTC−03:00 (11:11:06Z).
- **Estado:** INVESTIGAÇÃO PARCIAL — não encerrar como falha de comunicação confirmada.
- **Ambiente:** Windows x64, self-hosted runner, versão exibida 2.338.0; repositório `apoenalore/GameCreator`.
- **Sintoma relatado:** muitos X vermelhos no GitHub Actions, jobs repetidos e percepção de que o Runner não conseguia acompanhar ou receber o trabalho.
- **Evidências observadas:**
  1. O CMD exibiu `Connected to GitHub` e `Listening for Jobs`.
  2. O mesmo CMD mostrou vários `Running job` e `Job ... completed`, com resultados tanto `Succeeded` quanto `Failed`. Portanto, naquele período o Runner recebeu e executou jobs; não há evidência nesses logs de desconexão contínua.
  3. Houve várias execuções de `testar-catalogo` em sequência.
  4. O workflow `.github/workflows/pixel-art.yml` foi inspecionado e contém gatilhos `push`, `pull_request`, `schedule` e `workflow_dispatch`, além de grupo `concurrency` com `cancel-in-progress: true`. Isso pode gerar execuções por eventos distintos e cancelar uma execução anterior do mesmo grupo quando chega uma mais nova; não prova, sozinho, duplicidade indevida.
  5. As execuções 40994405717 e 40994401969 examinadas nas capturas eram falhas do job `testar-catalogo`, associadas a SHAs diferentes (`452f8da` e `a8421b5`). Portanto, esses dois exemplos não demonstram duas execuções do mesmo commit.
- **Hipóteses avaliadas:**
  - Runner desconectado: **não sustentada pelas capturas do CMD**, que mostram conexão, escuta e execução de jobs.
  - Fila/capacidade limitada do executor self-hosted: **plausível**, pois os jobs aparecem sendo processados em sequência e houve acúmulo; requer observação adicional para confirmar a causa do atraso.
  - Disparos redundantes de workflow: **possível em certos eventos**, mas precisa comparar evento, SHA, branch e workflow de cada Run. Não cancelar jobs apenas por parecerem repetidos.
  - Falha de rede/comunicação: **não confirmada** pelos dados disponíveis.
- **Caminho de identificação:** comparar o estado do Runner no GitHub com o CMD local; conferir versão e mensagens de conexão; observar início/fim de jobs; abrir os Runs marcados em vermelho; inspecionar o job e seu log; comparar evento e SHA dos Runs; verificar gatilhos e política de concorrência do YAML.
- **Conclusão atual:** o Runner estava operacional e executando tarefas no momento da captura. Parte dos X vermelhos vinha de falhas de execução de testes de aplicação, não de perda de comunicação. A causa completa do acúmulo/atraso da fila ainda não foi isolada.
- **Ações preventivas:** antes de cancelar uma execução, conferir status, evento, branch, SHA e job; evitar dispatch manual repetido; agrupar alterações relacionadas para reduzir disparos por push; acompanhar a execução mais recente; separar falha do Runner, cancelamento por concorrência e falha de teste.
- **Próximo passo:** observar uma nova ocorrência com horários, Run IDs, eventos, SHAs e estado do Runner; então confirmar se o gargalo é capacidade, concorrência, configuração de gatilhos ou outro fator.
- **Referências:** [Runner do repositório](https://github.com/apoenalore/GameCreator/settings/actions/runners); [workflow Pixel Art](https://github.com/apoenalore/GameCreator/blob/feat/tempo-biomas-hidrologia/.github/workflows/pixel-art.yml); [Run 40994405717](https://github.com/apoenalore/GameCreator/actions/runs/40994405717); [Run 40994401969](https://github.com/apoenalore/GameCreator/actions/runs/40994401969).

### GC-BUG-001 — `ReferenceError: profile is not defined` no cálculo hidrológico

- **Primeira ocorrência registrada:** 2026-10-30 08:00:00 UTC−03:00 (11:00:00Z), quando as capturas do erro foram compartilhadas.
- **Última atualização:** 2026-10-30 08:11:06 UTC−03:00 (11:11:06Z).
- **Estado:** VALIDADO no commit `b90be364189bd4f2145848494f285c9a6be2fed8` pelo Run `41045143930`. A documentação posterior ainda precisa de sua própria validação.
- **Impacto:** a suíte de integração do catálogo falhava ao alcançar a simulação hidrológica.
- **Runs observados:** [40994405717](https://github.com/apoenalore/GameCreator/actions/runs/40994405717) e [40994401969](https://github.com/apoenalore/GameCreator/actions/runs/40994401969).
- **Comando executado:** `node integracao/testes/catalogo.test.js`.
- **Mensagem:** `ReferenceError: profile is not defined`.
- **Local:** `map-editor/terrain-system.js`, função `stepHydrology`, linha indicada pelo log como 415; chamada pela simulação hidrológica no teste de integração.
- **Evidência:** o log mostrava o cálculo de transferência usando `profile.runoff`, mas `profile` não estava definido no escopo daquele loop.
- **Causa raiz confirmada:** o cálculo por célula consultava a propriedade de runoff sem obter o perfil hidrológico correspondente ao índice atual. A variável não estava disponível no escopo em que era usada.
- **Caminho de identificação:** abrir o Run que falhou; expandir o job `testar-catalogo`; localizar o primeiro erro e a stack trace; identificar o arquivo/função/linha; seguir a chamada de `catalogo.test.js` para `simulateHydrology` e `stepHydrology`; conferir o loop e o uso de `profile.runoff`; corrigir a declaração no escopo correto.
- **Correção:** obter o perfil da célula dentro do loop de escoamento, usando `sim.profiles[i] || defaultHydrology()`, antes de acessar `profile.runoff`. Uma primeira alteração introduziu uma declaração duplicada no mesmo escopo; a inspeção seguinte identificou a duplicidade e uma alteração subsequente a removeu. Isso fica registrado como lição: revisar o bloco completo após a edição, não apenas a linha inserida.
- **Prevenção:** manter uma única declaração por escopo; obter dados pelo índice da célula atual; incluir teste que percorra chuva, escoamento, acúmulo e erosão; executar essa suíte no workflow do PR.
- **Cobertura adicionada:** `.github/workflows/pixel-art.yml` passou a executar `node integracao/testes/catalogo.test.js` como etapa de contratos do catálogo e simulação hidrológica.
- **Validação:** o Run [41045143930](https://github.com/apoenalore/GameCreator/actions/runs/41045143930), no SHA `b90be364189bd4f2145848494f285c9a6be2fed8`, concluiu com sucesso; a etapa `Testar contratos do catálogo e simulação hidrológica` também concluiu com sucesso.
- **PR:** [#6 — Biomas, variantes sazonais e simulação hidrológica 2D](https://github.com/apoenalore/GameCreator/pull/6).
- **Limite da conclusão:** a correção do defeito hidrológico foi validada no SHA indicado. Isso não significa que o PR #6 foi mesclado nem que todos os fluxos do Creator foram validados em dispositivos reais.

## 7. Progresso — 2026-10-30 — Instituição do registro técnico obrigatório

- **Solicitação recebida:** 2026-10-30 08:11:06 UTC−03:00 (11:11:06Z).
- **Objetivo:** tornar obrigatório o registro de progresso, erros, investigação, justificativa técnica, solução, datas e evidências para IA e desenvolvedores.
- **Estado:** DOCUMENTAÇÃO PUBLICADA NA BRANCH; AGUARDANDO VALIDAÇÃO DO CI E MERGE DA PR.
- **Branch:** `feat/tempo-biomas-hidrologia`; PR #6, base `main`.
- **Commit documental:** `0acceaf993f6c100d01f023b610849e032fbae5a`.
- **Arquivos criados/atualizados:** `docs/DIARIO_TECNICO_E_HISTORICO_DE_ERROS.md`, `AGENTS.md`, `docs/PADRAO_DE_INTEGRACAO_E_PREVENCAO_DE_REGRESSOES.md` e `README.md`.
- **Ação:** criado o diário com modelos obrigatórios de progresso e incidente; adicionada obrigação explícita aos agentes; README e padrão de integração apontam para o diário.
- **Verificação documental:** os quatro arquivos foram relidos na branch e os IDs `GC-COMM-001` e `GC-BUG-001`, os modelos e as instruções obrigatórias foram confirmados.
- **CI:** até a última consulta, não havia workflow associado ao SHA documental `0acceaf...` e o status combinado não apresentava checks. Portanto, a documentação não deve ser marcada como validada pelo CI ainda. A validação de código anterior no Run `41045143930` foi bem-sucedida no SHA `b90be364...`, mas é um commit diferente.
- **Critério de conclusão:** validar o SHA documental por workflow apropriado e mesclar a PR #6; até lá, o padrão existe na branch da PR, não na `main`.
- **Próximo passo:** solicitar/disparar a validação do commit documental se ela não iniciar automaticamente; revisar o resultado e, após merge, confirmar que os arquivos estão presentes na `main`.

## 8. Regra final

**Se o trabalho não foi registrado, o conhecimento ainda não foi entregue ao projeto.** Toda tarefa termina com código/documentação validada quando aplicável e com um registro que permita a outra pessoa entender o que aconteceu, reproduzir o diagnóstico e continuar sem recomeçar do zero.


## 9. Continuidade e checklist de PR

- **Atualização:** 2026-10-30 08:17 BRT (11:17Z).
- **PR:** [#6 — Biomas, variantes sazonais e simulação hidrológica 2D](https://github.com/apoenalore/GameCreator/pull/6).
- **Último commit da documentação nesta etapa:** `31b3cec59f325e5cfe708aa49e4529bd61b37620`.
- **Ação adicional:** criado `.github/pull_request_template.md` para exigir o registro do diário, causa/hipóteses, testes e estado real em cada PR.
- **Referências existentes:** a base `docs/BASE_CONHECIMENTO_ERROS_RUNNER_CI.md`, o relatório `docs/RELATORIO_ERROS_COMUNICACAO_RUNNER_GITHUB.md`, as pendências e o protocolo sequencial continuam como documentos complementares; o diário centraliza o progresso e aponta para eles.
- **Estado:** PR aberta; não mesclada. A documentação está na branch, não se deve afirmar que já está disponível na `main`.


## 10. Progresso — empacotamento sem documentos internos (30/10/2026)

- **Repositório principal:** GameCreator, branch \`main\`.
- **Correção:** o workflow de entrega passou a excluir documentação interna, histórico, testes, CI, arquivos Markdown/texto, package de testes, scripts de publicação e versão antiga.
- **Commit:** \`f69a013dcc6f38267e204b50c1df90698dca54a3\`.
- **Validação:** run [#41079295445](https://github.com/apoenalore/GameCreator/actions/runs/41079295445), success. O ZIP interno foi inspecionado e contém 52 arquivos necessários ao runtime, sem documentação, testes ou workflows.
- **Integridade:** SHA-256 do ZIP interno \`7a061059a7d027c45e32ce11fd78c48fd5bdf9a0b0c05e069802cb6c1d3dfda7\`.
- **Limite:** a correção do empacotador foi validada na main. A branch ambiental desta PR tem commit equivalente, mas seu head atual ainda precisa de CI e sincronização com main antes de integração.
