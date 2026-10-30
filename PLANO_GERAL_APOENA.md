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


## 11. Lista de execução e preservação — 30/10/2026

### Concluído nesta rodada (código e regressões adicionados)
- O catálogo do Creator normaliza tags de bioma com acentos e espaços, preservando termos como `desertico` e `mata_atlantica`.
- O parâmetro `runoff` passa a controlar o volume de água transferido entre células; a água permanente recebe coeficiente alto para continuar escoando.
- Testes de regressão comparam escoamento baixo e alto, evitando que o campo hidrológico fique apenas armazenado no JSON.
- A documentação do editor corrige quebras de linha que eram exibidas literalmente.
- A suíte de integração automática deixa de duplicar a validação já executada pelo workflow principal `pixel-art.yml`; a execução isolada permanece disponível por acionamento manual.

### Em validação
- Branch `feat/tempo-biomas-hidrologia`: correções de runoff/tags e testes de regressão adicionados; a execução rápida [#40994405717](https://github.com/apoenalore/GameCreator/actions/runs/40994405717) permanece em `queued`, sem executor. A validação completa ainda depende do runner Windows do repositório.
- Branch `feature/estudio-unificado-pixelart-v41`: permanece a linha oficial de desenvolvimento V4.1; esta rodada não altera a `main` nem substitui a branch oficial.
- Runner GameCreator: as execuções atuais [validação completa #40995373599](https://github.com/apoenalore/GameCreator/actions/runs/40995373599) e [hidrologia #40995373584](https://github.com/apoenalore/GameCreator/actions/runs/40995373584) permanecem em `queued`, sem `runner_name`/executor atribuído (labels exigidas: `self-hosted`, `Windows`, `X64`). A validação agendada [#40959244729](https://github.com/apoenalore/GameCreator/actions/runs/40959244729) também permanece na fila. Os testes rápidos antigos da branch ambiental [#40994405717](https://github.com/apoenalore/GameCreator/actions/runs/40994405717) também não receberam executor; a workflow duplicada foi desativada para novas execuções automáticas.
- Runner Pixel Art: duas validações mais recentes concluídas com sucesso no runner real `Runner-Pixel-Art` (ID 21; labels `self-hosted`, `Windows`, `X64`, `pixel-art`): [calendário/hidrologia HTML + Godot #40995366149](https://github.com/apoenalore/Apoena-pixel-art-html/actions/runs/40995366149) e [laboratório de bacias/erosão #40995405793](https://github.com/apoenalore/Apoena-pixel-art-html/actions/runs/40995405793).

### Pendências preservadas — não marcar como concluídas
- Consolidar o laboratório hidrológico de bacias/solo da PR #5 com a prévia ambiental do `terrain-system.js` da PR #6, preservando recursos exclusivos de ambos.
- Implementar importação ponta a ponta do JSON e atlas exportados pelo Creator para o runtime HTML/Godot; metadados válidos não equivalem a mapa jogável importado.
- Substituir topografia provisória por alturas reais do mapa, validar variantes sazonais em objetos/construções e calibrar chuva longa, seca, neve e desempenho mobile.
- Validar no Godot de destino, Android físico e gameplay real antes de declarar História, Exploração ou MOBA concluídos.


### Ação externa necessária para liberar o GameCreator
- No computador Windows, executar o diagnóstico somente-leitura do repositório `runner`: `powershell -NoProfile -File .\\scripts\\diagnosticar_runner_windows.ps1`.
- Confirmar que existe uma instalação de runner registrada especificamente para o repositório GameCreator (ou um runner de organização autorizado para ele), com labels compatíveis com `self-hosted`, `Windows` e `X64`; o runner `Runner-Pixel-Art` está registrado no repositório Pixel Art e não atende automaticamente o GameCreator.
- Não reiniciar um runner que esteja com `Runner.Worker.exe` executando job. Depois de ativar/registrar o serviço correto, reexecutar a validação completa e só então marcar a parte do Creator como concluída.
