# Base de conhecimento — erros de CI, runners e validação

**Projeto:** Game Creator  
**Repositório:** apoenalore/GameCreator  
**Branch de referência:** main  
**Atualização:** 30/10/2026  
**Objetivo:** permitir que agentes de IA reconheçam falhas recorrentes, investiguem a causa real e apliquem correções pequenas sem repetir tentativas cegas.

**Relatório dedicado de comunicação:** [Relatório de erros de comunicação — GitHub Actions e Runner Windows](RELATORIO_ERROS_COMUNICACAO_RUNNER_GITHUB.md). Consultar esse documento para o incidente atual GC-COMM-001 e o procedimento de diagnóstico do runner.

> Esta base reúne logs apresentados nas conversas do projeto, registros documentados no repositório e inspeções de workflows. Ela distingue fatos comprovados de hipóteses. Não trate uma hipótese como causa raiz confirmada.

## 1. Instruções obrigatórias para qualquer agente de IA

Antes de alterar código, workflow ou runner:

1. Leia este documento e o protocolo sequencial do projeto.
2. Identifique o repositório, branch, commit SHA, workflow, run ID, job e etapa que falhou.
3. Classifique o caso como **CONFIRMADO**, **PROVÁVEL**, **NÃO DIAGNOSTICADO** ou **HISTÓRICO**.
4. Encontre a primeira mensagem causal do log. Não use apenas a mensagem final “Process completed with exit code 1”.
5. Verifique se o job realmente executou. Um job em estado **queued** não é falha de código.
6. Faça a menor inspeção ou reprodução possível antes de propor alteração.
7. Não repita uma execução idêntica sem uma causa transitória demonstrada ou uma correção verificável.
8. Mantenha WIP = 1 para Game Creator e Apoena Pixel Art HTML combinados.
9. Não remova testes, não enfraqueça assertions e não troque um erro por um aviso para obter um resultado verde.
10. Depois de corrigir e comprovar a solução, atualize esta base com o log, causa raiz, arquivos alterados e validação que passou.

## 2. Estados e níveis de certeza

- **CONFIRMADO:** há log, código ou estado do GitHub que demonstra diretamente o problema.
- **PROVÁVEL:** a evidência aponta para uma causa, mas ainda falta uma verificação.
- **NÃO DIAGNOSTICADO:** há mensagem de erro, mas não existe evidência suficiente para atribuir causa.
- **HISTÓRICO:** ocorreu em execução anterior; não afirmar que ainda acontece sem verificar novamente.
- **RESOLVIDO:** somente depois de corrigir e conferir a execução relevante no commit que contém a correção.

## 3. Catálogo de erros conhecidos

### GC-RUN-001 — Jobs permaneceram em QUEUED sem runner atribuído

**Classificação:** bloqueio de atribuição CONFIRMADO no snapshot inicial; RECUPERADO OPERACIONALMENTE; causa raiz original NÃO DIAGNOSTICADA.

