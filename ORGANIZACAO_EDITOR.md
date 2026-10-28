# APOENA GAME CREATOR — INTEGRAÇÃO NATIVA V4.0 + FERRAMENTAS V4.1

## Entrada única e preservação

Use `index.html` no Windows ou no navegador do dispositivo. A entrada compacta monta o Creator nativo a partir de `bundle-v4/` e injeta a biblioteca central, a ponte V4.0/V4.1 e o módulo de Natureza. Ela não usa iframe nem substitui a bancada 3D por um shell separado.

`APOENA_GAME_CREATOR_V4_0_BANCADA_INTEGRADA.html` permanece como fonte original. No Windows, `ABRIR_GAME_CREATOR.cmd` executa `integracao/build_unificado.ps1`, que compila uma entrada nativa com a área Pixel Art. O build também está disponível em Python por meio de `integracao/build_unificado.py`.

## Ferramentas disponíveis na área Pixel Art

- **Gerador nativo:** o módulo existente de personagens/objetos/mapas continua na V4.0.
- **Estúdio de spritesheets V4.1:** abre `pixel-art/estudio.html`; permite importar PNG/WebP/JPG, editar transparência, cortar por grade ou manualmente, configurar ações/direções e exportar PNG/JSON.
- **Editor de mapas 2.5D:** abre `map-editor/index.html`; suporta salvar/reabrir mapas e trabalhar com tilesets.
- **Biblioteca central:** abre `biblioteca/index.html`; consulta, exporta e restaura recursos/projetos armazenados em IndexedDB.
- **Itens, receitas e Godot:** abre `integracao/index.html`; valida e exporta o catálogo portátil.

As ferramentas Studio e Map Editor usam `shared/creator-bridge.js` quando são abertas pelo menu nativo. Spritesheets e mapas são salvos na biblioteca central e sincronizados com a sessão V4.0. A sincronização é em memória; use **Salvar projeto editável** na aplicação principal para persistir o projeto completo em JSON.

## Corte Inteligente e padronização

- **Malha ajustável:** linhas/colunas, deslocamentos, espaçamento X/Y e divisórias arrastáveis; a separação aplica a malha atual.
- **Corte Inteligente por quadro:** analisa transparência ou fundo opaco uniforme conectado à borda, mostra prévia e só altera pixels depois de confirmar.
- **Corte Inteligente em lote:** quadros incertos são preservados; há desfazer de lote com limite de memória.
- **Exportação:** mantém células padronizadas e manifesto com ação/direção. Exportar PNG/JSON não conecta sozinho as animações ao gameplay.

## Catálogo e Godot

`integracao/catalogo.js` exporta catálogo portátil e valida vínculos de itens/receitas. `integracao/godot/ApoenaCatalogo.gd` carrega catálogo, gerencia inventário, coleta, fabricação temporizada, efeitos consumíveis e sessões. O projeto de teste está em `integracao/godot/project.godot` com script `tests/test_catalogo.gd`.

O workflow executa o teste GDScript quando Godot 4 estiver instalado. Se não estiver, o log marca explicitamente o runtime como não testado; o teste Node cobre apenas o contrato estático e o formato de exportação.

## Assets existentes e limites

Javali, abelha, tronco-colmeia, Apoena, folhas/frutas/árvores, pisos e penhascos: os binários disponíveis da conversa não foram enviados automaticamente ao GitHub. O catálogo `pixel-art/catalogo_assets_agar.json` lista categorias e incorporação; importe os arquivos locais pelo Estúdio quando necessário.

Antes de declarar a V4.1 concluída, valide o fluxo no navegador, teste Android real, faça regressão visual da bancada 3D e importe os pacotes no Godot. A biblioteca do editor não substitui automaticamente o inventário do jogo nem comprova as transições de animação no runtime.

## Organização segura

- Repositório **GameCreator**: editores, biblioteca, ferramentas de exportação e documentação.
- Repositório **JOGO-APOENA-AGAR-**: gameplay, NPCs, clima e ecossistema.
- Não apagar a V3.9, V3.9.2 ou V4.0, nem mesclar a V4.1 na `main` antes de passar nos testes e revisar o diff.
- Testes principais: `tests/corte-inteligente.test.cjs`, `tests/asset-library.test.cjs`, `tests/library-backup.test.cjs`, `tests/tileset-check.test.cjs`, `tests/catalogo.test.cjs` e `tests/creator-bridge.test.cjs`.
