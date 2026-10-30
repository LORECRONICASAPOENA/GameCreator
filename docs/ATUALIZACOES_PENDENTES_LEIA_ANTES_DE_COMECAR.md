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

## Requisitos complementares — decisões discutidas em 30/10/2026

**Estado de todos os itens nesta seção:** PLANEJADO / NÃO IMPLEMENTAR ATÉ PEDIDO EXPLÍCITO. Esta seção preserva decisões e relatos do autor; não comprova que o comportamento esteja pronto ou validado. **Restrição atual do autor:** apenas documentar, não modificar interface, funcionalidades, testes ou workflows nesta etapa.

### GC-UX-004 — Simplificar fluxo e navegação do GameCreator
- **Relato:** o autor considera a interface atual confusa até para quem desenvolve a ferramenta; menus e campos de funções diferentes estão misturados e sobrecarregam a visualização.
- **Diretriz de organização:** o fluxo natural do usuário é (1) criar/importar e configurar recursos reutilizáveis, personagens, itens, animais, plantas e objetos; (2) definir comportamentos e animações; (3) **abrir o editor de mapas ao final**, para montar o cenário a partir da biblioteca pronta. Não apresentar o mapa como painel permanente em todas as etapas.
- **Navegação prevista:** menus contextuais, poucos níveis, grupos claros e painéis recolhíveis; tela principal dedicada à tarefa atual; editor de mapas acessível por aba/barra própria no final do fluxo. A preferência por posição “no final” é decisão expressa do autor; apresentação exata ainda deve passar por revisão visual.
- **Dentro do editor de mapas:** biblioteca organizada e consultável por categorias distintas: **Tiles/terrenos**, **Assets/árvores e cenários**, **Personagens e NPCs**, **Itens e veículos** (ex.: carro, balão, carroça), **Animais**; categorias devem reaproveitar os recursos já cadastrados, evitando importações redundantes.
- **Requisitos de usabilidade:** busca, miniaturas legíveis, filtros por categoria, comportamento transparente de seleção, painéis adequados a celular/PC, área de mapa prioritária, distinção entre editar um recurso e posicioná-lo no mapa.
- **Critério de aceite futuro:** o usuário conclui o percurso “criar recurso → salvar comportamento → reencontrar recurso → inserir no mapa” sem repetir importação, sem menus sobrepostos e sem perder funções existentes.
- **Código já existente (verificado):** `pixel-art/modulo-integrado.js` possui abas de personagens, objetos e mapas; `map-editor/modulo-integrado.js` carrega editor integrado sob demanda; `biblioteca/index.html` e `shared/asset-library.js` implementam parte da biblioteca. Isso é **parcial**, não a reorganização proposta.

### GC-ANIM-005 — Dois modos de animação do personagem
- **Decisão de produto:** preservar e ampliar dois fluxos complementares, sem obrigar o autor a escolher um só:
  1. **Animação 2D tradicional** por sprites/quadros, direções e ações; montagem de spritesheet e exportação compatível com HTML e Godot.
  2. **Animação por partes recortadas**: importar fotografia/desenho original, separar cabeça, tronco, braços, antebraços, mãos, quadril, pernas e acessórios; alinhar pivôs/articulações; vincular **esqueleto 2D hierárquico** e simular profundidade/perspectiva para aparência 2.5D/pseudotridimensional, com rotação/escala/deslocamento das peças, ordenação de camadas e animação de ossos.
- **Restrições:** a aparência de profundidade não deve ser confundida com reconstrução automática de geometria 3D real. Não exigir Blender, GPU dedicada ou serviço pago; mirar HTML/Canvas/WebGL leve e exportação futura para Godot sem prometer compatibilidade ainda não testada.
- **Requisitos de trabalho:** ajustar pivôs, hierarquia de ossos e camadas sem destruir imagens; alternar visualização 2D e pseudo-3D; timeline/keyframes, pose, prévia, desfazer/refazer, salvar projeto editável e exportar resultados.
- **Liberdade criativa:** nunca recortar, deformar, redesenhar ou substituir parte da imagem de origem sem prévia e controle do autor.
- **Estado conferido:** gerador modular com spritesheet e estúdio de recortes já existem em `pixel-art/modulo-integrado.js`, `pixel-art/estudio.html` e `pixel-art/estudio.js`. O editor completo de rig 2D com profundidade simulada **não foi comprovado** nesses arquivos, portanto está **PENDENTE**.

