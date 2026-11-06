# Checkpoint incremental — GameCreator, PR #14, CI do Criador Modular e Apoena Skill

**Data de consulta:** 02/11/2026, aproximadamente 20:59 BRT (23:59 UTC).  
**Fonte:** mensagens visíveis do autor nesta conversa, GitHub autenticado (repositórios `apoenalore/GameCreator` e `apoenalore/apoenaskil`), metadados de PRs, jobs, logs e artefatos do GitHub Actions.  
**Tipo de backup:** registro incremental de decisões, evidências e estado remoto; snapshot Git do código já versionado. **Não é** transcrição integral de todas as conversas, cópia de arquivos locais, PDFs, imagens, sprites, ZIPs, IndexedDB ou teste de restauração.  
**Política de preservação:** sem merge, sem edição de código de produção, sem alteração de workflow, runner ou biblioteca do navegador; WIP = 1.

## 1. Pedido atual do autor e contexto preservado

- Pedido recorrente explícito: **fazer backup do projeto Game Creator no GitHub a cada conversa, registrando novidades e informações detalhadas**.
- A captura de tela recente mostrou falha do job `validar`, especificamente na etapa **Testar Criador Modular no navegador**, e solicitou correção. O erro exibido não autoriza declarar os botões funcionais nem desabilitar testes para obter CI verde.
- O checkpoint anterior já preservou os requisitos de **todos os botões funcionais**, integração do Criador Modular em **Pixel Art → Personagens**, gerador clássico como contingência, importação de peças próprias, malha/corte inteligente/borracha, desfazer/refazer, biblioteca, ponte com Creator, exportações PNG/JSON/Godot e originais intactos. Ver [checkpoint anterior](2026-11-02-checkpoint-1906-gerador-modular-botoes-ci-pr13.md).
- Esta execução acrescenta **novos fatos verificáveis**; não afirma ter lido conversas privadas inacessíveis nem que a periodicidade equivale a um gatilho automático por mensagem.

## 2. Novo trabalho de integração: PR #14

