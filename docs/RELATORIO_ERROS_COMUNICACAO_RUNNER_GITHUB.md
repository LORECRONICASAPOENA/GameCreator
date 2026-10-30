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

## 3. Incidente atual — GC-COMM-001: GitHub não atribui jobs ao Runner Windows

**Classificação:** BLOQUEIO DE ATRIBUIÇÃO CONFIRMADO; causa local específica ainda NÃO DIAGNOSTICADA.  
**Data/hora do relato do usuário:** 30/10/2026 10:42:01 UTC (07:42:01 BRT).  
**Data da rechecagem no GitHub:** 30/10/2026; a integração retornou os dados sem preservar o minuto/segundo da consulta.  
**Repositório:** `apoenalore/GameCreator`.

### 3.1 Evidência observada

Consulta das quatro páginas de execuções:
- 346 execuções no histórico consultado;
- 17 `queued`;
- 0 `in_progress`;
- 329 `completed` (158 `failure`, 96 `success`, 75 `cancelled`).

Os 158 resultados `failure` são históricos e não significam 158 defeitos atuais.

Os 17 jobs em fila foram consultados individualmente. Todos apresentaram:
- labels solicitadas: `self-hosted`, `Windows`, `X64`;
- `runner_id = 0`;
- `runner_name = ""`;
- nenhum step executado (`steps = []`);
- status `queued`.

Isso demonstra que o GitHub ainda não atribuiu esses jobs a um runner compatível. O bloqueio ocorre antes do checkout do código e antes de qualquer script PowerShell, Node.js ou teste.

### 3.2 Execuções em fila

**Preservar — são as duas validações mais recentes da PR de hidrologia e não devem ser canceladas:**

