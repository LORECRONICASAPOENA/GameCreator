# Correção da exportação de spritesheet — Estúdio Pixel Art

**Data:** 02/11/2026  
**Escopo:** correção isolada na PR #11, sem alterar os presets ou o fluxo de edição.

## Implementação

Na função sheet() de pixel-art/estudio.js, foi inserida a configuração ctx.imageSmoothingEnabled = false imediatamente após obter o contexto 2D do canvas de saída e antes do loop que chama drawImage().

Objetivo: evitar interpolação de cores nas operações de redimensionamento de pixel art. A mudança não modifica os canvases de origem, a transparência, o cálculo de escala, a posição dos quadros, a âncora inferior, a grade ou o manifesto.

## Teste adicionado

Arquivo: tests/pixel-art-export.test.cjs

O teste carrega a função sheet() real do código do Estúdio num contexto Node com Canvas mockado e verifica:
- a suavização está desativada antes de cada drawImage;
- a quantidade de quadros desenhados;
- largura e altura finais do atlas;
- número de colunas e linhas;
- dimensões dos canvases de origem preservadas.

O workflow .github/workflows/pixel-art.yml agora executa esse teste como etapa própria.

## Destino do código

A alteração foi aplicada diretamente à branch feat/apoena-personagem-estudio-main para integrar-se à PR #11 já existente, sem abrir uma PR duplicada.

Commits:
- pixel-art/estudio.js: 49c76e884aa58468522dc003136fdf9cc67d5939
- tests/pixel-art-export.test.cjs: 1002c51525a58237d8801e76f416354d4e121262
- .github/workflows/pixel-art.yml: 0447ea9dc9d9310e985247325e3af1d1c726519a

Workflow acionado:
- Run 41461801598
- URL: https://github.com/apoenalore/GameCreator/actions/runs/41461801598
- Estado observado no primeiro polling: queued. Resultado final ainda não confirmado neste registro.

## Limitações

O teste valida o contrato de configuração e a geometria do atlas com Canvas mockado. Não substitui inspeção de PNG real em navegador nem comparação visual de pixel art. A validação visual e round-trip Godot continuam pendentes.

## Próximos passos

1. Aguardar o workflow 41461801598 e confirmar o step Testar exportação pixel-perfect do Estúdio.
2. Se falhar, corrigir o teste ou implementação e repetir CI.
3. Validar visualmente presets de corrida e ataque.
4. Adicionar teste de contrato do manifesto e round-trip de exportação/importação Godot.
5. Manter a PR #11 em Draft até concluir validação e revisão.