### GC-LIB-006 — Biblioteca persistente de recursos e comportamentos
- **Objetivo:** um tileset/objeto/bananeira/personagem cadastrado uma vez deve ser recuperado na próxima sessão e reutilizável no mapa com sua ficha funcional: ID, tipo, imagem original, grade, animação, colisão, grupo de conexão/autotile, interação, ambiente e demais parâmetros pertinentes.
- **Estado parcial comprovado:** `shared/asset-library.js` usa IndexedDB no navegador e preserva recursos e metadados; `biblioteca/index.html` fornece busca e backup exportável; o editor de mapas integrado já inclui catálogo de regras de terreno e de objetos. Isso **não é** escrita automática numa pasta do Windows.
- **Problema específico encontrado:** o editor de mapas separado `map-editor/index.html` salva perfil de tileset em metadados mas força `manual` na recarga; verificar fluxos separados e integrados antes de unificar. Nunca declarar persistência completa de comportamento sem teste de salvar → fechar → reabrir → reutilizar.
- **Planejamento:** reutilizar a Biblioteca Central atual, criar formato de definição do recurso desacoplado de um mapa, dar IDs estáveis, associar regras a cada tileset e propagar configurações ao reabrir. Oferecer **backup/exportação** e posterior integração opt-in com pasta local (por exemplo em Documentos), respeitando permissões reais do navegador/Windows; não afirmar que acesso irrestrito à pasta existe por padrão.
- **Critério de aceite:** cadastrar bananeira/tileset com configurações; fechar e reabrir; localizar pela categoria; inserir em novo mapa sem importar imagem novamente; manter comportamento e edição íntegros; exportar backup e restaurá-lo.

### GC-KEY-007 — Teclas de movimento interferem na digitação de formulários
- **Relato:** em campos de texto do Creator, inclusive o de ID do item produzido, a tecla minúscula `a` parece não produzir texto; com Shift (maiúscula) funciona. Outras teclas também foram mencionadas.
- **Hipótese técnica forte (não validada em navegador):** a arena de teste usa atalhos WASD; `pixel-art/modulo-integrado.js` intercepta `a` em um listener de `keydown` no `document`, usando `typing(e.target)` para verificar input. Em formulários dentro de Shadow DOM, `e.target` observado no `document` pode ser o host, não o input interno, por retargeting. Assim, `preventDefault()` pode suprimir letras minúsculas `w,a,s,d`, enquanto maiúsculas não correspondem ao mapeamento.
- **Solução proposta, NÃO aplicada:** reconhecer campos editáveis via `event.composedPath()`, `isContentEditable` e elementos `input`, `textarea`, `select`; atalhos apenas com arena em foco ativo e sem modificadores; não interceptar digitação em formulários, inclusive dentro de Shadow DOM. Rever listener de `keyup` para evitar tecla presa.
- **Critério de aceite:** digitar minúsculas `a,w,s,d` e nomes/IDs nos formulários de itens e objetos, com e sem Shift, sem acionamento de movimento; confirmar WASD e setas funcionando na arena focada; repetir em outras abas e navegadores compatíveis.
- **Estado:** causa plausível identificada no código, mas não reproduzida/validada; **PENDENTE DE CORREÇÃO**.

### GC-MAP-008 — Categorias e regras de interação de objetos 2.5D
- **Relato:** o autor está cadastrando objetos como **bananeira** e quer configurar colisão e comportamento, depois reencontrá-los ao construir mapas.
- **Proposta:** separar **colisão física** (onde o personagem não atravessa), **interação** (coletar, cortar, usar), **estado ambiental** (crescimento, chuva, solo, ciclo de vida) e **representação visual 2.5D** (base/altura/camadas). Não aplicar automaticamente colisão em toda a imagem: árvores altas podem ter tronco sólido e copa atravessável visualmente.
- **Estado parcial:** formulários de colisão e regras ambientais/de objetos existem no módulo integrado, mas integração no runtime do jogo e persistência reutilizável por ativo exigem teste e não devem ser marcadas como prontas.
- **Critério de aceite:** cadastrar bananeira como planta com imagem e ficha; definir colisão do tronco e interação; salvar; reutilizar o mesmo objeto em novo mapa preservando as configurações, sem reimportar.

### Ordem e limites de implementação futura
- **Agora:** somente documentação. Não alterar código, UI, testes ou GitHub Actions sem nova instrução explícita do autor.
- **Depois, quando autorizado:** resolver conflito de digitação (falha básica de usabilidade); validar persistência da biblioteca; definir protótipos de navegação e editor de animação; só então implementar por incrementos pequenos, com testes isolados e CI canônico, **WIP = 1**.
- Cada tarefa terá indicação de **decisão de produto, hipótese, evidência, implementação e validação**. Não remover funcionalidades antigas; manter histórico e mecanismo de reversão.


