# Instruções para agentes de IA — Game Creator

Antes de investigar ou alterar CI, GitHub Actions, PowerShell, runner, testes ou build:

1. Leia docs/BASE_CONHECIMENTO_ERROS_RUNNER_CI.md.
2. Leia docs/PENDENCIAS_ABERTAS_E_LIMPEZA_GITHUB.md.
3. Respeite o protocolo sequencial: WIP = 1 para Game Creator e Apoena Pixel Art HTML combinados.
4. Diferencie job queued (aguardando runner) de job failed (código/etapa executada e falhou).
5. Não repita workflows, não crie workflows redundantes e não altere labels/shells sem identificar a causa.
6. Nunca enfraqueça testes, remova assertions ou oculte exceções para obter CI verde.
7. Separe causas comprovadas de hipóteses. Atualize a base de conhecimento somente depois de validar a correção.
8. Preserve a liberdade criativa: automações do editor devem ser assistivas, reversíveis e nunca impor escolhas ao criador.

## Registro obrigatório de incidentes

Ao acrescentar ou atualizar um erro em docs/BASE_CONHECIMENTO_ERROS_RUNNER_CI.md, registre data/hora da ocorrência e do cadastro com fuso BRT, mensagem literal, motivo comprovado, solução efetivamente utilizada, evidência da solução, resultado e prevenção. Não invente horários retroativos. Se a hora não estiver preservada, declare isso. Nunca registre uma recomendação como solução aplicada.


## Verificação obrigatória da validação automática

1. Antes de alterar código, identifique o workflow de validação já existente e confirme que seus gatilhos `push` e `pull_request` cobrem os arquivos, branches e alterações pertinentes. Não crie outro workflow nem acrescente agenda apenas para compensar gatilhos mal configurados.
2. Depois de cada alteração de código enviada ao GitHub, confira se o GitHub Actions iniciou **automaticamente**, sem clique em `Run workflow`/validar, no commit SHA e branch/PR corretos. Registre o link do run e seu resultado na evidência da tarefa.
3. Se não houver run automático, investigue na ordem: filtros de caminhos, evento/branch, habilitação do Actions, permissões, requisitos de ambiente/aprovação e disponibilidade/labels do runner. Não declare validado sem uma execução efetiva.
4. Diferencie `queued`, `in_progress`, `failed`, `cancelled` e `success`; runner sem atribuição não é falha de código. Não dispare manualmente um job idêntico enquanto ele estiver em fila; `workflow_dispatch` é contingência, não rotina.
5. Reaproveite a validação canônica existente e respeite WIP = 1 para os dois repositórios combinados. Evite executar testes equivalentes em paralelo ou acumular schedules. Mudanças apenas em documentação podem ser excluídas por filtros de caminho, desde que não alterem código ou configuração de validação.
6. Quando encontrar falha de autovalidação, investigue a causa raiz, faça uma correção mínima, comprove com nova execução automática e registre erro, causa, correção real, data/hora BRT, commit e run ID em `docs/BASE_CONHECIMENTO_ERROS_RUNNER_CI.md`. Não invente êxito, horário ou solução. Não publique relatórios rotineiros na conversa; informe somente bloqueios e decisões que exijam participação humana.
7. Aprovação de PR, proteção de branch e autorização de implantação são controles distintos de iniciar testes automaticamente: nunca contorne uma exigência legítima de aprovação para eliminar cliques.
