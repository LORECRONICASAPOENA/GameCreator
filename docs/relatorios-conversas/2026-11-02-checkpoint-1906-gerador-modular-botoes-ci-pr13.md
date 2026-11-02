# Checkpoint de conversa — Gerador de Personagens Pixel, Maker Apoena e CI da PR #13

**Data do registro:** 02/11/2026, aproximadamente 19:06 BRT.  
**Repositório:** [apoenalore/GameCreator](https://github.com/apoenalore/GameCreator).  
**Natureza:** backup documental incremental de decisões e diagnóstico técnico; **não é** transcrição integral nem backup de binários/IndexedDB.  
**Fontes:** mensagens disponíveis nesta conversa, síntese previamente feita de dois PDFs, arquivos de código consultados no GitHub autenticado e execução da CI da PR #13.  
**Preservação:** nenhuma mudança no código, nas branches de produto, nos runners, nos workflows, nos assets ou na biblioteca local.

## 1. Sequência de pedidos e decisões do autor

1. O autor compartilhou duas conversas para análise:
   - https://chatgpt.com/share/6ae9021c-5500-83e9-82e3-acaf0b220566
   - https://chatgpt.com/share/6ae90229-1540-83e9-b0bd-826877e04288
2. Para disponibilizá-las, pediu instruções de exportação para PDF no PC. Foi orientado a abrir cada conversa, carregar o histórico, usar `Ctrl+P` e escolher **Salvar como PDF**.
3. Foram fornecidos dois PDFs, identificados na conversa como **Resumo das ferramentas.pdf** (21 páginas na síntese anterior) e **Melhorar interface do Apoena.pdf** (5 páginas na síntese anterior). Os PDFs **não foram copiados** para este repositório neste checkpoint.
4. A análise anterior registrou que o **Game Creator** é o ambiente central; o **Gerador de Personagens Pixel** monta personagens a partir de peças/tiles e camadas; e o **Animador de Personagens Maker Apoena** é um editor complementar, independente dentro do Creator, para humanoides, monstros, quadrúpedes e criaturas aladas. A biblioteca central deve ser compartilhada.
5. O autor exige uma interface no estilo de editor de personagens do RPG Maker, alimentada com seus próprios tiles/spritesheets; malha ajustável, corte inteligente e borracha por quadro para eliminar pixels que invadem células adjacentes; originais preservados.
6. A sequência funcional desejada para o animador é: **peças → rig/ossos/pivôs → poses/timeline/keyframes → correção quadro a quadro → spritesheet/JSON → biblioteca/Creator/Godot**. A rotação 2.5D é evolução posterior, não função homologada.
7. O pedido explícito mais recente foi **“preciso do gerador funcionando com todos os botoes por favor”**. O requisito é operação real, não somente botões visíveis ou um protótipo de tela inicial. O novo gerador modular deve ocupar a posição principal de **Personagens** dentro do menu Pixel Art do Game Creator, mantendo o gerador clássico acessível como contingência até a validação.
8. A orientação operacional assumida foi não mesclar implementação não validada, testar cada controle e preservar a versão anterior até a substituição ser comprovada.

## 2. Código e arquitetura observados na PR #13

**PR:** [GC-CHAR-001 — integrar criador modular funcional em Pixel Art](https://github.com/apoenalore/GameCreator/pull/13).  
**Branch head:** `feat/apoena-character-creator-prototype`; **base:** `main`.  
**Head observado:** `34a0a722444448e384c91286affecf0f50217038`.  
**Estado em 02/11/2026:** **open, não draft, não merged, mergeable**, 26 arquivos alterados; atualizado em `2026-11-02T21:46:32Z`. Isto corrige o estado de *draft* que constava de checkpoints anteriores. **Não afirmar que já substituiu o gerador da main.**

Arquivos examinados:
- `pixel-art/personagens.html`: interface modular com três vistas (montagem, malha/limpeza, biblioteca), ações, timeline, preview, perfil e exportações.
- `pixel-art/personagens.js`: handlers de interação, renderização em Canvas, importação, malha, pintura, undo/redo, persistência, exportação e ponte.
- `pixel-art/personagens-core.js`: schema `apoena.character.v1`, validação de projetos, índices de quadros, manifesto e exportação `SpriteFrames` para Godot.
- `pixel-art/corte-inteligente.js`, `shared/asset-library.js`, `shared/creator-bridge.js`, `pixel-art/ponte-creator.js`, `pixel-art/modulo-integrado.js`: dependências do fluxo.
- `tests/personagens.test.cjs`, `tests/personagens-browser.html` e `.github/workflows/pixel-art.yml`: contratos e CI.

Na inspeção estática do HTML foram identificados **59 controles com `id`**, incluindo **28 botões de ação** (sem contar abas sem `id`). As ligações em JavaScript estão implementadas por handlers diretos e laços de registro. **Esse inventário não significa que os 28 botões funcionem corretamente em execução.**

### Matriz de aceitação funcional (pendente de evidência de ponta a ponta)

| Área | Ações que devem funcionar | Evidência necessária |
| --- | --- | --- |
| Importação | PNG/WebP/JPEG, peça isolada e spritesheet | carregar arquivos reais e verificar pixels/camadas |
| Montagem | selecionar, mover, reordenar, remover, visibilidade, espelhar, escala, opacidade | interação no canvas + estado correto |
| Animação | criar/excluir ação, linha, quadros, FPS, anterior/próximo, reproduzir/pausar | prévia consistente e quadros corretos |
| Malha | colunas/linhas, origem, tamanho, espaçamento, ajustar/aplicar | recorte sem invadir células vizinhas |
| Limpeza | borracha, restauração, corte inteligente com prévia, aceitar/cancelar, restaurar original | edição independente por quadro e preservação do original |
| Histórico | desfazer/refazer, inclusive após edição | regressão do estado sem perda de dados |
| Projeto | novo, salvar, abrir JSON, biblioteca, recuperar projeto | persistência/round-trip real |
| Exportação | PNG, JSON editável, Godot `.tres` | conferir dimensões, animações, transparência e importação no Godot |
| Integração | adicionar à biblioteca, gravar no Creator | verificar ponte e **salvar também o projeto principal** |

**Restrições presentes no código:** até 32 camadas e 32 ações; grade até 24×24 com máximo de 160 quadros por camada; projeto JSON até 48 MB; importação de arquivo até 18 MB e camadas de fonte até 1024×1024; spritesheet com limite de 16 milhões de pixels; exportação Godot limitada a 4 milhões de pixels. Esses limites são implementação atual, não necessariamente especificação definitiva.

## 3. Descoberta crítica: CI da PR #13 falhou

- [GitHub Actions — run 41528996973](https://github.com/apoenalore/GameCreator/actions/runs/41528996973) no head `34a0a722444448e384c91286affecf0f50217038`: **completed / failure**.
- Job `validar` (ID `125564041631`): **failure**.
- Etapa que falhou: **“Testar criador modular no navegador”**, etapa 7.
- O log mostra a exceção: `Teste funcional de personagens falhou; consulte characters-browser.html.`
- O navegador foi executado e retornou, mas a saída não continha o marcador esperado `<pre id="result">CHARACTER BROWSER OK</pre>`. **O motivo específico da falha de asserção ainda não foi extraído** do HTML de diagnóstico; não atribuir a falha a um botão específico sem ler esse artefato.
- O workflow carregou o artefato de diagnóstico `v41-ci-diagnostics` (ID `13181082175`), com retenção configurada de 3 dias: [artefato](https://github.com/apoenalore/GameCreator/actions/runs/41528996973/artifacts/13181082175).
- O job encerrou antes das demais etapas subsequentes; **não declarar o conjunto completo de testes aprovado nesse head**.

**Prioridade técnica:** baixar e ler `.ci-results/characters-browser.html` e `.ci-results/characters-browser.log` do artefato, identificar a primeira asserção que falhou, corrigir na branch da PR #13, reexecutar o workflow canônico, testar os 28 botões/59 controles por cenário e somente depois avaliar merge/substituição.

## 4. Separação entre o que existe e o que falta

**Implementado no código da branch, ainda não homologado:** montagem modular, malha, correção manual e assistida, preview de animação por quadros, JSON, biblioteca IndexedDB, PNG, Godot `.tres`, ponte para a sessão do Creator.

**Ainda não comprovado:** funcionamento de cada botão no Creator compilado; integração real após salvar/reabrir o projeto principal; ausência de regressões no gerador clássico; fidelidade visual em sprites reais; importação no runtime Godot; estabilidade em Android físico; rig e timeline do Animador Maker Apoena. Não confundir **Gerador Modular** com **Animador Maker**, que são módulos complementares.

**Persistência importante:** gravar via ponte altera a sessão V4.0; para persistência definitiva do projeto principal, o usuário ainda precisa executar **Salvar projeto editável** no Game Creator. Salvar na IndexedDB e salvar a sessão do Creator são operações distintas.

## 5. Próximas ações sequenciais, sem WIP paralelo

1. Diagnosticar a falha do teste funcional de navegador da PR #13 usando o artefato do run 41528996973.
2. Corrigir somente a causa comprovada, com teste de regressão.
3. Validar cada botão em ambiente integrado (não apenas teste estático ou arquivo isolado).
4. Testar persistência, ponte, biblioteca, spritesheets e Godot com dados reais.
5. Revisar visualmente a interface e o fluxo de substituição do gerador antigo no menu Pixel Art.
6. Preservar backup de código, branch e originais; obter evidência de CI verde antes de merge.
7. Tratar o Animador Maker Apoena como etapa independente posterior, aproveitando a biblioteca e as peças do gerador.

## 6. Limitações do backup

Este arquivo é um **resumo técnico detalhado** de material visível e verificável, não uma transcrição literal das duas conversas compartilhadas. Os PDFs, imagens de referência, tiles, sprites, anexos, dados IndexedDB e arquivos locais não foram transferidos ao GitHub. O backup de código do repositório é fornecido pelo próprio histórico Git; este registro preserva decisões, contexto e estado observado. Não declarar backup mestre completo sem cópia dos binários e teste de restauração.

**Registro anterior relacionado:** [auditoria da interface e 500 melhorias](2026-11-02-backup-interface-gamecreator-500-melhorias.md) e [índice de backups](../REGISTRO_CONVERSAS_E_BACKUPS.md).

## 7. Snapshot de código preservado neste checkpoint

Além do registro documental na `main`, foi criada a branch de backup [`backup/pr13-gerador-modular-20261102-1906-brt`](https://github.com/apoenalore/GameCreator/tree/backup/pr13-gerador-modular-20261102-1906-brt), apontando exatamente para o commit `34a0a722444448e384c91286affecf0f50217038` da PR #13. Isso preserva no GitHub uma referência estável à implementação do gerador **naquele SHA**, sem fazer merge, editar a PR ou alterar o runtime. É snapshot de código Git, **não** cópia dos dados locais, arquivos anexados ou IndexedDB.