### GC-UPDATE-009 — Atualização local do GameCreator sem pastas duplicadas
- **Relato/objetivo do autor (30/10/2026):** manter uma única instalação permanente do GameCreator no computador. O programa deve ser extraído/instalado uma vez; nas atualizações seguintes, o usuário quer baixar o ZIP novo, executar um único arquivo CMD e atualizar a instalação já existente. Depois de confirmar a atualização, poderá apagar o ZIP e a pasta temporária extraída, sem manter várias cópias completas do Creator.
- **Restrição operacional:** o computador/HD apresenta instabilidade e episódios de tela azul; minimizar escrita, espaço temporário, cópias completas, processos em segundo plano e dependências adicionais. Não exigir administrador, outro runner, Node adicional ou serviço pago para atualizar arquivos estáticos.
- **Alternativa preferencial a avaliar:** se a instalação permanente puder ser preparada como clone Git válido, oferecer um arquivo ATUALIZAR_CREATOR.cmd dentro da pasta fixa que execute git pull na branch correta. Isso evita baixar e extrair ZIP completo em toda atualização e transfere apenas alterações. Antes de adotar, verificar se Git está instalado, branch/remote corretos, alterações locais e se a pasta atual é realmente um clone; não executar reset, clean, checkout destrutivo nem sobrescrever trabalho local.
- **Fluxo ZIP solicitado (fallback compatível):**
  1. Manter uma única pasta de instalação definitiva, cujo caminho é escolhido/confirmado uma vez.
  2. Baixar e extrair o ZIP novo numa pasta temporária.
  3. Executar ATUALIZAR_CREATOR.cmd da pasta temporária; o atualizador reconhece a raiz do repositório, valida que é o GameCreator e localiza a instalação definitiva previamente configurada (ou solicita o caminho na primeira execução).
  4. Copiar/atualizar somente arquivos do produto que pertencem ao repositório, copiando arquivos novos e substituindo arquivos alterados; não criar outra pasta completa de instalação.
  5. Preservar arquivos de usuário, banco/biblioteca local, assets autorais, exports, backups, configurações, credenciais e runner. As pastas exatas a preservar e a lista de arquivos atualizáveis devem ser levantadas no repositório e na instalação real antes da implementação.
  6. Validar cópia, arquivos essenciais e versão/commit de origem; gerar log simples e informar sucesso ou erro com instrução clara. Somente depois do sucesso, oferecer remoção da pasta temporária e do ZIP; nunca apagar automaticamente a instalação antiga nem dados do usuário.
- **Segurança obrigatória:** não usar robocopy /MIR, rmdir recursivo ou qualquer rotina que espelhe exclusões da origem sobre o destino. Não apagar arquivos desconhecidos do destino. Não sobrescrever dados locais; se houver conflito entre arquivo local modificado e arquivo novo, interromper ou preservar cópia de segurança e pedir decisão. Não atualizar enquanto o Creator estiver em execução se isso puder causar inconsistência.
- **Eficiência de armazenamento:** preferir git pull numa instalação Git já preparada; no modo ZIP, manter apenas uma extração temporária e removê-la após validação. Backup, se necessário, deve ser incremental e limitado aos arquivos de programa que serão substituídos, sem duplicar a pasta inteira; medir espaço livre antes de começar e abortar com segurança se insuficiente.
- **Compatibilidade:** Windows 10/11, caminhos com espaços e acentos, execução sem privilégios administrativos, CMD simples chamando PowerShell/robocopy nativos. Não instalar nem atualizar Node.js como efeito colateral da atualização do Creator.
- **Critérios de aceite:** (a) primeira configuração define a pasta fixa; (b) atualização seguinte atualiza essa mesma pasta sem criar uma segunda instalação; (c) arquivos novos e modificados chegam corretamente; (d) assets, biblioteca, dados, configurações e runner locais permanecem intactos; (e) falha/interrupção não deixa o Creator parcialmente sobrescrito sem aviso ou recuperação; (f) log identifica data, origem/commit, destino, arquivos copiados e resultado; (g) após sucesso, a pasta/ZIP temporários podem ser apagados e o espaço recuperado.
- **Estado:** WIP 1 / implementado na branch draft PR7, ainda não integrado. O CMD e o script PowerShell foram criados; o parser e o teste estático do manifesto passaram no step 17 do run #41082083233. Ainda faltam simulação real em sandbox (clone/fast-forward, repetição, offline, alterações locais, origem/branch incorretas e preservação do Runner) e teste controlado na instalação do autor. Nenhuma instalação local do usuário foi alterada.
- **Implementação futura:** primeiro inspecionar a estrutura real do repositório e a pasta local do usuário; elaborar inventário de arquivos de produto versus dados locais; prototipar em duas pastas temporárias de teste; validar cópia e recuperação; só então disponibilizar o CMD. Respeitar a regra geral deste documento: nesta etapa, apenas documentar, sem alterar código, UI, testes ou workflows.


