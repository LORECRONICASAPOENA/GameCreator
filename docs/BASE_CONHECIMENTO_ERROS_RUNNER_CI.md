# Base de conhecimento — erros de CI, runners e validação

**Projeto:** Game Creator  
**Repositório:** apoenalore/GameCreator  
**Branch de referência:** main  
**Atualização:** 30/10/2026  
**Objetivo:** permitir que agentes de IA reconheçam falhas recorrentes, investiguem a causa real e apliquem correções pequenas sem repetir tentativas cegas.

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

### GC-RUN-001 — Jobs permanecem em QUEUED e nenhum runner é atribuído

**Classificação:** CONFIRMADO para as execuções consultadas; causa específica do não atendimento ainda NÃO DIAGNOSTICADA.

**Sinais observados:**
- Jobs permanecem em estado queued.
- Amostras retornaram runner_id = 0 e runner_name vazio.
- O workflow solicita as labels self-hosted, Windows e X64.
- O registro central de 29/10/2026 21:37 BRT documentou 324 execuções consultadas, 13 queued e 0 in_progress. Um relatório posterior, em 30/10, observou 17 em fila. Esses números pertencem a horários diferentes; não devem ser tratados como contagem atual.

**O que isso significa:** o job ainda não foi atribuído a um runner compatível. O código do job ainda não começou a executar; portanto, não classifique isso como bug do aplicativo.

**Causas possíveis — ainda precisam ser verificadas:**
1. Runner desligado, offline ou serviço do Windows parado.
2. Runner registrado em outro repositório ou grupo sem acesso a este repositório.
3. Uma ou mais labels exigidas pelo workflow não existem no runner online.
4. Serviço iniciado com outra conta Windows ou configuração antiga.
5. Runner está ouvindo em uma pasta/configuração diferente daquela registrada no GitHub.

**Procedimento de diagnóstico:**
1. Abrir Settings → Actions → Runners do repositório GameCreator.
2. Confirmar que o runner está Online e disponível para o repositório correto.
3. Conferir todas as labels efetivas: self-hosted, Windows e X64.
4. Conferir o grupo de runners e se o repositório está autorizado a usá-lo.
5. No PC, conferir o serviço do runner e os logs locais da pasta _diag (Runner_*.log e Worker_*.log).
6. Comparar o nome do runner e o diretório de instalação com o caminho realmente iniciado.
7. Só depois de corrigir a causa, permitir uma única validação canônica.

**Solução conforme a causa:**
- Runner offline: iniciar ou reparar o serviço já registrado.
- Label ausente: corrigir a configuração do runner ou o runs-on, sem retirar requisitos de segurança por conveniência.
- Registro no repositório errado: registrar o runner no repositório correto, seguindo o procedimento oficial.
- Serviço duplicado ou pasta errada: manter uma instalação identificável por diretório, nome e serviço; não iniciar várias cópias da mesma instalação.

**Não fazer:** disparar mais workflows, criar runners duplicados, apagar a pasta _work sem diagnóstico ou trocar para ubuntu-latest apenas para fazer a fila andar.

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

## 4. Configuração de CI conhecida — usar como referência, não como verdade permanente

O workflow canônico atualmente consultado em .github/workflows/pixel-art.yml:
- Usa runs-on: [self-hosted, Windows, X64].
- Usa shell PowerShell.
- Prepara Node.js 20.
- Executa build e verificações do Creator.
- Possui smoke test de navegador com --disable-javascript. Esse teste verifica DOM/marcadores estáticos; não comprova inicialização JavaScript nem interação real.
- É acionado por push na branch feature/estudio-unificado-pixelart-v41, pull requests para main com filtros de caminho e workflow_dispatch.
- Não deve ser duplicado por um segundo workflow com os mesmos testes.
- O workflow publicar-creator-unificado.yml tem finalidade distinta de build/publicação e não deve ser removido sem comparar seus artefatos.

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