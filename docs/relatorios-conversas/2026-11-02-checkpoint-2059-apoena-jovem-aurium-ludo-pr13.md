# Checkpoint documental — Apoena jovem, Aurium, Ludo.ai e Criador Modular (PR #13)

**Data:** 02/11/2026 (BRT). **Referência da conversa:** mensagem do usuário de 17:53 BRT (20:53:52 UTC) e resposta subsequente; verificação GitHub realizada neste checkpoint.
**Tipo:** backup incremental de decisões, referências visuais e prompt de sprites. **Escopo:** documentação; não houve modificação funcional nem homologação de animação.
**Repositório:** `apoenalore/GameCreator`. **Branch de registro:** `main`.

## 1. Solicitação original e arquivos visuais

O usuário apresentou **duas imagens** e esclareceu: "esse é epoena jovem que não é arqueiro é usuario de aurium preciso de um pront pra gerar um sprint aqui na ludo estude antes de gerar o pront para se mais preciso no pront".

- **Imagem 1:** turnaround ilustrado de Apoena jovem com três vistas (frente, perfil esquerdo e costas), corpo inteiro. Cabelo branco desalinhado e volumoso, olhos castanhos, pele morena, camiseta azul-marinho de manga curta, calça larga bege-clara e sandálias marrons. Expressão jovem; sem arco, flechas, armadura ou armas. A imagem mostra um personagem desenhado, **não** um spritesheet pixel art pronto.
- **Imagem 2:** captura da interface `app.ludo.ai/sprite-generator`, com "Gerador de Sprites", modo "Novo Sprite", campo de descrição, filtros e botão "Gerar Sprite Estático". A captura mostra a tela antes de gerar; **não comprova sprite ou animação gerados**.
- **Preservação:** as imagens originais estão anexadas à conversa, mas **não foram copiadas para o GitHub** neste checkpoint. É necessário salvar os binários originais com hashes, autorização e identificação de licença/origem para completar o backup de assets.

## 2. Decisões e restrições explícitas

1. **Apoena jovem não é arqueiro.** É usuário de **Aurium**. Não atribuir arco, flechas ou classe de arqueiro ao personagem.
2. A aparência do turnaround deve orientar a consistência visual em qualquer conversão para pixel art.
3. A versão de início da aventura é a de **12 anos**, conforme contexto prévio do projeto; não misturar com versões adultas.
4. Preservar cabelo branco, olhos castanhos, pele morena, camiseta azul, calça bege e sandálias marrons.
5. Primeiro gerar **sprite-base estático** com referência; depois gerar movimentos e direções. Essa ordem é **recomendação do assistente**, não prova de resultado na Ludo.
6. Aurium é identidade/poder do personagem; no sprite-base não incluir efeitos mágicos ativos ou equipamentos convencionais.
7. Objetivo final: personagem 2D RPG utilizável no GameCreator, com spritesheets e animações coerentes (idle, caminhada, corrida, salto, manifestação de Aurium, reação a dano e derrota).

**Nota de interpretação:** o usuário escreveu "sprint", mas o contexto da Ludo.ai indica "sprite"; a resposta tratou o pedido como sprite de personagem. Não afirmar que a ferramenta já gerou o sprite.

## 3. Resposta e fluxo recomendado na conversa

O assistente descreveu as características visuais e recomendou:
- modo "Novo Sprite" na Ludo.ai;
- enviar o turnaround como imagem de referência;
- pedir corpo inteiro, vista frontal, pixel art RPG 2D, fundo transparente se disponível;
- avaliar a fidelidade visual do sprite-base antes de aplicar Transfer Motion ou solicitar sequências de animação;
- verificar o resultado produzido posteriormente, porque a tela enviada ainda estava vazia.

### Prompt entregue (registro integral)

