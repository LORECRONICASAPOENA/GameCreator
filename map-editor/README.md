# Editor de Mapas Pixel Art 2.5D — Apoena GameCreator

## Onde abrir

No iniciador `index.html` do GameCreator, toque em **Abrir Editor de Mapas 2.5D**. Também é possível abrir diretamente `map-editor/index.html` depois de extrair o ZIP completo do repositório. Funciona sem internet, sem login e sem servidor em Chrome/Edge/Android, usando HTML Canvas.

## Ferramentas incluídas

- Novo mapa vazio de 16×16 a 160×160 células e preset MOBA 80×80 com três rotas, rio, marcadores de duas bases e 18 posições de torres.
- Pintar grama, pedra, água e terra. O caminho de terra tem união visual automática entre células vizinhas (modo procedural simples de 4 lados, **não** um autotile de 47 peças completo).
- Pincel de 1, 3 ou 5 blocos, borracha, preenchimento, desfazer e refazer (até 30 alterações), zoom, câmera arrastável e minimapa clicável.
- Importar PNG ou WebP de tileset, selecionar célula de 32×32 e pintá-la no mapa. Importação de PNG transparente de objetos (árvore, rocha, torre e montanha) para colocar, reposicionar, redimensionar novos objetos e apagar.
- Camada de objetos desenhada por profundidade (posição Y), com sombra simples para prévia 2.5D. Marcadores de projeto para bases, torres e cavernas.
- Salvar projeto completo `.json` (com imagens em base64), abrir o mesmo JSON, exportar prévia `.png` e rascunho local no navegador quando couber no armazenamento.

## Exemplo rápido

1. Toque em **Criar mapa com 3 rotas**.
2. Selecione **Caminho automático** e arraste o dedo sobre o mapa para editar uma rota.
3. Use **Importar tileset PNG** e toque num quadrado da folha; clique **Usar tile selecionado** e pinte um trecho.
4. Use **Importar árvores, rochas, torres** para enviar PNGs com transparência e depois selecione as miniaturas.
5. Coloque os elementos tocando no mapa. Use **Mover objeto** e arraste pelo pé do objeto para ajustar a posição.
6. Clique **Salvar projeto JSON** para não perder o trabalho e **Exportar mapa PNG** para visualizar o resultado.

## Limitações honestas

- Este editor cria e organiza o mapa visual. **Não** integra as alterações automaticamente ao jogo MOBA HTML nem cria um TileSet/TileMapLayer Godot funcional.
- Arquivos PNG do usuário precisam ser importados. O terreno provisório é desenhado por código; não representa a arte final e não é gerado por IA.
- Uma imagem gerada por IA com 16 blocos não ganha autotiling completo só por ser importada. No modo Atlas, os tiles são pintados manualmente. O caminho procedural une as células, mas um tileset automático profissional exigirá regras de vizinhança e atlas adequado (por exemplo, bitmask de 47 variantes ou terreno configurado no Godot).
- O editor não executa batalha, colisão, navegação por altura, água com física, masmorra, multiplayer nem simulação do jogo.
- Projetos com muitos PNGs podem ultrapassar armazenamento local; salve arquivos JSON manualmente como backup. Para melhores resultados no celular, use PNGs de poucos KB e mapas pequenos durante os testes.

## Repositórios separados

O GameCreator é uma ferramenta independente, localizado em `apoenalore/GameCreator`. O protótipo HTML jogável fica em `apoenalore/Apoena-pixel-art-html`, e o projeto Godot 3D permanece em `apoenalore/JOGO-APOENA-AGAR-`. Nenhum desses outros repositórios é modificado pelo editor.