- Snapshot inicial: 30/10/2026, 17 queued, 0 in_progress; todos os 17 jobs tinham runner_id = 0, runner_name vazio e steps vazios.
- Recuperação: runner ID 2, `APOENA-GAMECREATOR-RUNNER`, recebeu jobs com labels self-hosted, Windows, X64 e concluiu com success os runs [40996154399](https://github.com/apoenalore/GameCreator/actions/runs/40996154399), [40996154391](https://github.com/apoenalore/GameCreator/actions/runs/40996154391), [41044696841](https://github.com/apoenalore/GameCreator/actions/runs/41044696841), [41044823914](https://github.com/apoenalore/GameCreator/actions/runs/41044823914) e [41045143930](https://github.com/apoenalore/GameCreator/actions/runs/41045143930).
- Snapshot posterior às validações: 0 queued, 0 in_progress.
- Causa raiz da indisponibilidade inicial: NÃO DIAGNOSTICADA. Não foi comprovado se o runner ficou Offline, perdeu serviço, grupo, autorização ou labels.
- Solução efetivamente utilizada: nenhuma alteração de instalação/configuração do runner foi comprovada. O runner voltou a aceitar jobs e processou a fila; as falhas que surgiram foram diagnosticadas separadamente como GC-CI-010 e GC-CI-011.
- **Relatório completo:** [RELATORIO_ERROS_COMUNICACAO_RUNNER_GITHUB.md](RELATORIO_ERROS_COMUNICACAO_RUNNER_GITHUB.md).

**Regra:** se queued + runner_id=0 + steps vazios, diagnosticar atribuição do runner antes de analisar código. Não declarar causa resolvida apenas porque o runner voltou.

### GC-RUN-002 — “pwsh: command not found”

**Classificação:** HISTÓRICO; mensagem observada em uma execução anterior. A configuração atual deve ser reavaliada antes de aplicar a correção.

**Mensagem observada:**
> Error: pwsh: command not found

**Causa diretamente indicada:** o processo tentou iniciar o executável pwsh, mas ele não foi encontrado no ambiente/PATH do runner.

**Causas prováveis:**
- Workflow configurado para usar PowerShell 7 (pwsh) em máquina sem PowerShell 7 instalado.
- PowerShell 7 instalado, mas ausente do PATH da conta que executa o serviço.
- Job executado em ambiente diferente do esperado.

**Solução:**
1. Conferir o shell definido no step ou em defaults.run.
2. No Windows, usar powershell se o script for compatível com Windows PowerShell 5.1; ou instalar PowerShell 7 e garantir que pwsh.exe esteja acessível à conta do runner.
3. Em Linux, instalar PowerShell 7 se o workflow realmente precisar de pwsh; caso contrário, usar bash e adaptar o script.
4. Não trocar o shell sem conferir sintaxe, módulos e comandos usados.

**Prevenção:** incluir diagnóstico de versão do shell no início do job e manter o ambiente declarado compatível com o workflow.

### GC-RUN-003 — PowerShell ParserError: token “PACOTE” inesperado

**Classificação:** erro de sintaxe CONFIRMADO; causa raiz exata NÃO DIAGNOSTICADA.

**Trecho observado:**
> ParserError — Token 'PACOTE' inesperado  
> Linha apresentada: "APOENA GAME CREATOR V4.1 — PACOTE DE TRABALHO"

**Interpretação:** o parser não interpretou corretamente a expressão naquela posição. O caractere de travessão longo (—) não é, por si só, inválido dentro de uma string PowerShell corretamente delimitada. Não atribua automaticamente o erro ao travessão.

**Causas possíveis:**
- Aspa anterior aberta/fechada incorretamente.
- Aspas tipográficas ou codificação alterada ao gerar o script temporário.
- Vírgula, parêntese ou elemento de array fora da estrutura esperada.
- Texto inserido em expressão PowerShell sem estar delimitado como string.

**Solução:**
1. Inspecionar o arquivo .ps1 temporário completo e as linhas anteriores à linha reportada.
2. Verificar bytes/encoding e substituir aspas tipográficas por aspas ASCII quando necessário.
3. Para texto longo, usar string corretamente delimitada ou here-string.
4. Validar o arquivo com [System.Management.Automation.Language.Parser]::ParseFile(...) antes de executá-lo.
5. Corrigir a expressão real; não remover palavras do pacote apenas para silenciar o parser.

**Prevenção:** manter a etapa de análise sintática PowerShell antes do build. O workflow canônico já contém uma chamada a Parser::ParseFile para integracao/build_unificado.ps1; preservar essa proteção.

### GC-RUN-004 — Nenhum arquivo encontrado em _delivery/

**Classificação:** aviso CONFIRMADO; causa específica NÃO DIAGNOSTICADA.

**Mensagem observada:**
> Warning: No files were found with the provided path: _delivery/. No artifacts will be uploaded.

**Significado:** a etapa de upload não encontrou arquivos que correspondessem ao caminho informado. Isso pode não falhar o workflow sozinho, mas significa que nenhum artefato foi publicado por aquela etapa.

**Causas possíveis:**
- A etapa que deveria gerar o pacote não criou _delivery/.
- O build gravou em outro diretório.
- O caminho relativo foi interpretado a partir de outro diretório de trabalho.
- A geração do pacote foi ignorada ou falhou antes do upload.
- O diretório existe, mas está vazio.

**Solução:**
1. Localizar a etapa que deveria gerar o pacote.
2. Registrar o diretório de saída real no log.
3. Antes do upload, listar arquivos e confirmar que há conteúdo.
4. Fazer o build e o upload usarem exatamente o mesmo caminho.
5. Se o artefato for opcional, declarar isso explicitamente; não esconder a ausência de um artefato obrigatório.

**Prevenção:** validar a existência do pacote esperado antes da etapa de upload e informar claramente se a entrega é obrigatória.

### GC-RUN-005 — AssertionError: esperado 0, recebido 128

**Classificação:** falha de teste CONFIRMADA; causa raiz NÃO DIAGNOSTICADA.

**Trecho observado:**
> AssertionError [ERR_ASSERTION]: Expected values to be strictly equal: 128 !== 0

O log apresentado mostrava dez testes de contrato do catálogo aprovados antes da assertion.

**Interpretação:** o teste esperava código de saída zero, mas uma operação retornou 128. O valor 128 pode aparecer em falhas de comandos externos, inclusive Git, mas não prova que Git seja a causa.

**Solução de diagnóstico:**
1. Abrir integracao/testes/catalogo.test.js na linha indicada pelo stack trace.
2. Identificar qual comando/processo produziu o código 128.
3. Capturar stdout, stderr, diretório de trabalho (cwd) e argumentos reais desse processo.
4. Se for Git, verificar se o diretório é um repositório válido, se há remote/branch configurados e se o comando precisa de credenciais.
5. Se for outro processo, consultar seu próprio código de erro e documentação.
6. Corrigir a condição real. Não alterar a assertion para aceitar 128.

**Prevenção:** testes de subprocessos devem exibir comando, cwd, stdout, stderr e exit code quando falharem. Em caminhos Windows com espaços, passar argumentos separadamente e evitar concatenação insegura de comandos.

### GC-RUN-006 — Runner mostra “Listening for Jobs”, mas o job não começa

**Classificação:** sintoma relatado; causa específica NÃO DIAGNOSTICADA.

**Significado:** a mensagem confirma que o processo local entrou no modo de escuta. Não confirma que o GitHub encontrou aquele runner como compatível com o job.

**Verificações:**
- O job está queued ou já foi atribuído?
- O runner está Online na página do repositório?
- As labels exigidas pelo runs-on coincidem?
- O runner está registrado no repositório correto?
- O serviço ativo é o mesmo da instalação que está sendo observada no CMD?
- O workflow foi realmente acionado para aquela branch e para os caminhos alterados?

**Solução:** seguir o diagnóstico de GC-RUN-001. Não iniciar outra cópia do runner na mesma pasta apenas porque o terminal não mostrou um job.

### GC-RUN-007 — “Tenho mais de um runner ativo?”

**Classificação:** hipótese levantada; não há evidência de que múltiplos runners sejam a causa de uma falha específica.

**Regra técnica:** ter mais de um runner pode ser válido se cada instalação tiver registro, nome, diretório de trabalho e serviço próprios. O problema aparece quando duas instâncias tentam usar a mesma instalação/pasta, quando há registros duplicados sem identificação ou quando as labels/grupos não correspondem ao workflow.

**Solução:** inventariar cada runner por repositório, nome, labels, pasta e serviço. Não desinstalar nem remover registros sem identificar qual instalação atende cada projeto.

### GC-RUN-008 — “Process completed with exit code 1”

**Classificação:** mensagem genérica; NÃO DIAGNOSTICADA sem a primeira falha causal.

**Solução:** abrir o log do job, voltar à primeira mensagem Error, ParserError, AssertionError, comando não encontrado ou teste reprovado. O código 1 isolado não informa se a origem foi PowerShell, Node, Git, Godot ou uma assertion.

### GC-CI-009 — Validação de integração dependia de clique manual

**Classificação:** CAUSA CONFIRMADA; CORRIGIDO E VALIDADO.
- O workflow de integração da branch PR #6 continha somente `on: workflow_dispatch`; o push canônico estava restrito a uma branch e a agenda horária antiga não estava na main.
- Correção: commit [e861c534](https://github.com/apoenalore/GameCreator/commit/e861c5348cd9849800571a4d31c6bfeff0ede8ed) ampliou push/PR e restaurou agenda horária. Commits [acc6c293](https://github.com/apoenalore/GameCreator/commit/acc6c2938a365a992fffaa13c6e11854527cd24c) e [00b3619](https://github.com/apoenalore/GameCreator/commit/00b3619f296fd821beed219f46fcc5d572bad6ea) removeram workflows redundantes das PRs #6 e #5.
- Validações automáticas sem clique: [41044696841](https://github.com/apoenalore/GameCreator/actions/runs/41044696841) main success; [41044823914](https://github.com/apoenalore/GameCreator/actions/runs/41044823914) PR #5 success; [41045143930](https://github.com/apoenalore/GameCreator/actions/runs/41045143930) PR #6 success.
- Consulta posterior: 0 queued, 0 in_progress. `workflow_dispatch` permanece somente como fallback de emergência.

### GC-CI-010 — Testes executados antes do build nativo

**Classificação:** CAUSA CONFIRMADA; RESOLVIDO.
- Run [40959244729](https://github.com/apoenalore/GameCreator/actions/runs/40959244729), 30/10/2026 07:48:40 BRT: assertion `entrada nativa carrega biblioteca, ponte e editor de Natureza`.
- O workflow antigo rodava a suíte antes de compilar o Creator; a etapa de build era ignorada após a falha.
- Correção: fluxo horário antigo substituído pelo pipeline canônico que compila antes dos testes. Run [41044696841](https://github.com/apoenalore/GameCreator/actions/runs/41044696841) comprovou a ordem e passou.

### GC-CI-011 — ReferenceError: profile is not defined

**Classificação:** CAUSA CONFIRMADA; RESOLVIDO E VALIDADO.
- Runs [40994401969](https://github.com/apoenalore/GameCreator/actions/runs/40994401969) e [40994405717](https://github.com/apoenalore/GameCreator/actions/runs/40994405717), 30/10/2026 07:57:20 e 07:57:37 BRT.
- `stepHydrology` usava `profile.runoff` no loop de escoamento sem declarar `profile` naquele escopo.
- Correção: commit [de5f5e9](https://github.com/apoenalore/GameCreator/commit/de5f5e9db7808c1eb0c3b5c18aec3686a10ea77b), 30/10/2026 08:00:44 BRT, declara `const profile = sim.profiles[i] || defaultHydrology();` dentro do loop de escoamento.
- Validação: run [41045143930](https://github.com/apoenalore/GameCreator/actions/runs/41045143930), step `Testar contratos do catálogo e simulação hidrológica` success às 08:04:58 BRT; job completo success às 08:05:57 BRT.

## 4. Configuração de CI conhecida — usar como referência, não como verdade permanente

O workflow canônico atual é `.github/workflows/pixel-art.yml` na `main`:
- Usa `runs-on: [self-hosted, Windows, X64]`.
- Usa Windows PowerShell explicitamente e prepara Node.js 20.
- Executa em push de alterações relevantes em qualquer branch.
- Executa em eventos de Pull Request para `main`, com filtro de caminhos.
- Executa também a cada hora na branch padrão (`cron: "0 * * * *"`).
- `workflow_dispatch` é somente fallback de emergência; não é necessário para o fluxo normal.
- Usa concorrência por branch com `cancel-in-progress: true`, evitando acumular validações antigas equivalentes.
- Executa build nativo antes dos testes, depois DOM responsivo, sintaxe, testes Node, biblioteca/backup, integração de catálogo/terreno/objetos/natureza, hidrologia quando os arquivos existem, runtime headless do Godot, preservação de arquivos e artefatos.
- Todas as verificações ficam em um único job sequencial para reduzir concorrência e consumo do runner.
- Não recriar workflows manuais separados para testes já cobertos pelo pipeline canônico.
- `publicar-creator-unificado.yml` mantém finalidade distinta de build/publicação; não remover sem comparar seus artefatos.

**Importante sobre schedules:** o evento `schedule` é executado na branch padrão. Um cron definido apenas numa branch de Pull Request não substitui a agenda ativa da `main`.

## 5. Procedimento padrão para corrigir qualquer falha

1. **Identificar:** repositório, branch, commit SHA, run ID, job, step e runner.
2. **Classificar:** fila/runner, shell/ambiente, dependência, sintaxe, teste, build ou artefato.
3. **Localizar a primeira causa:** copiar o trecho de log anterior à mensagem final.
4. **Verificar a hipótese:** inspecionar o arquivo e a linha apontada; não adivinhar.
5. **Corrigir uma causa por vez:** evitar mudanças sem relação.
6. **Validar barato primeiro:** parser, lint ou teste específico; suíte canônica só depois que o ambiente estiver disponível e a correção for pertinente.
7. **Repetir uma única vez quando necessário:** não repetir o mesmo commit para erro determinístico sem mudança de condição.
8. **Registrar o resultado:** link da execução, commit que contém a correção e evidência do sucesso.

## 6. Modelo obrigatório para novos registros

Para cada erro novo, adicionar:

- ID:
- Repositório:
- Data:
- Run ID e URL:
- Commit SHA:
- Workflow / job / step:
- Mensagem literal:
- Classificação: CONFIRMADO / PROVÁVEL / NÃO DIAGNOSTICADO / HISTÓRICO:
- Causa raiz comprovada:
- Causas descartadas:
- Correção aplicada:
- Arquivos alterados:
- Teste específico:
- Validação canônica e resultado:
- Prevenção para não repetir:

**Regra final:** uma correção só vira conhecimento reutilizável quando a causa raiz foi comprovada e a solução passou por validação no commit correspondente.

---

## 7. Histórico de incidentes — erro, motivo, solução utilizada e data/hora

**Fuso horário padrão:** BRT (UTC−03:00). Quando o log original está em UTC, o horário abaixo foi convertido e o UTC original foi mantido entre parênteses. “Hora não preservada” significa que a conversa ou o registro original não continha um horário verificável. Não inventar horários retroativos.

### GC-RUN-001 — Job sem runner atribuído (queued)

- **Data/hora do relato:** 30/10/2026 10:42:01 UTC (07:42:01 BRT).
- **Sintoma inicial:** snapshot com 17 jobs queued; todos solicitavam self-hosted, Windows, X64 e apresentavam runner_id = 0, runner_name vazio e steps vazios.
- **Motivo comprovado:** o GitHub não atribuiu jobs a um runner compatível naquele snapshot; nenhum step tinha começado.
- **Recuperação observada:** o runner ID 2, `APOENA-GAMECREATOR-RUNNER`, voltou a receber jobs. Runs [40996154399](https://github.com/apoenalore/GameCreator/actions/runs/40996154399) (07:44:56–07:45:20 BRT), [40996154391](https://github.com/apoenalore/GameCreator/actions/runs/40996154391) (07:53:08–07:55:51 BRT) e [41044696841](https://github.com/apoenalore/GameCreator/actions/runs/41044696841) (07:58:56–08:01:18 BRT) foram concluídos com success e labels self-hosted, Windows, X64.
- **Causa raiz da indisponibilidade inicial:** NÃO DIAGNOSTICADA. A recuperação foi observada, mas não foi registrada alteração de serviço, grupo, autorização, labels ou instalação que prove a causa.
- **Solução efetivamente utilizada:** nenhuma alteração de configuração do runner comprovada. A fila antiga foi processada pelo runner; 15 execuções antigas terminaram (12 success, 3 failure). As falhas foram de código/ordem de build, não de comunicação.
- **Resultado:** RECUPERADO OPERACIONALMENTE; causa raiz original permanece desconhecida. Não confundir recuperação com causa resolvida.
- **Relatório completo:** [RELATORIO_ERROS_COMUNICACAO_RUNNER_GITHUB.md](RELATORIO_ERROS_COMUNICACAO_RUNNER_GITHUB.md).
- **Prevenção:** antes de repetir, verificar status, runner_id, runner_name, labels e steps. Se queued + runner_id=0 + steps vazios, investigar atribuição do runner, não o código.

### GC-RUN-002 — pwsh: command not found

- **Data/hora do erro:** 28/10/2026 18:24:18.389 BRT (UTC original: 2026-10-28T21:24:18.3899704Z).
- **Execução:** run 40771579313, job 123109874120 — https://github.com/apoenalore/GameCreator/actions/runs/40771579313/job/123109874120
- **Erro literal:** ##[error]pwsh: command not found
- **Motivo comprovado:** o job chegou a um runner Windows identificado como APOENA-GAMECREATOR-RUNNER, mas o processo tentou iniciar pwsh e não encontrou esse executável no ambiente/PATH. O log mostra Node v20.20.2 instalado; portanto, não era ausência geral de execução do runner.
- **Solução efetivamente utilizada na configuração atual:** o workflow .github/workflows/pixel-art.yml na main declara explicitamente defaults.run.shell como powershell -NoProfile -ExecutionPolicy Bypass -Command ". '{0}'", em vez de depender do shell pwsh padrão.
- **Evidência da solução:** configuração atual da main, arquivo .github/workflows/pixel-art.yml.
- **Resultado:** CONFIGURAÇÃO CORRIGIDA no arquivo atual; ainda falta uma execução posterior bem-sucedida que comprove o fim do erro em runtime.
- **Prevenção:** manter o shell explícito e compatível com Windows PowerShell instalado na conta do serviço do runner.

### GC-RUN-003 — PowerShell ParserError: token PACOTE inesperado

- **Data/hora do erro:** 28/10/2026; hora exata não preservada no registro original.
- **Execução:** ID/URL da execução não preservados.
- **Erro literal:** ParserError: Token 'PACOTE' inesperado, associado à linha "APOENA GAME CREATOR V4.1 — PACOTE DE TRABALHO".
- **Motivo comprovado:** o parser PowerShell rejeitou a expressão na posição indicada.
- **Causa raiz:** NÃO DIAGNOSTICADA. Aspas, delimitadores, vírgulas, parênteses ou codificação são hipóteses. O travessão longo, isoladamente, não foi comprovado como causa.
- **Solução efetivamente utilizada:** nenhuma solução confirmada por log ou validação foi localizada.
- **Solução proposta:** recuperar o .ps1 completo da execução original, inspecionar as linhas anteriores e validar a sintaxe com Parser::ParseFile antes de executar.
- **Resultado:** PENDENTE DE DIAGNÓSTICO.
- **Prevenção:** registrar o script temporário completo e a linha/coluna do parser no log.

### GC-RUN-004 — Upload sem arquivos em _delivery/

- **Data/hora do aviso:** 28/10/2026 18:24:18.978 BRT (UTC original: 2026-10-28T21:24:18.9781108Z).
- **Execução:** mesmo run 40771579313, job 123109874120.
- **Erro literal:** No files were found with the provided path: _delivery/. No artifacts will be uploaded.
- **Motivo comprovado:** no mesmo job, os steps PowerShell anteriores falharam com pwsh: command not found. Assim, os comandos que criariam/preencheriam _delivery/ e .ci-results/ não foram executados; o upload recebeu diretórios sem arquivos.
- **Solução efetivamente utilizada na configuração atual:** a mesma correção de shell de GC-RUN-002 — declarar explicitamente Windows PowerShell no workflow.
- **Resultado:** CAUSA DO AVISO IDENTIFICADA e configuração atual ajustada; falta confirmar em uma execução posterior que _delivery/ e os artefatos foram realmente produzidos.
- **Prevenção:** fazer upload somente depois de verificar a criação do pacote e listar os arquivos esperados. Não tratar o aviso como falha independente de build quando o step gerador nem iniciou.

### GC-RUN-005 — AssertionError 128 !== 0

- **Data/hora do erro:** 28/10/2026; hora exata não preservada no registro original.
- **Execução:** run ID/URL e job não preservados no trecho recebido.
- **Erro literal:** AssertionError [ERR_ASSERTION]: Expected values to be strictly equal: 128 !== 0.
- **Contexto preservado:** dez testes de contrato do catálogo foram exibidos como aprovados antes da assertion.
- **Motivo comprovado:** uma operação retornou código 128, quando o teste esperava 0.
- **Causa raiz:** NÃO DIAGNOSTICADA. Não há evidência suficiente para afirmar que foi Git, credencial, diretório ou outro subprocesso.
- **Solução efetivamente utilizada:** nenhuma solução confirmada registrada.
- **Solução proposta:** recuperar a linha completa do stack trace e o comando executado; registrar cwd, argumentos, stdout, stderr e exit code; corrigir a causa sem enfraquecer a assertion.
- **Resultado:** PENDENTE.
- **Prevenção:** toda falha de subprocesso deve imprimir contexto suficiente para identificar o comando e seu diretório de trabalho.

### GC-RUN-006 — Runner ouviu jobs, mas as validações falharam

- **Data/hora dos eventos:** 28/10/2026 18:18:26 BRT (runner Listening for Jobs); 18:20:48 BRT (job validar iniciado); 18:22:46 BRT e 18:23:09 BRT (jobs concluídos como Failed). Horários UTC originais: 21:18:26Z, 21:20:48Z, 21:22:46Z e 21:23:09Z.
- **Execução:** IDs/URLs individuais não preservados no registro da conversa.
- **Erro literal:** Job validar completed with result: Failed.
- **Motivo comprovado:** o runner estava ativo e recebeu jobs; portanto, neste episódio, Listening for Jobs não significava que o runner estava incapaz de receber tarefas.
- **Causa raiz:** NÃO DIAGNOSTICADA sem o log de cada job.
- **Solução efetivamente utilizada:** nenhuma solução específica comprovada no registro disponível.
- **Solução proposta:** consultar o primeiro step com conclusion: failure e seu log, sem reiniciar ou duplicar o runner.
- **Resultado:** execução recebida, mas validações falharam; causa pendente.
- **Prevenção:** separar diagnóstico de disponibilidade do runner do diagnóstico de falha interna do job.

### GC-RUN-007 — Suspeita de múltiplos runners ativos

- **Data/hora do registro:** 28/10/2026; hora não preservada.
- **Erro/sintoma:** pergunta sobre possível conflito entre mais de um runner.
- **Motivo comprovado:** nenhum conflito foi comprovado.
- **Solução efetivamente utilizada:** nenhuma remoção ou alteração de runner foi comprovada.
- **Resultado:** HIPÓTESE, não incidente confirmado.
- **Prevenção:** inventariar nome, repositório, labels, pasta e serviço de cada instalação antes de remover ou registrar runners.

### GC-RUN-008 — Process completed with exit code 1

- **Data/hora:** não aplicável sem um run específico; mensagem genérica relatada em diferentes contextos.
- **Erro literal:** Process completed with exit code 1.
- **Motivo comprovado:** apenas que um step terminou com código diferente de zero.
- **Causa raiz:** não identificável por essa mensagem isolada.
- **Solução efetivamente utilizada:** depende do erro causal; não existe solução única.
- **Resultado:** NÃO DIAGNOSTICADO até recuperar o primeiro erro do log.
- **Prevenção:** registrar e investigar a primeira mensagem causal, não corrigir apenas o código final.

### GC-CI-009 — Gatilhos automáticos incompletos

- **Data/hora do relato:** 30/10/2026 10:55:05 UTC (07:55:05 BRT).
- **Causa:** `testar-integracao.yml` na branch de desenvolvimento tinha somente `workflow_dispatch`; portanto, era manual. O push do workflow canônico estava restrito a `feature/estudio-unificado-pixelart-v41`; o workflow horário antigo não existia na main.
- **Correção:** commit `e861c534` às 07:58:51 BRT ampliou os gatilhos do pipeline canônico para push em qualquer branch, Pull Requests para main e schedule horário na main. Commits `acc6c293` às 07:59:40 BRT e `00b3619` às 07:59:50 BRT removeram workflows redundantes das PRs #6 e #5.
- **Validação main:** run `41044696841` — success às 08:01:18 BRT.
- **Validação PR #5:** run `41044823914` — success às 08:03:40 BRT, incluindo teste hidrológico no job canônico.
- **Validação PR #6:** run `41045143930` — success às 08:05:57 BRT, incluindo integração, simulação hidrológica, Godot e artefatos.
- **Estado:** RESOLVIDO. Consulta posterior: 0 queued e 0 in_progress.

### GC-CI-010 — Ordem de build/teste incorreta na validação agendada

- **Data/hora:** 30/10/2026 07:48:40.053 BRT.
- **Run/job:** `40959244729` / `123747361508`.
- **Mensagem:** `AssertionError: entrada nativa carrega biblioteca, ponte e editor de Natureza` em `tests/corte-inteligente.test.cjs:100`.
- **Causa:** a suíte executava antes do build nativo; a etapa de build foi skipped após a assertion.
- **Correção:** pipeline canônico com build antes da suíte e schedule horário restaurado na main; commit `e861c534`.
- **Validação:** run `41044696841` — build success antes dos testes; todos os steps success às 08:01:18 BRT.
- **Estado:** RESOLVIDO.

### GC-CI-011 — Variável profile fora do escopo no escoamento

- **Data/hora:** 30/10/2026 07:57:20.037 BRT e 07:57:37.247 BRT.
- **Runs/jobs:** `40994401969` / `123864045768`; `40994405717` / `123864058010`.
- **Mensagem:** `ReferenceError: profile is not defined`, `map-editor/terrain-system.js:415:132`.
- **Causa:** `profile` era declarado em outro loop; o loop x/y que usa `profile.runoff` não tinha variável no escopo.
- **Correção:** commit `de5f5e9` às 08:00:44 BRT adicionou `const profile = sim.profiles[i] || defaultHydrology();` no loop de escoamento.
- **Validação:** run `41045143930`; o teste de contratos do catálogo e simulação hidrológica passou às 08:04:58 BRT e o job completo terminou success às 08:05:57 BRT.
- **Estado:** RESOLVIDO E VALIDADO.

### GC-CI-012 — Falha transitória de DNS ao publicar artefatos

- **Classificação:** ERRO DE COMUNICAÇÃO EXTERNA; não foi falha de build, teste ou runtime.
- **Ocorrência:** 30/10/2026 13:55:01 UTC (10:55:01 BRT), run [#41066904787](https://github.com/apoenalore/GameCreator/actions/runs/41066904787), job \`124100579029\`.
- **Mensagem literal:** \`Failed to CreateArtifact: Unable to make request: ENOTFOUND\`; houve timeout ao chamar \`ArtifactService/CreateArtifact\`.
- **Evidência anterior à falha:** compilação, JavaScript, interface, biblioteca, backup, catálogo, integração, hidrologia, Godot e preparação do pacote concluíram com success. A falha ocorreu nos steps de upload de \`_delivery/\` e \`.ci-results/\`.
- **Causa confirmada:** a requisição ao serviço de artefatos não conseguiu resolver o destino de rede (ENOTFOUND) após timeout. O log não preserva o hostname final, portanto não atribuir a falha a um domínio específico.
- **Solução aplicada:** nenhuma mudança de código para esse incidente; a execução posterior [#41075044875](https://github.com/apoenalore/GameCreator/actions/runs/41075044875) concluiu os dois uploads.
- **Resultado:** RECUPERADO E VALIDADO OPERACIONALMENTE por execução posterior. Não repetir toda a suíte quando o único step falho for upload transitório e os testes já tiverem passado.
- **Prevenção:** separar falha de artifact service de falha de aplicação; guardar run/job/step e confirmar se o pacote foi gerado antes de repetir.

### GC-PACK-001 — Pacote de trabalho incluía documentação interna

- **Classificação:** BUG DE EMPACOTAMENTO confirmado por inspeção.
- **Identificação:** 30/10/2026, durante auditoria após o run #41075044875; hora exata do achado não preservada.
- **Arquivo:** \`.github/workflows/pixel-art.yml\`, etapa \`Preparar entrega na pasta ChatGPT trabalho do runner\`.
- **Causa:** o filtro antigo excluía apenas \`.git\`, \`node_modules\`, \`.ci-results\`, \`_delivery\`, \`.godot\` e \`__pycache__\`; a cópia recursiva incluía \`docs/\`, arquivos Markdown/texto, testes e workflows internos.
- **Correção aplicada:** commit main \`f69a013dcc6f38267e204b50c1df90698dca54a3\`; o mesmo filtro foi levado à branch ambiental no commit \`5f47b1fb2889a7116d02910da09ea9cb4d33003a\`. A cópia recursiva exclui documentação, histórico, testes, CI, package de testes, scripts de publicação e versões antigas. Manifesto e resumo ficam fora do ZIP.
- **Validação:** run [#41079295445](https://github.com/apoenalore/GameCreator/actions/runs/41079295445), SHA `f69a013dcc6f38267e204b50c1df90698dca54a3`, success. O empacotador registrou 52 arquivos de runtime; inspeção do ZIP confirmou ausência de docs, testes, CI, `.md`, `.txt` e `package.json`, preservando launcher, fonte V4.0, bundle e módulos necessários. SHA-256 do ZIP interno `7a061059a7d027c45e32ce11fd78c48fd5bdf9a0b0c05e069802cb6c1d3dfda7`.
- **Resultado:** VALIDADO. A documentação interna permanece no repositório e fora da distribuição.
- **Prevenção:** manter a lista de exclusões e falhar o step se diretórios/documentos internos aparecerem no pacote.

## 8. Modelo obrigatório para todos os novos registros

Cada ocorrência nova deve conter todos os campos abaixo. Usar ISO 8601 com fuso, preferencialmente BRT (-03:00), e preservar o horário UTC original quando vier do GitHub.

- ID do incidente:
- Projeto/repositório:
- Data/hora da ocorrência:
- Data/hora do registro:
- Fuso horário:
- Run ID / job ID / URL:
- Branch e commit SHA:
- Workflow / step:
- Erro literal (copiado do log):
- Motivo / causa raiz comprovada:
- Hipóteses ainda não confirmadas:
- Solução efetivamente utilizada: descrever somente o que foi aplicado de fato; se não houver, escrever “Nenhuma solução aplicada/comprovada”.
- Evidência da solução: arquivo/commit/log/teste que demonstra a alteração.
- Resultado após a solução: aprovado, resolvido, pendente ou não reproduzido.
- Data/hora da validação:
- Prevenção para não repetir:

**Regra:** nunca preencher “solução efetivamente utilizada” com uma recomendação que ainda não foi aplicada. Quando a hora original não estiver disponível, registrar “hora não preservada” e manter a data/hora do cadastro separada.

## GC-COMM-002 — Falha intermitente ao criar/enviar artefatos do GitHub Actions

- **Projeto/repositório:** Game Creator — apoenalore/GameCreator.
- **Data/hora da ocorrência:** 30/10/2026 10:55:01 -03:00 e 10:55:09 -03:00 (13:55:01Z e 13:55:09Z).
- **Data/hora do registro:** 30/10/2026 12:17:00 -03:00.
- **Run/job:** [41066904787](https://github.com/apoenalore/GameCreator/actions/runs/41066904787) / 124100579029.
- **Branch/commit:** main / 55052f8912b70dc8eb132b983447df1c080e63fd.
- **Workflow/steps:** .github/workflows/pixel-art.yml; step 21, “Disponibilizar pacote de codigo para download”, e step 22, “Anexar logs de diagnostico”.
- **Status:** testes e preparacao local do pacote passaram; as duas etapas de upload de artefatos falharam.
- **Erro literal:** Request timeout: /twirp/github.actions.results.api.v1.ArtifactService/CreateArtifact seguido de Failed to CreateArtifact: Unable to make request: ENOTFOUND.
- **Evidencia adicional:** o pacote local foi preparado em ChatGPT trabalho; o log informou 128 arquivos para o artefato principal e 22 arquivos de diagnostico. O erro ocorreu ao criar o artefato no servico remoto, nao durante os testes do Creator.
- **Causa imediata comprovada:** falha de resolucao/conectividade ao acessar o servico de artefatos do GitHub, acompanhada de timeout.
- **Hipotese ainda nao confirmada:** instabilidade temporaria de DNS, rede, proxy ou rota do runner. O log nao identifica qual componente de rede originou a falha.
- **Causas descartadas nesta execucao:** nao houve falha nos testes de JavaScript, biblioteca, exportacao, integracao ou Godot; os steps anteriores ao upload terminaram com sucesso.
- **Solucao efetivamente utilizada:** nenhuma correcao de codigo, DNS ou configuracao foi aplicada. A execucao posterior [41075044875](https://github.com/apoenalore/GameCreator/actions/runs/41075044875), no mesmo commit 55052f8912b70dc8eb132b983447df1c080e63fd, terminou com success, indicando que a falha nao foi permanente. Isso e recuperacao observada, nao causa raiz resolvida.
- **Resultado:** INTERMITENTE / NAO REPRODUZIDO NA EXECUCAO SEGUINTE / CAUSA RAIZ DE REDE NAO IDENTIFICADA.
- **Prevencao:** classificar falhas de upload separadamente de falhas de codigo; quando o computador estiver online, verificar uma vez a resolucao e o acesso aos endpoints de artefatos do GitHub no runner. Nao repetir a suite inteira apenas por falha de upload.


### GC-PACK-002 — Dependência da fábrica original ausente no manifesto enxuto

- **Classificação:** BUG DE EMPACOTAMENTO/MANIFESTO DE RUNTIME.
- **Identificação:** 30/10/2026, após a inspeção independente do primeiro ZIP limpo; hora exata do achado não preservada.
- **Causa:** \`pixel-art/modulo-integrado.js\` abre \`integracao/index.html\`; essa página usa \`integracao/catalogo.js\` e aponta para \`legacy/abrir-editor-v3.9.html\`. A página da fábrica carrega 23 partes JS em \`legacy/v3_9_parts/parte_000.js\` a \`parte_022.js\`. O primeiro empacotador e o manifesto do atualizador excluíam toda a pasta \`legacy\`; o manifesto do atualizador também omitia a página integrada e o catálogo.
- **Impacto:** o Creator principal abria, mas o acesso à página integrada/fábrica original ficava incompleto na instalação enxuta.
- **Correção aplicada:** o empacotador agora copia apenas a página original e suas 23 partes, validando ausência de arquivos legados extras; o atualizador inclui \`integracao/index.html\`, \`integracao/catalogo.js\`, a página da fábrica e as 23 partes. \`legacy/iniciador-anterior.html\` continua fora.
- **Testes adicionados:** \`tests/atualizador-manifest.test.cjs\` valida o contrato do sparse-checkout, regex de runtime, os 23 scripts referenciados, a ligação da interface e o empacotador.
- **Commits:** packager main \`1561a0d08b26177596fafbf21102b739aa4a2b76\`; manifesto \`184102a9317c687485da55bc34ef0f50d5352601\`; teste \`c155207db4a61ce2766ebcbd5dc1a59604c5afee\`; workflow canônico \`65db2b62cc9750f50a3cc595c80466b6344fbc94\`.
- **Validação do atualizador:** o step 17 do run [#41082083233](https://github.com/apoenalore/GameCreator/actions/runs/41082083233) passou (parser PowerShell e teste estático do manifesto); o job ainda está no step 22 de publicação do artefato. O teste real de clone/fast-forward e preservação local continua pendente.




### GC-UPDATE-TEST-001 — CRLF não normalizado no teste de contrato

- **Projeto/repositório:** Game Creator — apoenalore/GameCreator.
- **Data/hora da ocorrência:** 2026-10-30T16:18:02-03:00 (2026-10-30T19:18:02Z).
- **Data/hora do registro/correção:** 2026-10-30T16:27-03:00.
- **Run/job:** [41113920551](https://github.com/apoenalore/GameCreator/actions/runs/41113920551) / 124263385696.
- **Commit testado:** df105063a13536c0b3e56296c94e405cd7ce5a04.
- **Workflow/step:** pixel-art.yml — step 17, “Validar manifesto do atualizador Windows quando presente”.
- **Erro literal:** AssertionError: Arquivos locais fora do runtime precisam ser verificados antes de alterar o sparse-checkout.
- **Causa raiz comprovada:** o checkout Windows entregou o arquivo PowerShell com CRLF, mas o teste Node procurava sequências com LF usando indexOf. A busca retornou -1 e a assertion falhou. A hipótese anterior de que a primeira ocorrência era um comentário estava incompleta; a causa que explica o comportamento no runner é a diferença de quebras de linha.
- **Correção aplicada:** a função read do teste normaliza CRLF para LF antes das buscas; a posição do sparse-checkout também aponta para a linha executável completa. Commits de correção do teste: 65c65521b0fb1595215bd70da03c4ef7b898032d e 8bbe3d7379b43da5c98c18bd1165e2d8d114a267.
- **Evidência adicional:** o teste foi ampliado para executar o PowerShell real contra repositório Git temporário. A CI do commit 68c63b0b16b434a3482d9e44aa9824f8a27676dc ainda estava em andamento no momento deste registro; o resultado do teste end-to-end não foi presumido.
- **Resultado:** CORREÇÃO DE TESTE APLICADA / NOVA CI PENDENTE.
- **Prevenção:** normalizar CRLF/LF em testes Node que inspecionam scripts PowerShell e localizar linhas executáveis completas, não substrings ambíguas.


### GC-UPDATE-RECOVERY-001 — Retomada de clone inicial interrompido antes do checkout

- **Projeto/repositório:** Game Creator — apoenalore/GameCreator.
- **Data/hora do achado:** 2026-10-30T16:26-03:00.
- **Fonte:** revisão CodeRabbit da PR #7 e reprodução de clone com --no-checkout.
- **Condição:** se a primeira execução parar após o clone sem checkout e antes de read-tree, uma nova execução encontra .git e $novoClone=false. Em um clone --no-checkout, git ls-files retorna índice vazio e git status --porcelain pode apresentar remoções no índice (D ), não o estado de worktree-only ( D). Tratar esse estado como edição local bloquearia a recuperação.
- **Correção aplicada:** marcador clone-pendente.txt em ConfigDir, gravado antes do clone e associado ao destino absoluto. Na retomada, o script verifica git ls-files: índice vazio + árvore HEAD válida identifica clone ainda não materializado. Se o índice já tiver entradas, somente ausências de worktree (status “ D”) são aceitas; alterações rastreadas reais bloqueiam. Se o worktree estiver limpo, o marcador antigo é removido e a execução segue como atualização normal. Após checkout concluído, o marcador é removido.
- **Teste previsto/aplicado:** o teste Node cria clone temporário com --no-checkout, confirma índice vazio e status “D ”, grava o marcador e executa o atualizador PowerShell real para materializar os arquivos e remover o marcador.
- **Branch testada:** `feat/atualizador-local-incremental`, PR #7.
- **CI de confirmação:** [run #41116194279](https://github.com/apoenalore/GameCreator/actions/runs/41116194279), job `validar`, step 17 executou o teste PowerShell real e passou; merge commit testado: `c6562464c96e9bfaaff70b68a1d8a2ce624ae6d2`, head da branch na execução: `ae085d57c3245fb1c5d4956f0b0cd0399e4067c5`.
- **Estado:** IMPLEMENTADO NA BRANCH / CI WINDOWS AUTOMATIZADA APROVADA / TESTE MANUAL NO COMPUTADOR DO AUTOR PENDENTE.

### GC-UPDATE-TEST-002 — Bloco duplicado após catch causou erro de parser PowerShell

- **Projeto/repositório:** Game Creator — apoenalore/GameCreator.
- **Data/hora da ocorrência:** 2026-10-30T16:25:31-03:00 (2026-10-30T19:25:31Z).
- **Data/hora do registro/correção:** 2026-10-30T16:31-03:00.
- **Run/job:** [41114836257](https://github.com/apoenalore/GameCreator/actions/runs/41114836257) / 124266943540.
- **Commit testado:** 68c63b0b16b434a3482d9e44aa9824f8a27676dc.
- **Branch testada:** `feat/atualizador-local-incremental`, PR #7.
- **Workflow/step:** `pixel-art.yml` — step 17, “Validar manifesto do atualizador Windows quando presente”.
- **Classificação:** falha de sintaxe/parse do PowerShell; defeito de código bloqueante antes da execução do teste Node.
- **Erro literal:** `Token '}' inesperado na expressão ou instrução.`
- **Causa raiz comprovada:** uma edição anterior da validação do remote deixou um segundo bloco de código duplicado após o primeiro bloco try/catch. O parser encontrou uma chave de fechamento extra e interrompeu a validação antes do teste Node/PowerShell.
- **Causas descartadas:** nenhuma causa alternativa foi comprovadamente descartada no run que falhou; o log mostra que a falha ocorreu no parser antes do teste Node. Não atribuir a Git, rede ou runner sem evidência.
- **Correção aplicada:** removido o trecho duplicado após o primeiro catch, preservando o bloco completo e único de validação. Commit de correção: `d90541bd642f17aa681ea7e623b49dba12ca2b36`.
- **Evidência de correção:** [run #41116194279](https://github.com/apoenalore/GameCreator/actions/runs/41116194279), step 17 — parser PowerShell 5.1, `node --check` e execução de `tests/atualizador-manifest.test.cjs` concluídos; teste end-to-end reportou aprovação, inclusive colisão com nome acentuado. Merge commit testado: `c6562464c96e9bfaaff70b68a1d8a2ce624ae6d2`; head da branch na execução: `ae085d57c3245fb1c5d4956f0b0cd0399e4067c5`.
- **Resultado:** CORREÇÃO APLICADA / PARSER E TESTE END-TO-END WINDOWS APROVADOS NO RUN CITADO.
- **Prevenção:** após substituições por trecho, verificar arquivo completo, contagem de blocos e executar o parser PowerShell no runner antes de considerar o teste end-to-end alcançado.



### GC-UPDATE-PS-001 — Aspa ausente e regex sem âncora no manifesto do atualizador

- **Projeto/repositório:** Game Creator — apoenalore/GameCreator.
- **Ocorrências:** [run 41464182794](https://github.com/apoenalore/GameCreator/actions/runs/41464182794), job 125340620373, SHA `78a162e76b49a7862cb96bec87d5795c1c797ff2`; e [run 41486755080](https://github.com/apoenalore/GameCreator/actions/runs/41486755080), job 125419616782, SHA `1eb2119e3fa0f285e6278d51d0d5eec5ab48399c`.
- **Causas comprovadas:** a atribuição de `$regexRuntime` estava sem aspa simples final, causando erro de parsing PowerShell. Após fechar a string, a assertion encontrou que a regex sem âncora aceitava por prefixo caminhos como `map-editor/cache.json`.
- **Correção:** fechar a string e exigir correspondência do caminho completo com `$`, sem afrouxar os testes. Correção final na PR #7: commit `b483bff226e5488175b6c776f4cfd24da5f30fae`.
- **Validação:** o run canônico [41488368286](https://github.com/apoenalore/GameCreator/actions/runs/41488368286), job 125425257046, passou integralmente no SHA corrigido; o step do manifesto passou.
- **Prevenção:** após editar linha PowerShell via API, conferir os caracteres finais e o diff completo, manter o teste de caminho completo e aguardar somente a CI automática do head mais recente.

### GC-UPDATE-PS-002 — Edição remota truncou a linha e repetiu código do atualizador

- **Projeto/repositório:** Game Creator — apoenalore/GameCreator.
- **Ocorrência:** [run 41487673698](https://github.com/apoenalore/GameCreator/actions/runs/41487673698), job 125422177253, branch `feat/atualizador-local-incremental`, SHA `b29adee6023f225f88275eb2be397c40cdb5f1af`.
- **Erro:** parser PowerShell reportou `Token '{' inesperado na expressão ou instrução.` A linha `$regexRuntime` terminava sem âncora e sem aspa final; a edição remota também repetiu o final do script.
- **Correção:** restaurar o conteúdo-base de 666 linhas do commit anterior e aplicar somente a âncora `$` antes da aspa de fechamento. Commit final `b483bff226e5488175b6c776f4cfd24da5f30fae`.
- **Validação:** run canônico [41488368286](https://github.com/apoenalore/GameCreator/actions/runs/41488368286), job 125425257046, sucesso integral; arquivo final conferido com 666 linhas.
- **Prevenção:** para correção pontual, editar o arquivo completo a partir de um blob-base conhecido, verificar contagem estrutural e diff antes de considerar a alteração pronta.


### GC-UPDATE-009 — CI Windows aprovada após reexecução do job sem logs (05/11/2026)

- **Repositório/PR:** `LORECRONICASAPOENA/GameCreator`, PR #7, branch `feat/atualizador-local-incremental`.
- **Run de confirmação:** [#41950469672](https://github.com/LORECRONICASAPOENA/GameCreator/actions/runs/41950469672), tentativa 2, SHA `43fcf2afdbf669b4c79f0139fa73d27eb8d21fec`.
- **Job:** `validar`, ID `127008498341`, conclusão `success`.
- **Etapas aprovadas:** PowerShell 5.1; compilação Creator V4.0; DOM; sintaxe JavaScript; Corte Inteligente; tilesets; persistência IndexedDB; backup/restauração da biblioteca; exportação e contrato Godot; sincronização V4.0/V4.1; manifesto do atualizador; hidrologia/erosão; runtime Godot 4; preservação do Creator original e dos módulos.
- **Tentativa 1 do mesmo run:** job `126994711511` terminou sem etapas registradas e sem logs recuperáveis (`BlobNotFound`). A causa não foi confirmada; não classificar como falha de código.
- **Falha anterior de código:** run [#41949644099](https://github.com/LORECRONICASAPOENA/GameCreator/actions/runs/41949644099) em SHA anterior reportou token `}` inesperado no PowerShell. O commit `43fcf2af` removeu o bloco duplicado no final de `integracao/atualizar-creator.ps1`; a tentativa 2 do run #419504 validou o parser e os testes end-to-end.
- **Resultado:** CI Windows aprovada no SHA atual. A PR permanece draft.
- **Aceite ainda pendente:** teste manual do atualizador na máquina do proprietário, usando instalação de teste; verificar preservação de arquivos locais e exportar/restaurar a Biblioteca IndexedDB em perfil de teste.
- **Próxima ação:** aguardar evidência manual do proprietário. Não mesclar nem iniciar nova implementação no eixo GameCreator/Pixel Art antes de fechar GC-UPDATE-009.

## Registros históricos de GC-ANIM-006 preservados da PR #11 — 06/11/2026

Os registros abaixo preservam evidências históricas dos runs de 02/11/2026; não representam o estado atual das PRs. Consulte a atualização canônica no final deste arquivo.

### GC-CI-013 — Run 41357977741 terminou em failure sem logs recuperáveis

**Classificação:** NÃO DIAGNOSTICADO. Falha do run/job CONFIRMADA; causa-raiz NÃO CONFIRMADA.

- Repositório: `apoenalore/GameCreator`.
- PR: [#11 — GC-ANIM-006](https://github.com/apoenalore/GameCreator/pull/11).
- Workflow: `.github/workflows/pixel-art.yml`, execução [41357977741](https://github.com/apoenalore/GameCreator/actions/runs/41357977741), tentativa 4.
- Branch: `feat/apoena-personagem-estudio-main`.
- Commit: `a9c7148f01504f7be142dd0d852056dd5a9a5114`.
- Job: `validar`, ID `125207251095`, estado `completed/failure`.
- Horário da tentativa: início 2026-11-02T06:53:49-03:00; última atualização 2026-11-02T07:03:54-03:00.
- Evidência disponível: API do GitHub confirma failure no run e no job; runner ID `2` (`APOENA-GAMECREATOR-RUNNER`), grupo `Default`, labels `self-hosted`, `Windows`, `X64`, foi atribuído. O job iniciou em `2026-11-02T09:53:53Z` e concluiu em `2026-11-02T10:03:54Z`; a resposta da tentativa 4 retornou `steps=[]`.
- Limitação: a tentativa de baixar os logs do job retornou HTTP 404 / `BlobNotFound`; o endpoint de logs da tentativa retornou conteúdo vazio; annotations e primeira mensagem causal não estão disponíveis. O runner atribuído elimina a hipótese de job nunca agendado, mas não prova se a falha foi do runner ou do código.
- Causa raiz: **CAUSA NÃO CONFIRMADA**. Não afirmar falha de código, teste ou runner sem os logs.
- Solução aplicada: relatório individual criado em [docs/relatorios-actions/2026-11-02-run-41357977741-nao-diagnosticado.md](relatorios-actions/2026-11-02-run-41357977741-nao-diagnosticado.md). Nenhum código do produto foi alterado para mascarar o erro.
- Próxima ação: recuperar logs/annotations ou logs locais do runner Windows no intervalo acima; identificar a primeira etapa causal antes de corrigir ou repetir.
- Estado: **NÃO RESOLVIDO / AGUARDANDO EVIDÊNCIA**.
- Registro: 02/11/2026; hora exata do registro não preservada.
- Erro literal: não preservado. A API não retornou logs/annotations; o endpoint de logs retornou `BlobNotFound`/conteúdo vazio.
- Validação documental: 04/11/2026; hora exata não preservada. Validação técnica do commit não executada nesta atualização, pois a evidência causal continua indisponível.
- Prevenção: preservar `_diag` e logs/annotations antes de repetir; registrar a primeira etapa causal; não classificar como falha de código nem remover testes; verificar a disponibilidade do runner e a comunicação com GitHub antes de uma nova execução.


### GC-CI-014 — Run 41433942503 terminou em failure sem steps/logs recuperáveis

- **Classificação:** falha confirmada; causa-raiz NÃO CONFIRMADA.
- **Registro:** 02/11/2026; hora exata do cadastro não preservada nesta sessão.
- **Repositório/PR:** `apoenalore/GameCreator`, [PR #11 — GC-ANIM-006](https://github.com/apoenalore/GameCreator/pull/11).
- **Run:** [41433942503](https://github.com/apoenalore/GameCreator/actions/runs/41433942503), workflow `.github/workflows/pixel-art.yml`, evento `pull_request`, tentativa 1.
- **Branch/SHA:** `feat/apoena-personagem-estudio-main` / `70a4e09e7243d56f0f0313a7791a849218514055`.
- **Horários UTC:** criado/iniciado 2026-11-02T11:05:16Z; concluído/atualizado 2026-11-02T11:17:48Z.
- **Evidência:** API confirma run `completed/failure` e job `validar` `completed/failure`; a resposta não contém steps individuais. Consulta de reviews e comentários da PR não encontrou revisão formal nem comentários de CodeRabbit.
- **Erro literal/log causal:** indisponível; não foi retornado pela API consultada. Não inferir a etapa nem atribuir ao código/runner.
- **Causa comprovada:** apenas o estado failure do job. **Causa-raiz: NÃO CONFIRMADA.**
- **Solução efetivamente utilizada:** nenhuma correção técnica. Relatório individual publicado em [2026-11-02-run-41433942503-falha-sem-steps-recuperaveis.md](relatorios-actions/2026-11-02-run-41433942503-falha-sem-steps-recuperaveis.md).
- **Próxima ação:** coletar logs/annotations do GitHub Actions ou logs locais do runner Windows; localizar primeira etapa causal. Não repetir o mesmo commit sem evidência de falha transitória e recuperação.
- **Prevenção:** preservar relatório individual antes de qualquer correção/reexecução; não remover steps, assertions ou testes para obter CI verde.
- **Estado:** ABERTO / AGUARDANDO EVIDÊNCIA.


### Atualização GC-CI-014 — evidência visual recebida em 02/11/2026

- O autor forneceu captura da anotação expandida do GitHub Actions para o run [41433942503](https://github.com/apoenalore/GameCreator/actions/runs/41433942503).
- Texto exibido: **“0 executor auto-hospedado perdeu a comunicação com o servidor. Verifique se a máquina está em execução e possui uma conexão de rede estável. Qualquer fator no seu fluxo de trabalho que encerre o processo do executor, consuma toda a CPU/memória necessária ou bloqueie seu acesso à rede pode causar esse erro.”**
- **Categoria confirmada:** perda de comunicação do runner auto-hospedado com o servidor GitHub.
- **Causa operacional específica ainda não confirmada:** rede/DNS/proxy/firewall, suspensão/desligamento do Windows, encerramento do processo/serviço do runner, saturação de CPU/memória ou outro bloqueio. A anotação enumera possibilidades; não prova qual ocorreu.
- **Implicação:** não há evidência nesta anotação de defeito no código de animação nem de falha em teste funcional. Priorizar diagnóstico de runner/ambiente. Não alterar o código do Estúdio para corrigir esta falha de comunicação.
- **Próxima ação quando o computador estiver disponível:** consultar logs locais do runner no diretório _diag no intervalo do run; verificar estado de energia/suspensão/reinicialização do Windows, rede estável, DNS, HTTPS para GitHub, proxy/firewall e recursos CPU/memória.
- Relatório individual atualizado: [2026-11-02-run-41433942503-falha-sem-steps-recuperaveis.md](relatorios-actions/2026-11-02-run-41433942503-falha-sem-steps-recuperaveis.md).
- **Estado:** ABERTO / CATEGORIA IDENTIFICADA / CAUSA OPERACIONAL PENDENTE.
- **Validação documental:** 04/11/2026; hora exata não preservada. A classificação foi conferida com a anotação visual recebida e o histórico do GitHub Actions; nenhum novo run foi executado para este incidente.


### Atualização GC-CI-014 — conflito de sessão duplicada (capturas do autor + pesquisa)

- Capturas do console Windows mostram `Connected to GitHub`, `A session for this runner already exists` e `Runner connect error: Error: Conflict. Retrying until reconnected`, repetidamente.
- Erro imediato: tentativa de criar sessão enquanto o GitHub considera que já existe sessão ativa para a identidade do runner.
- Hipótese A: duas instâncias/listeners ou serviço Windows e execução manual `run.cmd` simultâneos usando a mesma configuração.
- Hipótese B: processo anterior encerrado abruptamente/reboot e sessão anterior ainda ativa. Hipótese adicional: OOM/pressão de recursos, ainda sem evidência local.
- Referências comunitárias: [actions/runner #4312](https://github.com/actions/runner/issues/4312) (mesma mensagem e padrão); [#3441](https://github.com/actions/runner/issues/3441) (mantenedor identificou duas solicitações de sessão em 11 segundos e questionou chamadas duplicadas de run.sh; comentário cita OOM como hipótese); [#3677](https://github.com/actions/runner/issues/3677) (sessão após reboot Windows).
- Documentação: [configurar runner Windows como serviço](https://docs.github.com/en/actions/how-tos/manage-runners/self-hosted-runners/configure-the-application?platform=windows).
- **Ainda não comprovado:** qual processo ou evento causou a sessão conflitante neste computador.
- **Próxima ação:** não iniciar outra instância; quando disponível, verificar serviço em `services.msc`, processos `Runner.Listener`/`Runner.Worker`/`run.cmd`, caminho/PID, Agendador de Tarefas e Inicialização; preservar `_diag` e Event Viewer antes de parar/reiniciar. Escolher um único modo de inicialização; não apagar `.runner` nem reconfigurar primeiro.
- Relatório detalhado: [GC-CI-014](relatorios-actions/2026-11-02-run-41433942503-falha-sem-steps-recuperaveis.md).


### Atualização GC-CI-014 — runner reconectado (captura 02/11/2026)

Nova captura mostra `Runner reconnected`, versão `2.338.0` e `Listening for Jobs` às 13:12:43Z. Isso confirma que o processo exibido recuperou comunicação e voltou a escutar tarefas. Não prova que a causa do conflito de sessão foi corrigida nem que só exista uma instância. A imagem inclui outra janela de terminal ao fundo, mas não permite identificá-la. Não iniciar outro `run.cmd`/serviço em paralelo. Conferir Settings → Actions → Runners (Online/Idle), identificar processos/serviço e preservar `_diag`; só então reexecutar uma vez o workflow da PR #11. Código do Creator permanece inalterado.


### GC-CI-015 — PR #14: gatilhos duplicados e sincronização do teste funcional

- **Classificação:** cancelamentos por concorrência CONFIRMADOS; falha de teste CONFIRMADA; correção VALIDADA no head `03382b02e74e2b39da0924bd0ff72ddacdf27e5a`.
- **Contexto:** PR [#14](https://github.com/apoenalore/GameCreator/pull/14), branch `feat/apoena-modular-character-creator-integration`. O workflow `.github/workflows/pixel-art.yml` disparava tanto em `push` quanto em `pull_request` para o mesmo branch e ambos usavam o mesmo grupo com `cancel-in-progress: true`. Os runs [41564160778](https://github.com/apoenalore/GameCreator/actions/runs/41564160778) (push) e [41564165759](https://github.com/apoenalore/GameCreator/actions/runs/41564165759) (pull_request), no mesmo SHA `264c605b5118e357ec60100fa1ad583498ec2de3`, terminaram cancelados.
- **Correção do gatilho:** limitar `push` a `main`; branches em revisão seguem validadas pelo evento `pull_request`, evitando dois eventos concorrentes para o mesmo commit.
- **Erro funcional observado:** o run [41564711737](https://github.com/apoenalore/GameCreator/actions/runs/41564711737), SHA `03d0ad2d5de0aad47a92c88ad51d132aaae34e38`, passou build, smoke test, sintaxe e teste de modelo, mas falhou no teste funcional do navegador com timeout aguardando o estado do editor. O log preservou o host trace das operações de biblioteca; não apontou falha na persistência do IndexedDB (validada em etapa própria posteriormente).
- **Ajuste do teste:** o commit `03382b02e74e2b39da0924bd0ff72ddacdf27e5a` adicionou contagem explícita de operações em andamento e sinal `apoena:character-idle` ao hook do teste, que passa a esperar o término real das ações enfileiradas.
- **Validação:** run [41565001752](https://github.com/apoenalore/GameCreator/actions/runs/41565001752) terminou `completed/success` no SHA `03382b02e74e2b39da0924bd0ff72ddacdf27e5a`. Passaram build nativo, smoke test do navegador, sintaxe JS, teste de modelo/personagens, teste funcional no navegador, exportação pixel-perfect, tileset, IndexedDB, backup/restauração da biblioteca, catálogo/Godot, integração, manifesto do atualizador, hidrologia/erosão, runtime Godot 4 e preservação dos módulos. O teste de sintaxe Python foi pulado como opcional porque Python não estava instalado no runner.
- **Estado:** **RESOLVIDO E VALIDADO NO PR**; PR continua draft e não foi integrada à `main`.


### Atualização GC-CI-015 — timeout de bridge reproduzido no run #41663786861

- Ocorrência: 2026-11-03 12:33:11 BRT (15:33:11Z), PR #14, job 126013580379, step 11 “Testar Criador Modular no navegador”, commit `1775d77f447e9e245c7a71a35327d935ebaf6bc1`.
- Mensagem: `Timeout: Personagem gravado no projeto atual do Creator. Salve o projeto principal para guardar essa alteração.`
- O run anterior #41632223425 apresentou a mesma mensagem. Entre os heads não houve mudança de runtime/teste; foi adicionado somente o relatório de incidente. Portanto a falha é reproduzível e não foi resolvida pela validação anterior no SHA `03382b0...` para o novo head atual.
- Runner 2 `APOENA-GAMECREATOR-RUNNER` executou a suíte; build, smoke, sintaxe e modelo passaram. A integração funcional permanece sem validação.
- Artefato #13246855533, digest SHA-256 `07b2a2c6f9908978bccccee87ca96da0864098293036840e44b4ecca118f046f`.
- Causa-raiz permanece **NÃO CONFIRMADA**: o status da UI muda para sucesso, mas o harness não observa o payload. A próxima mudança registra origin/source/action e payload recebido sem remover assertions.
- Estado: **ABERTO / REPRODUZÍVEL / AGUARDANDO INSTRUMENTAÇÃO E VALIDAÇÃO**.


### Atualização GC-CI-015 — payload capturado após timeout (run #41702943279)

No run [#41702943279](https://github.com/apoenalore/GameCreator/actions/runs/41702943279), SHA `7cfcdf6f670bb6c86ff72aac9a5d0f9c72388bd5`, o step 11 ainda expirou. O log do catch mostrou `GLOBAL_RECEIVED=true`, `stored=true:keys=manifest,png` e `FRAME_RECEIVED=false`: o listener da janela host recebeu e armazenou o payload válido antes de o catch montar o erro, apesar de a espera de nove segundos ter expirado. Build, DOM, sintaxe e teste de modelo passaram. Causa **PROVÁVEL**: o limite/último polling da espera era curto para este fluxo. Correção aplicada no commit seguinte: limite de 30 segundos somente para a captura do bridge, com uma checagem final; assertions de manifesto/PNG intactas. Run 41702943279 falhou antes da correção; aguarda validação canônica da nova versão.


### Atualização GC-CI-015 — polling ainda falha, callback captura payload (run #41704904027)

O run [#41704904027](https://github.com/apoenalore/GameCreator/actions/runs/41704904027), SHA `8756adc6df548042cc26cf95b69a35e3a1fd9d48`, ainda expirou no step 11 mesmo com espera de 30 s. O catch mostra `GLOBAL_RECEIVED=true`, `FRAME_RECEIVED=false` e `stored=true:keys=manifest,png`. Assim, o payload chegou e foi salvo no host; o polling continua sem observar a variável. A alteração de 30 s não foi suficiente. Nova correção troca polling por Promise resolvida no callback que recebe `saveAsset`, preservando assertions de 12 frames e PNG. Aguardando novo Actions para confirmar.


### Atualização GC-CI-016 — timeout após captura de payload do bridge (run #41728611799)

- **Ocorrência:** 2026-11-03 19:22:10 BRT (22:22:10Z), PR #14, branch feat/apoena-modular-character-creator-integration, HEAD 37e7395013e6423c61fe4beb487265b97d0031b0, merge commit testado 1a3a07fca60e6a1f789dc7736c356362c4b54494, job 126240154897, step 11.
- **Mensagem literal:** “Timeout: Personagem gravado no projeto atual do Creator. Salve o projeto principal para guardar essa alteração.”
- **Evidência:** o HTML de diagnóstico e os logs mostram pedido saveAsset recebido pelo listener do host e payload armazenado com manifest,png. A espera do teste por status de sucesso expirou. O estado FRAME_RECEIVED=false é apenas uma variável de captura no documento de teste e não prova perda da resposta no iframe.
- **Causa-raiz:** não confirmada. O teste aguardava por polling de status; faltavam evidências do momento em que a fila do editor terminava. Não há evidência de que o runtime tenha perdido o recurso.
- **Correção escolhida:** substituir a espera temporal do status pela espera do hook whenIdle() da fila assíncrona do editor e manter a assertion de mensagem de sucesso e as assertions do manifesto/PNG. Nenhuma alteração de produção do bridge.
- **Relatório individual:** [run #41728611799](relatorios-actions/2026-11-03-run-41728611799-character-bridge-timeout.md).
- **Validação posterior:** run [#41840891930](https://github.com/LORECRONICASAPOENA/GameCreator/actions/runs/41840891930) passou no SHA `2ec3c55c1612fdb885e328bfa19f5ef64a49f010`; o step funcional do navegador, IndexedDB e backup/restauração passaram.
- **Estado:** RESOLVIDO E VALIDADO NO CI posterior; a falha original permanece no histórico.


### Atualização GC-CI-017 — run terminal com step 6 ainda em andamento (run #41731726616)

- **Ocorrência:** 2026-11-03, 19:32:46–19:50:16 BRT, PR #14, HEAD 71c142bc4371c1f7b1a4ca047b6c61fb1f5be0f1, job 126251213495.
- **Resultado:** run/job completed failure; step 5 compilação passou; step 6 smoke test DOM permaneceu in_progress no payload da API sem completed_at; steps 7–26 ficaram pending.
- **Coleta:** consulta dos logs do job retornou HTTP 404 BlobNotFound; listagem de artefatos vazia; check run indicou uma annotation, mas o conteúdo não pôde ser lido pelo conector. Horário para investigar nos logs locais do runner: 19:39:56–19:50:16 BRT.
- **Causa-raiz:** NÃO CONFIRMADA. Travamento do navegador headless e perda de comunicação do runner são hipóteses, não fatos.
- **Ação:** nenhuma alteração de código em resposta a este run. Não repetir cegamente o mesmo SHA. Coletar _diag e estado do processo do navegador antes de nova execução manual.
- **Validação posterior:** o run [#41840891930](https://github.com/LORECRONICASAPOENA/GameCreator/actions/runs/41840891930), no SHA `2ec3c55c1612fdb885e328bfa19f5ef64a49f010`, passou pelo smoke test DOM e concluiu o job em `success`.
- **Estado atual:** encerrado como bloqueio atual; a causa histórica específica continua NÃO CONFIRMADA.
- **Relatório:** [run #41731726616](relatorios-actions/2026-11-03-run-41731726616-step6-runner-diagnostics.md).


### GC-CI-018 — timeout de avanço de animação no Chrome headless (run #41743357325)

- **Repositório/PR:** `LORECRONICASAPOENA/GameCreator`, PR #14, branch `feat/apoena-modular-character-creator-integration`.
- **Data/hora da ocorrência:** 2026-11-03 21:00:37 BRT (log UTC: 2026-11-04T00:00:37Z).
- **Cadastro:** 2026-11-04; hora exata do cadastro não preservada.
- **Run/job/step:** [#41743357325](https://github.com/LORECRONICASAPOENA/GameCreator/actions/runs/41743357325), job `validar` 126290129740, step 11 “Testar Criador Modular no navegador”.
- **Commit SHA:** `2c656cfea31f8782299e2e0372d196ddaf3bf31b`.
- **Mensagem literal:** `Timeout: Personagem gravado no projeto atual do Creator. Salve o projeto principal para guardar essa alteração.`
- **Classificação:** falha do teste CONFIRMADA; hipótese de documento oculto no headless PROVÁVEL, não comprovada.
- **Causa raiz comprovada:** o teste expirou aguardando mudança em `frameInfo` após iniciar a animação. A hipótese de falha do bridge foi descartada para esta ocorrência: o host já havia recebido e armazenado `manifest` e `png`.
- **Correção aplicada:** hook `advanceFrame()` somente em modo `?test=1`, com avanço controlado do quadro; teste define o iframe como visível e não depende do agendamento RAF do Chrome headless. O loop de produção não foi alterado.
- **Arquivos alterados:** `pixel-art/personagens.js` e `tests/personagens-browser.html`.
- **Teste específico:** transição do contador de quadros no harness do Criador Modular.
- **Validação canônica:** run [#41840891930](https://github.com/LORECRONICASAPOENA/GameCreator/actions/runs/41840891930), SHA `2ec3c55c1612fdb885e328bfa19f5ef64a49f010`, job completo `success`; step funcional do navegador passou.
- **Prevenção:** não depender de RAF real para asserções temporais determinísticas no headless; preservar a distinção entre teste do avanço de estado e teste do agendador real.
- **Limitação residual:** esse hook não comprova o agendamento RAF em navegador visível ou dispositivo real.
- **Estado:** RESOLVIDO COMO FALHA DO CI / LIMITAÇÃO DE COBERTURA DOCUMENTADA.
- **Relatório individual:** [INCIDENT-2026-11-03-character-animation-timeout.md](ci/INCIDENT-2026-11-03-character-animation-timeout.md).


### GC-CI-019 — gatilho de CI da PR #14 e reconciliação de deltas da PR #13

- **Ocorrência:** 2026-11-04; hora exata da identificação não preservada.
- **Repositório/PR:** `LORECRONICASAPOENA/GameCreator`, PR #14 (base branch PR #11).
- **Branch-base:** `feat/apoena-personagem-estudio-main`; o filtro `pull_request.branches` aceitava apenas `main`, embora a PR #14 tivesse essa branch como base.
- **Correção do gatilho:** commit `a60ef6ea0549f3d30c9fd62ba1a7f716fd454142` incluiu a branch-base no filtro de pull request. A validação da PR #11 passou no run [#41902283423](https://github.com/LORECRONICASAPOENA/GameCreator/actions/runs/41902283423).
- **Reconciliação:** na PR #14, foram portados os checks de build PowerShell/Python para os arquivos do Criador Modular, o fixture `integracao/godot/character-test.tres`, o teste Godot `SpriteFrames` e o redirect de compatibilidade `character-creator/index.html`.
- **Arquivos alterados:** `integracao/build_unificado.ps1`, `integracao/build_unificado.py`, `integracao/godot/character-test.tres`, `integracao/godot/tests/test_catalogo.gd`, `character-creator/index.html`.
- **Validação:** run [#41902995635](https://github.com/LORECRONICASAPOENA/GameCreator/actions/runs/41902995635), commit `0e1c170a8eb4f4b4c7cd32196a8f57cb199f96df`, job 126830089627, concluído em `success`; todos os testes obrigatórios passaram, incluindo Godot 4. As etapas opcionais de empacotamento/entrega/anexação de logs foram `skipped`.
- **Aviso não bloqueante:** actions `checkout@v4` e `setup-node@v4` registraram aviso de depreciação do Node.js 20 e execução forçada em Node.js 24.
- **Estado:** gatilho e validação automatizada RESOLVIDOS. PR #14 continua draft; CodeRabbit e segurança do bridge permanecem pendentes; PR #13 permanece aberta até reconciliação completa.
- **Relatório:** [run #41902995635](relatorios-actions/2026-11-04-run-41902995635-pr13-delta-reconciliation.md).


### GC-CI-020 — hardening seguro da ponte V4.0/V4.1 (run #41906361151)

- **Ocorrência:** 2026-11-04 17:25:36–17:27:21 BRT (logs UTC 20:25:36.816–20:27:21.345Z).
- **Repositório/PR:** `LORECRONICASAPOENA/GameCreator`, PR #14, branch `feat/apoena-modular-character-creator-integration`.
- **Commit validado:** `d5bea2b3c7905f00bcff2645e1b2e8b3f49a8df6`; job 126842370143.
- **Falha intermediária:** run #41905233755 falhou no teste de navegador com `BRIDGETRACE` vazio; os fluxos de biblioteca passaram. A evidência apontou ausência do handshake `ready`; não foi classificada como perda de payload.
- **Correção:** nonce criptográfico de 256 bits, allowlist de `WindowProxy`, validação de origem exata quando disponível, handshake mínimo e payloads/respostas por `MessageChannel`. Para `file://`, source+nonce são obrigatórios; nonce também é passado no fragmento e removido após leitura.
- **Wildcard residual:** `postMessage("*")` é usado somente na transferência inicial do `MessagePort` quando a origem é opaca. O payload não trafega no canal global.
- **Arquivos principais:** `shared/creator-bridge.js`, `pixel-art/modulo-integrado.js`, `tests/personagens-browser.html`, `tests/creator-bridge.test.cjs`, `README.md`.
- **Validação:** run [#41906361151](https://github.com/LORECRONICASAPOENA/GameCreator/actions/runs/41906361151) concluiu `success`; browser, protocolo, testes negativos de autorização, contratos, Godot 4 e preservação do Creator passaram.
- **Avisos não bloqueantes:** depreciação Node.js 20 em actions v4 e `punycode`.
- **Estado:** hardening automatizado RESOLVIDO E VALIDADO. Revisão CodeRabbit e teste manual offline `file://` ainda pendentes; PR #14 continua draft, sem merge.
- **Relatório:** [run #41906361151](relatorios-actions/2026-11-04-run-41906361151-bridge-hardening.md).

### GC-CI-021 — PR #19: teste de exportação pixel-perfect ausente na árvore sincronizada (06/11/2026)

- **Ocorrência:** [run 42276102355](https://github.com/LORECRONICASAPOENA/GameCreator/actions/runs/42276102355), job `validar` ID `128092695456`, step 11, branch `sync/main-into-gc-anim-006-20261106-v2`, SHA `301eadd3aadb3d59aafaf9dae9fa92197e6ca191`.
- **Erro literal recuperado:** `node:internal/modules/cjs/loader:1210`; PowerShell registrou `NativeCommandError`, exit code 1. A mensagem completa da exceção Node não foi preservada.
- **Causa comprovada:** o workflow executava `node tests/pixel-art-export.test.cjs`, mas o arquivo não existia no tree do SHA 301eadd (consulta de conteúdo retornou 404). O teste existia na branch da PR #11.
- **Correção:** a reconciliação da PR #19 incorporou o teste, o Estúdio e os assets da PR #11, mantendo a etapa e as assertions.
- **Validação:** [run 42281994131](https://github.com/LORECRONICASAPOENA/GameCreator/actions/runs/42281994131), job `validar`, success no SHA `e16fe832adde4ab7606594b45a8395a4df6d2438`; step 11 e todos os steps funcionais seguintes passaram.
- **Prevenção:** conferir no mesmo tree/commit a existência de cada teste, script e asset referenciado pelo workflow antes de iniciar a sincronização. Não remover cobertura para obter CI verde.
- **Relatório:** `docs/relatorios-actions/2026-11-06-run-42276102355-pixel-art-export-test-ausente.md`.
- **Follow-up:** a PR #19 foi mesclada na branch-base #11 em 2026-11-06T19:56:11Z (merge commit `8acf515c6be8f097b05b4231608894f06740ab17`); a CI da PR #11 [run 42283992136](https://github.com/LORECRONICASAPOENA/GameCreator/actions/runs/42283992136) terminou success no mesmo SHA.

### GC-CI-022 — literal RegExp duplamente escapado no teste de concorrência (07/11/2026)

- **Ocorrência:** [run 42378776734](https://github.com/LORECRONICASAPOENA/GameCreator/actions/runs/42378776734), tentativa 1; job `validar` ID `128421776860`, step 11, branch `feat/apoena-modular-character-creator-integration`, SHA `74614a6c97e86f6e0be7519ddb30b7e4138cc8df`.
- **Erro literal:** `SyntaxError: Invalid regular expression: /if\\s*\\(presetRequestGuard\\.isCurrent\\(requestId\\)\\)\\s*msg\\(/: Unterminated group`; stack trace aponta `tests/preset-request-guard.test.cjs:26`.
- **Causa comprovada:** quatro assertions foram compostas em uma template string com duas barras invertidas no código-fonte do literal RegExp. O parser recebeu `\\s`/`\\(` e rejeitou a expressão antes de executar a suíte. Não é falha do runner nem do código de produção.
- **Impacto:** steps 1–10 passaram; step 11 falhou antes das assertions; steps 12–26 foram skipped; step 27 anexou o artefato de diagnóstico com sucesso. O teste de concorrência e os testes posteriores não foram validados nessa tentativa.
- **Correção escolhida:** corrigir somente o escape das assertions em `tests/preset-request-guard.test.cjs`, preservando toda a cobertura. Não remover assertions nem alterar o Estúdio.
- **Correção:** commit `3285d888cb5c203b8a6ff94e4694818e1e085a5c` corrigiu os quatro literais RegExp sem remover assertions.
- **Validação:** [run #42379244625](https://github.com/LORECRONICASAPOENA/GameCreator/actions/runs/42379244625) concluiu `completed/success` no SHA exato; steps funcionais 1–24 passaram e steps 25–27 foram skipped pelas condições do evento PR. **Incidente resolvido e validado.**
- **Prevenção:** ao gerar código JavaScript em template strings, conferir o texto final gravado e validar sintaxe/teste focado antes do commit quando disponível.
- **Relatório:** [2026-11-07-run-42378776734-regex-duplamente-escapada.md](relatorios-actions/2026-11-07-run-42378776734-regex-duplamente-escapada.md).
