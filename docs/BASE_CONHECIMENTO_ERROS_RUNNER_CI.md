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
