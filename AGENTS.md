# Instruções para agentes de IA — Game Creator

Antes de investigar ou alterar CI, GitHub Actions, PowerShell, runner, testes ou build:

1. Leia docs/BASE_CONHECIMENTO_ERROS_RUNNER_CI.md.
2. Leia docs/PENDENCIAS_ABERTAS_E_LIMPEZA_GITHUB.md.
2a. Leia docs/ATUALIZACOES_PENDENTES_LEIA_ANTES_DE_COMECAR.md antes de modificar o editor, mapa, tilesets ou registrar novas decisões; atualize estados com evidência e não confunda ideia discutida com implementação.
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


## Relatório obrigatório para CADA erro do GitHub Actions

Sempre que qualquer execução ou job do GitHub Actions terminar em `failure`, ou apresentar anotação de erro/infraestrutura, a IA responsável deve produzir e registrar um relatório individual antes de tentar corrigir, repetir ou contornar a execução. A regra vale para falhas de código/teste, build, publicação/artefato, permissões, rede, GitHub, runner self-hosted e ambiente.

### Procedimento obrigatório
1. Identificar repositório, workflow, run ID e URL, job/step, branch, commit SHA, evento, horário disponível e estado final. Distinguir falha real, cancelamento, timeout, fila (`queued`) e perda de comunicação do runner.
2. Coletar a mensagem literal, annotations, logs do job/step, logs do runner e evidências correlatas. Se os logs não estiverem disponíveis, registrar a tentativa de acesso e a limitação; nunca preencher lacunas com suposições.
3. Determinar a causa-raiz com evidências. Separar explicitamente **causa comprovada**, **hipóteses ainda não verificadas** e **informações ausentes**. Se não houver evidência suficiente, declarar `CAUSA NÃO CONFIRMADA` e indicar a próxima coleta necessária.
4. Descrever o impacto: o que falhou, o que chegou a executar, o que não foi validado e se o resultado diz algo sobre o código. Uma falha de comunicação do runner, por exemplo, não é prova de defeito nos testes ou no produto.
5. Registrar as soluções possíveis consideradas e seus riscos. Explicar **qual solução foi escolhida e por quê**, incluindo critérios técnicos, menor risco, preservação de dados/código, compatibilidade com WIP = 1 e ausência de workflows redundantes. Se uma alternativa foi descartada, explicar o motivo.
6. Diferenciar `solução proposta` de `solução aplicada`. Nunca afirmar que corrigiu se apenas recomendou. Registrar arquivos/linhas alterados, commit SHA e autor da mudança quando aplicável.
7. Definir uma validação objetiva para a correção: teste focado, execução canônica, resultado esperado e evidência. Só marcar como resolvido após a validação passar no commit corrigido. Não repetir o mesmo run/commit cegamente; repetição sem mudança só é aceitável quando a causa transitória estiver demonstrada e a comunicação/serviço tiver sido restabelecida.
8. Criar um relatório por incidente em `docs/relatorios-actions/`, usando `docs/relatorios-actions/MODELO_RELATORIO_FALHA_ACTIONS.md`. Nome sugerido: `AAAA-MM-DD-run-ID-resumo.md`. Atualizar também `docs/BASE_CONHECIMENTO_ERROS_RUNNER_CI.md` quando o incidente trouxer conhecimento reutilizável, e o registro de conversas/checkpoints quando a falha alterar prioridades ou decisões.
9. Ao final, apresentar ao autor um resumo direto com: erro, causa comprovada ou estado da investigação, solução escolhida, justificativa, o que foi efetivamente alterado e resultado da validação. Destacar qualquer ação que dependa do usuário.

### Restrições
- Não alterar código do produto para mascarar falha de infraestrutura.
- Não enfraquecer testes, apagar assertions, ignorar exit codes, silenciar erros ou remover etapas para obter status verde.
- Não trocar runner, shell, permissões, labels, gatilhos ou workflow sem evidência e justificativa registradas.
- Não criar workflow paralelo para substituir uma investigação.
- Não executar ações destrutivas, cancelar execuções válidas ou sobrescrever dados locais sem autorização e análise de impacto.
- O relatório é obrigatório mesmo quando a causa for externa, transitória ou ainda desconhecida. Nesses casos, registrar claramente o limite da evidência e a próxima ação diagnóstica.


