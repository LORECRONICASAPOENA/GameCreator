# Game Creator — registro de conversas, checkpoints e backup no GitHub

Este documento registra fatos novos comprováveis e decisões do autor associados ao Game Creator. Ele complementa `docs/PENDENCIAS_ABERTAS_E_LIMPEZA_GITHUB.md`, `docs/ATUALIZACOES_PENDENTES_LEIA_ANTES_DE_COMECAR.md` e o histórico Git. **Não substitui o código, os assets originais, o backup exportado da biblioteca IndexedDB nem um arquivo integral de conversas.**

## Critérios de registro

1. Registrar data/hora de consulta em BRT, origem, decisão/relato, estado (conversa, planejado, código em branch, integrado, validado), evidência e pendência.
2. Diferenciar claramente o SHA da `main` dos SHAs de PRs e do repositório de Skills.
3. Não presumir acesso a conversas privadas, arquivos locais, anexos ou imagens que não estejam efetivamente disponíveis.
4. Não fazer commits repetidos quando nenhuma informação nova tiver sido encontrada; manter o histórico de versões do GitHub como checkpoint dos arquivos rastreados.
5. Não alterar código, CI, runner, instalações ou recursos do editor apenas para registrar um backup. Respeitar WIP = 1 entre GameCreator e Apoena Pixel Art HTML.
6. Consultar atualizações de `apoenalore/apoenaskil` e registrar apenas as mudanças relevantes, sem misturar o cânone narrativo com funcionalidades implementadas no Creator.

## Checkpoint — 01/11/2026, 20:03 BRT

