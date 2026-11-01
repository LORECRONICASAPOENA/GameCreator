# Ideia em discussão — Criador de personagens pixel art para Apoena

**Estado:** pedido expresso do autor para tornar o Estúdio Pixel Art operacional com Apoena. Implementação inicial em andamento na branch `feat/apoena-personagem-estudio`; ainda aguarda validação.  
**Escopo:** planejamento do GameCreator. Não confundir o editor com o runtime do jogo Apoena.

## Visão

Transformar o GameCreator em um estúdio para montar personagens 2D do universo Apoena com peças reutilizáveis: corpo, cabelo, roupas, equipamentos e acessórios. O personagem exportado deve ser utilizável no jogo, não apenas aparecer bem na tela do editor.

A mesma definição visual deve produzir resultados consistentes na prévia HTML e na integração planejada com Godot 4. O Creator edita e exporta recursos; o runtime continua responsável por movimentação, combate, atributos e regras do jogo.

## Princípios propostos

- **Compatibilidade desde o início:** definir formatos, dimensões, âncoras, camadas e metadados antes de produzir muitas peças.
- **Peças combináveis:** roupas e equipamentos devem encaixar em corpos compatíveis sem deslocar outras partes.
- **Pixel art preservada:** usar escala nearest-neighbor; evitar deformações que borram pixels.
- **Autoria sob controle do criador:** pré-visualizar mudanças, permitir desfazer e não substituir nem alterar originais sem controle explícito.
- **Aparência separada das regras:** mudar roupa ou cabelo não deve alterar atributos e habilidades.
- **Integração verificável:** JSON ou PNG exportado não contam como integração concluída até o recurso funcionar no consumidor real.

## Escopo conceitual

### Aparência e peças

Biblioteca de corpos-base com proporções diferentes, variações de pele, rosto e olhos; cabelos em camadas traseira e frontal; roupas separadas por tronco, pernas, pés, braços, cabeça, costas e cintura; armas, escudos, cristais, bolsas e acessórios.

O Apoena precisa manter seus itens próprios, incluindo a manopla e o bracelete de cristais. As tribos Fogo, Água, Ar e Terra podem orientar conjuntos visuais e predefinições, sem limitar personagens inéditos.

Cada peça precisa declarar compatibilidade, ponto de encaixe e ordem de desenho. A profundidade pode depender da direção: uma arma ou capa pode aparecer atrás ou à frente do corpo.

### Animação e visualização

**Objetivo confirmado pelo autor:** o criador deve permitir animar os movimentos do personagem, incluindo caminhada e ataque. A ferramenta precisa permitir montar/editar e pré-visualizar essas animações, não só exibir sprites já animados.

Começar avaliando animação quadro a quadro com peças alinhadas. A lista conceitual inclui parado, caminhada e ataque básico; corrida, dano, morte, defesa e conjuração são possibilidades para etapas posteriores. Quatro direções são uma possibilidade de partida; a lista de ações e direções do primeiro corte ainda precisa ser escolhida.

A versão HTML pode oferecer prévia de frente, costas, esquerda e direita, reprodução das animações de caminhada e ataque e uma arena simples para avaliar escala e movimento em tela pequena.

### Exportação e integração

Pacote conceitual por personagem:

- spritesheet PNG com transparência;
- JSON com nome, tribo, elemento, peças, cores, âncoras, direções e animações;
- camadas PNG opcionais para edição ou uso em runtime;
- organização de quadros compatível com a ferramenta consumidora.

A proposta cita HTML Canvas e Godot 4. A forma real de integração — spritesheet, camadas, recurso nativo ou combinação — depende do contrato já usado pelo jogo e precisa ser decidida antes de prometer compatibilidade.

## Implementação inicial solicitada — Estúdio e Apoena

- O Estúdio terá predefinições para importar as referências originais de corrida multidirecional e ataques laterais, separando quadros numa grade inicial e marcando ação/direção para pré-visualização.
- As imagens originais não são alteradas. As divisórias permanecem editáveis e os quadros precisam ser conferidos antes de exportar; em especial, os efeitos dos ataques podem cruzar as células da grade.
- A referência disponível mostra corrida, não caminhada. Há uma opção de prévia marcada como “andar” que reutiliza essas poses de corrida e fica identificada como preliminar; para uma caminhada fiel, será necessário carregar quadros próprios.
- **Estado:** implementação em branch; revisão, testes e validação canônica pendentes. Isso ainda não comprova integração de gameplay no Creator/Godot.

## Dimensões de referência — ainda em debate

O plano recebido sugere **32 × 48 pixels por quadro**, com spritesheet de **128 × 192** para quatro direções e quatro quadros por direção. **48 × 64** aparece como alternativa caso falte espaço para os detalhes.