## Launcher local e GitHub Actions

- `ABRIR_GAME_CREATOR.cmd` é somente um atalho opcional para o usuário no Windows: chama `integracao/build_unificado.ps1` e abre `index.html` após o build. Não é uma dependência do CI.
- O GitHub Actions deve chamar diretamente os scripts de build/teste necessários; nunca executar o launcher CMD como etapa do Runner.
- Alterações isoladas no launcher CMD não devem acionar o workflow canônico. Manter o launcher enquanto for útil ao fluxo local; removê-lo somente após confirmar que nenhum usuário/atalho/documento depende dele e que o build direto continua acessível.


## Segurança por padrão e conteúdo comunitário

- Antes de abrir upload/publicação para a comunidade, consultar `docs/SEGURANCA_APOENA_500_CONTROLES.md` e classificar os controles aplicáveis com evidência e teste.
- Não executar código, scripts, HTML, SVG ativo, plugins ou binários enviados por usuários no processo principal do Creator ou do jogo.
- A primeira versão de criação comunitária deve ser declarativa: schemas versionados, formatos permitidos, limites rígidos, validação binária, processamento isolado, quarentena e moderação.
- Tratar `postMessage`, arquivos importados, backups, manifests e metadados como entrada não confiável. Não considerar canal, ID, MIME informado, prefixo de data URL ou origem opaca `null` como autenticação.
- Não confiar no cliente para saldo, inventário, combate, posse, preços, recompensas, ranking ou elegibilidade. Multiplayer/economia exigem autoridade do servidor e autorização por objeto.
- Não implementar sandbox de mods executáveis sem modelo de capabilities, isolamento de processo/runtime, quotas, revogação, revisão e testes adversariais aprovados.
- Mudanças de segurança devem incluir relatório de ameaça, evidência, testes negativos e riscos residuais; não afirmar que o produto está “seguro” com base apenas em testes de contrato.


## Continuidade obrigatória — documentação de segurança

Para qualquer auditoria, correção ou alteração relacionada a segurança, backup, importação/exportação, bridge, biblioteca, distribuição ou GitHub Actions, leia também, antes de agir:
1. docs/security/README.md;
2. docs/security/AUDIT-V4.1.md;
3. docs/security/FINDINGS.md;
4. docs/security/REMEDIATION-PLAN.md;
5. docs/security/EVIDENCE-REGISTER.md;
6. docs/security/BACKUP-AND-RECOVERY.md;
7. docs/security/GITHUB-SECURITY.md;
8. docs/security/CHANGELOG-SECURITY.md.

Os achados SEC-001 a SEC-007 são históricos/preliminares e devem ser revalidados no SHA atual. Não declarar exploração, vulnerabilidade confirmada, correção, teste ou release sem evidência. A memória geral, decisões transversais e arquivo de conversas pertencem ao repositório Apoena Skill; este repositório mantém somente documentação técnica operacional do GameCreator.


## Arquitetura e fonte oficial — leitura obrigatória

Antes de alterar a entrada principal, build, distribuição, módulos compartilhados, Map Editor, Pixel Art ou integração Godot, leia:
1. docs/architecture/README.md;
2. docs/architecture/ENGINEERING-BASELINE-2026-11-02.md;
3. README.md e os documentos de build correspondentes.

A identificação registrada é: fonte de entrada do build = APOENA_GAME_CREATOR_V4_0_BANCADA_INTEGRADA.html; artefato integrado = index.html; caminho operacional predominante = integracao/build_unificado.ps1. Trate como baseline verificado no ZIP A1, não como certificação de distribuição em produção. O index depende de módulos externos; não o distribuir isoladamente. O build Python apresentou diferença de dois bytes em relação ao index recebido; não declarar equivalência até alinhar e testar. WIP = 1. A próxima atividade é A2, mapa de dependências/contratos; não refatorar antes de concluir esse levantamento.
