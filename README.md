# Apoena Game Creator

Editor visual do universo **Apoena Agar**, separado do repositório do jogo e da Lore Engine.

## Situação da publicação — 25/10/2026

- **index.html** — iniciador HTML **provisório**, com catálogo básico offline de poções, busca, edição e importação/exportação JSON.
- **assets/pocoes-01.js** até **assets/pocoes-09.js** — dados e imagens de **36 das 52 poções** do arquivo original.
- **Editor completo v3.9** — **ainda não publicado** neste repositório. Não usar o iniciador provisório como substituto do programa completo.
- **Exportação para Godot 4** — o iniciador provisório não implementa nem valida a integração com o jogo.

O arquivo-fonte original, `APOENA_GAME_CREATOR_OFFLINE_v3_9_EDITOR_VISUAL_REORGANIZADO.html`, está preservado na biblioteca do projeto, mas houve falha de leitura durante a tentativa de publicá-lo. A edição completa e as 16 poções restantes aguardam recuperação da fonte.

## Como abrir o iniciador HTML no Windows / Android

1. Pelo GitHub, use **Code → Download ZIP** e extraia todo o pacote. A extração deve manter a pasta `assets/` junto do `index.html`.
2. Abra **index.html** no navegador. Não precisa de servidor nem Runner para o catálogo básico.
3. Faça alterações e clique **Baixar catálogo editado (.json)** para guardá-las. É possível usar **Importar catálogo (.json)** depois.

**Importante:** arquivos separados dentro de `assets/` são necessários para mostrar os ícones das poções. Abrir somente o `index.html` sem a pasta `assets/` não carrega esses dados.

## Objetivo da versão completa

A edição completa incluirá as ferramentas já existentes no HTML original: editor de layouts, personagens, itens e receitas, biblioteca e exportação de referência para Godot 4. A ativação dos sistemas dentro do jogo depende de integração e testes específicos.

**Repositório de acesso privado.** Não incluir senhas, tokens ou credenciais nos arquivos.

## Gerador Pixel Art (novo)

O iniciador `index.html` agora oferece o botão **Abrir Gerador Pixel Art**, que abre `pixel-art/index.html`. O editor funciona offline em Android/PC, permite montar personagens por camadas (corpo, cabelo, roupas, armas e acessórios), testar movimento em uma pequena arena HTML e exportar spritesheets PNG, JSON e ZIP com `SpriteFrames` para Godot 4. Consulte [o guia do gerador](pixel-art/README.md).

**Limitação:** o teste HTML é um protótipo de movimento; não é o jogo MOBA completo nem substitui a integração no projeto Godot. O editor visual completo GameCreator v3.9 continua pendente de recuperação e é independente do novo módulo Pixel Art.

## Editor de Mapas 2.5D (novo)

O iniciador \`index.html\` oferece agora **Abrir Editor de Mapas 2.5D** em \`map-editor/index.html\` (HTML puro, offline). Nele é possível pintar grama, água, pedras e caminhos com união automática básica; selecionar peças de um tileset PNG 32×32; importar imagens transparentes de árvores, montanhas e torres; posicionar e mover objetos no mapa; usar preset MOBA com três rotas, bases e 18 posições de torres; exportar PNG e salvar/importar projeto JSON.

**Ainda não é uma edição automática da partida MOBA nem exportação pronta de TileMapLayer para Godot.** O visualizador é independente, preservando o projeto 3D, o gerador de personagens e o protótipo de jogo HTML. Veja [instruções do editor](map-editor/README.md).