```text
Create a professional 2D RPG pixel art game character sprite based EXACTLY on the uploaded character reference image.

CHARACTER: APOENA — age 12.

IMPORTANT CHARACTER IDENTITY:
Apoena is a young human character and a natural user of Aurium, the primordial creative energy of the Apoena universe. He is NOT an archer, NOT a warrior class, and NOT a bow user.

VISUAL APPEARANCE:
- Young boy, approximately 12 years old.
- Warm medium-brown skin.
- Large expressive brown eyes.
- Distinctive messy, voluminous white hair with many irregular pointed locks.
- Slim childlike body proportions.
- Simple navy blue short-sleeved shirt.
- Loose light beige cropped trousers.
- Brown leather sandals.

REFERENCE ACCURACY:
Preserve the character's recognizable face, hairstyle, skin tone, clothing colors, body proportions and overall silhouette from the uploaded reference.

PIXEL ART STYLE:
Create authentic high-quality 2D RPG pixel art.
Clearly defined individual pixels.
Carefully controlled pixel clusters.
Clean outlines.
Consistent pixel density.
Professional shading and highlights.
Natural folds in clothing.
Detailed but readable facial features.
A polished fantasy RPG aesthetic.

SPRITE REQUIREMENTS:
- Full body visible.
- Front-facing standing pose.
- Neutral relaxed idle stance.
- Arms naturally positioned beside the body.
- Feet clearly separated and visible.
- Character centered.
- Consistent proportions.
- Transparent background.
- No ground scenery.
- No additional characters.
- No text or labels.

AURIUM IDENTITY:
Do not add weapons or conventional magical equipment.
Do not make him an archer.
Do not add bows, arrows, swords, shields or armor.
His connection to Aurium is part of his identity, but this first sprite should show his ordinary appearance without active magical effects.

GAME CONSISTENCY:
The result must be suitable as the base character sprite for a 2D pixel art RPG. It must be possible to use this design later for idle, walking, running, jumping and Aurium manifestation animations.

PRIORITY: CHARACTER IDENTITY AND VISUAL CONSISTENCY ARE MORE IMPORTANT THAN DECORATIVE DETAILS.
```

**Limite técnico do prompt:** texto e imagem de referência não garantem fidelidade automática, transparência verdadeira, grid fixo, alinhamento de pivô, tamanho de frame, consistência de direções ou exportação compatível com o runtime. Essas propriedades devem ser validadas no resultado da Ludo e na importação ao editor.

## 4. GitHub consultado neste checkpoint

- Repositório `apoenalore/GameCreator`, branch padrão `main`, disponível e com permissão de escrita.
- Último commit da `main` antes deste checkpoint: `14ed9da6d2572dd40ad9abaf0a777a07a61969f2` (histórico documental Agar/runners).
- **PR #13:** [GC-CHAR-001 — protótipo do Criador Modular de Personagens Apoena](https://github.com/apoenalore/GameCreator/pull/13) observada **aberta, draft**, não comprovada integrada à `main`. Branch `feat/apoena-character-creator-prototype`.
- Arquivo da PR #13: `character-creator/index.html` lido diretamente na branch. Interface de edição modular com upload de PNG, camadas e preview canvas. Campos iniciais visíveis: nome "Apoena", tribo "Agar", classe "Guardião" e poder "Aurium / Constelações". **Atenção:** o valor "Guardião" é um default do protótipo, não uma classificação canônica confirmada do personagem; não substituir a restrição "não arqueiro" por uma classe presumida.
- **PR #11:** observada aberta e draft, sem confirmação de merge. Resultados anteriores de CI não equivalem a validação da PR #13 nem a sprite gerado na Ludo.
- Repositório `apoenalore/apoenaskil`: último commit identificado `6c6df4fe918c0ffc8d8f2f888fa5c8d65160428d`; não houve escrita nele nesta execução.
- `AGENTS.md` consultado: manter WIP=1, não declarar hipótese como correção aplicada, não enfraquecer testes e preservar o CI canônico.

## 5. Lacunas, riscos e próximos critérios de aceite

| ID | Situação | Critério de aceite |
|---|---|---|
| CHAR-REF-001 | Imagens da conversa não copiadas ao GitHub | Arquivos binários preservados com hashes, origem e autorização |
| CHAR-BASE-001 | Sprite-base Ludo não gerado/testado nesta conversa | PNG exportado, pixel art legível, transparência real e fidelidade visual conferidas |
| CHAR-ANIM-001 | Animações ainda não geradas | Spritesheet com frames/direções/ordem/FPS/pivô definidos e testados |
| CHAR-CANON-001 | Classe default "Guardião" no protótipo | Revisar terminologia com cânone Apoena; não presumir classe |
| CHAR-INTEG-001 | Integração Ludo → Creator/Godot não demonstrada | Importar sprite e animações, reabrir projeto e executar no runtime |
| BACKUP-MESTRE | Incompleto | Preservar originais, IndexedDB e testar restauração integral |

## 6. Estado e integridade desta ação

**Registrado:** contexto visual, restrição "Aurium, não arqueiro", prompt integral, recomendações e estado consultado das PRs.  
**Não executado:** geração de sprite, edição de imagens, alteração de código, merge de PR, workflow, teste de runtime, upload de assets, backup binário do navegador ou restauração.  
**Confiabilidade:** decisões e prompt são evidências da conversa; dados da PR são leitura autenticada do GitHub; compatibilidade Ludo/GameCreator permanece não validada.
