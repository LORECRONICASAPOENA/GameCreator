# Apoena Game Creator

Editor visual do universo **Apoena Agar**, separado do repositório do jogo e da Lore Engine.

## Situação da publicação — 28/10/2026

- **index.html** — iniciador HTML **provisório**, com catálogo básico offline de poções, busca, edição e importação/exportação JSON.
- **assets/pocoes-01.js** até **assets/pocoes-09.js** — dados e imagens de **36 das 52 poções** do arquivo original.
- **Editor original completo v3.9** — restaurado em `legacy/v3_9_parts/` (23 partes) com `legacy/abrir-editor-v3.9.html`, que reúne o HTML completo e permite baixá-lo em arquivo único. A cópia é a **v3.9**, não a v3.9.2 nem a v4.0.
- **Exportação para Godot 4** — o iniciador provisório não implementa nem valida a integração com o jogo.

O código de `APOENA_GAME_CREATOR_OFFLINE_v3_9_EDITOR_VISUAL_REORGANIZADO.html` foi recuperado da biblioteca do projeto e publicado em partes para contornar falha de envio de 16 MB em uma só requisição. As 16 poções restantes do catálogo provisório e os arquivos principais das versões v3.9.2/v4.0 ainda não foram recuperados para o GitHub.

## Como abrir o iniciador HTML no Windows / Android

1. Pelo GitHub, use **Code → Download ZIP** e extraia todo o pacote. A extração deve manter a pasta `assets/` junto do `index.html`.
2. Abra **index.html** no navegador. Não precisa de servidor nem Runner para o catálogo básico.
3. Faça alterações e clique **Baixar catálogo editado (.json)** para guardá-las. É possível usar **Importar catálogo (.json)** depois.

**Importante:** os arquivos de `assets/` são necessários para mostrar os ícones das poções. Para abrir o editor original completo, mantenha também a pasta `legacy/v3_9_parts/` e abra o botão **Abrir editor v3.9 completo** no `index.html`. O resgate não é um executável Godot.

## Objetivo da versão completa

A v3.9 recuperada contém os editores existentes no HTML original: layouts, personagens, itens, receitas e biblioteca, além de exportações de referência para Godot 4. **Disponibilidade do código não equivale a teste funcional completo**; ainda faltam validações em Android, PC e Godot real, e recuperação das versões posteriores.

**Repositório de acesso privado.** Não incluir senhas, tokens ou credenciais nos arquivos.

## Gerador Pixel Art (novo)

O iniciador `index.html` agora oferece o botão **Abrir Gerador Pixel Art**, que abre `pixel-art/index.html`. O editor funciona offline em Android/PC, permite montar personagens por camadas (corpo, cabelo, roupas, armas e acessórios), testar movimento em uma pequena arena HTML e exportar spritesheets PNG, JSON e ZIP com `SpriteFrames` para Godot 4. Consulte [o guia do gerador](pixel-art/README.md).

**Limitação:** o teste HTML é um protótipo de movimento; não é o jogo MOBA completo nem substitui a integração no projeto Godot. O editor visual GameCreator v3.9 foi recuperado em `legacy/`; ele permanece independente do novo módulo Pixel Art, e ainda precisamos validar os fluxos entre os módulos.

## Editor de Mapas 2.5D (novo)

O iniciador \`index.html\` oferece agora **Abrir Editor de Mapas 2.5D** em \`map-editor/index.html\` (HTML puro, offline). Nele é possível pintar grama, água, pedras e caminhos com união automática básica; selecionar peças de um tileset PNG 32×32; importar imagens transparentes de árvores, montanhas e torres; posicionar e mover objetos no mapa; usar preset MOBA com três rotas, bases e 18 posições de torres; exportar PNG e salvar/importar projeto JSON.

**Ainda não é uma edição automática da partida MOBA nem exportação pronta de TileMapLayer para Godot.** O visualizador é independente, preservando o projeto 3D, o gerador de personagens e o protótipo de jogo HTML. Veja [instruções do editor](map-editor/README.md).

## Resgate do editor original — 28/10/2026

1. Baixe o repositório por **Code → Download ZIP** e **extraia tudo** em uma pasta.
2. Abra `index.html` e selecione **Abrir editor v3.9 completo**.
3. Na tela do resgate, escolha **Abrir o editor completo**. Se preferir arquivo independente, selecione **Baixar HTML único (.html)**.
4. Preserve cópias dos projetos JSON anteriores; teste exportações no Godot antes de colocá-las no jogo.

O código HTML foi dividido em **23 arquivos `parte_000.js` a `parte_022.js`** para publicação; não são 23 versões diferentes. O iniciador valida quantidade, tamanho de cada parte e marcadores de início/fim antes de reconstruir o documento. A fonte possivelmente perdeu apenas a marca de BOM UTF-8 na leitura, que é reposta na exportação do HTML único. Não houve teste ponta a ponta no Android nem no Godot nesta recuperação. Não substituir nem remover a fonte original da Biblioteca.
