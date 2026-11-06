# Checkpoint incremental — Game Creator — 02/11/2026, 23:59 BRT

## Pedido de preservação
O autor reiterou: realizar backup no GitHub do Game Creator e registrar novidades e informações detalhadas a cada conversa. Este checkpoint preserva evidências novas observadas por consulta autenticada ao GitHub, sem alegar acesso a todos os históricos de chat ou aos dados locais.

## Evidências verificadas
- Repositório principal: `apoenalore/GameCreator`. O índice `docs/REGISTRO_CONVERSAS_E_BACKUPS.md` na branch padrão já continha os checkpoints da PR #13, PR #14 e a correção do teste no commit [7193362](https://github.com/apoenalore/GameCreator/commit/7193362cfe99294bc910dcf9c92ddbfd87cf9378).
- Na branch `feat/apoena-modular-character-creator-integration`, o arquivo `tests/personagens-browser.html` foi novamente consultado (blob SHA `9b5e9b8272f0e2d59186606f62e0d840b95906e4`). Em relação ao checkpoint anterior, agora contém instrumentação `bootStage`, marcador `BOOTSTRAP`, listener global de erros, `hostTrace`, um host de teste em memória com `testProjects`/`testAssets`, monitoramento de carregamento do iframe e diagnóstico de timeout de 15 segundos. O comentário no próprio teste distingue host de memória de testes de IndexedDB em `tests/asset-library.test.cjs`.
- Essa evolução melhora a observabilidade e isola parte da persistência, mas **não demonstra CI aprovado nem homologação de todos os botões**. Não houve execução de teste nesta automação.
- Repositório `apoenalore/apoenaskil`: README consultado (blob SHA `f3bbc1dd28b949d0fd92f0582614fa42218368d9`) referencia `apoena/docs/recovery/session-2026-11-02-animador-maker-prototipo.md`. O registro distingue protótipo HTML de interface de implementação efetiva de rig, exportação de spritesheets e integração com Game Creator.

## Decisões e pendências
1. Manter separados Criador Modular de Personagens (PR #13/#14) e Animador de Personagens Maker Apoena (humanoides/monstros); protótipo visual não equivale a recurso funcional integrado.
2. Exigir validação de navegador, operações de biblioteca, IndexedDB, importação, edição, botões e exportação antes de mesclar a PR #14. Não mascarar testes com skip.
3. Preservar os snapshots anteriores: `backup/pr13-gerador-modular-20261102-1906-brt` e `backup/pr14-criador-modular-20261102-2059-brt`. O presente checkpoint é documental e não cria um novo snapshot de código.
4. Backup Mestre ainda incompleto: arquivos não versionados, PDFs/imagens originais, sprites, IndexedDB, hashes e restauração testada permanecem fora da cobertura Git.

## Escopo desta execução
Criação deste relatório e atualização do índice central na branch padrão. Sem merge, sem alteração de código funcional, workflow, runner, asset ou biblioteca local. Não declarar CI verde sem prova.
