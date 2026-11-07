# Relatório de incidente — GitHub Actions run 41433942503

## 1. Identificação
- Repositório: `apoenalore/GameCreator`.
- PR: [#11 — GC-ANIM-006: abrir e editar animações de Apoena no Estúdio](https://github.com/apoenalore/GameCreator/pull/11).
- Workflow: `.github/workflows/pixel-art.yml`.
- Run: [41433942503](https://github.com/apoenalore/GameCreator/actions/runs/41433942503).
- Evento: `pull_request`.
- Branch: `feat/apoena-personagem-estudio-main`.
- Commit SHA: `70a4e09e7243d56f0f0313a7791a849218514055`.
- Tentativa: 1.
- Criado/iniciado: 2026-11-02T11:05:16Z.
- Concluído/atualizado: 2026-11-02T11:17:48Z.
- Estado final: `completed / failure`.
- Job retornado pela API: `validar`, `completed / failure`.

## 2. Erro observado e evidência
- A API do GitHub confirma que o workflow e o job `validar` terminaram em `failure`.
- A consulta de jobs não retornou etapas individuais (`steps` ausentes/vazias).
- A consulta de reviews e comentários da PR #11 não retornou revisão formal ou comentários de CodeRabbit até o momento desta investigação.
- **Anotação literal exibida no GitHub Actions (captura enviada pelo autor em 02/11/2026):** `0 executor auto-hospedado perdeu a comunicação com o servidor. Verifique se a máquina está em execução e possui uma conexão de rede estável. Qualquer fator no seu fluxo de trabalho que encerre o processo do executor, consuma toda a CPU/memória necessária ou bloqueie seu acesso à rede pode causar esse erro.`
- A anotação confirma perda de comunicação do runner auto-hospedado com o servidor GitHub durante a execução. Não identifica, por si só, se a origem foi queda de rede, máquina desligada/suspensa, processo do runner encerrado, saturação de CPU/memória, firewall/proxy ou outro bloqueio.
- URL oficial para inspeção manual: https://github.com/apoenalore/GameCreator/actions/runs/41433942503

## 3. Classificação da causa
**CATEGORIA CONFIRMADA: perda de comunicação do runner auto-hospedado com o servidor GitHub. CAUSA TÉCNICA ESPECÍFICA NÃO CONFIRMADA.**

A anotação aponta explicitamente desconexão do executor. Isso torna a infraestrutura de execução a primeira linha de investigação e não há evidência de que os testes de código tenham sido executados até o fim. Ainda não sabemos se a desconexão foi causada por rede, suspensão/desligamento da máquina, encerramento do processo do runner, consumo de CPU/memória, firewall/proxy ou outro fator. Não classificar como bug do código do Estúdio.

## 4. Impacto
- GC-ANIM-006 permanece sem validação canônica aprovada no HEAD atual.
- A falha não demonstra que os presets de animação estejam incorretos; também não demonstra que estejam corretos.
- A PR #11 permanece draft e não integrada à `main`.
- Não foram realizadas alterações de código como tentativa de mascarar ou contornar a falha.

## 5. Soluções consideradas
1. **Repetir imediatamente o workflow no mesmo SHA:** rejeitada, pois não existe evidência de falha transitória e isso seria repetição cega.
2. **Modificar código do Estúdio:** rejeitada, pois a anotação aponta perda de comunicação do runner e não apresenta erro de produto.
3. **Modificar workflow/runner/rede imediatamente:** adiada até verificar logs locais e estado da máquina; alterar configurações sem saber se o processo foi encerrado, suspenso ou bloqueado pode mascarar o problema.
4. **Remover testes/etapas para obter CI verde:** proibida pelo protocolo do repositório.
5. **Obter logs locais do runner e verificar disponibilidade/rede/recursos do Windows, depois aplicar correção mínima:** escolhida.


## 6. Solução aplicada
Nenhuma correção de produto ou infraestrutura foi aplicada. Foi criado este relatório de incidente para preservar o estado e impedir repetição sem diagnóstico.

## 7. Próxima coleta necessária
1. Abrir a URL do run no GitHub Actions com a conta autorizada.
2. Verificar se o job `validar` permite expandir a etapa que falhou e copiar a primeira mensagem causal.
3. Se a interface também não disponibilizar logs, registrar a indisponibilidade e solicitar ao operador do runner Windows os logs locais correspondentes ao intervalo de execução.
4. Só após obter evidência, classificar a causa e decidir a correção.
5. Depois da correção, executar testes focados e aguardar a validação canônica automática no SHA corrigido.

## 8. Estado
- Incidente: **ABERTO / CATEGORIA DE FALHA IDENTIFICADA (runner perdeu comunicação); causa operacional específica pendente**.
- GC-ANIM-006: **EM VALIDAÇÃO / BLOQUEADA PELA DISPONIBILIDADE DO RUNNER**.
- CodeRabbit: **AGUARDANDO REVISÃO**; não há review formal localizada nesta consulta.
- Integração na `main`: **NÃO INTEGRADO**.
- Commit de criação do relatório: `a93289b308ef92bada6ff2fbea1508bcc6a815f1`; última atualização do conteúdo: `5d034606de3fea6ec54663a30dee29fb2e771ff9` (evidência de runner reconectado, 02/11/2026).


## 9. Pesquisa externa — documentação oficial e relatos da comunidade (02/11/2026)

A pesquisa foi feita após o autor solicitar que a investigação também consultasse Google/GitHub Community e experiências de desenvolvedores independentes. Os relatos abaixo são referências para formular hipóteses e testes; não provam que a causa deste incidente seja idêntica.

### Documentação oficial
- GitHub Docs — [Monitoring and troubleshooting self-hosted runners](https://docs.github.com/en/actions/how-tos/manage-runners/self-hosted-runners/monitor-and-troubleshoot): runner pode ficar offline quando a máquina está desligada, o aplicativo do runner não está ativo ou não consegue comunicar-se com GitHub. A documentação descreve a verificação de conectividade usando o script de configuração com `--check`, URL do repositório e PAT com permissões adequadas. O PAT deve ser fornecido apenas localmente, nunca compartilhado em conversa ou commit.

### Relatos do projeto oficial actions/runner e comunidade
- [actions/runner #2624](https://github.com/actions/runner/issues/2624): relato da mesma mensagem de perda de comunicação em self-hosted runner; útil como referência histórica, não prova a causa deste caso.
- [actions/runner #4703](https://github.com/actions/runner/issues/4703): relato recente em que `Runner.Listener` continua ativo, mas deixa de avançar/comunicar-se; jobs aparecem sem steps e são posteriormente marcados como lost communication. Ambiente descrito no issue é Linux, portanto serve como hipótese de listener/broker, não como reprodução do nosso Windows.
- [actions/runner #4444](https://github.com/actions/runner/issues/4444): relato Windows do listener parar de buscar novos jobs após uma transição de estado; reiniciar o serviço recuperava temporariamente. Não é evidência de que nosso incidente tenha essa mesma causa.
- [GitHub Community #173431](https://github.com/orgs/community/discussions/173431): relato da mensagem em job Windows com alto consumo de CPU/RAM.
- [Microsoft Q&A — self-hosted runner Windows](https://learn.microsoft.com/en-us/answers/questions/5996434/github-actions-self-hosted-runner-on-azure-windows): relato de runner Windows que volta a aceitar jobs após reinício do serviço; hipótese de listener/conexão degradada.

### Hipóteses priorizadas para o nosso runner Windows
1. Serviço/processo do runner foi encerrado, travou ou perdeu o canal de comunicação.
2. Máquina Windows entrou em suspensão, reiniciou ou perdeu conectividade durante o job.
3. Rede, DNS, proxy ou firewall interrompeu a conexão de saída com os serviços do GitHub Actions.
4. CPU, memória ou disco foram esgotados e impediram o listener de responder.
5. Possível comportamento específico da versão do runner/listener; só considerar após identificar versão e comparar logs com issues relevantes.

### Plano de coleta recomendado
- Confirmar no GitHub Settings > Actions > Runners se o runner está Online/Idle/Offline e registrar a hora da observação.
- No Windows, consultar logs locais do runner em `_diag` para o intervalo do run; preservar os arquivos antes de reiniciar o serviço.
- Consultar Visualizador de Eventos do Windows (Sistema e Aplicativo) para eventos de desligamento, suspensão, reinício, falha de serviço e rede no mesmo intervalo.
- Registrar versão do runner, nome/estado do serviço, uso de CPU/RAM/disco e estabilidade da rede.
- Executar o diagnóstico oficial `config.cmd --check` no computador, com URL do repositório e PAT apropriado inserido localmente. Não colocar PAT em logs públicos, issues, commits ou mensagens.
- Somente após preservar evidências, se o serviço estiver travado/offline, reiniciá-lo e registrar o resultado. Reexecutar a validação canônica depois da recuperação.

### Decisão técnica
Não alterar código de animação nem remover etapas de teste para corrigir uma falha cuja evidência atual aponta perda de comunicação do executor. A pesquisa externa amplia as hipóteses e define coleta direcionada; a causa operacional específica permanece **PENDENTE** até a análise dos logs do computador que hospeda o runner.


## 10. Nova evidência: conflito de sessão duplicada — pesquisa comunitária

Em 02/11/2026, o autor enviou duas fotografias do console do runner Windows. O texto visível é:

- `Connected to GitHub`
- `A session for this runner already exists.`
- `Runner connect error: Error: Conflict. Retrying until reconnected.`
- A sequência se repete após novas mensagens `Connected to GitHub`.

### Comparação com relatos públicos
1. **Correspondência muito forte:** [actions/runner #4312](https://github.com/actions/runner/issues/4312), relato de 2026 com a mesma sequência de logs (`The session for this runner already exists`, `Runner connect error: Error: Conflict`, retries e posterior reconexão). O caso mostra que a mensagem pode persistir e depois reconectar; não determina a causa do nosso host.
2. **Hipótese de inicialização duplicada:** [actions/runner #3441](https://github.com/actions/runner/issues/3441). Um mantenedor observou duas solicitações de criação de sessão com intervalo de 11 segundos e perguntou se a automação estava chamando `run.sh` múltiplas vezes. Outro participante levantou encerramento por OOM como causa possível de uma sessão anterior não ser encerrada corretamente. O issue também registra relatos em Windows.
3. **Reinicialização não graciosa:** [actions/runner #3677](https://github.com/actions/runner/issues/3677), relato de sessão conflitante após reboot Windows; o autor suspeita de encerramento abrupto do runner.
4. **Configuração de serviço:** [GitHub Docs — configurar runner como serviço no Windows](https://docs.github.com/en/actions/how-tos/manage-runners/self-hosted-runners/configure-the-application?platform=windows). A documentação orienta parar a aplicação antes de instalar/configurar o serviço e gerenciar o serviço pelo Windows Services/PowerShell.

### Diagnóstico atualizado
- **Erro imediato confirmado:** o GitHub rejeita a criação de uma nova sessão porque já existe uma sessão ativa associada à identidade deste runner (`Conflict`).
- **Hipótese prioritária A:** dois processos/listeners ou dois mecanismos de inicialização (serviço Windows + `run.cmd` manual/Inicialização/Agendador) usam a mesma configuração/identidade.
- **Hipótese prioritária B:** processo anterior caiu, foi encerrado à força ou o Windows reiniciou sem encerramento gracioso; a sessão anterior ainda é considerada ativa.
- **Hipótese adicional:** pressão de memória/recursos causou encerramento ou reinício inesperado. Só considerar comprovada após logs/Event Viewer.
- **Não comprovado:** que o runner foi definitivamente iniciado duas vezes neste computador. As fotografias provam conflito de sessão, não a origem.

### Procedimento seguro quando o computador estiver disponível
1. Não iniciar outro `run.cmd` enquanto o console atual estiver em loop de conflito.
2. Verificar `services.msc` e localizar o serviço `GitHub Actions Runner (...)`; registrar se existe e seu estado.
3. No PowerShell, consultar processos relacionados a `Runner.Listener`, `Runner.Worker` e `run.cmd`, sem encerrá-los inicialmente. Correlacionar PID, caminho e serviço para identificar se serviço e terminal iniciaram a mesma pasta/configuração.
4. Verificar Agendador de Tarefas, pasta Inicializar e scripts de inicialização para chamadas duplicadas.
5. Preservar logs `_diag` e eventos do Windows antes de qualquer parada/reinício.
6. Se serviço e console estiverem executando a mesma identidade, escolher um único modo de operação e parar o mecanismo duplicado de forma controlada. Não remover/reconfigurar o runner no GitHub nem apagar `.runner`/credenciais como primeiro passo.
7. Se só houver um processo, investigar sessão anterior não encerrada, reinício abrupto, falha do listener e OOM; então seguir procedimento de recuperação documentado.
8. Confirmar que o runner aparece uma única vez e como `Idle` no GitHub antes de reexecutar o workflow.

### Decisão
Não modificar o código do GameCreator nem o workflow de testes para contornar o conflito. A prioridade é diagnosticar e normalizar a identidade/sessão do runner Windows. O diagnóstico está mais específico, mas a causa operacional final ainda depende de inspeção local.


## 11. Recuperação observada — runner voltou a escutar trabalhos

Em 02/11/2026, o autor enviou nova captura do console `run.cmd - game creator`. Após mensagens repetidas de conflito (`A session for this runner already exists` / `Error: Conflict`), o console mostra:

- `2026-11-02 13:12:43Z: Runner reconnected.`
- `Current runner version: '2.338.0'`
- `2026-11-02 13:12:43Z: Listening for Jobs`

**Conclusão:** o processo visível recuperou a conexão com GitHub e voltou ao estado de escuta de trabalhos. A versão observada é 2.338.0. Isso confirma recuperação operacional naquele instante, mas não comprova que a causa do conflito foi removida nem que não existam outras instâncias. A fotografia também mostra uma segunda janela de terminal ao fundo, mas não permite identificar seu processo ou afirmar que seja outro runner.

### Próximo passo seguro
1. Não iniciar outro `run.cmd` nem iniciar o serviço em paralelo.
2. Conferir em Settings → Actions → Runners se a identidade aparece Online/Idle.
3. Verificar processos e serviço Windows para confirmar que só existe uma instância usando essa configuração. Preservar logs `_diag` antes de reiniciar/parar.
4. Se estiver Online/Idle e houver somente uma instância, então reexecutar uma única vez o workflow da PR #11 para validar a recuperação. Observar se o job inicia e conclui; se houver novo conflito, interromper novas tentativas e coletar logs.
5. Não alterar o código do GameCreator por causa do conflito de sessão.

**Estado atualizado:** runner recuperado e escutando trabalhos na captura; estabilidade e causa-raiz ainda pendentes; PR #11 ainda sem validação aprovada no CI.

## 12. Controles de segurança para diagnóstico com PAT — 07/11/2026

Esta atualização fecha uma lacuna documental identificada na revisão: a orientação anterior dizia para fornecer o PAT apenas localmente, mas não detalhava como reduzir sua exposição. Ela não altera o diagnóstico histórico nem afirma que um PAT foi usado nesta sessão. Nenhum valor de token é armazenado neste relatório.

Para uma eventual execução futura de config.cmd --check:

- Criar um PAT dedicado e de curta duração, com acesso somente ao repositório necessário e o menor conjunto de permissões exigido pela documentação oficial vigente. Preferir token fine-grained quando compatível.
- Executar o diagnóstico apenas em sessão local confiável do Windows. Não inserir o PAT em scripts, arquivos .ps1/.cmd, variáveis persistentes, tickets, commits, conversas ou transcrições.
- Como o argumento de linha de comando pode ficar visível a processos locais e ao histórico do shell, desativar temporariamente a gravação do histórico do PSReadLine e não iniciar transcript/log de terminal durante a passagem do segredo. Se a ferramenta exigir o PAT em argumento, manter a sessão privada e encerrar os processos de diagnóstico assim que terminar.
- Verificar os logs gerados antes de compartilhá-los; remover qualquer ocorrência do token sem apagar evidências não sensíveis do incidente.
- Revogar o PAT imediatamente após o diagnóstico e confirmar que não permanece em scripts, histórico, arquivos temporários ou logs.

**Estado desta correção documental:** controles de menor privilégio, curta duração, proteção de histórico/logs e revogação foram documentados. Nenhum token foi criado, solicitado, exibido ou utilizado nesta atualização.
