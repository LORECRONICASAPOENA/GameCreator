# ACE — Etapa 4: Animation Engine

**Estado desta entrega:** núcleo de animação implementado em branch isolada; aguardando CI no SHA da implementação. Não integrado à main.

## Objetivo

Criar um motor determinístico e reutilizável para as duas modalidades de animação já previstas no GameCreator:

1. **Sprite/frame-by-frame:** sequência discreta de quadros, ações, direções e FPS.
2. **Rig 2D por partes:** tracks numéricas de transformação aplicadas a ossos e peças, sem alterar os PNGs de origem.

O motor é um serviço de domínio independente da interface. O Estúdio Pixel Art existente passa a utilizá-lo para calcular a posição de reprodução da prévia.

## Contrato versionado

- Schema: apoena.animation.v1.
- Versão: 1.
- Um clip contém id, name, fps, durationFrames, loopMode e tracks.
- Cada track identifica targetKind, targetId, property, interpolation e keyframes.
- targetKind: sprite, bone ou part.
- sprite.frame usa interpolação discreta step.
- bone e part aceitam x, y, rotation, scaleX, scaleY, opacity e zIndex.
- Interpolação: step, linear e cubic (Hermite com tangentes opcionais por keyframe).
- Playback: loop, once e pingpong.

## API implementada

- createClip / normalizeClip: criação e normalização determinística.
- validateClip: validação do schema e dos limites.
- sampleTrack: amostragem de uma propriedade em posição fracionária da timeline.
- getPlaybackPosition: cálculo de frame, direção, ciclo, progresso e conclusão.
- sampleClip: composição da pose por alvo.
- buildTimelineModel: modelo de tracks e marcadores para uma futura interface de timeline.
- serializeClip / deserializeClip: round-trip JSON validado.
- createSpriteSequenceClip: adaptador de sequência de sprites para o contrato do motor.

## Limites e segurança

- FPS: 1–60, inclusive valores fracionários.
- Duração: 1–6.000 frames.
- Até 256 tracks, 10.000 keyframes por track e 50.000 no clip.
- IDs e propriedades são declarativos; nenhum código externo, eval ou script importado é executado.
- Valores numéricos são finitos e limitados por propriedade.
- Keyframes são ordenados e frames duplicados são rejeitados.
- Uma track por combinação alvo/propriedade evita sobrescrita ambígua.
- O motor não modifica a imagem original nem executa deformação destrutiva.

## Integração nesta etapa

- pixel-art/estudio.html carrega o motor antes do script do Estúdio.
- A prévia de spritesheet usa getPlaybackPosition, mantendo FPS, filtro nearest-neighbor e seleção de ação/direção existentes.
- A API já amostra tracks de sprite, ossos e peças e produz um modelo de timeline.

## Ainda não incluído

- Interface visual de edição de bones/parts e timeline multi-track.
- Rig hierarchy, constraints, IK e reconstrução de pixels ocultos.
- Deformação de malha, profundidade 2.5D/3D e renderer de malha.
- Exportação de animação para Godot validada no motor.
- Integração funcional com o Criador Modular da PR #14; essa PR permanece preservada e fora desta branch.
- Teste manual offline/IndexedDB no computador do proprietário.

## Validação prevista

tests/animation-engine.test.cjs cobre schema, limites, tracks de sprite/rig, interpolação, timeline, loop/once/pingpong, amostragem, round-trip JSON e ordem de carregamento no Estúdio. O teste é encadeado pela suíte existente tests/pixel-art-export.test.cjs, sem criar workflow redundante.

A validação final desta etapa depende do GitHub Actions automático no commit da branch. CI verde não substitui teste visual/manual do proprietário nem prova exportação Godot.
