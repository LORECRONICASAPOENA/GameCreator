# Integração do Apoena Game Creator com outros jogos (Etapa 1)

**Status:** contrato de dados JSON, validador e um executor Godot 4 inicial publicados no repositório. O HTML da ponte e os scripts de catálogo passaram nas verificações de sintaxe JavaScript e em testes lógicos isolados. **Não houve teste nativo em Godot/Android nem conexão automática ao jogo principal.**

## Qual é a fonte de verdade?

A Fábrica de Itens, Receitas, Personagens e outros módulos **já existem no Game Creator v3.9 original**; não devem ser reescritos nem substituídos por um segundo editor. O projeto é salvo pelo botão **Salvar projeto editável**, criando `APOENA_PROJETO_EDITAVEL.json` com schema `apoena.central.v1`, contendo `items`, `recipes`, `assets`, `screens` e demais cadastros.

O repositório mantém:
- `legacy/abrir-editor-v3.9.html` — acesso à fonte original v3.9 dividida em 23 partes;
- `integracao/index.html` — conversor/validador de projetos para catálogo portátil;
- `integracao/catalogo.js` — contrato e simulação isolada de coleta/fabricação;
- `integracao/godot/ApoenaCatalogo.gd` — script inicial para jogos Godot 4;
- `pixel-art/index.html` — gerador que agora importa catálogo e grava `linkedItemId` na ficha de personagem;
- `map-editor/index.html` — editor de mapas com JSON próprio; ainda sem importação automática de catálogo ou TileMapLayer.

**Não confundir versões:** o HTML completo do repositório é o **v3.9**. A auditoria da **v3.9.2** e o relatório da **v4.0** existem como documentação, mas o HTML completo da v3.9.2/v4.0 ainda não foi publicado aqui. Para recuperar fielmente a última versão, precisamos do HTML ou ZIP original, sem reconstruir às cegas.

## Fluxo de trabalho (celular ou PC)

1. No GitHub: **Code → Download ZIP**. Extraia todas as pastas para que `index.html`, `legacy/`, `integracao/` e `pixel-art/` permaneçam juntas.
2. Abra `index.html` no navegador. Entre em **Game Creator completo v3.9** → **Abrir o editor completo**.
3. Na **Fábrica de Itens**, crie o item/ingrediente (ID único, categoria, propriedades, ícone, efeito e disponibilidade). Nas **Receitas**, selecione o produto por ID, os ingredientes e quantidades, custo, estação e tempo.
4. Clique **Salvar projeto editável**. Guarde o arquivo `APOENA_PROJETO_EDITAVEL.json` e **não apague o original**.
5. Volte à central e escolha **Integração de Itens e Receitas**. Importe o projeto, informe um identificador para o jogo e confira os avisos. Exporte `apoena_catalogo_<jogo>.json`.
6. Para outro jogo, repita **somente** o passo 5 com um `game_id` diferente. Os IDs e as receitas preservam seu vínculo; o catálogo exportado não altera o projeto original.
7. Para um personagem Pixel Art, abra o **Gerador Pixel Art**, importe o mesmo catálogo e escolha um item. O manifesto `personagem.json` exportado inclui `character.linkedItemId`. **Isso não desenha o item no sprite e não equipa automaticamente no Godot.**

## Instalação inicial no Godot 4

1. Crie uma **cópia** do projeto Godot do jogo (não altere o principal sem backup).
2. Crie a pasta `res://dados/` e coloque o JSON exportado do passo 5 com o nome `apoena_catalogo.json`.
3. Copie `integracao/godot/ApoenaCatalogo.gd` para `res://scripts/ApoenaCatalogo.gd`.
4. Adicione um nó **Node** à cena chamado `DadosDoJogo`, e atribua a ele o script `ApoenaCatalogo.gd`.
5. No script controlador da sua cena, faça:
   
   ```gdscript
   @onready var dados = $DadosDoJogo

   func _ready() -> void:
       if not dados.carregar_catalogo():
           push_error(dados.ultimo_erro)
           return
       dados.coletar("banana", 2)
       dados.coletar("erva", 1)
       dados.ouro = 5
       # Use o ID de uma receita que realmente exista no seu catálogo:
       # dados.iniciar_receita("pocao_de_cura")
       dados.salvar_sessao()
   ```
6. Depois de validar IDs reais, conecte `inventario_alterado` e `receita_concluida` aos painéis da interface. Para carregar uma sessão já salva, use `dados.carregar_sessao()` após carregar o catálogo. O arquivo fica em `user://` e está separado por `game_id`.

### Recursos que o script já implementa

- Carregar catálogo com conferência dos IDs, produtos e ingredientes.
- Coletar/remover itens, verificar quantidades, consumir ingredientes de uma receita sem tirar estoque em caso de erro.
- Validar ouro e executar a fabricação com tempo `seconds` (cronômetro enquanto a cena está em execução).
- Salvar e restaurar inventário, ouro e fila de fabricação em `user://`.
- Três tipos de efeito instantâneo: `restaurar_hp_fixo`, `restaurar_hp_percentual` e `restaurar_aurium_percentual`; os demais retornam aviso e **não consomem o item**.

**Não implementa:** seleção visual/equipagem real de armas, sprites PNG, status do personagem real, combate, veneno, buffs, escudo temporário, multiplayer, efeitos personalizados, crafting offline ao fechar o app, loja, NPCs, itens no mapa, colisão e integração no jogo principal. Tudo isso requer scripts/adaptadores e testes com o jogo destino. A presença de um campo `effect` no JSON não significa que o efeito funciona.

## Contrato

- Fonte: `apoena.central.v1`, também aceita exportar do conjunto `apoena.items.v1` + `apoena.recipes.v1`.
- Saída: `apoena.gamecreator.catalogo.v1` com `project`, `game_id`, `items`, `recipes` e `assets` (metadados).
- Chaves preservadas: `items[].id`, `items[].effect`, `items[].iconId`, `recipes[].id`, `recipes[].resultId`, `recipes[].ingredients[].id`, `recipes[].ingredients[].qty`, `recipes[].seconds`, `recipes[].gold`.
- Dados base64 de imagens não são embutidos no catálogo leve. Importe PNGs em separado para o Godot.
- Todas as alterações à base principal devem ser feitas no **editor original**, salvas e depois reexportadas pelo conversor. O conversor não tenta modificar o projeto de origem.

## Próximas etapas necessárias

1. Recuperar a última fonte integral v3.9.2/v4.0 para comparar com v3.9, sem perder nenhum módulo.
2. Validar uso real no Android e em Godot 4; verificar salvamento, reabertura e receitas reais (inclusive 1 minuto).
3. Ligar catálogo a cenas de inventário/loja/personagem, ícones e modelos do jogo destino.
4. Criar adaptador entre o mapa em JSON e TileMapLayer (Godot) e entre mapa e a partida HTML.
5. Preservar as alterações e realizar regressão antes de publicar nova versão unificada.

**Segurança:** evite importar arquivos de procedência desconhecida. A ponte trabalha com JSON de dados, não executa scripts de projetos importados.
