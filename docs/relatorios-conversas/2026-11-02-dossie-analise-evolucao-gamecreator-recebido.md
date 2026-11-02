# Dossiê de análise, backup e plano de evolução — Apoena GameCreator

**Data:** 02/11/2026. **Origem:** análise fornecida pelo criador nesta conversa, atribuída a outra IA. **Natureza:** preservação do material recebido; não é auditoria independente.

## Limites de evidência
O material declara consulta ao README, plano geral e auditoria existente. As afirmações sobre funcionalidades e arquitetura devem ser reconfirmadas no código e em testes. Descrição em README, cadastro ou existência de testes não comprova execução ponta a ponta.

## Visão registrada
O GameCreator é descrito como plataforma de autoria integrada ao Godot, com Pixel Art, spritesheets, mapas 2.5D, tilesets, biblioteca de assets, itens, receitas, inventário, projetos, backups e exportação. A meta é conectar ferramentas num fluxo único, sem reconstruir funcionalidades existentes sem auditoria.

## Estrutura citada para verificação
Diretórios citados: bundle-v4, biblioteca, docs, historico/documentacao, integracao, legacy, map-editor, pixel-art, shared, tests e workflows. Documentos citados: README.md, AGENTS.md, AUDITORIA_CODIGO_EXISTENTE.md, PLANO_GERAL_APOENA.md, ORGANIZACAO_EDITOR.md, RESULTADOS_V4_0.md e STATUS_V4_0_ETAPA_1.md. A análise relata V4.1 em desenvolvimento preservando a base V4.0; confirmar no repositório.

## Funcionalidades descritas como existentes
Pixel Art: importação PNG/WebP/JPG, recorte livre e por grade, transparência, remoção de fundo por região conectada, detecção de sprites, prévia de spritesheets e exportação PNG/JSON.
Biblioteca: IndexedDB, categorias, etiquetas, metadados, projetos editáveis, atualização por identificador e exportação/restauração de backups.
Mapas: editor 2.5D, tilesets, grade, verificação de bordas transparentes, repetição de tiles e compatibilidade dimensional.
Integração: catálogo portátil, itens, receitas, inventário, coleta, fabricação temporizada, efeitos e salvamento/restauração de sessão no Godot.
Qualidade: testes automatizados, IndexedDB simulado e testes de backup, tilesets, catálogo e ponte entre ferramentas, além de CI.

## Legado mencionado
A auditoria V3.9.2 é citada como contendo editor de layout, fábrica de itens, inventário/lojas, receitas, biblioteca de imagens, fichas de personagens, animações 3D, controles PC/Android, eventos, simulador, missões, diálogos, NPCs, drops, central de projetos, checkpoints e exportação Godot. São pistas para auditoria, não prova de que tudo continua funcional.

## Princípio arquitetural
Separar Creator (autoria, assets, mapas, objetos, metadados e contratos) de Runtime/Jogo (história, exploração, combate, economia, ecossistema, NPCs e persistência), compartilhando contratos versionados sem duplicar responsabilidades.
Validar o ciclo completo: criação → exportação → importação → execução → alteração de estado → salvamento → recuperação. Cadastro ou JSON exportado não comprova mecânica funcional.

## Propostas não implementadas por este registro
1. Apoena AI Studio: assistência por linguagem natural para conteúdo, com proposta estruturada, validação de schema/referências, prévia, aprovação humana, gravação e testes.
2. Editor de mundos inteligentes: geração assistida/procedural de terrenos, biomas, rios, lagos, montanhas, florestas, cidades, clima e recursos; distinguir cenário estático, recurso interativo e organismo simulado.
3. NPCs e mundo vivo: identidade, profissão, objetivos, inventário, rotinas, necessidades, relações e histórico; execução determinística no runtime, evitando chamadas constantes a modelos de IA.
4. Automação: conversão de imagens, validação de spritesheets, assets ausentes, IDs, referências quebradas, mapas, manifestos, exportação e compatibilidade Godot.
5. Multiplataforma: interface responsiva, controles adaptáveis, otimização de memória, persistência e testes em Android físico e PC.

## Arquitetura-alvo sugerida
A Interface contém os editores; Serviços Compartilhados cuidam de assets, projetos, salvamento, backup e validação; Contratos de Dados definem schemas versionados; IA auxilia autoria; Exportação prepara recursos e manifestos; Runtime executa combate, NPCs, inventário, economia, ecossistema, progressão e persistência. É proposta, não descrição comprovada da implementação atual.

## Mundo vivo e desempenho
Sistemas sugeridos: economia (oferta, demanda, estoque, produção, consumo e preços), ecossistema (germinação, crescimento, água, nutrientes, luz, temperatura, estações, frutificação, dispersão e decomposição), NPCs (rotinas, profissões, relações e comércio) e progressão (personagem, mundo e menu). Para mobile: simulação completa apenas onde necessária, simplificada para entidades próximas e orientada a eventos para regiões distantes; dividir mundo em regiões e definir orçamento por quadro.

## Roadmap proposto
1. Auditoria e estabilização: mapear módulos, duplicações, incompletudes, contratos, persistência, backups e compatibilidade.
2. Consolidar schemas, IDs, biblioteca, comunicação, persistência, validação e exportação.
3. Validar fluxo item → coleta → inventário → uso → alteração de estado → salvamento → recuperação no Godot.
4. Evoluir editor de mundos: terrenos, autotile, camadas, colisões, alturas, objetos, entidades e exportação.
5. Implementar sistemas vivos: coleta, produção, comércio, NPCs, rotinas, economia e ecossistema.
6. Integrar Apoena AI Studio com contratos, validação, prévia e aprovação.
7. Consolidar desempenho, compatibilidade, documentação, recuperação e distribuição.

## Riscos
Evitar novas funcionalidades antes de estabilizar as existentes, duplicação, confusão entre cadastro e execução, mudanças grandes sem testes, quebra de compatibilidade, dependência excessiva de IA externa, simulação pesada em mobile, gravação sem validação, interface excessivamente complexa e declarações de conclusão sem evidência.

## Critérios para futuras implementações
Cada mudança deve registrar problema, justificativa, arquivos afetados, comportamento esperado, critérios de aceitação, testes e resultados, riscos e reversão. Sequência: estudar código, diagnosticar, acordar prioridade, especificar, implementar mudanças pequenas, testar, verificar compatibilidade e documentar.

## Fontes apontadas no material
- https://github.com/apoenalore/GameCreator
- https://github.com/apoenalore/GameCreator/blob/main/README.md
- https://github.com/apoenalore/GameCreator/blob/main/PLANO_GERAL_APOENA.md
- https://github.com/apoenalore/GameCreator/blob/main/AUDITORIA_CODIGO_EXISTENTE.md
- https://github.com/apoenalore/GameCreator/blob/main/ORGANIZACAO_EDITOR.md
- https://github.com/apoenalore/GameCreator/blob/main/AGENTS.md

## Limitações declaradas
O material recebido declara que não houve execução integral do aplicativo, auditoria linha a linha de todos os módulos nem validação física em Android ou ponta a ponta no Godot nesta análise.

**Próximo passo:** produzir matriz verificável com funcionalidade, módulo, estado real, evidência de implementação, dependências, testes, problemas, melhorias e prioridade. Começar pelo fluxo de itens/coleta/inventário/runtime Godot.

**Princípio orientador:** preservar o que funciona, compreender o que existe, corrigir o que precisa melhorar e construir o futuro sem comprometer o passado.