# Game Creator v4.0 — pacote completo encontrado (28/10/2026)

O usuário forneceu o arquivo `APOENA_GAME_CREATOR_V4_0_ATUALIZADO_COMPLETO(1).zip`, com **149 entradas**, contendo:

- `APOENA_GAME_CREATOR_V4_0_BANCADA_INTEGRADA.html` (16.332.595 bytes; SHA-256 `ec242d58b84d23b07c8d0f8f6a7620dd21cc2885cd11997d6a60a740be61502b`).
- `APOENA_GAME_CREATOR_v3_9_2_PROJETOS_SEGUROS_COMPLETO.html` (16.299.833 bytes; SHA-256 `13abf14dc8ed44df3f5ae684fd40666d2e61ae9b448c2cbd4da28a16c83aca27`).
- `FONTES_V4_0/runtime_core.js`, `FONTES_V4_0/runtime_ui.js`, CSS, os testes `TESTES_V4_0/test_runtime.js` e o laboratório Godot `SALA_GODOT_V4_0/project.godot`.
- 52 PNGs oficiais, fontes antigas, ferramentas de layout/fábrica universal, documentos e backups.

## Auditoria do arquivo local recebido

- A integridade do ZIP está OK.
- Os 15 scripts anteriores da v3.9.2 são **idênticos** àqueles na v4.0; a v4.0 acrescenta dois scripts.
- Todos os 17 scripts embutidos na v4.0 passaram em `node --check`.
- Um erro no pacote original foi localizado: o teste Node `TESTES_V4_0/test_runtime.js` importava `../runtime_core.js`, mas o módulo estava em `../FONTES_V4_0/runtime_core.js`. Após corrigir **apenas esse caminho no pacote consolidado**, os oito testes passam.
- A recuperação local incluiu um novo iniciador `INICIO_UNIFICADO.html` e uma ponte `INTEGRACAO_UNIFICADA/`. Foram executados seis testes desse novo contrato: todos aprovados.
- A abertura automatizada do HTML completo no Chromium de teste foi bloqueada por política do navegador do ambiente. **Não** equivale a um teste visual aprovado nem a validação nativa em Godot 4/Android.

## ATENÇÃO — situação da publicação

**O código principal da v4.0 ainda NÃO foi copiado para este repositório.** Ele está no ZIP original disponibilizado pelo usuário e no ZIP consolidado produzido para download na conversa. Não tratar documentos, esta auditoria, os arquivos da v3.9 ou a integração inicial do repositório como se fossem o executável v4.0.

Para publicar fielmente o programa, o HTML original v4.0 de 16,3 MB (menos de 25 MB, compatível com envio de um arquivo isolado pelo GitHub web) deve ser adicionado ao repositório sem reformatar seu conteúdo. Preferencialmente usar uma pasta de versões `releases/v4_0/` e manter a v3.9.2 como backup. Após o envio, integrar ao `index.html` e executar testes regressivos antes de trocar a versão padrão.

**Regra de preservação:** não substituir `state.items`, `state.recipes`, catálogos nem projetos salvos; evitar duplicar a Fábrica de Itens. O Game Creator permanece em repositório próprio, separado do jogo e do Studio Maker.

## Ponte criada no pacote de download

O ZIP consolidado inclui uma `INTEGRACAO_UNIFICADA/index.html` local, compatível com:
- `apoena.central.v1` (projetos Game Creator v4);
- `apoena-pixel-v1` (personagens do gerador Pixel Art);
- `apoena.map2d.v1` (mapas do editor 2.5D).

Exporta `apoena.integracao.v1` para preservar os três módulos e `apoena.runtime.v1` para dados da Sala Godot v4.0; esta ponte ainda não foi publicada neste repositório. A integração é de **dados JSON**, e não de efeitos completos de combate, objetos animados, física ou instalação automática nos jogos.
