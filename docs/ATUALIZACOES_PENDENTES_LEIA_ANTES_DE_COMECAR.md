# APOENA — Atualizações pendentes: leia antes de começar

**Data do registro:** 30/10/2026 (BRT; hora exata não preservada)
**Local:** GameCreator, documentação interna do repositório
**Função:** preservar decisões criativas, distinguir o que existe do que falta e orientar as próximas IAs sem apagar implementações anteriores.

## Como usar este documento

- **IMPLEMENTADO (código conferido):** função localizada no repositório, mas não significa que seu funcionamento integral passou em testes.
- **VALIDADO:** há teste ou execução associada ao commit que comprova o comportamento descrito.
- **PARCIAL:** parte já existe, mas ainda não atende completamente ao uso pretendido.
- **PENDENTE:** solicitação aceita para avaliação/implementação, sem evidência de código pronto.
- **A CONFERIR:** faltam evidências para vincular a queixa à ferramenta/arquivo correto.
- Ao começar uma tarefa, ler este arquivo, `AGENTS.md`, o protocolo sequencial e as bases de erros relevantes. Ao concluir, atualizar o estado com arquivos, commit, testes e data; não apagar a intenção original.
- Registrar separadamente **ideia discutida**, **decisão aprovada**, **implementação**, **validação** e **resultado integrado na main**. Não marcar conversa ou proposta como recurso implementado.
- Manter **WIP = 1** somando GameCreator e Apoena Pixel Art HTML; não disparar workflows redundantes.
- Relatórios técnicos permanecem **no GitHub**, não precisam ser reproduzidos na conversa. Só avisar o usuário sobre bloqueios, decisões criativas e resultados relevantes.
- A IA não recebe automaticamente toda conversa ocorrida em outras ferramentas: somente atualizar com informações efetivamente acessíveis na sessão ou recebidas de quem estiver operando o projeto. Não inventar o que teria sido discutido.

## Decisões preservadas sobre os produtos

- **GameCreator:** ferramenta de criação/edição e exportação, incluindo HTML e Godot; não confundir com o jogo.
- **Apoena Pixel Art HTML:** jogo com implementação em HTML e Godot; permanece distinto do editor e de outros jogos.
- **Apoena H:** outro jogo, com identidade e decisões próprias; não mover funcionalidades ou tratar como nome alternativo do Pixel Art.
- A liberdade criativa do autor é requisito: automações devem auxiliar e permitir desfazer/reconfigurar, não impor uma única solução artística.
- Decisões gerais discutidas para o universo Apoena incluem modos História, Exploração Livre e MOBA; a presença real de cada modo e de suas mecânicas deve ser checada por repositório antes de marcar implementado.

## GC-TILE-001 — Interfaces do editor de tilesets pequenas e esticadas

- **Estado:** PENDENTE DE CORREÇÃO; reclamação de uso confirmada pelo autor, causa exata visual não reproduzida.
- **Relato de 30/10/2026:** controles pequenos, espaços esticados e necessidade de menu mais otimizado.
- **Código consultado:** `map-editor/index.html`; layout atual com colunas de 244px / flexível / 234px; botões e grupos em flex-wrap, escala do canvas independente dos painéis. É um possível fator contribuinte, não uma causa visual comprovada.
- **Meta:** interface responsiva com ferramentas agrupadas por função (pintura, tileset, objetos, mapa, exportação); ícones e textos legíveis; área de mapa maior; painéis recolhíveis; botões alcançáveis por toque e mouse; sem perda de atalhos ou funções.
- **Aceitação:** testar telas pequenas e grandes, navegação com teclado, seleção de tilesets, pintura, zoom, desfazer/refazer e importação/exportação; preservar o comportamento das ferramentas antigas.
- **Evidência:** código de layout inspecionado; ainda sem teste visual do relato.
- **Próxima ação:** identificar a tela exata usada pelo autor e validar melhoria em interface antes de alterar layout global.

## GC-TILE-002 — Água e outros terrenos não conectam automaticamente como esperado

