# Matriz de navegação e dependências — Apoena Game Creator

**Data da inspeção:** 02/11/2026 (BRT)  
**Branch de trabalho:** `maintenance/audit-cleanup-20261102` — PR #12 (rascunho)  
**Base inspecionada:** `main` em `1b95d036c31dfb4ca9f9ce6859510be2c9f7e8cd`  
**Estado:** inventário estático parcial; não equivale a teste de execução em navegador/Android.

## Objetivo

Apoiar a decisão do autor de usar **uma plataforma única** com Estúdio 3D, Estúdio Pixel Art 2D e Editor de Mapas 2.5D, compartilhando biblioteca e projeto. Identificar caminhos inexistentes sem excluir dados ou módulos ainda necessários.

## 1. Rotas válidas observadas

| Origem | Destino | Evidência estática | Decisão |
| --- | --- | --- | --- |
| `ORGANIZACAO_EDITOR.html` | `index.html` | `href="index.html"`; arquivo presente | Manter |
| `ORGANIZACAO_EDITOR.html` | `pixel-art/estudio.html` | Link e arquivo presentes | Integrar à navegação única |
| `ORGANIZACAO_EDITOR.html` | `map-editor/index.html` | Link e arquivo presentes | Integrar à navegação única |
| `ORGANIZACAO_EDITOR.html` | `biblioteca/index.html` | Link e arquivo presentes | Preservar biblioteca central |
| `ORGANIZACAO_EDITOR.html` | `integracao/index.html` | Link e arquivo presentes | Preservar catálogo/exportação |
| `pixel-art/index.html` | `../index.html`, `natureza.js` | Ambos existem | Preservar |
| `pixel-art/estudio.html` | `../shared/asset-library.js`, `../shared/creator-bridge.js`, `corte-inteligente.js`, `estudio.js` | Todos existem | Preservar |
| `map-editor/index.html` | `../index.html`, `../shared/asset-library.js`, `../shared/creator-bridge.js`, `../shared/tileset-check.js` | Todos existem | Preservar |
| `biblioteca/index.html` | `../index.html`, `../shared/asset-library.js`, `../shared/library-backup.js` | Todos existem | Preservar |
| `integracao/index.html` | `../legacy/abrir-editor-v3.9.html`, `../index.html`, `../pixel-art/index.html`, `../map-editor/index.html`, `catalogo.js` | Todos existem | Preservar |
| `legacy/abrir-editor-v3.9.html` | `../index.html`, `v3_9_parts/parte_000.js` a `parte_022.js` | Todos existem | Preservar como histórico funcional |

**Observação:** existência do arquivo não comprova que uma página abre ou que o módulo funciona. O `index.html` grande e o bundle V4 ainda precisam de inspeção específica de navegação e regressão.

## 2. Caminhos quebrados comprovados no iniciador legado

O arquivo `legacy/iniciador-anterior.html` está dentro de `legacy/`, mas ainda utiliza links relativos escritos como se estivesse na raiz do repositório:

| Referência atual | Caminho efetivamente procurado | Destino existente / correção candidata |
| --- | --- | --- |
| `legacy/abrir-editor-v3.9.html` (2 links) | `legacy/legacy/abrir-editor-v3.9.html` (ausente) | `abrir-editor-v3.9.html` |
| `integracao/index.html` | `legacy/integracao/index.html` (ausente) | `../integracao/index.html` |
| `pixel-art/index.html` | `legacy/pixel-art/index.html` (ausente) | `../pixel-art/index.html` |
| `map-editor/index.html` | `legacy/map-editor/index.html` (ausente) | `../map-editor/index.html` |

**Resultado:** são cinco links HTML quebrados, envolvendo quatro destinos distintos. Não remover o iniciador sem antes decidir se seu catálogo será migrado; uma correção pontual de `href` é possível.

### Nove fontes de poções inexistentes

O mesmo iniciador carrega `assets/pocoes-01.js` até `assets/pocoes-09.js`. Como a página está em `legacy/`, o navegador procura `legacy/assets/pocoes-01.js` ... `pocoes-09.js`, **todos ausentes na árvore atual**. Também não existe `assets/` na raiz da `main` inspecionada.

O código monta a lista a partir de `window.__APOENA_POTIONS || []`. Sem essas fontes, a lista inicial fica vazia, embora a interface exiba o texto fixo `/ 52 oficiais`. A importação de JSON atual mapeia os itens recebidos sobre `originals`; quando `originals` está vazio, ela também não consegue povoar a lista. Logo, o catálogo não deve ser anunciado como operacional com 52 itens na versão atual.

**Decisão:** não criar poções fictícias, não apagar o código nem afirmar que as 52 imagens foram recuperadas. Localizar os arquivos reais no histórico/backup antes de migrar; se indisponíveis, tratar o catálogo como recuperação pendente e oferecer importação explícita em futura correção testada.

## 3. Integração existente, mas ainda incompleta

- `pixel-art/estudio.js` chama `ApoenaCreatorBridge.request('saveAsset', ...)` quando há janela de origem e recurso pequeno o bastante. `map-editor/index.html` chama `ApoenaCreatorBridge.request('saveMap', ...)` em situação semelhante. Isso indica integração assistida com o Creator, **não prova** uma sessão/projeto único persistido automaticamente.
- `biblioteca/index.html` usa `ApoenaLibrary.listAssets`, `listProjects` e permite abrir projeto salvo no mapa por `../map-editor/index.html?projeto=<id>`. O editor de mapas já pode consumir projetos da biblioteca; aproveitar esse fluxo.
- `shared/creator-bridge.js` usa `postMessage(..., '*')` e aceita origem opaca `null` em algumas condições. A segurança de origem/fonte e a identidade da sessão devem ser revisadas antes de ampliar a integração ou aceitar conteúdo externo. **Não alterar a ponte sem testes de compatibilidade local/offline.**
- Os scripts de build PowerShell/Python inserem caminhos `shared/`, `map-editor/` e `pixel-art/` relativos ao HTML gerado na **raiz**. Não classificá-los como links quebrados por resolver incorretamente a partir da pasta `integracao/`.

## 4. O que falta mapear antes de remover arquivos

1. Extrair a navegação real de `index.html` (~16,3 MB) e da bancada 3D original (~16,3 MB), incluindo links criados dinamicamente.
2. Comparar conteúdo e dependências das versões V3.9.2, V4.0, `index.html` e `bundle-v4/` sem confiar apenas no tamanho.
3. Localizar as fontes de poções ausentes em backups históricos, se existirem.
4. Fazer teste de abertura offline, importação, salvamento, restauração e navegação no Android/PC.
5. Definir migração de IDs/formatos e contrato compartilhado para assets 3D, sprites 2D e objetos do mapa 2.5D.

## 5. Próxima alteração de código recomendada

**Primeiro lote mínimo:** corrigir os cinco `href` quebrados do iniciador legado, sem modificar scripts de build, bundle ou fonte 3D. Tratar as nove fontes de poções ausentes como bloqueio de conteúdo, não como autorização para inventar dados. Incluir teste estático de resolução de links locais para prevenir regressões. Só aplicar após checar cobertura do CI e garantir que a tarefa única (WIP = 1) permaneça em andamento.

**Estado desta rodada:** inspeção e documentação. Nenhum arquivo funcional foi excluído ou modificado. A PR #12 continua em rascunho.
