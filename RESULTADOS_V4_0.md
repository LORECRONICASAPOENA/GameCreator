# Relatório de validação — Game Creator v4.0, etapa 1

**Base:** `APOENA_GAME_CREATOR_v3_9_2_PROJETOS_SEGUROS_COMPLETO.html` e pacote ZIP original.

**Mudanças:** bancada de operações centralizadas, regras transacionais separadas, projeto de laboratório Godot 4 exportável a partir dos itens e receitas existentes, testes de regressão.

**Verificações aplicadas:**
- `node --check` nas fontes novas e 15 scripts anteriores; sem erro de sintaxe.
- `node --test` em oito testes aprovados: coleta/fabricação/consumo, compra sem ouro, falha transacional, bônus de equipamento, proibição de venda equipado, efeitos não suportados, limpeza/troca de catálogo, IDs duplicados e ações não declaradas.
- Playwright/Chromium, interface da Bancada isolada: abrir, coletar, fabricar, consumir e atualizar HP, sem erros JS.
- O teste da página completa sem imagens incorporadas excedeu o tempo permitido; não foi declarado como aprovado.
- Pacote ZIP íntegro via Python `ZipFile.testzip()` e hashes SHA-256 de PNGs originais idênticos à entrega anterior.
- Arquivo HTML novo contém todos os 15 scripts originais byte a byte, na ordem anterior, mais dois scripts da bancada e seu CSS.
- Atalhos `ABRIR_GAME_CREATOR.cmd` e `INICIO_RAPIDO.html` foram atualizados para apontar para v4.0; atalhos originais permanecem em backup no ZIP.

**Limites:** não é certificação de runtime Godot ou Android físico. A bancada no navegador é uma simulação transacional vinculada aos dados reais do Creator; o projeto Godot é um laboratório executável sujeito a teste em Godot 4 no PC.