- **Estado:** PARCIAL no código; comportamento relatado sem reprodução no PNG específico do autor.
- **Relato de 30/10/2026:** ao escolher peças de água e pintar, as margens não dão continuidade visual; o comando “Conexões automáticas de terreno” não produz o resultado esperado.
- **Implementado conferido:**
  - `map-editor/index.html`, função `smartWaterTile(x,y)`, calcula vizinhos norte/leste/sul/oeste para terreno 3 (água) e escolhe índices fixos do atlas.
  - Renderização automática da água somente quando `sheetProfile === 'agar24'`, `smartTile` está ligado e célula usa terreno 3.
  - `Usar tile selecionado` coloca o editor em `mode='atlas'` e pinta código `1000+selectedTile`, portanto a peça permanece fixa, sem autotiling por vizinhança.
  - `Carregar salvo` da biblioteca redefine `sheetProfile='manual'`, mesmo havendo perfil salvo nos metadados; esse fluxo perde o modo de autotiling do perfil `agar24`.
  - A verificação `shared/tileset-check.js` identifica dimensões, transparência e repetição nas bordas; **não faz reconhecimento semântico de peças nem autotiling**.
- **Por que falha para folhas arbitrárias:** índices rígidos do atlas Apoena 6×4 não identificam automaticamente a peça de centro, lados, cantos, curvas e transições de um PNG de outra organização. A função atual também não oferece uma tabela universal de 8 vizinhos/diagonais ou mapeamento explícito configurável.
- **Solução planejada, ainda NÃO implementada:**
  1. Manter pintura manual intacta e dar escolha explícita entre **Peça individual** e **Terreno com conexão automática**.
  2. Criar configuração de autotile por tileset (perfil + mapeamento de índices para centro, bordas, cantos internos/externos e transições) com pré-visualização; oferecer configuração assistida quando não for possível inferir as peças.
  3. Determinar variação por vizinhos e recalcular também células adjacentes após pintar, preencher, apagar, desfazer/refazer e carregar; preservar aparência na exportação e reimportação.
  4. Preservar o perfil salvo nos metadados da biblioteca e validar a grade real da imagem. Não recortar, recolorir ou modificar os PNGs originais sem confirmação.
  5. Tratar limites do mapa e combinações não previstas com fallback visível e informativo, nunca simulando conexão perfeita.
- **Aceitação:** teste com rio vertical/horizontal, curvas, cruzamentos, margem isolada, lago, canto interno/externo, extensão e remoção de água, modo manual e perfil personalizado; confirmar que não há frestas, orientações trocadas ou distorção.
- **Arquivos-alvo prováveis:** `map-editor/index.html`, novo módulo de autotiling testável em JS, suíte de testes dedicada e persistência JSON/biblioteca. Não presumir que a mudança foi implementada só por este planejamento.

## GC-TILE-003 — Confirmar ferramenta efetivamente aberta pelo autor

- **Estado:** A CONFERIR.
- O usuário relatou que não sabia se a ferramenta aberta era exatamente o editor de mapas/tilesets inspecionado. A análise acima se aplica **ao arquivo `map-editor/index.html` na main do GameCreator**, não a qualquer outra tela possível.
- **Critério:** relacionar a tela utilizada ao URL local, aba do GameCreator ou arquivo; só então afirmar que GC-TILE-001/002 reproduzem exatamente o defeito observado.
- Se a ferramenta for outra, registrar repositório/arquivo correto e manter este diagnóstico como investigação de código, não como incidente reproduzido.

## Regra para manutenção da fila

1. **Prioridade 1:** confirmar a ferramenta e consertar a conexão visual dos terrenos sem perder a pintura manual.
2. **Prioridade 2:** reorganizar a interface preservando todas as funções atuais.
3. **Prioridade 3:** expandir autotiling para folhas externas e perfis reutilizáveis com testes completos.
4. Antes de executar suite pesada, testar a lógica de vizinhos isoladamente; depois usar o workflow canônico, e registrar evidência real de sucesso.
5. Após sucesso validado, mover tarefa para seção concluída neste mesmo arquivo, com data, commit, teste e comportamento confirmado. Nunca excluir o histórico de decisão.
