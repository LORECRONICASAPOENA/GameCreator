# Checkpoint documental — CI da PR #11 e Zodíaco de APOENA

**Data de referência:** 02/11/2026 (horário da consulta não certificado).  
**Origem:** consulta autenticada ao GitHub dos repositórios `apoenalore/GameCreator` e `apoenalore/apoenaskil`.  
**Natureza:** backup documental incremental, não backup integral do computador, IndexedDB, anexos, sprites ou transcrições privadas.

## 1. Estado do GameCreator

- Repositório: https://github.com/apoenalore/GameCreator
- Último commit da branch padrão encontrado antes desta operação: `92ee56dd41c858e3f1fb39df3c0a179ca9a2b332`, atualização do histórico documental.
- PR [#11 — GC-ANIM-006](https://github.com/apoenalore/GameCreator/pull/11), título "abrir e editar animações de Apoena no Estúdio": **aberta, draft, não integrada**.
- Branch da PR: `feat/apoena-personagem-estudio-main`; head confirmado: `0447ea9dc9d9310e985247325e3af1d1c726519a`.
- O head `0447ea9` acrescentou ao workflow o teste `tests/pixel-art-export.test.cjs`, que verifica exportação pixel-perfect de spritesheet em ambiente simulado.
- **Atualização importante:** a execução GitHub Actions [41461801598](https://github.com/apoenalore/GameCreator/actions/runs/41461801598), antes registrada como em andamento, agora está **completed/success** para o SHA `0447ea9...`.
- Job `validar` ID `125332443319`: **completed/success**. A consulta à lista de etapas confirma sucesso nas verificações de sintaxe JavaScript, Corte Inteligente, exportação pixel-perfect, tilesets, biblioteca/IndexedDB, backup/restauração, catálogo e contrato Godot, sincronização V4.0/V4.1, contratos de integração, hidrologia/erosão quando presente e runtime Godot 4 headless.
- Três etapas de artefatos/diagnósticos do workflow ficaram `skipped` ("Preparar entrega...", "Disponibilizar pacote...", "Anexar logs..."). O job foi aprovado apesar dessas etapas não executadas; não inferir que pacotes de entrega ou logs foram publicados.
- **Limite da evidência:** o sucesso é específico do SHA `0447ea9...`. Não demonstra por si só fidelidade visual da caminhada e do ataque, usabilidade interativa em navegador, gameplay completo, teste em Android físico nem autorização de merge.
- A PR continua em draft; não foi efetuado merge, rerun ou alteração do código nesta rotina.

## 2. Nova informação no Apoena Skill

- Repositório: https://github.com/apoenalore/apoenaskil
- Novo commit verificado: [`50a672ab15b3f784dff0dcf864dac15c87989894`](https://github.com/apoenalore/apoenaskil/commit/50a672ab15b3f784dff0dcf864dac15c87989894) — `docs: add Apoena zodiac constellation knowledge`.
- Documento adicionado: `docs/lore/zodiaco-de-apoena.md`.
- O documento atribui ao criador a lista e as quantidades de estrelas das **13 constelações**:
  - **Cordeiro: 10 estrelas.**
  - **Serpentário: 9 estrelas.**
  - **Touro, Falcão, Baleia Celestial, Fênix, Leão, Lobo, Urso, Elefante, Tartaruga, Corvo e Escorpião: 7 estrelas cada.**
  - Total: `10 + 9 + 11×7 = 96 estrelas`.
- Regras visuais expressas no documento: representar cada estrela como ponto amarelo individual e contável; linhas podem conectar os pontos, mas não contam como estrelas; evitar brilhos/ornamentos confundíveis com estrelas; o texto de quantidade não substitui os pontos reais.
- **Governança:** preservar esses números e requisitos como informação atribuída diretamente ao criador na fonte; não presumir que um sistema de constelações esteja implementado no GameCreator. A integração com sistemas de jogo exige especificação e autorização próprias.
- Referência do documento: https://github.com/apoenalore/apoenaskil/blob/main/docs/lore/zodiaco-de-apoena.md

## 3. Princípios de preservação

1. Manter o histórico Git e não apagar arquivos sem auditoria e autorização.
2. Separar informação canônica da obra de implementação comprovada no Creator/Runtime.
3. Preservar **WIP = 1** e não iniciar uma segunda frente de código por conta deste registro.
4. Não registrar testes simulados como validação visual/funcional em dispositivos físicos.
5. Não expor segredos ou tokens.
6. Não produzir commits documentais vazios se não houver novidades verificáveis.

## 4. Próximos passos pendentes

- Revisão visual das animações de caminhada e ataque de Apoena e exportação real no navegador.
- Importação e teste de gameplay no Godot, depois Android físico, com evidência por SHA.
- Avaliar se a PR #11 pode sair de draft após revisão autoral; nenhum merge automático.
- Manter o catálogo das constelações sincronizado com o Apoena Skill sem duplicar fontes de verdade.
- Completar Backup Mestre: documentos e sprites originais, biblioteca IndexedDB, anexos locais, transcrições recuperáveis, manifesto de hashes e teste de restauração.

## 5. Escopo da operação

A operação acrescenta somente documentação e índice no GitHub. Não altera código, assets, workflows, runner, PR, biblioteca IndexedDB nem arquivos locais. Não é uma transcrição literal integral da conversa.
