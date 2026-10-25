# Game Creator v4.0 — Etapa 1 da integração (25/10/2026)

## Base inspecionada
O HTML v3.9.2 possui editores e cadastros para itens, receitas, layout, projetos, recursos e integrações de referência para Godot 4. Esta etapa **reutiliza** `state.items` e `state.recipes`. Nenhuma Fábrica de Itens foi recriada.

## Implementação criada nesta etapa
- Bancada JS com ações transacionais: coletar, comprar, vender, equipar, desequipar, usar efeitos simples de HP/Aurium e fabricar receita instantaneamente.
- Estado de sessão isolado em `state.runtimeSessionV40`, persistido apenas quando o usuário salva seu projeto editável.
- Validação de IDs, receitas e operações não suportadas (sem declarar efeitos temporários como executados).
- Geração de um ZIP contendo `project.godot`, cena, GDScript e os dados atuais do catálogo para testes no motor.
- Projeto Godot separado para ações de inventário e persistência de sessão em `user://` (sem misturar código do jogo Apoena Agar).
- Backups e limpeza por categoria existentes na v3.9.2 mantidos.

## Evidências locais (não são testes Godot)
- 17/17 scripts JavaScript passaram em `node --check`, sendo 15 arquivos inline anteriores sem alteração.
- 8/8 testes unitários Node passaram.
- Interface isolada validada em Chromium/Playwright: coletar -> fabricar -> consumir -> HP atualiza.
- 52 PNGs conferidos por hash idênticos aos do ZIP original; ZIP passou `testzip()`.
- No Windows, o lançador e início rápido foram atualizados para abrir v4.0, preservando cópias dos atalhos anteriores.

## Ainda NÃO concluído
- Teste nativo em Godot 4, Android físico e abertura completa do HTML em navegador (teste integral excedeu o tempo do ambiente).
- Executor universal de efeitos temporários, NPC/IA, colisões, mapas, animações, combate e multiplayer.
- Exportação de um **jogo completo**, compilação de APK e atualizações automáticas.
- Migração controlada para código modular e publicação do código principal do Creator neste repositório.

## Pacote de entrega
Os arquivos HTML/ZIP da v4.0 foram disponibilizados na conversa com o usuário. **Este commit publica somente o registro técnico, não o programa.** É necessário publicar os fontes e a versão completa para tornar o GitHub a fonte de verdade.

## Próximas ações objetivas
1. Rodar projeto Godot e corrigir eventuais erros reais.
2. Testar salvamento/limpeza/troca de projetos e 52 imagens no Android.
3. Conectar ações declaradas a cenas reais usando scripts Godot já existentes.
4. Versionar fontes completas, gerar builds verificáveis e criar testes de regressão automáticos.
5. Implementar editor de cenas/fluxo jogável somente após validação da integração atual.
