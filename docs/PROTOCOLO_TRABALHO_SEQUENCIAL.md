# Protocolo de trabalho sequencial — Projeto Apoena

**Regra obrigatória:** manter somente **uma tarefa ativa por vez em todo o projeto**, abrangendo Game Creator e Pixel Art. Não iniciar uma segunda tarefa de implementação enquanto a atual não estiver concluída em 100%.

## 1. Ciclo obrigatório de uma tarefa

1. **Definir:** registrar ID, objetivo, escopo, arquivos/módulos envolvidos e critérios objetivos de aceitação.
2. **Executar:** trabalhar apenas no escopo aprovado. Novas ideias entram no backlog; não viram trabalho paralelo.
3. **Testar:** executar os testes pertinentes à tarefa e corrigir as falhas encontradas antes de avançar.
4. **Validar:** executar a validação canônica do repositório no runner correto. Uma execução isolada local não substitui a CI real.
5. **Conferir entrega:** revisar diff, integridade dos arquivos, artefatos e documentação; confirmar que o resultado foi salvo no GitHub.
6. **Encerrar:** registrar commit, links dos testes, resultado, limitações e estado final no registro de pendências. Só então marcar a tarefa como concluída e selecionar a próxima.

## 2. Definição de “100% concluída”

Uma tarefa de código só pode ser encerrada quando:
- todos os critérios de aceitação definidos no início forem atendidos;
- os testes relevantes e a validação canônica exigida passarem;
- o build/artefato esperado for produzido e conferido, quando aplicável;
- as alterações estiverem registradas no GitHub e a documentação pertinente estiver atualizada;
- não houver falha, teste obrigatório, validação de dispositivo ou decisão necessária ainda pendente para o escopo dessa tarefa.

Se depender de teste humano ou de dispositivo, o estado será **AGUARDANDO VALIDAÇÃO**, não **CONCLUÍDA**. Se houver bloqueio de runner, permissões ou fila, será **BLOQUEADA**. Em ambos os casos, não se inicia outra tarefa de implementação.

## 3. Regras para o GitHub Actions

- Escolher uma validação canônica por tarefa e repositório; workflows manuais de diagnóstico só serão usados quando necessários para investigar a mesma tarefa.
- Não disparar várias validações equivalentes, não criar workflows temporários redundantes e não repetir a suíte inteira quando for suficiente reexecutar o job que falhou.
- Antes de uma nova execução, conferir se já existe uma execução equivalente ativa ou na fila.
- Distinguir erro de código/teste, erro de configuração do workflow, falta de runner e aviso de descontinuação. Não tratar todos como o mesmo problema.
- Não declarar sucesso enquanto a execução relevante estiver em fila, em andamento ou com falha.
- Falhas descobertas durante a tarefa permanecem dentro da tarefa ativa até serem corrigidas ou formalmente identificadas como bloqueio impeditivo; não abrir uma tarefa paralela para contorná-las.

## 3A. Otimização: falhou, diagnosticar antes de repetir

**Proibição de repetição cega:** uma execução com falha não autoriza disparar várias tentativas iguais. A tarefa atual continua ativa até existir diagnóstico, alteração relevante e nova evidência.

1. **Parar e registrar:** guardar o ID do workflow, commit SHA, job/etapa, primeira mensagem de erro relevante e o ambiente (runner/labels).
2. **Classificar a falha:** código ou teste; configuração de workflow; runner/fila/permissão; dependência externa; aviso não bloqueante. Uma fila `queued` não é falha de código.
3. **Investigar a causa:** conferir logs da primeira falha causal; verificar arquivos, caminhos, dependências e diferenças entre a branch testada e `main`.
4. **Planejar uma correção específica:** registrar a hipótese e qual evidência poderá demonstrar que o problema foi corrigido. Não empilhar alterações sem relação.
5. **Validar barato antes de caro:** inspeção e testes locais/focados primeiro; suíte completa somente quando a falha específica estiver resolvida e o runner disponível.
6. **Executar apenas uma nova tentativa necessária:** usar o mesmo commit somente para falhas transitórias demonstradas; para erro determinístico, exigir uma correção ou mudança de condição antes de repetir.
7. **Concluir e arquivar:** encerrar apenas com evidência de sucesso no commit relevante. Mover itens concluídos para o histórico do registro central, sem apagá-los.

**Controle de recursos:** checar filas e execuções equivalentes antes de acionar CI; usar `concurrency`/cancelamento de execuções obsoletas quando seguro; não duplicar workflow por `push` e `pull_request` no mesmo commit sem necessidade; não acionar novamente um runner offline. Alterações exclusivamente documentais podem dispensar uma nova suíte de código quando a validação previamente exigida já foi aprovada e o motivo for registrado.

**Pendências antigas:** não carregar como erro atual uma falha de commit anterior que tenha sido comprovadamente corrigida. Conservar no histórico o link da falha e da validação que a substituiu; PR aberta não é igual a funcionalidade integrada.

## 3B. Organização da lista de workflows

