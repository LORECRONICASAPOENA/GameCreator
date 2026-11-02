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


## Checkpoint — 02/11/2026, aproximadamente 09:04 BRT — acervo APOENA Verso e colaboração entre IAs

**Origem:** conversa do autor sobre mitologia, documentação, recuperação de fontes e comunicação com uma segunda IA sem acesso ao GitHub; consulta autenticada ao estado do GameCreator e do Apoena Skill. **Registro detalhado:** [2026-11-02-apoena-verso-coleta-auditoria-transferencia-ia.md](registros-conversas/2026-11-02-apoena-verso-coleta-auditoria-transferencia-ia.md).

- **Decisão autoral expressa:** todos os documentos, imagens, capítulos, roteiros e sistemas enviados são parte da **obra APOENA**, não referências externas. Preservar originais e versões, não modificar cânone sem aprovação, diferenciar fonte primária, revisão, resumo e proposta.
- **Fontes prioritárias identificadas:** `APOENA VERSO BÍBLIA OFICIAL — CÂNONE MESTRE.pdf` e `Apoena-A-Origem-do-Universo-Revisada.pdf` (51 páginas, conforme inventário histórico), além de `1 Lore apoena`, `Grock Lore Apoena`, capítulo 1, versões de Aurium, origem de Agar e hierarquia de Agar. A presença no inventário **não prova** que todos os PDFs originais estejam armazenados neste GitHub ou acessíveis nesta sessão.
- **Conteúdo recuperado:** Grande Espírito, Aurium, Espírito da Vida, Kairu/Aruam, Nairuk/Serpentário, Guerra Celestial, Arkana, Tupi, Anahi, Agar, quatro tribos, Apoena e as seis manifestações. Há divergências entre versões, especialmente Blin/Brin, Oriom/Orium e duração antiga de três anos versus três meses canonizados. **Não alterar a narrativa nesta etapa.**
- **Investigação estruturada:** o autor elaborou 100 perguntas em nove áreas (cosmologia, hierarquia espiritual, guerra, Arkana, humanidade/Agar, Aurium, protagonista, auditoria de fontes e adaptação para jogo). Foram solicitados quatro lotes de originais: Bíblia/cosmologia, poderes, história/personagens/geografia e Game Creator/jogos. Perguntas não devem ser declaradas respondidas apenas por um resumo.
- **IA colaboradora sem GitHub:** foi redigida uma apresentação e transferência de conhecimento para encaminhamento pelo autor. **Não houve envio direto à outra IA**, nem confirmação de leitura.
- **Backup local anterior:** a conversa relatou um ZIP documental de 11 originais, com extrações e manifesto; um PDF chamado `Untitled document.pdf` foi excluído por conter credenciais/códigos. **O ZIP e os PDFs binários não foram enviados ao GitHub por esta atualização**. Não expor dados sensíveis.
- **Código remoto:** a `main` foi encontrada no SHA `1b95d036c31dfb4ca9f9ce6859510be2c9f7e8cd` antes destes commits documentais; arquivos de código rastreados permanecem no histórico Git. A auditoria de duplicações/limpeza já existe, sem autorização de exclusão.
- **PR #11:** continua aberta em rascunho e não integrada, head `70a4e09e7243d56f0f0313a7791a849218514055`. Run [41433942503](https://github.com/apoenalore/GameCreator/actions/runs/41433942503) terminou `completed/failure`. Logs do job `validar` retornaram `404 BlobNotFound` e lista de etapas vazia; **CAUSA NÃO CONFIRMADA**. Relatório específico: [2026-11-02-run-41433942503-validacao-pr11-causa-nao-confirmada.md](relatorios-actions/2026-11-02-run-41433942503-validacao-pr11-causa-nao-confirmada.md). Não repetir CI nem alterar código sem evidência.
- **Preservação e limite:** somente documentação foi adicionada; nenhum arquivo funcional, teste, asset, workflow, runner, banco de dados, IndexedDB ou instalação local foi modificado/copied. O GitHub não dá acesso automático a conversas privadas ou arquivos locais. WIP=1 preservado.

**Próxima verificação:** comparar novo head da main e da PR #11; recuperar evidência de CI; continuar inventário de fontes e atualização documental apenas se houver fatos novos. Não produzir commits horários vazios.


## Checkpoint — 02/11/2026 — lacunas do backup e auditoria estática de ZIPs

**Origem:** solicitação do autor para verificar o que falta no backup; relatório de auditoria estática recebido em conversa. **Documento detalhado:** [2026-11-02-lacunas-backup-auditoria-estatica.md](relatorios-conversas/2026-11-02-lacunas-backup-auditoria-estatica.md).

- **Dois ZIPs idênticos no relatório recebido:** SHA-256 `bb40c8419056dfecdf75f9db99ee2deecfe6963a7fbe5b3d5b804b8b7346dfd9`, 60.120.095 bytes cada, 155 entradas. O ZIP não certifica branch ou commit do GitHub. Outros pacotes mencionados em conversa anterior não foram revalidados nesta execução.
- **Testes relatados:** 71 JS/CJS e 57 blocos inline passaram em sintaxe; oito arquivos/suítes de testes executaram com sucesso, com 10 casos internos de catálogo; duas suítes IndexedDB bloqueadas pela ausência de `fake-indexeddb/auto`; sem validação integral Godot, PowerShell, Android, navegador interativo ou CI no SHA do ZIP.
- **Achados a verificar no código atual:** GC-SEC-001 (origem `null` na ponte), GC-MAP-001 (perfil de tileset descartado), GC-MAP-002 (autotiling de água incompleto), GC-CI-001 (workflows sobrepostos), GC-BUILD-001 (paridade de builds), GC-DOC-001 (documentação contraditória), GC-TEST-001 (smoke estrutural) e GC-TEST-002 (dependência de testes). **Nenhum marcado como corrigido**.
- **Lacunas de preservação:** transcrições integrais, originais narrativos e binários, biblioteca IndexedDB, arquivos locais, índice unificado, matriz de problemas/testes, evidências de execução, sprites citados como ausentes e restauração comprovada. Dossiê estratégico da conversa permanece em [branch documental](https://github.com/apoenalore/GameCreator/blob/backup/gamecreator-conversa-20261102-0904-brt/docs/relatorios-conversas/2026-11-02-dossie-analise-evolucao-gamecreator-recebido.md).
- **Próximo pacote proposto:** `APOENA_BACKUP_MESTRE_2026-11-02` com oito seções e manifestos SHA-256, **ainda não gerado**. Não declarar backup completo sem cópias externas e teste de restauração.
- **Preservação:** somente documentação; nenhum código, workflow, teste, runner, asset, ZIP original ou IndexedDB alterado. WIP=1 preservado.
