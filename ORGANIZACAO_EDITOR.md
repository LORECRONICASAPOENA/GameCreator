# APOENA GAME CREATOR — INTEGRAÇÃO 3D + PIXEL ART (V4.1)

## Novo ponto de entrada
Use **index.html** no navegador do celular ou no Windows. O menu lateral/superior passa a ser o menu único do Creator, não um segundo programa. A mudança preserva o editor 3D da V4.0 e os sistemas anteriores (itens, receitas, animações 3D, personagem modular, mapas). Cada módulo mantém seus arquivos por segurança e é aberto na mesma área central. O antigo index.html permanece em \`legacy/iniciador-anterior.html\`.

## Menu Pixel Art
- Personagens: preserva o gerador modular \`pixel-art/index.html\`.
- Animais, cenário e plantas, efeitos: abre \`pixel-art/estudio.html\` com a categoria selecionada.
- Recortes: importar PNG/WebP/JPG, definir grade, recortar região manual com toque/arrasto, editar células, adicionar/remover/reordenar quadros.
- Limpeza: apagar restos com pincel, restaurar pixels do quadro, remover cor por região conectada com tolerância, limpar alfa, recortar bordas vazias, desfazer.
- Prévia: ver animação e transparência antes da exportação.
- Exportações: quadro PNG, spritesheet PNG com células padronizadas e pés alinhados, JSON com ação/direção/corte/posição no atlas e projeto JSON com imagens embutidas.
- Tudo funciona localmente no navegador; não pede chave de IA nem coloca desenhos gerados automaticamente sobre o personagem do usuário.

## Relação com os assets feitos entre 27/10 e 28/10
Javali (caminhada/corrida/direções), abelha (voo), tronco-colmeia (quatro vistas), Apoena (andar/correr/ataque azul), folhas/frutas/árvores, pisos e penhascos: a biblioteca do pacote ZIP local reúne os arquivos disponíveis da conversa. **Os binários de imagem não foram enviados automaticamente ao GitHub nesta PR**. Use o botão de importação no editor para trabalhar com os PNG/WebP locais. O catálogo \`pixel-art/catalogo_assets_agar.json\` lista as categorias e o estado de incorporação.

## Importante: exportação não é instalação
O PNG e o manifesto ajudam a ligar frames no HTML ou Godot 4. Eles não corrigem sozinhos a máquina de estados do jogo e não executam integração automática. Critérios de validação para cada personagem: recorte sem fragmentos, dimensões iguais por célula, direção/ação identificadas, alinhamento dos pés e transição de animação sem deformar.

## Organização segura do GitHub
- Repositório **GameCreator**: só ferramentas, editores, biblioteca e documentação do editor.
- Repositório **JOGO-APOENA-AGAR-**: gameplay, NPCs, clima e ecossistema; não copiar o editor inteiro para dentro do jogo.
- Manter esta mudança em branch/PR para revisão, sem apagar versões antigas nem mesclar automaticamente.
- Não duplicar módulos Pixel Art: \`pixel-art/index.html\` continua sendo o gerador modular, e \`pixel-art/estudio.html\` é o editor de imagens/sprites do mesmo programa.

## Testes
- Sintaxe de \`pixel-art/estudio.js\` com \`node --check\`.
- Abrir \`index.html\` em tela mobile e acessar o menu Pixel Art; verificar módulos.
- Importar sprite com 4 quadros, separar grade, remover fundo por cor, testar desfazer e exportar PNG transparente.
- Exportar JSON e conferir posições do atlas.
- Testar lançamento dos módulos antigos e da bancada 3D em Windows/Android antes de mesclar.
