# Arquitetura da plataforma única — Apoena Game Creator

**Data:** 02/11/2026  
**Estado:** decisão de arquitetura aprovada pelo autor; implementação de integração ainda pendente.  
**Escopo:** reunir as ferramentas 3D, Pixel Art 2D e edição de mapas 2.5D em uma aplicação única para o mesmo jogo Apoena.

## 1. Decisão principal

O Apoena Game Creator será uma única plataforma, com uma entrada, um projeto ativo, uma biblioteca central de assets e ferramentas especializadas. Não serão mantidos dois Creators independentes que cadastram, salvam ou exportam os mesmos recursos de forma incompatível.

A plataforma terá três áreas principais:

1. **Estúdio 3D** — preservar e evoluir a bancada 3D já existente na fonte do Creator: personagens/modelos, objetos, materiais, rig/ossos, animações, pré-visualização e exportação. Não recriar essa bancada antes de mapear seus recursos reais.
2. **Estúdio Pixel Art 2D** — preservar o gerador de personagens e o Estúdio de Spritesheets: desenho/importação, recorte, camadas, animações, objetos, vegetação, animais, equipamentos e exportação.
3. **Editor de mapas 2.5D** — editor de mundo com grade/camadas, tilesets, terrenos, alturas, objetos, entidades, colisões declarativas, marcadores, biomas e exportação. O módulo `map-editor/` já existe e deve ser integrado/evoluído, não substituído por um editor novo.

O mapa é o ambiente que consome assets 2D e 3D. Um asset cadastrado uma vez deve poder ser localizado na biblioteca e usado em qualquer mapa compatível.

## 2. Estrutura funcional proposta

- **Início / Projetos:** criar, abrir, duplicar, validar e fazer backup de projetos Apoena.
- **Assets:** biblioteca única com categorias e filtros.
- **Estúdio 3D:** ferramenta especializada, preservando o editor 3D existente.
- **Estúdio 2D:** gerador e editor de spritesheets/Pixel Art.
- **Mapas 2.5D:** montagem do mundo usando assets da biblioteca.
- **Itens e regras:** fábrica de itens, receitas, atributos, vínculos e comportamentos declarativos.
- **Exportar para o jogo:** validação do pacote, manifesto e recursos destinados ao runtime Godot/HTML.

O menu deve ser simples e contextual. O editor de mapas não precisa ocupar a tela durante a criação de assets; ele fica disponível como etapa/ferramenta própria quando o autor estiver pronto para montar o cenário.

## 3. Biblioteca central: fonte única de verdade

A biblioteca existente em `shared/asset-library.js` e `biblioteca/` deve ser a fonte central de metadados e projetos. Não criar outra biblioteca dentro de cada editor.

Cada asset deve possuir, no mínimo:
- `id` estável e único;
- `schemaVersion` e `assetType`;
- `name`, `category`, `tags` e descrição;
- `sourceFormat` e referências aos arquivos originais;
- dimensões, pivô/âncora e escala;
- modo de uso: 2D, 3D ou ambos quando houver variantes;
- metadados específicos versionados;
- vínculo com projeto e, quando aplicável, com item/receita.

Tipos iniciais: personagem 3D, modelo 3D, objeto 3D, material/textura, personagem 2D, spritesheet, tile, tileset, planta, animal, item, construção, veículo, efeito e áudio.

**Regra de integridade:** salvar/atualizar por ID; não duplicar por nome; não sobrescrever original sem confirmação; preservar versões e metadados; permitir desfazer e restaurar backup.

## 4. Contrato de interoperabilidade entre os três editores

- Os editores leem e gravam na mesma biblioteca e no mesmo projeto.
- O Estúdio 2D exporta PNG/spritesheet + manifesto de quadros/animações.
- O Estúdio 3D exporta modelo/material/animação em formato suportado pelo pipeline definido e manifesto de escala, pivô, esqueleto e clips.
- O Editor 2.5D referencia assets por ID; não incorpora cópias independentes quando uma referência de biblioteca for suficiente.
- Um objeto pode ter variantes 2D e 3D ligadas ao mesmo ID lógico, sem forçar que uma imagem 2D vire um modelo 3D.
- O mapa guarda camada, posição, elevação, orientação, escala, ordem de profundidade, colisão declarada e referência do asset.
- A exportação reúne somente os arquivos usados, dependências, metadados e versões de schema.

Não assumir que PNG, JSON ou um modelo importado já funciona no jogo. O runtime precisa validar renderização, animação, colisão e interação.

## 5. Editor de mapas 2.5D: escopo de produto

O editor atual já oferece mapa em grade, tilesets, terreno, elevação visual limitada, objetos com ordenação por profundidade, marcadores, salvar/reabrir JSON e prévia PNG. Essas funções devem ser preservadas.