## Atualização de estado — auditoria de runners e validação (30/10/2026)

- A validação principal do GameCreator voltou a executar no runner Windows: [#41075044875](https://github.com/apoenalore/GameCreator/actions/runs/41075044875) terminou com success, incluindo build, testes de interface, biblioteca/backup, contratos, hidrologia, Godot headless e publicação de artefatos.
- A correção da variável \`profile\` permanece **VALIDADA** no SHA \`b90be364189bd4f2145848494f285c9a6be2fed8\`, run [#41045143930](https://github.com/apoenalore/GameCreator/actions/runs/41045143930). Não reabrir esse defeito sem nova reprodução.
- A PR ambiental #6 está aberta, mas seu head atual \`5f47b1fb2889a7116d02910da09ea9cb4d33003a\` ainda não foi validado por CI e a branch está divergente de main. A implementação do código já passou no SHA anterior; commits documentais/workflow posteriores exigem nova validação e resolução de conflito.
- A PR #5 de laboratório passou no run [#41044823914](https://github.com/apoenalore/GameCreator/actions/runs/41044823914). A PR #4 de modos/sessões continua draft e sem CI no head atual.
- O erro transitório de upload \`ENOTFOUND\` está registrado em GC-CI-012; o run posterior #41075044875 comprovou que os uploads foram recuperados.
- O empacotador está sendo ajustado para distribuir somente arquivos de execução, sem documentos internos, testes e workflows. A validação do pacote está pendente no run [#41079295445](https://github.com/apoenalore/GameCreator/actions/runs/41079295445).
- GC-UPDATE-009 continua como única tarefa ativa (WIP 1). A suíte canônica #41064201715 passou somente no head anterior; no head atual, parser PowerShell e teste estático do manifesto passaram no step 17 do run [#41082083233](https://github.com/apoenalore/GameCreator/actions/runs/41082083233). Ainda faltam a simulação real de atualização segura e a validação controlada no Windows do autor.


## Resultado da auditoria de entrega — 30/10/2026

- **GC-PACK-001: VALIDADO.** O workflow canônico [#41079295445](https://github.com/apoenalore/GameCreator/actions/runs/41079295445) passou no SHA \`f69a013dcc6f38267e204b50c1df90698dca54a3\`. O ZIP contém 52 arquivos de runtime, sem documentação interna, testes, workflows ou arquivos Markdown/texto.
- O manifesto foi separado do ZIP e o launcher, fonte V4.0, bundle e módulos necessários foram preservados.
- A auditoria do ZIP confirmou SHA-256 \`7a061059a7d027c45e32ce11fd78c48fd5bdf9a0b0c05e069802cb6c1d3dfda7\`.
- A auditoria de embalagem não altera as pendências criativas GC-TILE-001/002, nem autoriza implementar UI ou novas funcionalidades.
- GC-UPDATE-009 continua como WIP 1; a validação canônica #41064201715 refere-se ao head anterior. No head atual, o teste estático do manifesto passou no step 17 de #41082083233; a simulação de atualização segura e a atualização real controlada no Windows do autor permanecem pendentes.


## Follow-up de preservação do runtime — GC-PACK-002 (30/10/2026)

- A auditoria do primeiro ZIP limpo revelou que a exclusão total de \`legacy/\` quebrava a ligação da página integrada com a fábrica original v3.9.
- A correção preserva somente a página da fábrica e suas 23 partes JS; mantém \`integracao/index.html\` e \`integracao/catalogo.js\` no manifesto do atualizador; exclui o launcher legado e documentos.
- O teste de contrato \`tests/atualizador-manifest.test.cjs\` foi adicionado e o workflow canônico recebeu execução condicional desse teste quando o atualizador existir no branch.
- O atualizador recebeu a correção da comparação da versão Git completa (`Groups[0]`) e a cobertura estática do manifesto. O run #41064201715 é de um head anterior; o head atual teve parser PowerShell e teste estático do manifesto aprovados no step 17 de #41082083233, mas o job completo ainda finalizava o upload.
- Validação do pacote concluída na main #41081796048 e na branch ambiental #41081917796. O step 17 do atualizador passou no run #41082083233; GC-UPDATE-009 permanece WIP 1 até a simulação real de atualização segura em sandbox passar.


## Atualização do follow-up GC-PACK-002 — 30/10/2026

- O pacote da main passou no run [#41081796048](https://github.com/apoenalore/GameCreator/actions/runs/41081796048), SHA \`65db2b62cc9750f50a3cc595c80466b6344fbc94\`.
- O ZIP final contém 76 arquivos de runtime; a fábrica original está preservada somente com a página e as 23 partes JS necessárias. Não contém documentação, testes, CI ou arquivos Markdown/texto.
- SHA-256 do ZIP interno: \`62407aaad9bd183d78bd3a29a65752f8325981a4191aa77b084be49b818eb55d\`.
- O teste do manifesto do atualizador no PR7 passou no step 17 do run #41082083233; a simulação real de clone/fast-forward e preservação local continua pendente. A branch ambiental PR6 passou no run #41081917796.


## Atualização GC-UPDATE-009 — sincronização e reforço de segurança (30/10/2026)

- A branch original da PR #7 foi preservada em backup/gc-update-009-before-main-sync-20261030 antes de preparar uma base atualizada.
- A comparação com a main identificou 16 commits exclusivos da PR e 33 commits posteriores na main; a integração direta foi suspensa para evitar regressão.
- A nova versão de trabalho parte do SHA 0bd916157d9bfab6c6c9b121c26050f94918cf80, preservando as correções recentes da main.
- O manifesto agora exige também os arquivos Godot de runtime, os módulos de backup/tileset da biblioteca e os módulos complementares do Pixel Art.
- A regex de proteção foi alinhada ao padrão amplo de legacy/v3_9_parts/*.js, para proteger também arquivos JS futuros cobertos pelo sparse-checkout.
- O atualizador valida com git sparse-checkout check-rules que todos os arquivos essenciais estão incluídos antes de buscar/aplicar atualização.
- O teste automatizado foi ampliado para simular clone parcial, sparse-checkout real, fast-forward, referência anterior e conflito com arquivo local ignorado em repositório Git temporário.
- **Estado:** alterações preparadas na branch de trabalho; commits documentais e de código marcados com [skip ci] para evitar execuções intermediárias. CI ainda não executada para o novo head; teste Windows real permanece pendente.


## Descoberta de segurança — checkout inicial e conflitos locais (30/10/2026)

A simulação Git local identificou que sparse-checkout set --no-cone não materializa por si só um clone iniciado com --no-checkout. Foi adicionado git read-tree -mu HEAD após a verificação do manifesto.

Também foi comprovado que, em sparse-checkout, git merge --no-overwrite-ignore sozinho não é proteção suficiente contra todo arquivo local conflitante. O atualizador agora detecta tanto arquivos ignorados quanto não ignorados antes da materialização e antes do merge; qualquer colisão com o runtime remoto bloqueia a operação.

A simulação foi executada com Git 2.47.3 em Linux. O novo teste de contrato repete esses cenários na CI Windows. Nenhuma pasta do computador do autor foi alterada.


- **Proteção adicional:** antes de reduzir o worktree, o atualizador interrompe se encontrar arquivos ignorados fora da allowlist de runtime. O operador deverá fazer backup ou movê-los manualmente; o atualizador não apaga nem move dados pessoais.


## Bloqueio de arquivos locais fora do runtime

Antes de aplicar o sparse-checkout, o atualizador verifica arquivos locais ignorados e não ignorados. Se encontrar qualquer arquivo fora da allowlist de runtime, interrompe e solicita backup ou movimentação manual. Não tenta apagar, mover ou incorporar esses arquivos. Dados locais dentro de caminhos de runtime também bloqueiam a atualização se colidirem com um arquivo que venha do repositório.


## Caminhos Unicode

A leitura de árvores e arquivos locais usa core.quotePath=false para que nomes com acentos, como árvore.js, sejam comparados como caminhos reais e não como sequências octais escapadas. O teste PowerShell cria uma colisão com nome Unicode e exige que o atualizador bloqueie sem sobrescrever o arquivo local.
