# Checkpoint — auditoria funcional da PR #11

**Data:** 02/11/2026  
**Pedido:** continuar o trabalho no GameCreator enquanto o autor está sem acesso ao celular; auditar o código da PR #11 e preparar a matriz de testes.

## Evidências consultadas
- PR #11 aberta, draft, mergeable, base main.
- HEAD auditado: 0dd0b9ee90409654958f010eef9303f0dca8c7c7.
- Run 41451250043, mesmo SHA: completed/success.
- Job validar: success.
- 20 steps principais executados com sucesso; steps de empacotamento manual/upload foram skipped por ser pull_request.
- Reviews formais e threads de revisão retornaram vazias. Comentário CodeRabbit anterior informou que o pedido manual não foi concluído porque o HEAD mudou.

## Resultado da auditoria
- O CI executa smoke DOM, sintaxe e suítes gerais da plataforma; não foi identificado teste de comportamento dedicado para presets Apoena, metadados ação/direção, round-trip de projeto editável, spritesheet pixel-perfect ou integração específica do manifesto no runtime.
- Achado estático: a função sheet() redimensiona quadros sem configurar ctx.imageSmoothingEnabled=false; a suavização padrão do Canvas pode borrar pixel art. Correção mínima recomendada e teste de pixels pendentes.
- Presets de ataque: o código atribui direções diferentes às duas linhas de cada PNG. Isso precisa de inspeção visual das 24 células; não classificar como bug até confirmar o conteúdo das referências.
- Ações/direções do quadro selecionado têm listeners change que atualizam metadados, mas esse fluxo não tem teste dedicado.
- A PR não implementa rig 2D, criador modular, gameplay/combate ou integração automática comprovada com Godot. O manifesto é contrato de exportação inicial.

## Matriz de testes
PA-01 corrida 4×4 / 16 quadros e quatro direções.
PA-02 ataque direita / 6×2 e metadados.
PA-03 ataque esquerda / 6×2 e metadados.
PA-04 recorte manual/malha e preservação do original.
PA-05 edição de ação/direção refletida no manifesto.
PA-06 desfazer, duplicar, mover e excluir.
PA-07 salvar/reabrir projeto editável preservando pixels e metadados.
PA-08 exportação PNG transparente, ordem, âncora e nearest-neighbor.
PA-09 manifesto/atlas correspondente ao PNG.
PA-10 biblioteca central e bridge Creator.
PA-11 round-trip em cena Godot real.
PA-12 responsividade mobile/desktop.

## Decisões
- Não alterar o código funcional nesta auditoria; o relatório registra um patch mínimo recomendado para a exportação, que deve ser isolado e coberto por teste.
- Não executar o workflow novamente sem mudança relevante: o HEAD atual já tem CI verde.
- Não tirar a PR de Draft nem fazer merge: falta validação visual e revisão formal.
- Relatórios de auditoria foram gravados em branch documental separada para não disparar o workflow de pixel-art da PR #11 por push de documentação.

## Relatórios
- [Auditoria funcional do Estúdio Pixel Art / PR #11](../relatorios-actions/2026-11-02-auditoria-funcional-estudio-pixel-art-pr11.md)
- [Auditoria da PR #11 — causas de CI e contramedidas](../relatorios-actions/2026-11-02-auditoria-pr11-causas-ci-e-contramedidas.md)

## Estado final
A PR #11 está com CI verde no SHA auditado, mas permanece draft e não integrada. O runner recuperou-se e o CI não é mais o bloqueio imediato. O próximo trabalho técnico recomendado é implementar a correção pixel-perfect da spritesheet com teste automatizado e depois validar os presets de ataque e o round-trip Godot.
