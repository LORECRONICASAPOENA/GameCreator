# Checkpoint cruzado de Skills — requisitos recuperados do Game Creator

**Data da conferência:** 2026-11-02, aproximadamente 07h BRT (10h UTC).  
**Tipo:** backup documental incremental de conhecimento recuperado.  
**Estado:** RECUPERADO — VALIDAR; não é implementação nem teste de código.  
**Fonte primária desta rodada:** commit [633743695d7f1d0a26c3926ef706b61ee9f75df9](https://github.com/apoenalore/apoenaskil/commit/633743695d7f1d0a26c3926ef706b61ee9f75df9) da `main` de `apoenalore/apoenaskil`, arquivo [conversation-recovery-2026-11-01-historiaegeografia-project.md](https://github.com/apoenalore/apoenaskil/blob/633743695d7f1d0a26c3926ef706b61ee9f75df9/apoena/docs/conversation-recovery-2026-11-01-historiaegeografia-project.md), seção "Adendo da auditoria — 2026-11-02".

## 1. Por que registrar

Desde o último checkpoint do GameCreator, a base Apoena Skill recebeu um adendo de auditoria com requisitos de editor e jogo anteriormente dispersos em conversas. Este documento transporta **somente os requisitos e pendências relevantes** para o planejamento do Game Creator e mantém a origem verificável, sem alegar acesso integral às 32 conversas indexadas no projeto. O registro da Skill é explicitamente **PARCIAL**: algumas conversas e anexos não foram recuperados.

## 2. Requisitos de autoria recuperados

### Editor e biblioteca (conversa "Corrigir arquivos Godot")
- O Pixel Art e o Creator devem ser partes do **mesmo ambiente de autoria**; não resolver a integração com uma aba decorativa ou um editor paralelo.
- Biblioteca central de recursos com importação e transferência de imagens entre ferramentas.
- Edição de imagens com transparência, apagador, recorte manual, grade e recorte inteligente.
- Animações de personagens e animais indexadas por **ação, direção e quadro**.
- Suporte a **fases de espécies** nos recursos necessários ao jogo.
- Tilesets e mapas **2.5D** integrados à biblioteca e ao pipeline.
- Exportação de recursos e metadados para o runtime, com persistência, salvamento e reabertura.

**Conciliação com GC-PLAT-001:** esses requisitos reforçam a arquitetura de três estúdios (3D, Pixel Art 2D, Mapas 2.5D) com uma biblioteca/projeto compartilhados. Antes de implementar, auditar os recursos existentes em `pixel-art/`, `map-editor/`, `shared/asset-library.js` e a bancada 3D. Não afirmar que recorte inteligente, animação completa ou integração runtime já estão funcionando.

### Edição visual (conversa "Acompanhamento ativado")
- Evolução histórica pretendida do GameCreator 3.8 para 3.9; **entrega 3.9 funcional não comprovada** por esse relato.
- Imagens ajustadas ao quadro, camadas e composição de elementos (exemplo: construção + placa personalizada + interação por clique).
- Realce amarelo de objetos no hover, edição livre com auxiliares inteligentes, importação/transferência e salvar/reabrir.
- Estes são requisitos a confrontar com a versão atual, não instrução para voltar a V3.9 nem para substituir recursos mais recentes.

### Requisitos de jogo com impacto no editor (conversa "Corrigir arquivos Godot")
- Clima e estações coerentes com a ambientação brasileira **no cenário ao qual o pedido se referia**; não impor ausência de neve a todos os mundos de fantasia ou à Montanha dos Espíritos.
- Simulação ecológica planejada: condições de terreno, água, nutrientes, luz e espaço influenciam crescimento de plantas; frutos/sementes, dispersão por animais, decomposição de árvores e rebentos de bananeiras.
- Integração futura com cultivo, colheita, comércio, animais, monstros, masmorras e dragões.
- Cooperação local entre **dois celulares** via Bluetooth ou Wi-Fi Direct foi solicitada historicamente; não confundir com a arquitetura online híbrida Android/PC, que é outra frente de planejamento.
- Redução de 30% no dano do ajudante convidado foi uma **proposta discutida, não regra final aprovada**.

**Impacto de arquitetura:** o editor deve permitir armazenar metadados declarativos de bioma, clima, condições do terreno, crescimento e interação, **se e quando** o runtime definir contratos e sistemas consumidores. Não simular ecologia ou conectividade local apenas por adicionar campos de UI.

## 3. Falha histórica de Runner recuperada

A conversa "Erros do Runner" menciona:
- erro `Identifier not found: EstadoHistoria` em `res://scripts/modelo_heroi_3d.gd:54`;
- teste `personagens_provisorios_smoke` excedendo **120 segundos**;
- execução posterior ainda em andamento na conversa de origem.

**Classificação:** incidente histórico **sem reprodução atual**. Não declarar resolvido nem aberto no HEAD atual sem inspecionar o repositório do runtime Godot e reproduzir no SHA correto. A captura de tela da conversa não estava disponível. Não atribuir esses sintomas às falhas do GitHub Actions `41380526501` e `41367279379`, que permanecem sem causa demonstrada.

## 4. Priorização sem romper WIP = 1

1. **Agora, apenas documentação:** registrar a fonte e cruzar requisitos com a arquitetura existente; nenhum código de editor ou runtime foi alterado.
2. **Após a tarefa ativa GC-UPDATE-009:** confirmar a situação da PR #7 e logs causais antes de retomar a unificação.
3. **Inventário:** mapear o que já existe para camadas, recorte, animação, importação, biblioteca e mapa, classificando cada item como implementado/verificado, histórico, ausente ou incerto.
4. **Contratos compartilhados:** planejar metadados de animação (ação/direção/quadro), fases de espécies e composição de objetos, preservando compatibilidade com `apoena.central.v1`, `apoena.gamecreator.catalogo.v1` e `apoena.map2d.v1` até auditoria dos consumidores.
5. **Runtime em tarefa própria:** avaliar ecologia, clima e cooperação local contra os requisitos de plataforma, custo e arquitetura de rede; não prometer comportamento executável sem teste.

## 5. Snapshot de GitHub verificado nesta rodada

- **GameCreator `main`:** `1b95d036c31dfb4ca9f9ce6859510be2c9f7e8cd`; sem alteração desde o checkpoint anterior.
- **GameCreator PR #12:** branch `maintenance/audit-cleanup-20261102`, aberta e draft; head antes desta atualização `c081cd8b9ff405cc2aa5ed4cfa526d494257a130`.
- **GameCreator PR #7:** aberta e draft, head `b5836634b19dfcad3fa61fc3f7a85561c5be1f95`; sem validação final demonstrada.
- **Apoena Skill `main`:** novo commit `633743695d7f1d0a26c3926ef706b61ee9f75df9` de 2026-11-02 09:42:49 UTC, contendo o adendo recuperado.
- **Apoena Skill PR #6:** aberta e draft, head `6538f86ca63dec1aef68f1a558047036e6950c38`; é backup documental adicional ainda não integrado na `main`.
- **CI GameCreator:** últimas execuções listadas continuam incluindo `41380526501` (failure, PR #7) e `41367279379` (failure, main); sem novos logs causais nesta rodada. Não houve retry.

## 6. Integridade e limites

Esta atualização preserva conhecimento e proveniência no GitHub; não altera a `main`, os editores, assets, workflows, o runtime Godot nem instalações locais. Não equivale a backup de IndexedDB, spritesheets/modelos locais ou diretórios do usuário. Não converte propostas de IA, relato de conversa ou falhas antigas em funcionalidades implementadas. Nenhum arquivo funcional deve ser excluído antes da auditoria de dependências e testes.
