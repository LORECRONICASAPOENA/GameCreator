# Apoena Game Creator — V4.1 em desenvolvimento

## Entrada e preservação da V4.0

- Repositório oficial: `apoenalore/GameCreator`.
- Branch de trabalho: `feature/estudio-unificado-pixelart-v41`.
- A fonte original `APOENA_GAME_CREATOR_V4_0_BANCADA_INTEGRADA.html`, o editor nativo, a bancada 3D, os módulos de Natureza/Objetos e o editor nativo de mapas permanecem preservados.
- `index.html` apresenta a navegação do estúdio. A área Creator 3D abre a fonte V4.0 preservada; as ferramentas que usam a biblioteca central se comunicam com o shell pelo protocolo `apoena.gamecreator.library.v1` via `postMessage`.
- `ABRIR_GAME_CREATOR.cmd` abre o shell V4.1. Os scripts `integracao/build_unificado.py` e `.ps1` pertencem ao fluxo de publicação nativa V4.0 e podem substituir `index.html`; não os execute para abrir o shell V4.1 sem antes atualizar esse fluxo.

## Ferramentas V4.1 implementadas nesta branch

- **Estúdio Pixel Art:** importação PNG/WebP/JPG, recorte livre e por grade, divisórias ajustáveis, transparência, borracha, remoção de fundo por região conectada, prévia conservadora do Corte Inteligente e desfazer de limpeza em lote.
- **Spritesheets:** quadros padronizados, âncora inferior, prévia animada, ações e direções configuráveis por quadro, exportação PNG/JSON e importação de projetos JSON editáveis.
- **Biblioteca central:** imagens editadas e originais, metadados, categorias, etiquetas, atualização sem duplicação e projetos em IndexedDB. Os módulos compatíveis usam `shared/asset-library.js`.
- **Mapas 2.5D:** o editor permite importar e reutilizar tilesets, salvar projetos na biblioteca central e reabrir mapas salvos.
- **Projetos de Pixel Art:** podem ser exportados em JSON editável e salvos/reabertos pela biblioteca. O projeto do Creator continua separado do jogo Apoena Agar.

## Testes e limites conhecidos

- `tests/corte-inteligente.test.cjs` cobre o algoritmo de limpeza, transparência, malha, proteções e contratos de integração.
- `tests/asset-library.test.cjs` testa operações da biblioteca com IndexedDB simulado por `fake-indexeddb`; o workflow instala essa dependência de teste.
- Os testes de sintaxe e de contrato executados nesta rodada passaram no runtime JavaScript disponível.
- A execução do GitHub Actions ainda não foi confirmada nesta sessão. Também faltam testes visuais ponta a ponta no navegador/Android, regressão manual da bancada 3D e importação dos pacotes exportados no Godot.
- A biblioteca central não substitui automaticamente a persistência interna da V4.0 nem conecta, sozinha, os dados visuais ao runtime do jogo. Essas integrações devem ser verificadas antes de declarar a V4.1 concluída.

## Arquivos principais

- `index.html`: navegação do estúdio V4.1.
- `pixel-art/estudio.html` e `pixel-art/estudio.js`: importação, edição e exportação de sprites.
- `pixel-art/corte-inteligente.js`: análise conservadora do fundo e das sobras.
- `shared/asset-library.js`: biblioteca de assets e projetos.
- `biblioteca/index.html`: consulta, exportação e exclusão de assets e projetos.
- `map-editor/index.html`: edição de mapas, tilesets e projetos.
- `APOENA_GAME_CREATOR_V4_0_BANCADA_INTEGRADA.html`: fonte original preservada.