Esses números são hipóteses de trabalho, não padrões aprovados. A escolha deve ser feita com um personagem real em cenário de gameplay, verificando legibilidade, escala no mapa, animação e custo de produção de assets.

## Fases sugeridas no plano original

- **V1 — Criador básico:** corpos, cabelo, roupas, cores, equipamentos, direções, caminhada, exportação PNG/JSON e teste HTML em celular.
- **V1.5 — Biblioteca:** modelos-base e peças desenhadas com qualidade, conjuntos das tribos e catálogo reutilizável.
- **V2 — Animação:** ataques, habilidades, efeitos e ferramenta para editar quadros.
- **V3 — Integração com o jogo:** importar personagens no Godot e validar movimentação, equipamento e combate no runtime.

O plano também propõe esta ordem de dependências: decidir padrão de sprite → criar corpo-base → validar peças e encaixes → validar direções e caminhada → construir o editor → fechar exportação → testar no jogo. As fases e prioridades ainda precisam de debate.

## Apoena — personagem principal e referências visuais

O autor confirmou que o personagem principal do jogo é **Apoena**. As imagens abaixo foram fornecidas para orientar a identidade visual e o desenvolvimento das animações. Elas mostram Apoena com cabelo branco espetado, camisa azul, calça clara e sandálias, incluindo poses de corrida e sequências de ataque com energia azul.

- [Sequência de ataque lateral para a direita](../pixel-art/references/apoena/apoena-ataque-lateral-direita.png) — 2048 × 682.
- [Sequência de ataque lateral para a esquerda](../pixel-art/references/apoena/apoena-ataque-lateral-esquerda.png) — 2048 × 682.
- [Poses de corrida em várias direções](../pixel-art/references/apoena/apoena-corrida-multidirecional.png) — 1024 × 1536.

Os arquivos estão preservados como **referências visuais originais**, não como spritesheets prontos ou quadros com grade validada para importar diretamente no jogo. Servem para guiar a criação e edição das animações de caminhada/corrida e ataque; enquadramento, recorte, resolução final e separação em quadros continuam por definir.

## Estado conhecido do projeto

A documentação do repositório já registra um Estúdio Pixel Art com importação, recorte, spritesheets, biblioteca central e sincronização com a sessão do Creator. Também alerta que spritesheet e manifesto, sozinhos, não comprovam animações de gameplay nem instalação automática no runtime.

Esta ideia deve ser comparada com esses módulos existentes antes de qualquer implementação, para estender o que já existe em vez de criar um editor ou uma biblioteca paralelos. As funcionalidades descritas nesta proposta não ficam marcadas como prontas por terem sido planejadas aqui.

## Critérios de qualidade a discutir

- Trocar cabelo, roupa e equipamento sem deslocamento inesperado.
- Alinhar pés, cabeça, mãos e armas em todas as direções.
- Inspecionar a ordem de camadas ao mudar a direção.
- Salvar e importar a configuração sem perder peças.
- Exportar PNG transparente e camadas opcionais.
- Testar a escala e a caminhada no HTML em tela pequena.
- Validar o pacote em uma cena do Godot e, depois, no runtime real do jogo.
- Manter claro o que foi apenas discutido, implementado, testado e integrado.

## Pontos abertos para o debate

1. **Primeiro resultado:** fazemos um personagem completo e controlável como prova vertical, ou priorizamos a biblioteca modular antes do editor?
2. **Tamanho dos quadros:** 32 × 48 é suficiente para o estilo e a escala do Apoena? Que cena deve servir de referência para decidir?
3. **Animação inicial:** quais direções e ações são indispensáveis para a primeira entrega?
4. **Método de montagem:** começamos somente com quadros de pixel art, deixando rig de partes para outra etapa, ou há uma necessidade concreta de testar os dois métodos agora?
5. **Contrato de exportação:** quais dados e formatos o jogo atual consegue consumir sem duplicar lógica do runtime?
6. **Escopo das peças:** quais proporções corporais, roupas e equipamentos são necessárias para provar que a modularidade funciona?
7. **Integração de autoria:** como este fluxo deve se encaixar no Estúdio Pixel Art, na Biblioteca Central e na ponte já existente do Creator?

## Recomendação inicial para discussão

Antes de produzir uma biblioteca grande, escolher um personagem de referência — idealmente Apoena — e construir uma prova vertical pequena: corpo-base, um conjunto de roupa, cabelo e equipamento, as direções e ações mínimas acordadas, prévia HTML e exportação testada no consumidor escolhido. Isso deve revelar cedo se tamanho, encaixes, camadas e formato de exportação funcionam juntos. A prova não precisa ser implementada até o escopo e as decisões criativas serem debatidos.

## Origem

Síntese do arquivo recebido **“Planejamento completo do Criador de Personagens Pixel Art — Apoena”**, preservando a visão e os requisitos principais como proposta em aberto. Links de referência visual externos do texto original não foram tratados como assets do projeto.
