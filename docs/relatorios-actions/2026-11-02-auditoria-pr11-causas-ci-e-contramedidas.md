# Auditoria da PR #11 — causas das falhas de CI e contramedidas

**Data:** 02/11/2026  
**PR:** [#11 — GC-ANIM-006](https://github.com/apoenalore/GameCreator/pull/11)  
**Branch de registro:** docs/ci-pr11-countermeasures-20261102  
**Classificação:** auditoria de processo/CI; nenhuma alteração funcional do Creator nesta etapa.

## 1. Pedido do autor

Investigar os erros recorrentes da PR #11, determinar se ela precisa executar repetidamente, preparar contramedidas para evitar que falhas de CI interrompam o desenvolvimento e permitir avançar para as próximas tarefas.

## 2. Estado da PR

- PR aberta e em draft; base main.
- Branch: feat/apoena-personagem-estudio-main.
- HEAD consultado: 0dd0b9ee90409654958f010eef9303f0dca8c7c7.
- Objetivo: presets editáveis de animação do Apoena no Estúdio Pixel Art; corrida 4×4 e ataques laterais em grades iniciais 6×2; prévia, edição quadro a quadro, salvamento e exportação, preservando PNGs originais.
- A PR não afirma implementar gameplay/runtime no Godot.
- Consulta de reviews formais retornou lista vazia; aprovação/revisão formal do CodeRabbit não comprovada.

## 3. A PR executa continuamente?

**Não.** O workflow .github/workflows/pixel-art.yml declara:
- push com filtro de caminhos;
- pull_request para main, também com filtro de caminhos;
- workflow_dispatch para execução manual.

Não há cron/schedule. Portanto, não roda continuamente por relógio. Roda em eventos de push/PR que correspondem aos filtros ou quando alguém o dispara manualmente.

### Descoberta importante sobre os pushes de documentação

O filtro pull_request.paths contém pixel-art/**. Como a PR #11 já inclui alterações em pixel-art/estudio.html, pixel-art/estudio.js e imagens em pixel-art/references/apoena/**, a PR satisfaz o filtro. Assim, novos eventos de sincronização/push para a branch da PR podem iniciar o workflow completo mesmo quando o commit mais recente só adiciona documentação em docs/**.

Isso explica por que registrar vários relatórios diretamente na branch da PR pode disparar validações adicionais. Foi uma escolha operacional inadequada nesta investigação; checkpoints futuros devem ficar em branch documental separada, sem sincronizar a PR ativa.

No momento da consulta, o run [41451250043](https://github.com/apoenalore/GameCreator/actions/runs/41451250043), número 295, evento pull_request, estava pending no SHA acima; a API ainda não retornava jobs. Não afirmar que iniciou ou falhou sem nova consulta.

## 4. O que o workflow atual faz

O workflow possui um único job validar com runs-on self-hosted, Windows, X64. A auditoria encontrou 18 steps nomeados, incluindo:
1. Preparação de diagnósticos do runner.
2. Build nativo do Creator V4.0.
3. Smoke test DOM de Estúdio, Mapas e Biblioteca em navegador headless.
4. Verificação de sintaxe do build Python quando disponível.
5. Instalação de dependências npm.
6. Sintaxe de múltiplos arquivos JavaScript.
7. Testes do Corte Inteligente.
8. Testes de tileset.
9. Testes da biblioteca/IndexedDB.
10. Testes de backup/restauração.
11. Contrato de catálogo/Godot.
12. Protocolo de sincronização V4.0/V4.1.
13. Contratos de integração do Creator.
14. Manifesto do atualizador, quando presente.
15. Hidrologia/erosão, quando presente.
16. Runtime Godot 4 headless.
17. Preservação dos módulos e contratos do Creator.
18. Preparação de entrega manual, upload de artefato quando workflow_dispatch e upload de logs em caso de falha.

**Conclusão:** a validação da PR #11 é muito mais ampla do que o escopo de presets de animação. O job testa partes relevantes de toda a plataforma e depende de um único runner Windows auto-hospedado. A cobertura ampla é útil como regressão de integração antes de merge/release, mas é pesada para cada alteração pequena.

## 5. Evidências de falhas observadas

### Run 41357977741
- PR #11, tentativa 4, SHA a9c7148f01504f7be142dd0d852056dd5a9a5114.
- Run/job completed/failure.
- Runner ID 2, APOENA-GAMECREATOR-RUNNER, labels self-hosted, Windows, X64, foi atribuído.
- A API retornou steps=[]; logs do job deram HTTP 404 / BlobNotFound na investigação anterior.
- Causa original não pôde ser identificada a partir dos logs recuperáveis.

### Run 41433942503
- PR #11, SHA 70a4e09e7243d56f0f0313a7791a849218514055.
- Run/job completed/failure.
- Captura do GitHub Actions mostra anotação explícita de perda de comunicação do executor auto-hospedado.
- Capturas do console Windows mostram Connected to GitHub, A session for this runner already exists e Runner connect error: Error: Conflict. Retrying until reconnected.
- Captura posterior mostra Runner reconnected, versão 2.338.0 e Listening for Jobs.
- O autor informou que reiniciou o runner e depois o processo voltou a escutar trabalhos.
- **Interpretação:** evidência forte de incidente no ciclo de sessão/comunicação do runner, não evidência de bug funcional no código de animação. A causa operacional raiz (duas instâncias, serviço + console, sessão anterior não encerrada, reinício abrupto ou pressão de recursos) ainda não foi comprovada.

### Run 41451250043
- Evento pull_request, número 295, SHA 0dd0b9ee90409654958f010eef9303f0dca8c7c7.
- Estado observado: pending; API ainda sem jobs no momento da consulta.
- Não classificar como falha.

## 6. A PR #11 tem erros de código comprovados?

**Nenhum erro funcional de código foi demonstrado pelas evidências de CI recuperadas nesta auditoria.** Os dois runs analisados falharam sem steps/logs recuperáveis; um deles tem anotação explícita de perda de comunicação do runner e captura de conflito de sessão. Isso não prova que o código está correto: significa que os testes não forneceram evidência suficiente para aprovar ou reprovar os presets.

A PR continua draft e não deve ser integrada até obter validação técnica adequada e revisão visual das imagens/predefinições.

## 7. Pesquisa oficial e comunitária

- GitHub Docs — [Workflow syntax: path filters and concurrency](https://docs.github.com/en/actions/reference/workflows-and-actions/workflow-syntax): filtros de paths e grupos de concorrência controlam quais eventos iniciam workflows e como execuções concorrentes são tratadas.
- GitHub Docs — [Self-hosted runner troubleshooting](https://docs.github.com/en/actions/how-tos/manage-runners/self-hosted-runners/monitor-and-troubleshoot): verificar serviço, estado do runner e logs locais em _diag.
- GitHub Docs — [Self-hosted runner reference](https://docs.github.com/en/actions/reference/runners/self-hosted-runners): runner precisa estar ativo, comunicar-se por HTTPS/443 e possuir recursos adequados.
- GitHub Docs — [Configuring a self-hosted runner as a Windows service](https://docs.github.com/en/actions/how-tos/manage-runners/self-hosted-runners/configure-the-application?platform=windows): configurar e gerenciar serviço Windows; não executar serviço e console com a mesma identidade ao mesmo tempo.
- actions/runner [#3441](https://github.com/actions/runner/issues/3441): mantenedor observou duas solicitações de sessão em 11 segundos e perguntou se a automação iniciava o runner duas vezes; comentário adicional levantou OOM como hipótese.
- actions/runner [#3677](https://github.com/actions/runner/issues/3677): conflito de sessão após reboot Windows não gracioso.
- actions/runner [#3624](https://github.com/actions/runner/issues/3624): sessão conflitante após reinícios/recriação de runners; caso Linux/EKS, apenas referência de comportamento de sessão.
- GitHub Docs — [Concurrency](https://docs.github.com/en/actions/reference/workflows-and-actions/workflow-syntax#concurrency): grupos de concorrência mantêm uma execução ativa e cancelam a anterior, mas não corrigem duplicidade de processos do runner no host.

## 8. Contramedidas recomendadas

### A. Imediatas — runner Windows
1. Escolher um único mecanismo de inicialização: serviço Windows configurado ou execução interativa por run.cmd, nunca ambos com a mesma configuração/identidade.
2. Verificar services.msc, serviço GitHub Actions Runner, processos Runner.Listener, Runner.Worker e run.cmd, PIDs, caminhos e tarefas agendadas.
3. Preservar _diag e Event Viewer antes de parar/reiniciar processos.
4. Não iniciar manualmente um segundo runner quando o atual já mostra Listening for Jobs.
5. Confirmar uma única identidade Online/Idle no GitHub antes de reexecutar.
6. Após reinício do computador, preferir encerramento gracioso e verificar estado antes de iniciar outra instância.
7. Monitorar memória, CPU, disco, energia/suspensão e rede durante o workflow.

### B. Curto prazo — reduzir acionamentos desnecessários
1. Não registrar relatórios/checkpoints na branch de uma PR ativa quando o workflow monitora caminhos alterados nela. Usar branch documental separada.
2. Manter paths precisos e revisar se documentação interna realmente deve acionar build/testes.
3. Preservar concurrency para impedir execuções concorrentes da mesma branch. cancel-in-progress=true cancela o workflow anterior, mas não elimina a causa de runner duplicado.
4. Evitar reexecutar jobs automaticamente sem diagnóstico de falha de infraestrutura.

### C. Evolução proposta — CI em camadas
**Não implementar sem revisão do protocolo e análise dos testes; esta seção é proposta.**
- **Camada 1 — PR rápida (GitHub-hosted):** lint/sintaxe JS, testes unitários Node e contratos puros que não exigem recursos do Windows/Godot. Executar em ubuntu-latest ou windows-latest hospedado conforme compatibilidade.
- **Camada 2 — integração Windows:** build PowerShell, smoke test Edge/Chrome e runtime Godot headless. Rodar quando arquivos/áreas correspondentes forem alterados ou como validação de integração antes de merge, usando runner Windows controlado.
- **Camada 3 — pacote/release:** preparação de ZIP e publicação de artefato somente em workflow_dispatch ou evento de release, não em toda alteração de código.
- **Camada 4 — visual/manual:** conferir spritesheets e quadros reais no Estúdio, pois testes de sintaxe/contrato não provam que a segmentação visual das animações está correta.

### D. Critérios de conclusão da PR #11
1. Runner único e estável.
2. PR rápida aprovada.
3. Testes de integração Windows/Godot aprovados quando necessários.
4. Revisão visual das grades e animações no Estúdio.
5. Revisão CodeRabbit ou revisão técnica equivalente.
6. Autor aprova a PR; somente então considerar merge.

## 9. Decisão técnica e justificativa

As falhas observadas são predominantemente de infraestrutura/runner, conforme anotação e logs fotografados. Não há base para alterar arquivos de animação como correção desse incidente.

O workflow atual testa o Creator inteiro em um único job Windows; isso oferece regressão ampla, mas aumenta duração, custo operacional e superfície de falha para uma alteração pequena. A estratégia recomendada é separar testes rápidos hospedados de integração Windows/Godot e empacotamento manual, preservando cobertura sem fazer cada pequena mudança depender do runner local.

**Não foi alterado o workflow nem o código do produto nesta auditoria.** Nenhum teste novo foi executado. A arquitetura de CI proposta exige etapa própria de implementação e validação.

## 10. Estado e próximos passos

- PR #11: DRAFT / NÃO INTEGRADA.
- Código de animação: não reprovado por erro de código; ainda sem validação suficiente.
- Runner: recuperado e mostrando Listening for Jobs na captura; estabilidade/causa raiz ainda precisam ser verificadas.
- Run 41451250043: PENDING no último snapshot; verificar resultado antes de qualquer nova execução.
- Próxima ação: confirmar estado Online/Idle e uma única instância; consultar resultado do run pendente; depois executar uma validação controlada.
- Futuro: desenhar a divisão do workflow em camadas numa PR específica, sem enfraquecer testes.
- Relatórios individuais GC-CI-013 e GC-CI-014 permanecem como evidência de incidentes.