Evoluções previstas:
- camadas separadas: terreno/base, elevação, decoração, objetos, entidades e colisões;
- alturas e níveis com rampas/escadas/conexões, não apenas paredões visuais;
- tileset e autotile configurável, incluindo terreno, água, margens, caminhos e transições;
- biblioteca lateral com busca e categorias: Tiles/Terrenos; Assets/Cenários; Personagens/NPCs; Itens/Veículos; Animais/Plantas;
- posicionamento de assets 2D e 3D com pivô, escala, rotação e ordenação;
- zonas de entrada, cavernas/dungeons, pontos de interesse, rotas, bases, torres e regiões;
- camadas lógicas de colisão, navegação e interação;
- desfazer/refazer, validação, salvamento incremental e exportação.

O 2.5D é uma composição de profundidade/camadas e elevação com apresentação visual coerente. Não prometer física, navegação ou colisão funcionais até a integração no runtime.

## 6. Integração da aplicação e remoção de caminhos vazios

Antes de remover caminhos:
1. inventariar cada botão, aba, link, rota, página, iframe, callback e arquivo de entrada;
2. rastrear referências no código, documentação, workflows, scripts de build e atalhos;
3. classificar como ativo, legado necessário, duplicado comprovado, órfão provável ou placeholder;
4. identificar o substituto e migrar conteúdo exclusivo;
5. remover somente em mudança isolada, revisável e coberta por testes.

Um botão sem implementação, uma página vazia ou um caminho que aponta para arquivo inexistente pode ser removido quando sua ausência for comprovada. Um módulo antigo não é automaticamente inútil por não estar na navegação: pode conter dados, exportadores ou funções ainda chamadas por outro módulo.

Não apagar as fontes V3/V4, o bundle ou os iniciadores apenas por tamanho ou idade. Primeiro provar que o caminho unificado substitui suas funções e que os projetos antigos continuam abrindo.

## 7. Ordem de implementação — uma tarefa ativa (WIP = 1)

### Etapa A — mapa de dependências e navegação
- identificar a fonte real da bancada 3D e suas entradas;
- mapear a entrada principal, abas, páginas e caminhos de 2D/3D/mapa;
- localizar placeholders, links quebrados, módulos sem referência e funcionalidades duplicadas;
- registrar matriz origem → destino e lista de remoção segura.

### Etapa B — shell único
- definir uma única navegação e um único contexto de projeto;
- abrir as três ferramentas como áreas da mesma aplicação, sem duplicar seus códigos;
- manter compatibilidade com atalhos e links existentes durante a migração.

### Etapa C — biblioteca e contratos
- consolidar IDs, schema versionado e referências de assets;
- adaptar 2D, 3D e mapa para ler/escrever no mesmo contrato;
- preservar importação de projetos antigos com migração explícita e backup.

### Etapa D — mapa 2.5D integrado
- consumir diretamente a biblioteca compartilhada;
- posicionar assets 2D/3D por referência;
- salvar, reabrir, validar e exportar sem duplicar os arquivos.

### Etapa E — limpeza e validação
- remover rotas órfãs e duplicações comprovadas;
- executar testes de biblioteca, ponte, mapa, spritesheet e exportação;
- validar projetos antigos, regressão da bancada 3D e uso Android/PC;
- só então promover a mudança à main.

## 8. Critérios de aceitação

- Uma única entrada abre o Creator e permite acessar Estúdio 3D, Estúdio Pixel Art e Mapas 2.5D.
- Os três editores usam o mesmo projeto e a mesma biblioteca.
- Um asset cadastrado em 2D ou 3D pode ser encontrado e colocado no mapa sem novo cadastro.
- Assets 2D e 3D mantêm suas características e formatos originais.
- Mapas salvam e reabrem referências, camadas, alturas, objetos e metadados.
- Não há links quebrados, botões sem ação ou rotas vazias na navegação publicada.
- Projetos antigos continuam importáveis, com backup e migração verificável.
- Testes automatizados passam e a bancada 3D, Pixel Art e mapa são testados visualmente em PC e Android.
- Exportação é testada no runtime do jogo; não basta gerar arquivos sem erro.

## 9. Limites e não objetivos

- O Game Creator é ferramenta de autoria; o jogo Apoena continua sendo o runtime consumidor.
- Não reescrever o editor 3D existente sem auditoria da implementação.
- Não converter automaticamente todos os assets 2D em 3D nem vice-versa.
- Não apagar recursos históricos antes da migração comprovada.
- Não marcar funcionalidades declarativas como física, combate, multiplayer ou IA implementados sem runtime e testes.
