# Editor de Mapas Pixel Art 2.5D — Apoena GameCreator

## Onde abrir

No iniciador `index.html` do GameCreator, toque em **Abrir Editor de Mapas 2.5D**. Também é possível abrir diretamente `map-editor/index.html` depois de extrair o ZIP completo do repositório. Funciona sem internet, sem login e sem servidor em Chrome/Edge/Android, usando HTML Canvas.

## Ferramentas incluídas

- Novo mapa vazio de 16×16 a 160×160 células e preset MOBA 80×80 com três rotas, rio, marcadores de duas bases e 18 posições de torres.
- Pintar grama, pedra, água e terra. O caminho de terra tem união visual automática entre células vizinhas (modo procedural simples de 4 lados, **não** um autotile de 47 peças completo).
- Pincel de 1, 3 ou 5 blocos, borracha, preenchimento, desfazer e refazer (até 30 alterações), zoom, câmera arrastável e minimapa clicável.
- **Importação inteligente de grade:** defina colunas e linhas do PNG. Por exemplo, uma folha **1536×1536** com **4×4** imagens equivale a células-fonte de **384×384**, que são redimensionadas para 32×32 na prévia; o editor não corta 32×32 diretamente da imagem original.\n- **Caminho inteligente:** ao importar uma folha 4×4 como o Pack 01, usa as três primeiras imagens como gramados e a quarta como terra; o caminho desenhado por células conecta automaticamente os contornos aos vizinhos. Este é um contorno procedural e ainda **não** a seleção perfeita de todos os autotiles desenhados em cada célula.\n- **Alturas visuais 2.5D:** botões **Elevar terreno** e **Rebaixar terreno** (níveis 0–4); desenha paredões rochosos automáticos nas bordas sul quando um tile está mais alto que o vizinho, com alternância **Mostrar relevo 2.5D**. A altura ainda é visual, sem física, rampas nem colisões.\n- Importar PNG/WebP transparente de objetos (árvore, rocha, torre e montanha) para colocar, reposicionar, redimensionar novos objetos e apagar.
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
- Uma imagem gerada por IA com 16 blocos não ganha autotiling completo só por ser importada. A união automática atual usa as imagens-base de grama e terra mais uma máscara procedural para as curvas. As demais células do atlas podem ser pintadas individualmente. Um autotile exato como o RPG Maker exige um conjunto coerente de peças e mapeamento de 47 configurações de vizinhança ou um Terrain Set próprio no Godot.\n- Redimensionar uma imagem 384×384 para 32×32 evita cortes errados, mas **não garante qualidade de pixel art**: pode reduzir detalhes. Se desejar fidelidade, produza tiles nativos 32×32 ou 64×64, ou faça uma conversão supervisionada.
- O editor não executa batalha, colisão, navegação por altura, água com física, masmorra, multiplayer nem simulação do jogo.
- Projetos com muitos PNGs podem ultrapassar armazenamento local; salve arquivos JSON manualmente como backup. Para melhores resultados no celular, use PNGs de poucos KB e mapas pequenos durante os testes.

## Repositórios separados

O GameCreator é uma ferramenta independente, localizado em `apoenalore/GameCreator`. O protótipo HTML jogável fica em `apoenalore/Apoena-pixel-art-html`, e o projeto Godot 3D permanece em `apoenalore/JOGO-APOENA-AGAR-`. Nenhum desses outros repositórios é modificado pelo editor.

## Catálogo de terrenos e regras (implementação inicial)

O editor integrado agora possui um formulário **Regras do tile selecionado**. Para o terreno básico ou tile selecionado do atlas, é possível registrar:

- nome e função (terreno, água, encosta, decoração, construção, recurso ou entidade);
- grupo de conexão usado pelo autotile;
- colisão declarada (permitida, bloqueada, condicional ou nenhuma);
- altura lógica e tags;
- variantes de autotile em JSON, associando uma máscara de vizinhança ao índice do tile na folha.

A máscara utiliza 8 bits: N=1, NE=2, E=4, SE=8, S=16, SW=32, W=64, NW=128. Diagonais são desconsideradas se os dois lados cardinais correspondentes não estiverem conectados. Isso é uma convenção do Apoena Creator; o atlas precisa ter suas variantes mapeadas corretamente pelo autor.

O perfil do mapa agora pode ser marcado como **História**, **Exploração Livre** ou **MOBA**. Essa seleção é metadado de organização/exportação; não muda sozinha as regras do jogo.

### Formato e compatibilidade

O JSON mantém schema apoena.map2d.v1 para que projetos antigos continuem sendo reconhecidos, e acrescenta formatVersion 2, terrainRulesVersion, mapType e terrainCatalog. Projetos v1 sem catálogo recebem os padrões básicos quando abertos. O botão **Validar mapa** verifica dimensões, quantidade de tiles, alturas e catálogo antes da exportação/abertura.

As propriedades de colisão, altura, conexão e tipo são dados exportados. Elas **não implementam sozinhas física, navegação ou gameplay no Godot**; o runtime do jogo precisa consumir essas propriedades.

### Uma única implementação do editor

A página map-editor/index.html agora carrega terrain-system.js e modulo-integrado.js, em vez de manter uma segunda cópia independente da interface. Isso reduz a chance de o editor standalone e o editor integrado divergirem. O build unificado carrega o sistema de terreno antes do módulo de mapas.

