# APOENA GAME CREATOR v4.0 — Bancada Integrada (primeira etapa)

## Como abrir pelo Android
- **Mais simples:** baixe `APOENA_GAME_CREATOR_V4_0_BANCADA_INTEGRADA.html`, abra em um navegador que permita arquivos HTML locais e toque em **▶ Testar itens** (topo) ou em **🧪 Bancada de Testes** (navegação).
- Sem APK. A sessão de testes entra no projeto editável; use **Salvar projeto editável** ou **Projetos e segurança**. Em alguns visualizadores Android, IndexedDB/download local pode ser bloqueado: prefira o backup JSON externo.

## O que foi alterado
- Nada da versão 3.9.2 foi removido: 15 scripts e todos os sistemas anteriores permanecem.
- A bancada usa **state.items** e **state.recipes** originais, com um campo **runtimeSessionV40** dentro do projeto editável. Não cria bancos de itens paralelos.
- Testa: coletar, comprar, vender, equipar, desequipar, consumir efeito de HP/Aurium, preparar receita instantaneamente, validar referências. Falha sem alterar estado se requisito não for atendido.
- Os efeitos condicionais, temporários, combate, física, missões, IA, multiplayer e temporização de receitas NÃO são simulados falsamente.
- Inclui um **projeto Godot 4 de testes** que lê os dados exportados pelo mesmo catálogo. Abra Godot no PC, importe `project.godot` e execute.
- **Exportar Sala Godot 4** gera ZIP diretamente da Bancada com seus itens/receitas atuais. É um projeto de laboratório, não um jogo final ou exportação Android.
- **Zerar somente o teste** não apaga os dados de projeto; projetos totalmente vazios e limpeza por categoria continuam na Central de Projetos existente.

## Pacotes
- `APOENA_GAME_CREATOR_V4_0_BANCADA_INTEGRADA.html` — app offline completo com a bancada. Usa imagens embutidas na mesma qualidade anterior.
- `FONTES_V4_0` — fontes e CSS isolados para futura modularização.
- `SALA_GODOT_V4_0` — projeto de demonstração Godot com 3 itens de exemplo, importável sem editar um jogo existente.
- `TESTES_V4_0` — testes automáticos Node.
- Todas as pastas anteriores e o HTML v3.9.2 original do ZIP foram preservados. Não apague versões anteriores antes de abrir e salvar seus projetos.

## O que ainda NÃO está pronto
- Não foi possível rodar Godot 4 neste ambiente. O GDScript do projeto de teste requer validação com Godot no PC antes de afirmar execução real.
- O pacote não implementa editor universal de cenas, motor genérico de componentes, fluxo completo de personagem/mapa, integração multiplayer, atualizações automáticas ou compilação Android.
- A bancada de regras JS executa testes, mas não substitui o motor Godot nativo.
