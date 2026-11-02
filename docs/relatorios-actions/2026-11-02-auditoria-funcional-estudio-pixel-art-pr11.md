# Auditoria funcional estática — Estúdio Pixel Art / PR #11

**Data:** 02/11/2026  
**PR auditada:** [#11 — GC-ANIM-006](https://github.com/apoenalore/GameCreator/pull/11)  
**Branch auditada:** feat/apoena-personagem-estudio-main  
**HEAD auditado:** 0dd0b9ee90409654958f010eef9303f0dca8c7c7  
**Branch deste relatório:** docs/ci-pr11-countermeasures-20261102  
**Tipo:** revisão estática de código e cobertura de testes. Não houve alteração no código do produto.

## 1. Resultado executivo

A PR #11 passou pelo workflow canônico no run [41451250043](https://github.com/apoenalore/GameCreator/actions/runs/41451250043), no mesmo SHA auditado.

- Job validar: **completed / success**.
- Steps de validação executados: 20 steps de execução principal concluídos com sucesso.
- Steps de entrega manual e upload de logs: skipped, conforme esperado para evento pull_request.
- Testes incluíram build nativo, smoke test DOM responsivo do Estúdio/Mapas/Biblioteca, node --check de pixel-art/estudio.js e outros módulos, testes do Corte Inteligente, biblioteca/IndexedDB, backup, catálogo/Godot, bridge, integração do Creator e runtime Godot 4 headless.
- Reviews formais da PR: lista vazia na consulta; threads de revisão: lista vazia. Há comentário automático do CodeRabbit informando “Action not completed — Head commit changed” quando a revisão manual foi solicitada. Portanto, não existe aprovação formal de CodeRabbit comprovada.

**Limite importante:** CI verde prova que os testes automatizados existentes passaram. Não prova que as imagens foram recortadas corretamente, que o movimento está visualmente fluido, que o usuário consegue concluir cada fluxo no navegador ou que o pacote foi validado em gameplay.

## 2. Escopo realmente implementado na PR

Arquivos funcionais alterados:
- pixel-art/estudio.html: controles e instruções de predefinições Apoena (corrida 4×4 e ataques 6×2), ação/direção, edição, prévia e exportação.
- pixel-art/estudio.js: carregamento das três referências, criação de 16 quadros de corrida e 12 quadros por sequência de ataque, rótulos de ação/direção, prévia, salvamento e exportação.
- Três imagens de referência foram adicionadas em pixel-art/references/apoena/.

A PR não implementa esqueleto/rig 2D, criador modular de personagem, gameplay, combate nem importação automática no runtime Godot. O manifesto JSON é um contrato de exportação inicial, não uma integração comprovada de jogo.

## 3. Achado de código — exportação de spritesheet

**Prioridade média · correção recomendada**

Na função sheet() de pixel-art/estudio.js, o editor cria um canvas novo e redimensiona cada quadro com drawImage(), mas não define imageSmoothingEnabled = false.

O navegador usa suavização de imagem por padrão em operações de escala. Isso pode interpolar cores e borrar bordas de pixel art quando um quadro é redimensionado para a célula de exportação (128–512 px). A prévia e outras áreas explicitamente configuram imageSmoothingEnabled=false, mas a função de exportação não.

**Correção mínima proposta:** imediatamente após obter o contexto de out, definir ctx.imageSmoothingEnabled = false antes do loop frames.forEach. Manter a âncora inferior e o cálculo atual de escala.

**Teste necessário:** exportar uma imagem com pixels de borda bem definidos em pelo menos duas escalas (quadro menor que célula e quadro maior que célula), reabrir o PNG e verificar que não surgiram cores intermediárias nos contornos. Idealmente adicionar teste automatizado de pixels com canvas headless/browser.

Não foi aplicado patch nesta auditoria para evitar alterar a branch funcional sem um teste específico de regressão e sem uma nova execução controlada do workflow.

## 4. Ponto de validação visual — presets de ataque

O código define:
- apoena-ataque-lateral-direita.png: grade 6×2; atribui direita à primeira linha e esquerda à segunda.
- apoena-ataque-lateral-esquerda.png: grade 6×2; atribui esquerda à primeira linha e direita à segunda.

Isso é uma decisão de metadados codificada no preset. O nome de cada arquivo sugere uma orientação específica, mas não basta para concluir que a segunda linha representa a direção oposta. É necessário conferir as 12 células de cada imagem. Se cada arquivo for uma sequência de ataque de uma única direção, a linha inferior está recebendo metadado de direção incorreto.

**Ação:** validar visualmente os 24 quadros e confirmar o significado das linhas antes de considerar o manifesto confiável.

## 5. Cobertura de testes: o que o CI verifica e o que não verifica

### Cobertura observada
- Sintaxe JS de estudio.js e corte-inteligente.js.
- Smoke test DOM responsivo do Estúdio, Mapas e Biblioteca.
- Contrato do Corte Inteligente.
- Persistência da biblioteca IndexedDB e backup/restauração.
- Contratos do catálogo/Godot e bridge Creator V4.0/V4.1.
- Runtime Godot 4 headless.
- Preservação dos módulos existentes.

### Lacunas específicas da PR #11

Não foi identificado step dedicado que execute comportamento real do Estúdio Pixel Art para:
- carregar cada predefinição Apoena e conferir contagem/dimensões dos quadros;
- conferir metadados de ação/direção quadro a quadro;
- verificar recorte e ordem dos quadros;
- testar editar ação/direção e refletir isso no manifesto;
- editar, duplicar, mover e excluir quadros;
- salvar e reabrir projeto editável;
- exportar spritesheet e comparar pixels/âncoras;
- validar round-trip PNG + manifesto no consumidor Godot.

A função de alteração de ação/direção existe: os listeners change atualizam o quadro selecionado. Entretanto, isso ainda não está coberto por teste específico da PR.

## 6. Matriz de testes recomendada

| ID | Teste | Critério de aprovação | Estado |
|---|---|---|---|
| PA-01 | Carregar preset corrida | 16 quadros; 4×4; quatro direções corretamente mapeadas | Pendente |
| PA-02 | Carregar preset ataque direita | 12 quadros; grade 6×2; direção por quadro conferida visualmente | Pendente |
| PA-03 | Carregar preset ataque esquerda | 12 quadros; grade 6×2; direção por quadro conferida visualmente | Pendente |
| PA-04 | Recorte manual/malha | Limites ajustáveis sem alterar arquivo original | Pendente |
| PA-05 | Metadados | Alterar ação/direção no quadro selecionado atualiza manifesto | Pendente |
| PA-06 | Edição de quadros | Desfazer, duplicar, mover e excluir preservam ordem e dados | Pendente |
| PA-07 | Persistência | Salvar projeto editável, fechar/reabrir e comparar quantidade, pixels e metadados | Pendente |
| PA-08 | Exportação PNG | Dimensões, transparência, ordem, âncora e pixels corretos; sem suavização | Pendente |
| PA-09 | Manifesto Godot | Índices, atlas, célula, FPS, ação/direção e coordenadas correspondem ao PNG | Pendente |
| PA-10 | Integração Creator | Biblioteca central recebe PNG/metadados e bridge sincroniza quando aberta pelo Creator | Pendente |
| PA-11 | Round-trip Godot | Importar pacote em cena de teste e reproduzir as animações sem ajuste manual de atlas | Pendente |
| PA-12 | Responsividade | Fluxos principais utilizáveis em viewport estreita e desktop | Parcial: smoke DOM passou; teste manual pendente |

## 7. Contramedidas e ordem recomendada

1. Não reexecutar o workflow só por rotina. O run 41451250043 já passou no HEAD atual. Nova execução é necessária apenas quando houver alteração relevante ou validação final controlada.
2. Corrigir imageSmoothingEnabled na exportação em commit isolado na PR #11 e adicionar teste de exportação.
3. Adicionar teste automatizado focado no contrato do Estúdio, preferencialmente extraindo funções puras de composição de spritesheet/manifesto para módulo testável ou usando browser headless.
4. Conferir visualmente as duas referências de ataque e corrigir metadados de direção se necessário.
5. Validar salvar/abrir projeto e integração da biblioteca.
6. Validar o pacote em uma cena Godot real. O teste headless atual não comprova round-trip do manifesto específico da PR.
7. Solicitar nova revisão CodeRabbit após o HEAD estar estável; o pedido anterior não foi concluído.
8. Somente depois dos critérios acima, tirar a PR de Draft e solicitar aprovação do proprietário.

## 8. Decisão e estado final

- **CI canônico:** aprovado no SHA auditado.
- **Runner:** recuperado; problema de infraestrutura não é o bloqueio atual.
- **Defeito estático encontrado:** ausência de configuração nearest-neighbor na exportação da spritesheet; correção recomendada, ainda não aplicada.
- **Metadados de ataque:** precisam de inspeção visual; não declarar defeito sem verificar o conteúdo das imagens.
- **Testes específicos do Estúdio:** lacuna de cobertura identificada.
- **CodeRabbit:** revisão formal não concluída.
- **PR #11:** continua Draft / não integrada.
- **Código de produto alterado nesta auditoria:** não.
- **Próxima unidade de trabalho:** patch isolado para exportação pixel-perfect + teste automatizado, seguido da validação visual dos presets.

## 9. Fontes internas examinadas

- pixel-art/estudio.html
- pixel-art/estudio.js
- pixel-art/corte-inteligente.js
- shared/asset-library.js
- shared/creator-bridge.js
- .github/workflows/pixel-art.yml
- PR #11 e comentários/reviews associados
- Run 41451250043 e steps do job validar