- [PR #14 — Integrate Apoena Modular Character Creator into Pixel Art](https://github.com/apoenalore/GameCreator/pull/14): **aberta, draft, não mesclada**, `mergeable=true` na consulta.
- Head: `feat/apoena-modular-character-creator-integration`, SHA **`d02be33889ec4c7b3a329860d4ff9b726de8d18a`**; base: `feat/apoena-personagem-estudio-main`, SHA `0447ea9dc9d9310e985247325e3af1d1c726519a`. **Não é uma PR diretamente contra `main`.**
- Metadados da PR: 19 commits, 14 arquivos alterados, +611/-6 linhas na consulta. A descrição promete criador modular como aba principal, gerador clássico preservado, ponte Creator, testes de modelo e navegador. São objetivos/alterações da branch, não homologação funcional.
- O head mais recente `d02be338...` adiciona o relatório `docs/relatorios/CI-RUN-339-analise-artefatos-e-sincronizacao-teste-2026-11-02.md`; é **commit documental**, não evidência de CI verde no novo head.
- [PR #13 — GC-CHAR-001](https://github.com/apoenalore/GameCreator/pull/13) continua **aberta, não draft, não mesclada**, head `34a0a722444448e384c91286affecf0f50217038`, base `main`. Não confundir PR #13 e PR #14, suas bases ou suas validações.

## 3. Incidente CI: evidências, ações existentes e estado

### Run 41534893117 — falha inicial exibida na captura

- [GitHub Actions run 41534893117](https://github.com/apoenalore/GameCreator/actions/runs/41534893117), evento `push`, head `ef9cb3c803a53ad3c9ae2a53948b24eb9f494786` da branch da PR #14, tentativa 1, `completed/failure`.
- Job `validar`, ID `125584240139`, no runner self-hosted Windows `APOENA-GAMECREATOR-RUNNER`.
- Passaram build nativo, checagem DOM, sintaxe, dependências e teste do modelo; a etapa 11 **Testar Criador Modular no navegador** falhou. As etapas posteriores foram puladas; os logs diagnósticos foram enviados.
- Mensagem literal relevante: `Teste funcional do Criador Modular falhou. Consulte .ci-results/characters-browser.html e .log.` e `Process completed with exit code 1`.
- O marcador `CHARACTER BROWSER OK` não foi observado. Isso demonstra falha do teste funcional, **não** prova que todos os botões falham nem que a causa seja o runner.
- Artefato [v41-ci-diagnostics 13183467595](https://github.com/apoenalore/GameCreator/actions/runs/41534893117/artifacts/13183467595), expiração informada em 05/11/2026 22:15:26 UTC. É importante preservar a evidência antes de expirar.

### Run #339 — 41547074475

- [Run 41547074475](https://github.com/apoenalore/GameCreator/actions/runs/41547074475) terminou `failure`.
- Relatório já existente na branch da PR #14 documenta inspeção do artefato: `FAIL: Error: Timeout: Prévia pronta. Revise antes de aplicar.` ao aguardar `Projeto editável salvo` depois do clique em **Salvar projeto**.
- Servidor HTTP `http://127.0.0.1:4173` iniciou; a mudança de `file://` para HTTP não resolveu sozinha. O log não comprova exceção IndexedDB nem causa-raiz definitiva.

### Runs #340 e #341 — correção de sincronização ainda não validada

- [Run #340 — 41547497936](https://github.com/apoenalore/GameCreator/actions/runs/41547497936), commit `4e503a4710b0251dbdc4abe680918bada36b1f7b`: `cancelled`.
- [Run #341 — 41547503382](https://github.com/apoenalore/GameCreator/actions/runs/41547503382), commit `11ca300ddf32d979f7742b9278c1c6e281e11d92`: **`completed/failure`**, job `validar` ID `125626572975`, falha novamente em **Testar Criador Modular no navegador**.
- Alterações relatadas: `window.__apoenaTestHooks.whenIdle()` disponível apenas com `?test=1`, e helpers do teste aguardando a fila assíncrona em vez de pausas fixas de 50 ms.
- O log do #341 informa: `Teste funcional do Criador Modular falhou: FAIL: Error: Timeout aguardando fila de operações. Status: Prévia ...` com referência a `tests/personagens-browser.html:8:83`; exit code 1. A mensagem foi truncada neste registro após `Prévia` porque o log tem codificação de console distorcida; a evidência completa permanece no job.
- **Diagnóstico sustentado:** a fila de operações não chegou ao estado esperado pelo teste no prazo. **Causa-raiz ainda não confirmada**: operação pendente, handler de salvamento, persistência IndexedDB, ponte ou lógica do teste precisam ser isolados. O runner executou o teste, portanto não classificar esta falha como perda de comunicação.
- **Estado:** não resolvido; não mesclar PR #14, não afirmar testes de integração aprovados e não desligar o teste para ocultar o erro. Próxima investigação: artefato do #341, instrumentar fila/handlers e eventos IndexedDB/bridge sem dados privados, corrigir a primeira causa observável, depois validar CI integral no SHA corrigido.

## 4. Snapshot de preservação criado

- Branch imutável por convenção: [`backup/pr14-criador-modular-20261102-2059-brt`](https://github.com/apoenalore/GameCreator/tree/backup/pr14-criador-modular-20261102-2059-brt), criada no commit **`d02be33889ec4c7b3a329860d4ff9b726de8d18a`** da PR #14.
- Preserva o código **rastreado pelo Git** nesse estado, sem merge e sem sobrescrever branches de desenvolvimento.
- Snapshot anterior da PR #13 permanece em [`backup/pr13-gerador-modular-20261102-1906-brt`](https://github.com/apoenalore/GameCreator/tree/backup/pr13-gerador-modular-20261102-1906-brt), no SHA `34a0a722...`.
- O histórico da `main` segue preservado pelo Git; a documentação incremental é gravada na `main`. Não foi realizada cópia de instalação Windows, dados locais ou biblioteca IndexedDB.

## 5. Novidades no Apoena Skill: recuperação textual de PDFs

- O repositório [apoenalore/apoenaskil](https://github.com/apoenalore/apoenaskil) recebeu os commits `c21ccb8dccbc9fa8d81d2cc476fad12e3c4261a9` (inventário de extrações) e `6140a3f877ceef6080bfa519ad6f735e21c38988` (indexação no README).
- O documento `apoena/docs/recovery/pdf-text-extractions-2026-11-02.md` informa que o ZIP textual dos cinco PDFs está na **Biblioteca pessoal**, em `/Apoena/Backups/Backup_Apoena_GameCreator_Conteudo_PDF_em_Texto_2026-11-02.zip`; isso **não** significa que o ZIP esteja no GitHub.
- Cobertura relatada: **Resumo das ferramentas** (21 páginas, incluindo a lista de 500 possibilidades e Animador Maker Apoena); **Melhorar interface do Apoena** (5 páginas); **Imagem 2D Anime Manga** (5 páginas). Os PDFs **Criar personagens Godot** e **Aplicar textura da pedra** têm somente uma página cada, com aviso de imagens ainda carregando; conteúdo visual não recuperado.
- Extração textual não reproduz imagens, sprites, PDFs binários nem transcrições inacessíveis. As referências de design/ideias continuam distintas de código já implementado e validado.

## 6. Pendências objetivas para o próximo checkpoint

1. Investigar o timeout da fila no #341 com o artefato de diagnóstico e evidência de IndexedDB/handlers; registrar causa, solução, justificativa, ações e testes no relatório individual de CI.
2. Acompanhar novo SHA/CI da PR #14, distinguir da PR #13 e da `main`; não mesclar sem validação.
3. Completar o **Backup Mestre**: arquivos originais e anexos, spritesheets, PDFs completos, dados IndexedDB exportados, inventário/hash SHA-256 e restauração testada. As cópias locais dependem de acesso aos respectivos arquivos/dados.
4. Preservar a referência de personagem Apoena e a direção visual em Skills sem inventar assets, classe ou animações prontas.
5. Registrar apenas novidades reais em checkpoints futuros; não criar commits horários vazios.

**Conclusão verificável:** snapshot da PR #14 criado; novas evidências de CI e de extrações textuais documentadas. O Criador Modular **não está homologado** e o backup integral de todos os dados **não está concluído**.