**Repositório verificado:** [apoenalore/GameCreator](https://github.com/apoenalore/GameCreator), privado, branch padrão `main`.

**Snapshot do código rastreado na main:** commit [`993a8a6bfef714029a0d58c76d2b008b4b2f226a`](https://github.com/apoenalore/GameCreator/commit/993a8a6bfef714029a0d58c76d2b008b4b2f226a), de 01/11/2026 18:32:36 BRT. Esse commit ajusta `.github/workflows/pixel-art.yml` para evitar duplicação de arquivos no artefato de entrega. A validação automática da main [run 41357561095](https://github.com/apoenalore/GameCreator/actions/runs/41357561095), no mesmo SHA, terminou `completed/success`. Isso **não** comprova validação de PRs com código diferente nem teste em dispositivo físico.

### Novidades recentes recuperadas de conversas e GitHub

- **Personagem Apoena e animações — decisão do autor em conversa em 01/11/2026:** acrescentar ao fluxo do Estúdio Pixel Art o personagem principal Apoena e permitir trabalhar movimentos de andar/correr e atacar. A [PR #11](https://github.com/apoenalore/GameCreator/pull/11), `GC-ANIM-006`, está **aberta em rascunho**, head `a9c7148f01504f7be142dd0d852056dd5a9a5114`, **não integrada na main**. A descrição da PR registra corrida multidirecional em grade 4×4 e predefinições de ataque lateral em grades iniciais 6×2; estas grades de ataque são aproximadas devido a efeitos que cruzam células. A prévia de “andar” reutiliza poses de corrida e **não** constitui caminhada fiel. PNGs originais devem ser preservados. Edição, prévia e exportação no Estúdio não comprovam animações funcionais no gameplay/Godot.
- **Estado da validação da PR #11:** [run 41357977741](https://github.com/apoenalore/GameCreator/actions/runs/41357977741), no head citado, terminou `completed/failure`; [run 41357968979](https://github.com/apoenalore/GameCreator/actions/runs/41357968979) foi cancelado. A causa técnica da falha **não foi diagnosticada nesta consulta**. Não declarar a PR pronta, não repetir CI cegamente e não fazer merge sem revisão e validação.
- **Controle sequencial:** a descrição da PR #11 registra que o trabalho no atualizador `GC-UPDATE-009` foi **pausado por solicitação expressa do autor** para priorizar a animação do personagem. Isso atualiza o contexto do registro central datado de 30/10, que ainda mostrava o atualizador como tarefa ativa. A PR #11 permanece a frente de implementação em curso; não iniciar uma segunda frente por causa deste checkpoint.
- **Biblioteca de Skills consultada:** [apoenalore/apoenaskil](https://github.com/apoenalore/apoenaskil), branch `main`, head observado [`9f7b138687e5eea6c587d6f71693f3d51c7cd71e`](https://github.com/apoenalore/apoenaskil/commit/9f7b138687e5eea6c587d6f71693f3d51c7cd71e), de 01/11/2026 20:02:16 BRT. O commit mais recente amplia o registro de recuperação de conversa sobre história e geografia de Apoena. Commits imediatamente anteriores da mesma data integraram conhecimento recuperado de conversas. O repositório declara expressamente que a recuperação integral de todas as conversas e a cópia dos anexos binários **não foram concluídas**. Conteúdo narrativo de Skills não deve ser tratado como recurso já programado no Game Creator.
- **Preservação da base:** `APOENA_GAME_CREATOR_V4_0_BANCADA_INTEGRADA.html` continua presente na raiz da main; `README.md` descreve V4.1 em desenvolvimento e distingue editor, biblioteca, ponte e runtime. A presença desses arquivos no GitHub é confirmada; nenhum backup da instalação Windows, dados IndexedDB, arquivos não enviados ou pasta local foi realizado nesta consulta.

### Limites e próxima conferência

Esta captura registra o **estado remoto comprovado** e o resumo de decisões recentes acessíveis. Não representa cópia literal/integral de todas as conversas nem sincronização automática de alterações que existam somente no computador do autor. Na próxima conferência, comparar o SHA da `main`, a PR #11 e o head de `apoenaskil`; acrescentar um novo checkpoint somente diante de mudanças relevantes. Investigar a falha de CI da PR #11 dentro da tarefa ativa, sem criar workflow paralelo.

## Checkpoint — 01/11/2026, 20:32 BRT

**Origem:** conversa de acompanhamento de prioridades do projeto em 01/11/2026 e consulta autenticada ao GitHub. **Natureza:** registro documental de diagnóstico e recomendações; nenhuma nova decisão de produto foi confirmada pelo autor nesta conversa.

- **Pergunta do autor:** quais tarefas têm prioridade e estariam travando o sistema. A resposta distinguiu o bloqueio de validação da PR #11 de pendências de produto. Foi **recomendado**, sem autorização para implementar, tratar primeiro o CI da PR #11, depois aperfeiçoar animações e integração com Godot; retomar GC-UPDATE-009 somente após a frente atual. Essa sequência é recomendação de análise, não decisão formal nem evidência de defeito em produção.
- **Estado da main consultado:** head `0cbb4fdd8f1a437565c52a91a44ca031e8905524` (commit documental do checkpoint anterior); nenhum commit novo encontrado desde o registro de 20:03 BRT. O último commit de código identificado continua `993a8a6bfef714029a0d58c76d2b008b4b2f226a`, cuja CI já tinha passado. A main validada **não valida** automaticamente a PR #11.
- **Frente ativa:** [PR #11](https://github.com/apoenalore/GameCreator/pull/11) continua `open/draft`, head `a9c7148f01504f7be142dd0d852056dd5a9a5114`, não integrada. A consulta à execução [41357977741](https://github.com/apoenalore/GameCreator/actions/runs/41357977741) confirmou `completed/failure` no job `validar` (job ID `125003291009`). A consulta de detalhes do job retornou lista de etapas vazia; a tentativa de obter logs retornou erro GitHub/API `404 BlobNotFound`. **Não é possível afirmar a causa da falha**, nem classificá-la como erro do código, runner ou armazenamento sem novas evidências.
- **Demais frentes:** [PR #7](https://github.com/apoenalore/GameCreator/pull/7) permanece aberta em rascunho e pausada como trabalho ativo; PRs #6, #5 e #4 continuam abertas e não foram integradas nesta verificação. Conflitos/validações dessas frentes não devem ser misturados à falha da PR #11.
- **Skills:** o commit mais recente encontrado em `apoenalore/apoenaskil` permanece `9f7b138687e5eea6c587d6f71693f3d51c7cd71e`; sem mudança nova detectada após o checkpoint anterior.
- **Preservação:** nenhuma alteração de código, assets, CI, runner, branch de funcionalidade, merge, instalação Windows ou biblioteca IndexedDB foi executada. O GitHub guarda o código rastreado e este registro, mas **não** copia automaticamente conversas integrais, arquivos locais, binários não enviados nem os dados da biblioteca do navegador.

**Próxima ação da frente ativa:** obter diagnóstico verificável da falha do job da PR #11, sem repetição cega de workflow; somente após identificar causa e validar correção, avançar para revisão dos spritesheets, caminhada fiel, ataques e integração no gameplay. Manter WIP = 1.


## Evidência adicional — falha do Runner na PR #11 (01/11/2026, aproximadamente 21:24 BRT)

**Origem:** captura de tela enviada pelo autor, exibindo o job `validar` da execução #265 do workflow `.github/workflows/pixel-art.yml`, associado à PR `GC-ANIM-006` (PR #11).

- A anotação visível no GitHub informa: **“The self-hosted runner lost communication w…”**. A mensagem identifica perda de comunicação do executor self-hosted com o servidor do GitHub durante o job.
- **Atualização do diagnóstico:** há agora evidência direta de uma falha de comunicação do Runner. Portanto, a falha dessa execução não deve ser tratada como prova de erro nos fontes ou nos testes das animações. O status vermelho indica que o job falhou, mas não demonstra que os testes de código tenham encontrado defeitos.
- **Causa-raiz ainda não identificada:** a captura não informa se houve queda de internet, encerramento/travamento do processo ou serviço do Runner, suspensão/reinicialização do Windows, nem outro problema de rede/host. Não escolher uma dessas hipóteses sem consultar o histórico local do Runner e o estado do computador no horário da falha.
- **Ação recomendada:** verificar no Windows se o serviço/processo `APOENA-GAMECREATOR-RUNNER` está em execução e online, conferir conectividade e logs locais do Runner no intervalo do job e observar se houve suspensão, reinicialização ou desligamento. Depois de restabelecer a comunicação, executar uma única validação controlada da PR #11, sem alterar código apenas para tentar corrigir a desconexão.
- **Estado da PR:** permanece aberta em rascunho e não integrada. A captura não comprova aprovação de testes, nem validação funcional das animações no Godot.
- **Preservação:** esta atualização é documental. Nenhum código, workflow, configuração do Runner ou arquivo local foi alterado. A captura é evidência fornecida nesta conversa; ela não foi adicionada como arquivo binário ao repositório.

**Correção de interpretação do checkpoint anterior:** a causa da falha estava indeterminada porque os logs não puderam ser recuperados. Com a nova captura, a classificação sustentada pela evidência passa a ser **perda de comunicação do self-hosted runner**; a causa-raiz operacional permanece pendente de investigação.


## Política permanente — relatório para cada erro do GitHub Actions (01/11/2026)

- **Solicitação explícita do autor:** a cada erro do Actions, a IA deve produzir um relatório com a causa, a solução, o motivo da escolha e as evidências.
- **Regra implementada em `AGENTS.md`:** toda falha/anotação de erro exige investigação e relatório individual antes de corrigir, repetir ou contornar. O relatório deve identificar run/job/step/branch/SHA; preservar a mensagem literal; separar causa comprovada, hipóteses e lacunas; explicar impacto; comparar alternativas; justificar a solução escolhida; distinguir proposta de ação aplicada; registrar commit e validação; e indicar prevenção e participação necessária do autor.
- **Modelo criado:** `docs/relatorios-actions/MODELO_RELATORIO_FALHA_ACTIONS.md`.
- **Incidente atual documentado:** `docs/relatorios-actions/2026-11-01-run-41357977741-runner-perdeu-comunicacao.md`. A captura enviada pelo autor mostra a annotation “The self-hosted runner lost communication w…”. A perda de comunicação está comprovada pela captura; a causa-raiz operacional (rede, serviço/processo, suspensão/reinicialização ou outra) continua não confirmada. Nenhum código ou configuração foi alterado. Próxima ação é verificar o runner no Windows antes de uma única nova validação controlada.
- **Commits documentais:** `5f198f452427265c6a01f10b89cbb9d442f4c2a4` (AGENTS.md); `66a6335ec0a39aeea6fa8c273729fc3149493523` (modelo); `31cde018cad9016eeaf938721e9d47a60e38c4de` (relatório do incidente atual).
- **Limite:** esta regra orienta agentes que leem `AGENTS.md`; não significa que o GitHub Actions, sozinho, esteja configurado para chamar uma IA ou gerar relatórios automaticamente. A IA precisa consultar e seguir as instruções durante cada investigação.


## Decisão sobre ABRIR_GAME_CREATOR.cmd e redução de acionamentos do Runner (02/11/2026)

- **Solicitação do autor:** avaliar a remoção do instalador/iniciador CMD por entender que apenas encaminha para o HTML e pode atrapalhar o Runner.
- **Inspeção do arquivo:** `ABRIR_GAME_CREATOR.cmd` não é apenas um redirecionador. Ele chama `integracao/build_unificado.ps1` para montar a página integrada e, se o build terminar sem erro, abre `index.html`. É um atalho local opcional para Windows.
- **Inspeção do CI:** `.github/workflows/pixel-art.yml` já chama `integracao/build_unificado.ps1` diretamente no job `validar`; não depende do CMD. Portanto, o CMD não é executado pelo Runner. Porém, o nome do CMD estava listado nos filtros `paths` de `push` e `pull_request`, fazendo uma alteração isolada nele disparar a validação.
- **Decisão aplicada:** preservar o CMD como conveniência local, mas remover `ABRIR_GAME_CREATOR.cmd` dos filtros de caminho do workflow canônico. Assim, editar apenas o atalho não inicia Runner. O CI continua compilando pelo script PowerShell diretamente.
- **Documentação atualizada:** README esclarece que o CMD é opcional e local; `AGENTS.md` instrui agentes a nunca executar o launcher como etapa do Runner e a removê-lo apenas após verificar dependências locais.
- **Commits:** `2de026134f6e3d11805b168db1aaf5e446240d06` (filtros do workflow); `57c8208a0746a78d2321452c0cf63fabee2e1616` (README); `52458c83215a0f7e81654ac8ce00abbf4235e746` (AGENTS.md).
- **Validação:** alteração do workflow e documentação foi registrada na `main`; não foi disparada execução manual. Como `README.md` permanece nos filtros, a alteração documental do README pode acionar o CI automaticamente; alterações em `AGENTS.md` e neste registro não estão nos filtros de caminho. A confirmação final deve ser feita consultando o Actions no commit atual.
- **Estado:** CMD não apagado, pois realiza um build local real. Runner desobrigado de usá-lo; alteração isolada do CMD não deve consumir execução. Nenhuma configuração do produto foi removida.


## Iniciativa de segurança Apoena e criação comunitária (02/11/2026)

- **Solicitação do autor:** pesquisar centenas de formas de proteger o Game Creator e o futuro jogo contra invasores, hackers e mods maliciosos, antecipando a abertura de uma iniciativa comunitária para jogadores criarem itens (ex.: armas e roupas) dentro de um pacote limitado de opções.
- **Pesquisa/entrega documental:** criado `docs/SEGURANCA_APOENA_500_CONTROLES.md`, com exatamente 500 controles candidatos em 20 domínios, prioridades P0–P3, modelo de criação comunitária sem scripts, critérios de publicação e fontes OWASP/NIST/CISA.
- **Inspeção de código:** revisados `shared/creator-bridge.js`, `pixel-art/ponte-creator.js`, `shared/asset-library.js`, `shared/library-backup.js`, `integracao/catalogo.js`, `integracao/godot/ApoenaCatalogo.gd` e `tests/creator-bridge.test.cjs`, entre outros.
- **Achados para investigação:** ponte usa `postMessage` com targetOrigin `*` e aceita origem opaca `null`; testes atuais não demonstram cobertura para null/replay/payloads extremos. Backup impõe limites globais, mas importação sequencial merece revisão de atomicidade/limites por registro. Biblioteca aceita MIME `image/*`, que não prova conteúdo binário. Prefixo data URL PNG não valida imagem integral. Catálogo/inventário encontrado é local e não constitui autoridade para multiplayer/economia online. Não foi identificada nesta inspeção sandbox de mods ou API de publicação multiusuário.
- **Decisão de produto proposta:** primeira versão comunitária deve ser declarativa, sem execução de código; opções limitadas de aparência, geometria e materiais; atributos competitivos calculados por templates oficiais no servidor. Conteúdo passa por validação, quarentena e moderação. Mods executáveis ficam fora do escopo até haver sandbox real e revisão de segurança.
- **Limite:** auditoria documental parcial, não pentest nem certificação. Nenhuma correção de código foi aplicada nesta conversa; somente documentação e instruções de agentes foram atualizadas.
- **Commits:** `fd56632f29acc8daa68a93720134b813a245eb67` (catálogo de 500 controles); `cdf27a6d6f822b8003a84937d15f9d962e489d71` (gates de segurança em AGENTS.md).


## Pesquisa complementar: anti-cheat, ataques multiplayer, SQL e TLS (02/11/2026)

- **Solicitação:** estudar sistemas de segurança de jogos como GTA/Free Fire, vetores de ataque, SQL e SSL/TLS para o Apoena.
- **Pesquisa registrada:** `docs/PESQUISA_ANTI_CHEAT_SQL_TLS_JOGOS.md`.
- **Referências comerciais:** documentação Rockstar confirma BattlEye no GTA Online PC; documentação Garena descreve defesa anti-hack, clientes modificados, denúncias e programa de vulnerabilidades. Não inferir a arquitetura de GTA 6 a partir do GTA Online.
- **Decisões recomendadas:** servidor autoritativo; cliente não decide combate/inventário/economia; consultas SQL parametrizadas e privilégio mínimo; TLS 1.3 padrão/TLS 1.2 compatibilidade, SSL antigo desativado; validação de certificados; anti-replay e protocolo seguro maduro para transporte multiplayer; evitar anti-cheat kernel no primeiro estágio; usar OWASP GameSec como referência de requisitos.
- **Limite:** pesquisa documental, não pentest nem confirmação de vulnerabilidade no produto. Backend SQL/multiplayer ainda requer auditoria quando implementado.
- **Commit do relatório:** `964f7fe9a0418db812719f82a85c992cb4a7c87f`.


## Integridade do mundo, economia e experiência do jogador (02/11/2026)

- **Solicitação:** consultar medidas atuais de segurança/integridade em jogos e esclarecer o exemplo de punição do LoL por inatividade/ausência.
- **Pesquisa oficial Riot:** FAQ AFK/abandono (02/06/2026) descreve tiers escalonados de atraso de fila e bloqueios temporários; abandono de fila tem regras próprias; decaimento competitivo aplica-se a Diamond+ e regras Apex incluem dias acumulados; comportamento tóxico e reparação/compensação possuem sistemas separados.
- **Conclusão de design:** não punir login ausente diário em modos casuais. Diferenciar ausência, AFK durante partida, abandono de lobby, decaimento competitivo e comportamento/cheating. Decaimento, se adotado, deve ser restrito a ranques de topo, com tolerância e avisos. Preservar personagem/economia legítimos. Penalidades competitivas graduais, recurso e proteção contra falso positivo. Compensar participantes prejudicados por abandono confirmado.
- **Mundo persistente:** estado canônico e relógio no servidor; transações autorizadas para construção, captura, saque e crafting; qualquer decay de território deve ser mecânica transparente com aviso e período de graça.
- **Documento criado:** `docs/POLITICA_INTEGRIDADE_E_EXPERIENCIA_JOGADOR.md`.
- **Referências:** Riot Support AFK FAQ, queue dodge, ranked decay, Apex tiers, Instant Feedback e Disruptive Behavior Repair; OWASP Game Security Framework.
- **Commit:** `9d68305cd9b93d326b424d109b679e170293c17a`.
- **Limite:** pesquisa e proposta de design; nenhuma regra de jogo foi implementada.


## Plano para tornar Apoena um jogo online (02/11/2026)

- **Solicitação:** explicar o que é necessário para colocar o jogo online.
- **Arquitetura proposta:** cliente mobile; API HTTPS; servidores dedicados autoritativos para zonas/instâncias realtime; banco relacional (PostgreSQL como candidato, não decisão); storage/CDN para assets; painel administrativo; observabilidade, segurança e backups.
- **Princípio:** cliente envia intenções; servidor valida e calcula combate, movimentação, inventário, economia e resultados. Cliente nunca conecta diretamente ao banco.
- **Fases:** (0) confirmar engine, modelo de mundo, plataformas, simultaneidade e orçamento; (1) protótipo com servidor dedicado e 2–5 clientes; (2) contas e persistência; (3) combate, monstros, grupos e dungeons; (4) economia e mundo persistente; (5) beta fechado, carga, pentest e rollout.
- **Primeiro MVP técnico:** uma área pequena, dois a cinco clientes, movimento sincronizado, validação no servidor, reconexão e persistência mínima.
- **Decisões pendentes:** engine final, zonas vs mundo contínuo, jogadores simultâneos, plataforma, região/orçamento de hospedagem, backend próprio vs plataforma, funcionalidades iniciais.
- **Documento:** `docs/PLANO_JOGO_ONLINE_APOENA.md`.
- **Commit do plano:** `73d494674e6000f6deb8b44f5bd35517dc43bb7e`.
- **Limite:** arquitetura planejada; nenhum backend, servidor ou recurso online foi implementado nesta conversa.


## Arquitetura híbrida confirmada para planejamento online (02/11/2026)

- **Escolhas do autor:** mundo híbrido (regiões compartilhadas + dungeons/arenas instanciadas), teste inicial de 20–50 jogadores simultâneos, plataformas Android e PC.
- **Topologia definida para MVP:** clientes Android/PC; gateway/API HTTPS; servidor dedicado autoritativo por região; processos/sessões de instância sob demanda; PostgreSQL candidato para persistência; Redis opcional apenas se necessário; object storage/CDN para assets; painel, logs, métricas e auditoria.
- **Estratégia:** começar com uma região pequena e 2 clientes, depois escalar testes para 5/10/20/50. Medir latência p50/p95/p99, tick rate, CPU/RAM, tráfego, perda de pacotes e densidade de entidades. Meta de teste não é capacidade de produção garantida.
- **Engine:** Godot Dedicated Server é candidato condicionado à confirmação do runtime final. Scripts Godot de integração existentes no Creator não provam que o jogo final esteja definido nessa engine.
- **Backend:** avaliar Nakama versus backend próprio por prova técnica; não adotar redundâncias antes de decidir. TLS para APIs; transporte realtime UDP precisa protocolo seguro apropriado, autenticação e anti-replay.
- **Critérios de aceite:** Android e PC na mesma sessão; autoridade do servidor sobre posição/estado; isolamento de contas; reconexão sem duplicação; testes contra spoofing/replay; métricas e logs.
- **Documento atualizado:** `docs/PLANO_JOGO_ONLINE_APOENA.md`.
- **Commit do plano atualizado:** `57fd61f88fedcb4fd14fe9409d3159ceace0a632`.
- **Estado:** arquitetura registrada, implementação ainda não iniciada.


## Auditoria de organização e limpeza do Game Creator (02/11/2026)

- **Solicitação:** avaliar volume de informações, pendências e arquivos repetidos; identificar versões antigas, iniciadores HTML e itens que podem ser removidos; confirmar registro desta conversa.
- **Inspeção real da main:** árvore recursiva com 134 arquivos; tamanho do repositório informado pela API ~49.847 KB; 6 issues abertas no snapshot da API do repositório.
- **Achados:** HTML V4.0 fonte (~16.3 MB), index.html (~16.3 MB), HTML V3.9.2 (~16.3 MB), bundle-v4 com 24 partes (~16.5 MB), legacy V3.9 com 23 partes, iniciador legado, launcher CMD, utilitários de publicação, dois scripts de build e dois workflows.
- **Contradições:** README descreve index como loader compacto, embora a árvore mostre ~16.3 MB e os scripts possam gerar index a partir da fonte; README identifica HTML V4.0 como fonte, enquanto integracao/README.md diz que HTML completo V4.0 não está publicado e identifica a versão do repositório como V3.9. Precisamos resolver por comparação de conteúdo e build reproduzível.
- **Possível sobreposição:** `pixel-art.yml` e `publicar-creator-unificado.yml` executam build; o segundo tem `contents: write` e publica index. Avaliar triggers, permissões e outputs antes de remover qualquer workflow.
- **Candidatos não autorizados para exclusão ainda:** HTML V3.9.2, `legacy/iniciador-anterior.html`, scripts PUBLICAR_NO_GITHUB, um dos workflows, um dos builds e guias V3. Fonte V4.0, index, bundle e módulos ativos devem permanecer até provar dependências.
- **Documento criado:** `docs/AUDITORIA_ORGANIZACAO_E_LIMPEZA_2026-11-02.md`.
- **Commit:** `02606935d68cdc76e5f110b7084aeb3e6e2cbe67`.
- **Estado da limpeza:** nenhum arquivo apagado; inspeção e inventário apenas. Próximo passo: comparar HTMLs e workflows, corrigir documentação contraditória e depois abrir PR de limpeza revisável.
- **Backup da conversa:** esta sessão foi resumida neste registro e na auditoria; não é cópia literal de toda a transcrição.


## Continuação da auditoria de limpeza (02/11/2026)

- Criada branch isolada `maintenance/audit-cleanup-20261102` para organizar a revisão sem tocar diretamente na main.
- Inspecionados integralmente (texto disponível) README, `integracao/README.md`, scripts de build PowerShell/Python, os dois workflows, launcher CMD, iniciador legado e scripts de publicação local.
- Conclusões: os workflows têm funções distintas (CI abrangente com `contents: read` versus publicação automática do index com `contents: write`); não remover nenhum sem redesenho. `ABRIR_GAME_CREATOR.cmd` realmente executa build e abre o editor, não é mero redirect. `legacy/iniciador-anterior.html` contém catálogo de poções e links, não é mero redirect. `PUBLICAR_NO_GITHUB.ps1` sincroniza diretório via Robocopy e faz commit/push para main; requer revisão de segurança antes de uso.
- Os builds PowerShell e Python têm lógica semelhante, mas o CI apenas valida sintaxe Python quando disponível, sem provar paridade. Manter ambos até teste de paridade.
- README e `integracao/README.md` divergem sobre a fonte V3.9/V4.0/V4.1. Arquivos grandes não puderam ser comparados por conteúdo através do conector; tamanho semelhante não prova duplicação.
- Nenhum arquivo funcional apagado. Foi atualizada a auditoria documental na branch isolada: `docs/AUDITORIA_ORGANIZACAO_E_LIMPEZA_2026-11-02.md`.
- Commit na branch: `204cc95fddd0a7f57ebc99d943e44a8befc87396`.
- Próximo passo: abrir PR documental para revisão e depois preparar um ambiente de clone local para comparar os HTMLs por hash/diff e executar testes antes de qualquer exclusão.


## Decisão de plataforma única — 02/11/2026

O autor definiu que o editor 3D e o editor Pixel Art 2D pertencem ao mesmo Game Creator e ao mesmo jogo Apoena. A proposta aprovada é uma única plataforma com Estúdio 3D, Estúdio Pixel Art 2D e Editor de Mapas 2.5D, todos usando a mesma biblioteca e contexto de projeto. O mapa 2.5D já existe em `map-editor/` como implementação parcial; deve ser integrado/evoluído, não refeito. A bancada 3D existente deve ser preservada após inventário de suas rotas e dependências. Caminhos vazios/órfãos só serão removidos depois de rastrear referências e migrar conteúdo exclusivo.

- Arquitetura registrada em `docs/ARQUITETURA_PLATAFORMA_UNICA_APOENA.md`.
- Decisão/backlog registrados em `docs/ATUALIZACOES_PENDENTES_LEIA_ANTES_DE_COMECAR.md` como GC-PLAT-001.
- Próxima etapa única: inventário de dependências, navegação e matriz de rotas; depois integração do shell e biblioteca.
- Nenhuma funcionalidade, HTML, bundle, workflow ou asset foi removido nesta etapa.
- Alterações documentais seguem na branch `maintenance/audit-cleanup-20261102`, dentro da PR draft #12; não houve merge na main.


## Continuidade: inventário de rotas e backup de decisões — 02/11/2026 (23h BRT, horário aproximado da execução)

- Confirmada a árvore `main` em `1b95d036c31dfb4ca9f9ce6859510be2c9f7e8cd`; PR #12 permanece aberta em rascunho. Nenhuma alteração de código novo na `main` foi observada nesta consulta.
- Executado inventário estático de páginas e dependências menores: `ORGANIZACAO_EDITOR.html`, páginas Pixel Art, mapa, biblioteca, integração, legacy, ponte compartilhada e builds.
- Identificados **cinco links HTML quebrados** em `legacy/iniciador-anterior.html` por caminhos relativos que ainda pressupõem a raiz, apesar de a página estar em `legacy/`.
- Identificadas **nove referências de scripts de poções ausentes** (`assets/pocoes-01.js` a `assets/pocoes-09.js`). Sem esses arquivos, a lista `__APOENA_POTIONS` fica vazia e a importação atual não consegue preencher o catálogo porque percorre apenas os originais. Não inventar as 52 poções mencionadas pela interface.
- Confirmadas rotas existentes entre organização, Pixel Art, mapa 2.5D, biblioteca, integração e editor legado v3.9. O mapa e o estúdio já chamam a ponte `saveMap`/`saveAsset`; isso não equivale a integração completa de projeto.
- Atenção de segurança futura: `shared/creator-bridge.js` usa `postMessage` com destino `*` e aceita origem `null` em certas condições; revisar antes de ampliar integração externa, preservando uso offline.
- Criado `docs/MATRIZ_ROTAS_DEPENDENCIAS_2026-11-02.md`, commit `ef1a307a32b59f05a85c0e3be44bc45fe8a33888`, na branch da PR #12.
- Estado: **somente documentação e backup do conhecimento**, sem exclusões ou mudanças funcionais. Próxima tarefa única: corrigir os cinco links com teste de resolução; localizar fontes reais das poções e mapear a navegação interna do HTML grande antes de refatorar a plataforma.


## Checkpoint de continuidade — 02/11/2026, aproximadamente 00h BRT (03h UTC)

**Objetivo:** preservar a situação atual do Game Creator, as novidades efetivamente observadas e as limitações de backup sem interferir nas tarefas de código em andamento.

### Referências Git confirmadas
- `main`: `1b95d036c31dfb4ca9f9ce6859510be2c9f7e8cd`. Não foram observados commits posteriores na branch principal nesta consulta.
- `maintenance/audit-cleanup-20261102`: `956f3e5ebcd47a2dcd0a7f38019dfd979640970f` antes deste checkpoint. [PR #12](https://github.com/apoenalore/GameCreator/pull/12) aberta, em rascunho, sem merge. Contém apenas documentação: arquitetura única 3D/2D/2.5D, matriz de rotas, auditoria e registro de decisões.
- `feat/atualizador-local-incremental`: `b5836634b19dfcad3fa61fc3f7a85561c5be1f95`. [PR #7](https://github.com/apoenalore/GameCreator/pull/7) aberta em rascunho; branch divergente de `main` (4 commits à frente, 27 atrás no snapshot). Não considerar o atualizador integrado à principal.

### Novidades detectadas na PR #7
- `ATUALIZAR_CREATOR.cmd` e `integracao/atualizar-creator.ps1` introduzem instalador/atualizador Windows baseado em clone parcial, sparse-checkout e fast-forward, com verificações conservadoras de arquivos locais.
- `tests/atualizador-manifest.test.cjs` testa manifesto e cenários de atualização/colisão, inclusive PowerShell real em repositório Git temporário, segundo a documentação da branch.
- `docs/ATUALIZADOR_CREATOR_WINDOWS.md` esclarece que a pasta APP deve conter somente runtime, preservando docs/testes/histórico no GitHub; a instalação não deve tocar a pasta RUNNER.
- Commits recentes observados: `b854f7f` (proteção de caminhos e referência anterior), `ddfd541` (teste contra caminhos fora da allowlist), `b583663` (proveniência e timestamps de incidente).
- **Estado:** implementação e testes em evolução; ainda exige CI do head atualizado e teste de instalação/atualização no Windows do autor. Não declarar entregue.

### Estado de validação consultado
- [Run #41380526501](https://github.com/apoenalore/GameCreator/actions/runs/41380526501) do head `b583663`: `pending` na consulta; sem resultado final.
- [Run #41380498183](https://github.com/apoenalore/GameCreator/actions/runs/41380498183) do commit `ddfd541`: `in_progress` na consulta; sem resultado final.
- [Run #41367279379](https://github.com/apoenalore/GameCreator/actions/runs/41367279379), `main`, commit `57c8208`: `completed/failure`. A API forneceu job `validar`, mas não trouxe steps nem mensagem causal; **causa não confirmada**. Requer logs antes de propor correção; não repetir execução sem diagnóstico.
- Nenhum workflow foi disparado manualmente nesta verificação e nenhum teste foi declarado aprovado sem evidência.

### Limites reais do backup
- O histórico de commits, branches e documentação está preservado no GitHub; este checkpoint é um resumo factual, **não** um espelho literal das conversas nem um backup dos arquivos locais do computador.
- O conteúdo de IndexedDB da biblioteca do navegador, projetos não exportados, assets binários que não foram enviados e arquivos pessoais da pasta APP **não são automaticamente protegidos pelo Git**. A documentação do atualizador exige exportação e conferência de restauração da biblioteca antes de abandonar uma instalação antiga.
- A PR #12 ainda depende de revisão e merge para que seus registros façam parte da `main`. Nenhum HTML, script, asset, workflow ou módulo funcional foi apagado/alterado por este checkpoint.

### Próxima ação coordenada
- Respeitar WIP = 1: acompanhar a validação do atualizador (PR #7) antes de iniciar refatorações de código concorrentes.
- Depois, seguir a integração da plataforma única 3D + Pixel Art 2D + mapas 2.5D, corrigindo primeiro os links quebrados comprovados e preservando o catálogo antigo até localizar suas fontes de poções.
- Continuar registrando novidades com SHA, branch, arquivos, estado de CI e distinção entre proposta, implementação e validação.


## Checkpoint incremental — 02/11/2026, aproximadamente 01h BRT

**Finalidade:** registrar novas conversas e verificar o estado atual do GitHub, sem substituir o histórico anterior nem criar um novo backup idêntico. As informações abaixo distinguem decisão do autor, proposta de IA, evidência técnica externa e resultado confirmado no GitHub.

### 1. Novas diretrizes do autor em conversas recentes

- **Perfil e escopo:** o autor se declarou iniciante no uso do Codex e deseja empregá-lo em todas as frentes do projeto `Apoena Game Creator`, descrito também como **franquia**. A visão de produto é **completa**, **multiplataforma**, apta a **diferentes tipos de jogos** e com público inicial de criadores iniciantes. O projeto já foi iniciado; não se deve reconstruí-lo do zero.
- **Plataforma única preservada:** o Estúdio 3D, o Estúdio Pixel Art 2D e o Editor de Mapas 2.5D devem pertencer ao mesmo Creator, com um projeto ativo, biblioteca compartilhada e integração para o jogo Apoena. O escopo geral de múltiplos jogos não elimina Apoena como primeiro projeto consumidor.
- **Entrada e destinos:** foi aceita como direção a entrada `index.html`, suporte a **Godot 4 e HTML5**, com **prioridade de implementação Godot**. O diretório inicial de trabalho do Codex ainda não estava estabelecido nessa conversa.
- **Diretriz de planejamento:** diagnosticar o código existente, registrar dependências e contratos, preservar a bancada 3D e as funções já implementadas, e evoluir em etapas com testes. Uma proposta de IA para uma V0.1 de organização/interface/primeiro jogo funcional **não equivale a funcionalidade entregue nem a escopo técnico fechado**.

### 2. Diagnóstico relatado em análise externa de pacote do Creator (ainda não reproduzido neste checkpoint)

- Uma inspeção de ZIP do GameCreator relatou **155 entradas**, **71 arquivos JavaScript verificados sintaticamente sem erros** e **oito testes não executados/concluídos por indisponibilidade de `fake-indexeddb`**. Testes Godot e Android **não foram executados** nessa inspeção. Esses números se referem ao pacote analisado naquela conversa, **não** à árvore Git atual nem a validação canônica.
- A análise externa apontou possível divergência entre a documentação que chama `index.html` de loader de 24 partes e o `index.html` do pacote, descrito como HTML monolítico de aproximadamente 16,3 MB sem referências diretas às partes. **A confirmar por comparação reproduzível da árvore/artefato correspondente.** Não substituir o index, fonte V4.0 ou bundle com base apenas nesse relato.
- Foi proposta pela IA uma primeira integração **Godot Map Runtime Bridge**: ler JSON do mapa do Creator, converter para `TileMapLayer`/terrenos, posicionar personagem, suportar colisão, coleta e salvar/restaurar. **Estado: proposta técnica, não implementação nem aprovação de escopo integral.**
- Contratos já citados no projeto: `apoena.central.v1`, `apoena.gamecreator.catalogo.v1`, `apoena.map2d.v1`. Antes de inventar outro schema, conferir os consumidores e a compatibilidade existente.
- O planejamento da primeira fatia de runtime não deve ser confundido com a implementação completa de multiplayer, ecologia, autotiling avançado ou mapa 2.5D físico.

### 3. Snapshot GitHub verificado nesta execução

- Repositório: [apoenalore/GameCreator](https://github.com/apoenalore/GameCreator); branch principal `main` permanece em `1b95d036c31dfb4ca9f9ce6859510be2c9f7e8cd` no momento da consulta.
- [PR #12](https://github.com/apoenalore/GameCreator/pull/12): aberta, em rascunho, branch `maintenance/audit-cleanup-20261102`. Head antes deste checkpoint: `e86895c3f7fe9d172beb399c931d564dec95ee37`. Contém documentação, matriz de rotas e decisões de arquitetura; **não está integrada na main**.
- [PR #7](https://github.com/apoenalore/GameCreator/pull/7): aberta, em rascunho, head `b5836634b19dfcad3fa61fc3f7a85561c5be1f95`, referente ao atualizador incremental Windows. A API informou `mergeable_state=unstable`; isso não é diagnóstico causal de código.
- **Mudança de estado importante:** [run 41380526501](https://github.com/apoenalore/GameCreator/actions/runs/41380526501) da PR #7, antes `pending`, terminou `completed/failure` no head `b583663`. Job `validar` atribuído a `APOENA-GAMECREATOR-RUNNER`, mas o conector retornou `steps=[]` e não forneceu logs causais. **CAUSA NÃO CONFIRMADA**. Relatório: `docs/relatorios-actions/2026-11-02-run-41380526501-validacao-atualizador-sem-logs.md`.
- [Run 41380498183](https://github.com/apoenalore/GameCreator/actions/runs/41380498183) do head anterior `ddfd541` terminou `completed/cancelled`, não `failure`. Não serve como validação do head novo.
- [Run 41367279379](https://github.com/apoenalore/GameCreator/actions/runs/41367279379), `main`, SHA `57c8208`, segue `completed/failure` sem mensagem causal disponível. Relatório documental: `docs/relatorios-actions/2026-11-01-run-41367279379-main-sem-logs.md`.
- Não houve acesso ao conteúdo dos logs locais do runner, não foi disparado workflow manual e não foi aplicado código de correção. **Não declarar CI verde**.

### 4. Continuidade, limites e próxima ação

- A integração 3D + Pixel Art 2D + mapas 2.5D continua como arquitetura aprovada, com prioridade Godot para o primeiro fluxo de runtime. O Creator permanece concebido como ferramenta reutilizável para diferentes jogos.
- A tarefa técnica ativa deve respeitar **WIP = 1** entre GameCreator e Apoena Pixel Art HTML. A PR #7 não pode ser considerada concluída até obter logs, resolver a causa e validar seu head. As propostas de ponte de mapa e limpeza de rotas permanecem em planejamento.
- Preservar os cinco links legados quebrados e as nove fontes de poções ausentes como achados documentados; corrigir/migrar apenas após rastrear dependências, sem inventar assets nem remover conteúdo exclusivo.
- O backup Git registra **commits, documentos e decisões acessíveis**, mas não é cópia literal de todas as conversas nem protege automaticamente projetos em IndexedDB, assets locais não enviados ou dados da pasta APP. A restauração real desses dados exige exportação e teste.
- Esta execução atualiza **somente documentação na branch de auditoria**; não altera a `main`, scripts, builds, editores ou assets.


## Checkpoint incremental — 02/11/2026, 02h06 BRT (05h06 UTC)

**Pedido recorrente do autor:** fazer backup no GitHub do projeto Game Creator após as conversas e preservar novidades e informações detalhadas, sem perder decisões, limitações ou histórico.

### 1. Novidades de conversas e decisões
- Na revisão de continuidade desta janela não foram identificadas novas decisões ou novas conversas do projeto posteriores ao checkpoint anterior de aproximadamente 01h BRT. A arquitetura aprovada continua sendo **uma plataforma única** com Estúdio 3D, Estúdio Pixel Art 2D e Editor de Mapas 2.5D, projeto e biblioteca compartilhados; prioridade de integração Godot 4 e suporte HTML5.
- Permanecem pendentes a limpeza criteriosa de rotas vazias/links quebrados e a recuperação das fontes de poções ausentes. Não eliminar módulos antigos sem rastrear dependências e migrar conteúdo exclusivo.
- Nenhuma alteração funcional foi solicitada nesta janela além da manutenção do backup detalhado.

### 2. Estado GitHub consultado
- Repositório: https://github.com/apoenalore/GameCreator.
- `main`: SHA `1b95d036c31dfb4ca9f9ce6859510be2c9f7e8cd`, sem novos commits na consulta.
- PR #12: https://github.com/apoenalore/GameCreator/pull/12 — aberta em **rascunho**, branch `maintenance/audit-cleanup-20261102`. Head antes desta verificação: `7b0856492b9f0445a277fa36e7163256f1ef0bd0`; a PR preserva auditoria, arquitetura, matriz de rotas, incidentes e checkpoints, **sem merge na main**.
- PR #7: https://github.com/apoenalore/GameCreator/pull/7 — aberta, head `b5836634b19dfcad3fa61fc3f7a85561c5be1f95`, atualizador incremental Windows; ainda não validada no head.
- PRs #11, #6, #5 e #4 permaneciam abertas na consulta. Não houve evidência de merge recente dessas PRs.

### 3. Evidência nova: indisponibilidade dos logs de duas falhas do CI
- Run `41380526501` (PR #7, commit `b583663`, job `125071409041`) permanece `completed/failure`.
- Run `41367279379` (`main`, commit `57c8208`, job `125031378121`) permanece `completed/failure`.
- A consulta específica aos steps retornou `steps=[]` nos dois jobs.
- O download específico de logs dos dois jobs retornou **HTTP 404 / `BlobNotFound`** do armazenamento de logs, em 02/11/2026 05:06:09Z e 05:06:10Z, respectivamente. A mensagem do serviço foi `The specified blob does not exist`.
- **Interpretação rigorosa:** `BlobNotFound` é erro ao obter o arquivo de log; **não** demonstra a causa das falhas dos workflows. As causas continuam **NÃO CONFIRMADAS**.
- Foram complementados os relatórios `docs/relatorios-actions/2026-11-02-run-41380526501-validacao-atualizador-sem-logs.md` e `docs/relatorios-actions/2026-11-01-run-41367279379-main-sem-logs.md` com a nova evidência.
- Próxima coleta necessária: annotations/logs na interface GitHub Actions e logs locais do runner Windows. Não repetir workflow cegamente nem alterar código com base em hipótese.

### 4. Integridade e limites do backup
- Esta rodada modificou **somente documentação** na branch de auditoria. Nenhum HTML, asset, script, workflow, configuração de runner ou arquivo funcional foi excluído/alterado. Nenhum merge ou retry foi efetuado.
- O backup preserva o histórico versionado e o conhecimento documentado no GitHub, **não** é espelho literal de todas as conversas nem backup dos dados locais de IndexedDB, projetos não exportados, imagens/modelos não enviados ou arquivos pessoais da pasta APP.
- Manter o protocolo **WIP = 1** e não iniciar refatoração paralela enquanto a validação da tarefa ativa estiver pendente.
- **Próximo passo:** coletar logs causais das falhas; depois retomar a unificação 3D/2D/2.5D e correção de rotas com testes de regressão.


## Checkpoint incremental — 02/11/2026, aproximadamente 07h BRT (10h UTC)

**Pedido recorrente:** backup no GitHub do Game Creator a cada conversa, preservando novidades, requisitos, decisões e informações detalhadas.

### Novidade verificada na base Apoena Skill
- A `main` de `apoenalore/apoenaskil` avançou ao commit [`633743695`](https://github.com/apoenalore/apoenaskil/commit/633743695d7f1d0a26c3926ef706b61ee9f75df9), datado de 02/11/2026 09:42:49 UTC. Esse commit acrescenta um adendo de recuperação de conversas do projeto, ainda com **cobertura PARCIAL**.
- O adendo contém requisitos relevantes para o GameCreator: edição Pixel Art com transparência, apagador, recorte manual/inteligente e grade; animações por ação/direção/quadro; biblioteca compartilhada; camadas e composição de objetos; hover amarelo; persistência; tilesets e mapas 2.5D; exportação de metadados.
- Também recupera requisitos de jogo que afetam o planejamento de metadados do editor: ecologia/plantas/sementes/decomposição, clima contextual, e cooperação local entre dois celulares via Bluetooth ou Wi-Fi Direct. Não confundir com a arquitetura online híbrida Android/PC, que é outra frente.
- O erro `Identifier not found: EstadoHistoria` (`modelo_heroi_3d.gd:54`) e o timeout `personagens_provisorios_smoke` de 120s são **relatos históricos não reproduzidos no HEAD atual**. Não os atribuir às falhas atuais de CI.
- O detalhamento, fonte, classificação de status, riscos e próxima sequência estão em [CHECKPOINT_SKILL_REQUISITOS_RECUPERADOS_2026-11-02.md](CHECKPOINT_SKILL_REQUISITOS_RECUPERADOS_2026-11-02.md).

### Snapshot e preservação
- `GameCreator/main` permanece em `1b95d036c31dfb4ca9f9ce6859510be2c9f7e8cd`; a PR #12 segue draft na branch de auditoria e a PR #7 segue draft sem validação final comprovada.
- A PR #6 do Apoena Skill continua draft; o novo commit da Skill citado acima está na `main`, em outro arquivo.
- As execuções de CI `41380526501` e `41367279379` continuam com falha e sem causa comprovada nesta consulta; não houve retry.
- Esta rodada registra **novos requisitos recuperados**, sem repetir um checkpoint vazio. Somente documentação da branch de auditoria foi modificada; nenhum código funcional, asset, workflow ou `main` foi alterado.
- Dados de IndexedDB, projetos não exportados e arquivos locais não são incluídos automaticamente no backup do GitHub.
