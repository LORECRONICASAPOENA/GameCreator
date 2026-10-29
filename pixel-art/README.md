# Gerador de Personagens Pixel Art — Apoena GameCreator

## Abrir no celular (Android) ou computador

1. Abra o repositório **GameCreator**, escolha **Code → Download ZIP** e extraia os arquivos.
2. Abra `index.html` na pasta principal e toque em **Abrir Gerador Pixel Art**. Alternativamente, abra diretamente `pixel-art/index.html`.
3. Escolha corpo, cabelo, roupa, cores, tribo e equipamento.
4. Na seção **Testar no celular**, use os botões ▲ ◀ ▶ ▼ para mover o personagem numa pequena arena HTML.
5. Para guardar os arquivos, escolha **Baixar pacote Godot (.zip)** ou baixe o PNG/JSON individualmente.

O editor funciona **100% local/offline**, sem serviços externos, sem chave de IA e sem instalar Godot no celular. Ele usa Canvas 2D + JavaScript e gera gráficos pixel art com formas próprias, não converte imagens por IA.

## O que esta primeira versão entrega

- Personagens modulares 32×48 px, 4 direções (sul, oeste, leste, norte) e 4 quadros por direção (16 quadros ao todo).
- Corpo juvenil, adulto e forte; 5 cabelos; 5 tipos de roupa; calça curta/comprida; capa e equipamentos do universo Apoena.
- Presets de Apoena e das quatro tribos; edição de cores; renderização em camadas alinhadas.
- **Spritesheet 128×192** com fundo transparente.
- Camadas PNG individuais, para combinar e aperfeiçoar no futuro.
- Salvar/importar ficha `apoena-pixel-v1` como JSON, com formato versionado.
- Prévia animada e pequena arena local com teclado e controles de toque.
- ZIP com `spritesheet.png`, `camadas/*.png`, `personagem.json`, `frames.tres` e instruções.

## Importar para Godot 4

1. Baixe e extraia o ZIP exportado.
2. Coloque a pasta `personagem/` dentro do projeto Godot 4, na raiz `res://`.
3. Na sua cena, crie um nó `AnimatedSprite2D`.
4. Na propriedade `Sprite Frames`, carregue `res://personagem/frames.tres`.
5. Use `play("sul")`, `play("oeste")`, `play("leste")` ou `play("norte")`, conforme o movimento.
6. No filtro da textura, use **Nearest / Mais próximo** para não borrar os pixels.

O arquivo `frames.tres` contém quatro animações e 16 texturas AtlasTexture referenciando as células do PNG. O nome fixo da pasta `personagem` torna o recurso portátil. Ao adicionar outro personagem, coloque-o em outra pasta e ajuste a referência de textura do `.tres`, para não sobrescrever o anterior.

## Limites importantes

- **O teste HTML é uma arena de movimentação**, não uma partida MOBA com torres funcionais, IA, rede, loja ou combate.
- **O editor produz assets 2D** e não controla personagens do jogo Godot sozinho. É preciso integrar os sprites ao controlador Godot e às animações.
- Corpo/roupas/cabelos ainda são base pixel art procedural. Novas poses, animações de ataque, rig e refinamento de arte podem ser adicionados em etapas.
- Alguns navegadores bloqueiam múltiplos downloads; use **Baixar pacote Godot (.zip)** para obter tudo num único arquivo.
- O projeto do GameCreator é separado do código principal do jogo `JOGO-APOENA-AGAR-`.

## Arquivos

- `../index.html`: tela inicial do GameCreator com atalho ao gerador.
- `pixel-art/index.html`: editor, previews, exportação e teste de arena sem dependências externas.

## Vínculo com itens da Fábrica de Itens — 28/10/2026

O gerador aceita o catálogo `apoena.gamecreator.catalogo.v1` exportado pela página `../integracao/index.html`. Clique em **Importar catálogo de itens**, escolha um item e salve o personagem. O campo `character.linkedItemId` no `personagem.json` e no ZIP preserva o vínculo ao mesmo ID usado nas receitas e no inventário do Game Creator. `linked_catalog_game_id` identifica o jogo de origem. Não há alteração visual automática da arma, ligação física ao Godot ou equipagem de verdade: essas operações precisam de scripts e sprites de jogo.

## Natureza no mesmo Editor Pixel Art

A aba **Pixel Art → Natureza / Plantas** registra espécies, necessidades do solo, germinação, reprodução, vida, decomposição e 14 PNGs separados (semente, muda, planta adulta, fruto, tronco, pó). Permite importar PNG, verificar transparência, baixar PNG com nomes estáveis e exportar ficha JSON `apoena.natureza.asset.v1`. Não é um segundo gerador e não altera a biblioteca de itens nem a ferramenta 3D. Consulte `pixel-art/NATUREZA_CONTRATO.md`.

**Importante:** o GameCreator não gera automaticamente as ilustrações; a pessoa produz as imagens e as cadastra. Para abrir como aba do editor principal é preciso recompilar a versão v4.0 com `integracao/build_unificado.py` ou `.ps1`; abrir `pixel-art/index.html` oferece a aba local imediatamente.

## Estúdio Pixel Art V4.1

O menu **Pixel Art** do shell V4.1 abre `estudio.html`. Esse módulo trabalha com PNG/WebP/JPG, recortes manuais e por grade, detecção automática de componentes separados em imagens com espaçamento variável, limpeza de transparência, revisão de limites antes de aplicar e exportação de spritesheets.

- **Projeto editável:** use **Projeto JSON** para exportar os quadros e seus metadados; **Projeto editável JSON** permite reabrir esse pacote.
- **Detecção:** os contornos verdes são uma prévia; clicar em um contorno carrega X/Y/largura/altura para correção manual. A detecção não altera a imagem original, não separa objetos fisicamente conectados e pede revisão quando os limites tocam as bordas ou o fundo ocupa quase toda a folha.
- **Ações/direções:** podem ser definidas por quadro, incluindo ações personalizadas como andar, correr, atacar, beber, crescer, florescer ou frutificar. A prévia anima os quadros da ação/direção selecionadas. Os campos Habitat/Comportamento e o objeto JSON específico são preservados no projeto e nos metadados exportados; use-os para propriedades próprias de animais, objetos ou cenários.
- **Biblioteca central:** **Salvar projeto editável** guarda o projeto; **Abrir projeto salvo** recupera os quadros e seus metadados. **Salvar na biblioteca central** guarda a imagem final e preserva o original quando disponível.
- **Mapas e tilesets:** o editor 2.5D possui controles para salvar/reabrir mapas e reutilizar tilesets pela mesma biblioteca. **Verificar encaixes** sinaliza bordas transparentes/semitransparentes e grades cujas dimensões não se dividem uniformemente; é um diagnóstico, não uma correção automática.

Os arquivos editáveis podem ficar grandes porque cada quadro é incorporado como data URL no JSON. O importador limita o arquivo a 18 MB e o conjunto descompactado a 32 MB; para projetos maiores, exporte em partes.

A presença desses controles não substitui os testes visuais em navegador/Android nem a importação de recursos exportados no Godot. Consulte o README da raiz para o status de validação da branch.