1. [40996154391 — validação principal do Creator](https://github.com/apoenalore/GameCreator/actions/runs/40996154391)
2. [40996154399 — validação específica de hidrologia](https://github.com/apoenalore/GameCreator/actions/runs/40996154399)

**Fila antiga — 15 execuções que devem ser canceladas manualmente após conferir que continuam obsoletas:**

1. [40994405717 — integração antiga por push](https://github.com/apoenalore/GameCreator/actions/runs/40994405717)
2. [40994401969 — integração antiga por push](https://github.com/apoenalore/GameCreator/actions/runs/40994401969)
3. [40959244729 — validação agendada antiga](https://github.com/apoenalore/GameCreator/actions/runs/40959244729)
4. [40949144668 — validação antiga da branch Pixel Art](https://github.com/apoenalore/GameCreator/actions/runs/40949144668)
5. [40947634011 — validação antiga da branch ambiental](https://github.com/apoenalore/GameCreator/actions/runs/40947634011)
6. [40947633985 — integração antiga por pull request](https://github.com/apoenalore/GameCreator/actions/runs/40947633985)
7. [40947625325 — integração antiga por push](https://github.com/apoenalore/GameCreator/actions/runs/40947625325)
8. [40947611808 — integração antiga por pull request](https://github.com/apoenalore/GameCreator/actions/runs/40947611808)
9. [40947601170 — integração antiga por push](https://github.com/apoenalore/GameCreator/actions/runs/40947601170)
10. [40944962186 — integração antiga por pull request](https://github.com/apoenalore/GameCreator/actions/runs/40944962186)
11. [40944675654 — integração antiga por pull request](https://github.com/apoenalore/GameCreator/actions/runs/40944675654)
12. [40944666718 — integração antiga por push](https://github.com/apoenalore/GameCreator/actions/runs/40944666718)
13. [40943993233 — integração antiga por pull request](https://github.com/apoenalore/GameCreator/actions/runs/40943993233)
14. [40943754023 — integração antiga por push](https://github.com/apoenalore/GameCreator/actions/runs/40943754023)
15. [40943621289 — integração antiga por push](https://github.com/apoenalore/GameCreator/actions/runs/40943621289)

**Observação:** a lista é um retrato da consulta de 30/10/2026. Antes de cancelar, reconsultar o status de cada run. Não cancelar uma execução que já tenha sido concluída ou que tenha se tornado a validação atual.

### 3.3 Causa raiz: o que sabemos e o que ainda não sabemos

**Comprovado:** o agendador do GitHub não encontrou/atribuiu um runner que atendesse às labels exigidas no momento da consulta. Os jobs não chegaram a executar steps.

**Ainda não comprovado:** por que o runner não foi considerado disponível. Hipóteses a verificar, nesta ordem:

1. runner está Offline ou serviço do Windows está parado;
2. runner está registrado em outro repositório ou grupo;
3. repositório não tem autorização para usar o grupo de runners;
4. labels efetivas não correspondem exatamente a `self-hosted`, `Windows`, `X64`;
5. serviço ativo aponta para outra instalação/pasta ou usa uma configuração antiga;
6. duas instalações foram registradas e a instância observada no CMD não é a que o GitHub conhece.

A hipótese de “há mais de um runner ativo” não foi comprovada. Não remover, reinstalar ou registrar runners adicionais antes de inventariar as instalações existentes.

### 3.4 Correção: o que foi feito e o que falta

**Ações internas efetivamente concluídas nesta investigação:**
- consultadas as quatro páginas de histórico do Actions;
- consultados os 17 jobs em fila;
- separados 15 jobs antigos e 2 validações atuais que devem ser preservadas;
- atualizado o registro central de pendências com a contagem e os links;
- criado este relatório para reutilização por futuras IAs;
- não foi disparada uma nova validação para aumentar a fila.

**Limite da integração:** a conexão GitHub usada nesta sessão permite consultar runs, jobs, arquivos e logs, mas não disponibiliza operação de cancelamento de runs nem leitura autorizada da lista de runners em Settings. Portanto, nenhum job foi cancelado e o status Online do runner não foi confirmado por esta sessão.

**Correção definitiva ainda pendente:** verificar Settings → Actions → Runners no repositório GameCreator e corrigir a condição exata (serviço, registro, grupo, permissão ou labels). Depois, preservar as duas validações atuais e executar apenas a validação canônica necessária.

### 3.5 Procedimento para concluir o diagnóstico no PC

1. Abrir `https://github.com/apoenalore/GameCreator/settings/actions/runners`.
2. Localizar o runner esperado do Game Creator.
3. Registrar nome, estado (Online/Offline), grupo e labels exibidas.
4. Se estiver Offline, verificar o serviço Windows correspondente antes de iniciar outra instância.
5. Se estiver Online, conferir se o grupo autoriza o repositório e se as labels incluem exatamente `self-hosted`, `Windows`, `X64`.
6. No Windows, conferir o serviço e os processos ativos. Usar PowerShell:

```powershell
Get-Service |
  Where-Object {
    $_.Name -like 'actions.runner*' -or
    $_.DisplayName -like '*GitHub Actions Runner*'
  } |
  Format-Table Name, Status, StartType, DisplayName -AutoSize

Get-Process -Name Runner.Listener, Runner.Worker -ErrorAction SilentlyContinue |
  Format-Table Id, ProcessName, Path -AutoSize
```

7. Conferir os logs `_diag/Runner_*.log` e `_diag/Worker_*.log` da instalação efetivamente registrada.
8. Não iniciar duas cópias da mesma instalação. Não apagar `_work` nem remover o runner sem evidência.
9. Depois de corrigir, aguardar a atribuição de uma das duas validações preservadas. Confirmar no GitHub que `runner_id` deixou de ser zero e que os steps começaram.
10. Só depois da fila antiga cancelada e do runner confirmado, executar uma única validação canônica.

**Pasta do runner informada anteriormente no projeto:** `C:\ApoenaHub\GAME CREATOR\RUNNER`. É uma referência fornecida pelo usuário, não uma confirmação de que o serviço ativo esteja instalado ou iniciado nessa pasta neste momento.

**Critério de resolução:** o runner aparece Online com grupo/autorização/labels corretos; o job atual recebe runner_id e runner_name reais; os steps começam; uma validação canônica termina com resultado registrado. Até lá, manter o incidente como BLOQUEADO, não RESOLVIDO.

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