- Manter **um único workflow canônico de validação por repositório**. Um segundo workflow só permanece quando produz uma entrega distinta (por exemplo, build/publicação) ou cobre testes exclusivos que não estejam na validação canônica.
- Antes de remover um workflow manual, comparar seus testes com a suíte canônica e confirmar que toda a cobertura útil foi preservada.
- Não manter agenda periódica sem requisito explícito de monitoramento; validações devem ocorrer por alteração relevante, PR ou acionamento manual deliberado.
- Normalizar o grupo de concorrência pela branch (`github.head_ref || github.ref_name`) para que eventos `push` e `pull_request` da mesma branch não mantenham duas execuções concorrentes. Usar `cancel-in-progress: true` quando seguro.
- Diferenciar estados: `queued` aguarda um runner e aumenta a fila, mas não consome execução ativa; `in_progress` ocupa runner; `completed` (sucesso, falha ou cancelamento) é histórico e não ocupa runner.
- Só declarar a fila limpa depois de consultar todas as páginas de execuções e confirmar zero itens `queued` e zero `in_progress`.
- Cancelar uma execução exige permissão de escrita de Actions. Se a integração disponível não oferecer a operação de cancelamento, registrar o bloqueio e solicitar cancelamento humano pelo GitHub Actions; não criar outro workflow para tentar contornar a limitação.
## 4. Trabalho que abrange os dois repositórios

Quando uma funcionalidade exigir mudanças no Game Creator e no Pixel Art, os dois lados formam **uma única tarefa integrada**, com critérios de aceitação para cada repositório. Não iniciar outra funcionalidade entre a implementação e a validação dos dois lados.

## 5. Estados permitidos

- **BACKLOG:** ainda não iniciada.
- **EM EXECUÇÃO:** única tarefa ativa.
- **EM VALIDAÇÃO:** implementação feita; testes/CI ainda não terminaram.
- **BLOQUEADA:** depende de runner, permissão, ação humana ou outra condição externa. Continua sendo a tarefa ativa.
- **AGUARDANDO VALIDAÇÃO:** falta confirmação humana ou em dispositivo real. Continua sendo a tarefa ativa.
- **CONCLUÍDA:** todos os critérios de aceitação foram comprovados e o resultado foi registrado.

## 6. Registro de trabalho

Manter um único registro principal de pendências em `apoenalore/GameCreator/docs/PENDENCIAS_ABERTAS_E_LIMPEZA_GITHUB.md`. Nele, identificar a tarefa ativa, os itens do backlog, os bloqueios, os links de CI e a evidência de encerramento. O protocolo deste arquivo aplica-se também ao repositório `apoenalore/Apoena-pixel-art-html`.

**Não começar a próxima tarefa por conveniência, por haver uma ideia nova ou porque a tarefa atual ficou bloqueada. Primeiro encerrar a tarefa ativa; se estiver bloqueada, resolver ou pedir a dependência necessária.**


## 7. Governança de fila, revisão por IA e evidência de correção

- **Capacidade:** WIP = 1 para GameCreator + Apoena Pixel Art HTML combinados. Manter no máximo 5 tarefas aprovadas na próxima fila. O restante é backlog de ideias, não trabalho iniciado.
- **Bloqueio crítico:** enquanto existir bloqueio crítico de infraestrutura, segurança, integridade de dados ou validação, não iniciar funcionalidades novas. Resolver o bloqueio dentro da tarefa ativa.
- **Papéis:** CodeRabbit faz a revisão técnica; a IA de desenvolvimento interpreta os achados e aplica correções pontuais; GitHub Actions valida automaticamente o commit corrigido. Não solicitar autofix/autopilot ao CodeRabbit sem autorização explícita. Se a revisão automática estiver pausada, solicitar uma única revisão manual na PR; não criar automações ou workflows extras para isso.
- **Ciclo obrigatório:** revisão CodeRabbit → classificação dos achados → correção pela IA de desenvolvimento → testes focados → validação canônica do GitHub Actions no SHA correto → atualização do registro. Se CodeRabbit não responder, registrar como aguardando revisão; não fingir que houve revisão.
- **Registro por correção:** ID do incidente/tarefa; mensagem literal do erro quando existir; causa comprovada (ou hipótese claramente marcada); solução realmente aplicada; data/hora BRT; repositório e branch; commit SHA; testes executados; run ID/link e resultado. Se o horário exato não estiver disponível, declarar que não foi preservado.
- **Critério de conclusão:** código alterado não significa concluído. Só encerrar com revisão tratada, testes pertinentes aprovados, CI canônica aprovada no commit atual e validações humanas/dispositivo concluídas quando exigidas.
- **Fila e duplicidade:** agrupar PRs do Creator e do Pixel Art que pertencem à mesma entrega integrada. Não contar uma issue guarda-chuva como várias tarefas e não criar issue/PR duplicada para uma frente já existente.
- **Automação:** não criar novos workflows, agendas ou runners para compensar uma validação existente que falhou. Primeiro identificar por que o workflow canônico não iniciou ou não recebeu runner; só alterar a automação após comprovar a causa.
- **Prioridade atual registrada em 30/10/2026:** GC-UPDATE-009 (atualizador incremental do Creator) é a tarefa ativa; a auditoria da fila e seus estados ficam no registro principal `GameCreator/docs/PENDENCIAS_ABERTAS_E_LIMPEZA_GITHUB.md`. A lista pode mudar somente após evidência nova ou decisão expressa do autor.
