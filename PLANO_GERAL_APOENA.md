# Plano de implementação — Apoena Game Creator e jogo Apoena

**Versão:** 1.0  
**Status:** plano de arquitetura e implementação incremental  
**Princípio:** preservar a base existente, implementar em fatias testáveis e não declarar uma função pronta sem teste no jogo consumidor.

## 1. Produtos e responsabilidades

- **Apoena Game Creator:** editor de assets, spritesheets, tilesets, mapas, objetos e metadados. Exporta recursos e contratos de dados para Godot 4 e, quando aplicável, outros jogos.
- **Jogo Apoena:** runtime que executa a história, a exploração, o MOBA, a economia, os NPCs, o ecossistema e a persistência. O editor descreve dados e regras; o runtime do jogo é responsável por executá-los.

Não criar um segundo inventário nem duplicar a Fábrica Universal de Itens. Preservar os módulos e fontes históricas existentes.

## 2. Três modos

### História
O jogador acompanha a jornada original de Apoena. A sequência inicial planejada começa na cidade capital, onde estuda; segue até a Tribo da Água para encontrar os pais; inclui uma prova cujo fracasso é parte da narrativa; e abre o caminho de aventureiro, com caça, coleta de remédios, monstros e defesa da muralha.

### Exploração Livre
O jogador cria sua própria identidade e escolhe o que quer se tornar: ferreiro, aventureiro, mago, agricultor, comerciante ou uma combinação. As competências devem surgir das ações, do conhecimento e das escolhas, sem exigir que o jogador seja Apoena nem seguir a narrativa do Modo História.

### MOBA
Partidas com progressão temporária do nível 0 ao 20. A experiência da partida pode contribuir para a progressão permanente do menu, segundo uma regra de conversão a balancear. Nível temporário e progressão permanente precisam ser dados distintos.

Os modos compartilham personagens, recursos e infraestrutura quando fizer sentido, mas preservam suas regras próprias.

## 3. Progressão e consequências

Separar:
1. **Progressão do personagem:** competências, habilidades, Aurium, Constelações, equipamentos e especializações.
2. **Progressão do mundo:** casa, horta, guilda, companheiros, relações, economia, recursos e regiões.
3. **Progressão permanente do menu:** desbloqueios como laboratório, ferreiro, arena, melhorias e novas opções de fabricação.

As escolhas podem abrir ou fechar oportunidades, alterar relações e influenciar a forma como o personagem se desenvolve. Evitar classes rígidas que impeçam combinações de caminhos.

## 4. Mundo persistente e economia

NPCs importantes terão identidade, profissão, objetivos, inventário, rotinas e relações. Podem produzir, comprar, vender, viajar e aproveitar oportunidades sem a presença do jogador.

A economia deve modelar estoque, oferta, demanda, produção, consumo, preços e disponibilidade. Exemplo: uma cidade pode não comprar mais espadas naquele momento porque o mercado já foi abastecido por outro ferreiro. Consequências devem vir de regras previsíveis, não de bloqueios aleatórios.

Agar é a região inicial planejada; Pandora amplia a exploração. Ao retornar, o jogador deve encontrar mudanças persistentes e recuperáveis, respeitando o tempo de mundo definido pelo jogo.

## 5. Ecossistema

Classificar recursos em:
- **Cenário estático:** decoração sem simulação individual.
- **Recurso interativo:** árvore que fornece madeira/fruta, pedra extraível ou planta coletável; reage a ações.
- **Organismo simulado:** planta ou animal com ciclos ecológicos.

A simulação planejada inclui sementes, germinação, crescimento, água, nutrientes, luz, temperatura, estações, frutificação, coleta, dispersão, morte e decomposição. A grama pode ficar seca ou verde conforme as condições locais. Árvores podem modificar luminosidade e consumo de recursos. Animais podem procurar alimento, fugir, caçar ou transportar sementes.

O runtime deve ser autoritativo sobre os estados ecológicos; o editor armazena recursos, espécies, necessidades e metadados. Um campo de dados no Creator não significa que a mecânica já esteja executada no jogo.

## 6. Desempenho mobile

- Atualização completa apenas para entidades próximas que exigem resposta imediata.
- Simulação simplificada para regiões próximas fora da tela.
- Processamento por eventos e intervalos maiores para regiões distantes.
- Limites de entidades, filas de trabalho e orçamento de processamento por quadro.
- Não animar plantas ou animais invisíveis sem necessidade.
- Dividir o mapa em regiões/células para evitar varrer todas as entidades a cada quadro.
- Recalcular visual quando o estado ecológico muda, não a cada quadro.
- Salvar por eventos importantes e intervalos, com gravação segura, validação e recuperação do último estado válido.
- Testar em dispositivos de baixo desempenho; limites populacionais, sozinhos, não garantem fluidez.

## 7. Game Creator: assets e mapas

### Assets
Importar imagens, cortar spritesheets, remover fragmentos de quadros vizinhos, preservar transparência, validar dimensões e exportar sprites/manifestos. Personagens, animais, montarias, objetos e vegetação devem ter categorias e metadados adequados.

