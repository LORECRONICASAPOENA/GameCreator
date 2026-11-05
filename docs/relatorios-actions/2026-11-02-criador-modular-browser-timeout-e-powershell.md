# Relatório de falhas GitHub Actions — Criador Modular / navegador

- **Data do registro:** 2026-11-02
- **Repositório:** [apoenalore/GameCreator](https://github.com/apoenalore/GameCreator)
- **Status:** diagnóstico registrado; correções ainda não aplicadas nem validadas.
- **Escopo:** logs recentes do workflow Pixel Art / Criador Modular.

## Resumo executivo

Há duas falhas prioritárias relacionadas ao teste funcional de navegador:

1. **Falha de parsing do PowerShell no workflow mais recente.** O script que valida rotas HTTP obrigatórias não está sendo interpretado corretamente; mensagens no log indicam tokens inesperados como `$(` e `Rota`, string sem terminador e bloco de fechamento ausente. Isso impede a execução do teste de navegador.
2. **Falha funcional recorrente no teste de navegador.** Em execuções anteriores, o teste termina por timeout esperando fila de operações ou a condição “Prévia pronta. Revise antes de aplicar.”. O teste de modelo passa, mas a validação da interação no browser não conclui.

Os logs também mostram timeouts intermitentes de upload de artefatos e aviso de depreciação Node; estes são itens secundários e não estão demonstrados como causa da falha funcional.

## Evidências de execuções

- [Run 41552817410](https://github.com/apoenalore/GameCreator/actions/runs/41552817410) — falha recente na etapa de teste do Criador Modular; log inclui erros de parsing PowerShell no bloco de rotas obrigatórias.
- [Run 41551677625](https://github.com/apoenalore/GameCreator/actions/runs/41551677625) — teste de navegador falha com timeout aguardando fila de operações / prévia.
- [Run 41547503382](https://github.com/apoenalore/GameCreator/actions/runs/41547503382) — teste funcional falha aguardando “Prévia pronta”.
- [Run 41547074475](https://github.com/apoenalore/GameCreator/actions/runs/41547074475) — falha do teste funcional do navegador.
- [Run 41546080697](https://github.com/apoenalore/GameCreator/actions/runs/41546080697) — falha do teste funcional do navegador.
- [Run 41534893117](https://github.com/apoenalore/GameCreator/actions/runs/41534893117) — falha do teste funcional do navegador.

Execuções canceladas durante commits sucessivos não foram classificadas como falha funcional, pois cancelamento por substituição de execução pode ser comportamento normal do Actions.

## Diagnóstico e correções possíveis

### GC-CI-CHAR-001 — PowerShell malformado na etapa de navegador

**Prioridade:** crítica  
**Confiança:** alta quanto ao erro do script; causa exata de quoting/interpolação ainda precisa ser verificada no YAML e no conteúdo executado.

**Sintomas observados:** parser reclama de tokens inesperados, string sem terminador e fechamento ausente no trecho que trata as rotas obrigatórias.

**Correção proposta:**
- Inspecionar o bloco de PowerShell embutido no workflow e a forma como o YAML o transmite ao runner.
- Evitar combinações frágeis de aspas e subexpressões `$()` dentro de strings interpoladas.
- Capturar a mensagem da exceção em variável separada antes de compor a mensagem final; alternativamente usar string formatada com parâmetros explícitos.
- Validar sintaxe do script isoladamente com o parser PowerShell antes de iniciar o navegador.
- Após a correção, confirmar no log que o teste funcional realmente inicia; não considerar apenas a etapa de parsing como sucesso total.

**Aceite:** etapa executa o script sem erros de parsing e chega ao lançamento/validação do navegador.

### GC-CI-CHAR-002 — timeout na fila de operações / estado de prévia

**Prioridade:** crítica  
**Confiança:** alta quanto ao timeout recorrente; raiz no produto versus sincronização do teste ainda não confirmada.

**Sintomas:** “Timeout aguardando fila de operações”, “Timeout: Prévia pronta. Revise antes de aplicar” ou estado de execução “RUNNING”.

**Correção proposta:**
- Inspecionar os artefatos `.ci-results/characters-browser.html` e logs do browser gerados pelas execuções que falharam.
- Registrar transições de estado e erros JS da operação que gera/aplica a prévia.
- Verificar se a fila assíncrona sempre resolve/rejeita e se a UI sinaliza estado final tanto no sucesso quanto no erro.
- Verificar se o teste espera o evento/estado correto, sem depender de texto transitório ou temporização arbitrária.
- Corrigir a condição de espera ou o fluxo de operação conforme evidência. **Não aumentar timeout como única correção** sem determinar por que o estado esperado não chega.
- Reexecutar em navegador real/headless no runner do CI.

**Aceite:** teste executa uma ação real, espera a conclusão observável, verifica o resultado e termina sem timeout; erros de operação devem ser apresentados como falha explícita, não como espera infinita.

### GC-CI-CHAR-003 — integração funcional não comprovada pelo teste de modelo

**Prioridade:** alta  
**Confiança:** média; é uma lacuna de cobertura, não prova de defeito isolado.

O log de modelo indica validações de grid, frames, persistência, validação, manifest e recurso Godot concluídas. Isso não demonstra por si só que a interface do navegador gera a prévia e aplica a alteração corretamente.

**Correção proposta:**
- Manter testes de modelo separados dos testes de browser.
- Adicionar/verificar uma asserção ponta a ponta: carregar/criar personagem → prévia → aplicar → conferir estado/artefato final.
- Validar persistência/recarregamento se esse for o comportamento esperado pelo produto.

**Aceite:** evidência de resultado final após interação do browser, além do teste estrutural do modelo.

### GC-CI-CHAR-004 — falha intermitente de upload de artefatos

**Prioridade:** média  
**Confiança:** média.

Logs apresentam retries/timeout em `ArtifactService/CreateArtifact` e `FinalizeArtifact`. Não há evidência de que isso cause o timeout funcional anterior.

**Correção proposta:** preservar retry; conferir se os artefatos de diagnóstico são publicados ao final de falhas; reduzir ou organizar arquivos excessivamente grandes apenas se houver evidência de impacto.

### GC-CI-CHAR-005 — avisos de depreciação Node/actions

**Prioridade:** baixa  
**Confiança:** alta de que são avisos secundários.

Aviso de depreciação envolvendo `url.parse()` e actions do workflow. Não é a causa demonstrada dos erros de parsing PowerShell nem do timeout da prévia.

**Correção proposta:** revisar versões suportadas das actions e dependências em tarefa de manutenção separada, com validação de compatibilidade.

## Plano de execução recomendado

1. Corrigir e validar sintaxe do script PowerShell no workflow.
2. Reexecutar o job e obter HTML/log de browser de forma confiável.
3. Localizar o evento/estado assíncrono que não conclui; corrigir produto ou teste com evidência.
4. Validar o fluxo ponta a ponta do Criador Modular.
5. Tratar upload de artefatos e avisos de depreciação separadamente.

## Limitações

Este registro é uma análise de logs e evidências das execuções citadas. Nenhuma alteração de código foi aplicada neste registro, e nenhuma correção foi declarada validada. A raiz do timeout de prévia continua em investigação até que o HTML/log completo do browser e o código do fluxo sejam correlacionados.