### Tiles e terrenos
Separar asset, tile, tileset e mapa. Tiles podem ter nome, função, grupo de conexão, colisão, altura lógica, tags e variantes de autotile. Construir biblioteca própria: grama, terra, areia, pedra, neve, água, rios, margens, caminhos, montanhas, bases retas, diagonais ascendentes/descendentes, bordas, cantos, pontes, cercas, ruínas e construções.

Autotiling deve usar regras explícitas e atlas coerentes. Não presumir que qualquer imagem importada já contém todas as 47 configurações de vizinhança. Permitir pintura manual quando não houver regra automática.

### Objetos e entidades
Cercas, ruínas, árvores grandes, edifícios e carroças podem ocupar várias células ou ser posicionados independentemente. Personagens, animais e montarias são entidades com animações, pontos de referência, colisão e regras de movimentação próprias.

### Mapas
Camadas visuais e lógicas separadas; grade, pincel, preenchimento, seleção, borracha, desfazer/refazer, objetos, alturas, colisões e navegação. Metadados do mapa distinguem História, Exploração e MOBA sem transformar os três em um único conjunto de regras.

### Godot
Exportar dados e imagens com IDs estáveis, dimensões e propriedades preservadas. Validar o contrato e testar a geração de TileSet/TileMapLayer quando apropriado. A exportação precisa ser testada no runtime; JSON válido não prova que o mapa funciona no jogo.

## 8. Ordem de implementação

1. Auditar código e contratos existentes; preservar backups e fontes.
2. Formalizar schema de tiles, mapas e validação.
3. Consolidar recorte, correção e exportação de spritesheets.
4. Evoluir o editor de mapas com catálogo de terreno e regras de conexão.
5. Construir e validar a cidade capital como primeiro mapa completo.
6. Implementar recursos interativos, coleta e inventário no runtime.
7. Implementar lojas, fabricação e economia.
8. Integrar rotinas de NPCs e persistência do mundo.
9. Evoluir o ecossistema e sua simulação escalonada.
10. Integrar Aurium, Constelações, especializações e progressão.
11. Consolidar os três modos.
12. Validar desempenho, salvamentos, compatibilidade e exportação em dispositivos reais.

## 9. Critérios de aceitação

- Projetos antigos continuam abrindo; campos novos são opcionais e têm padrões seguros.
- Catálogo de tiles e mapas passam por validação estrutural.
- Spritesheets exportados não contêm fragmentos de quadros adjacentes.
- Regras de conexão podem ser descritas e testadas; tiles sem variantes continuam editáveis manualmente.
- Mapas preservam dimensões, tiles, alturas, objetos, marcadores e catálogo após salvar/reabrir.
- Exportações têm IDs estáveis e são validadas no Godot.
- NPCs, economia e ecossistema têm testes de estado, desempenho e recuperação.
- Nenhum sistema é marcado como concluído sem teste no runtime de destino.

## 10. Escopo desta primeira fatia

A primeira implementação técnica no Game Creator cria um contrato reutilizável de terrenos, máscara de vizinhança, variantes de autotile, regras ambientais por tile, comportamento declarativo de objetos, perfis de NPC/profissão/rotina/comércio, perfis de mapa e validação de mapas/assets. O mapa inicial do editor passa a ser a Cidade Capital de Agar no perfil História, mantendo o preset de três rotas para o MOBA. Isso estabelece a base de autoria e exportação; não substitui o runtime ecológico, a economia, a IA de NPCs nem a integração final com Godot. Esses itens devem ser entregues em etapas separadas e verificadas.

## Sistema ambiental 2D — calendário, biomas e hidrologia

A arquitetura ambiental passa a separar três responsabilidades:

1. **Catálogo do tile:** define o tipo físico, os biomas compatíveis, permeabilidade, retenção, escoamento, resistência à erosão e variantes visuais de primavera, verão, outono e inverno.
2. **Editor de mapa:** permite escolher a estação visual e simular uma sequência de chuva/sol em uma grade 2D, mostrando umidade, poças e canais. A simulação de prévia não modifica as alturas originais do mapa.
3. **Runtime do jogo:** usa calendário virtual, perfis climáticos regionais, infiltração, escoamento, evaporação, neve e erosão. O Godot e o HTML têm motores ambientais próprios para a Floresta Viva.

**Decisão de arquitetura:** não migrar para 3D apenas para representar relevo e água. A altura lógica da célula controla o escoamento; a profundidade da água é uma camada separada. O custo da simulação é limitado por células e passos discretos, priorizando desempenho em celulares.

**Estado:** metadados de bioma/hidrologia e variantes sazonais, prévia ambiental no Creator e motores iniciais no HTML/Godot foram adicionados na branch feat/tempo-biomas-hidrologia. A importação automática do JSON/atlas do Creator como mapa jogável continua pendente e precisa de um teste ponta a ponta antes de ser declarada concluída.
