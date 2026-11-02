# Plano para tornar Apoena um jogo online

**Data:** 02/11/2026  
**Status:** arquitetura proposta; nenhum servidor ou serviço online foi implementado por este documento.

## Objetivo

Transformar o jogo Apoena em um RPG online mobile com exploração compartilhada, grupos, dungeons, combate, mundo persistente, economia e conteúdo comunitário. O Game Creator é uma ferramenta de produção; não deve ser confundido com o servidor/runtime do jogo.

## 1. Arquitetura lógica

- **Cliente mobile/desktop:** renderização, input, interface, áudio e apresentação local.
- **Gateway/API HTTPS:** autenticação, perfil, inventário, loja, catálogo, guildas, suporte e operações não realtime.
- **Servidores de sessão/partida:** simulação realtime, movimentação, combate, monstros, instâncias e validação autoritativa.
- **Banco relacional (candidato: PostgreSQL):** contas, personagens, inventários, transações, guildas, progresso e auditoria.
- **Cache/filas (futuro, conforme carga):** presença, matchmaking, filas, eventos e tarefas assíncronas; não adotar sem necessidade medida.
- **Object storage/CDN:** builds, mapas, modelos, texturas, áudio e conteúdo comunitário aprovado.
- **Painel administrativo:** suporte, moderação, operações, auditoria e observabilidade.
- **Telemetria e segurança:** métricas, logs, alertas, detecção de abuso, backups e resposta a incidentes.

Fluxo: cliente -> TLS/API ou protocolo realtime seguro -> autenticação/autorização -> servidor autoritativo -> banco/storage. O cliente nunca conecta diretamente ao banco.

## 2. Escolha de arquitetura de jogo

Antes de escolher tecnologia, definir:
- Engine/runtime efetivo do jogo (Godot foi citado em partes da integração, mas precisa ser confirmado como runtime final).
- Modelo de mundo: zonas compartilhadas, instâncias de dungeon, arenas ou mundo contínuo.
- Jogadores simultâneos por zona/partida.
- Frequência de atualização e tolerância de latência.
- Plataformas: Android primeiro? PC também?
- Necessidade de cross-play e persistência offline.

Para um RPG de ação com grupos e dungeons, começar com **servidores dedicados autoritativos por zona/instância**, em vez de tentar construir um único mundo massivo contínuo logo na primeira versão. Um servidor de sessão calcula ações importantes e sincroniza estado com os clientes.

## 3. Sistemas necessários

### Identidade e contas
Cadastro/login, verificação, recuperação, MFA para equipe, sessões revogáveis, proteção contra credential stuffing e autorização por objeto.

### Rede realtime
Transporte adequado ao engine e ao tipo de jogo. Usar solução madura com autenticação de sessão, sequência/nonce, anti-replay, limites de pacotes, timeout e reconexão. HTTPS/TLS para APIs e downloads; tráfego realtime UDP precisa de protocolo seguro apropriado, não simplesmente “HTTPS em tudo”.

### Servidor autoritativo
Cliente envia intenção/input. Servidor valida posição, velocidade, alcance, linha de visão, cooldown, dano, drops, XP, inventário, crafting, trocas e resultados. Nunca aceitar saldo, dano, item ou vitória calculados pelo cliente.

### Persistência e economia
Banco relacional com schema versionado, prepared statements, privilégio mínimo, transações atômicas, ledger de economia, idempotência, constraints e auditoria. Backups criptografados e testes de restauração.

### Mundo persistente
Estado canônico no servidor. Zonas e dungeons com regras claras de instância. Eventos e alterações de território registradas. Reconexão e rollback controlados para falhas.

### Segurança e operação
TLS moderno, gestão de segredos, WAF/rate limit quando apropriado, firewall, proteção DDoS do provedor, logs protegidos, alertas, patching, CI/CD com permissões mínimas e plano de incidentes.

### Comunidade e conteúdo criado por jogadores
Primeira versão declarativa e sem scripts: manifestos versionados, formatos limitados, validação binária, quarentena, moderação, assinatura/hash e revogação. Aparência comunitária separada de atributos competitivos.

## 4. Fases de desenvolvimento

### Fase 0 — definição do MVP online
- Confirmar engine e build alvo.
- Escolher uma pequena área de teste.
- Definir limite inicial de jogadores simultâneos.
- Definir ações realtime mínimas: login, spawn, movimento, chat simples e desconexão/reconexão.
- Definir requisitos de segurança e orçamento de hospedagem.

### Fase 1 — protótipo de rede
- Subir servidor dedicado de desenvolvimento.
- Conectar dois clientes.
- Sincronizar movimento com interpolação.
- Testar latência, perda de pacotes, reconexão e desconexão.
- Sem economia real, comércio ou PvP ranqueado ainda.

### Fase 2 — backend e persistência
- Implementar contas e sessões.
- Persistir personagem e progresso.
- Implementar inventário no servidor.
- Testar autorização cruzada e restauração.
- Criar ambiente de homologação separado.

### Fase 3 — gameplay online
- Combate autoritativo.
- Monstros e loot no servidor.
- Grupos e matchmaking.
- Instâncias de dungeon.
- Chat, presença, denúncias e moderação.

### Fase 4 — economia e mundo
- Moedas, crafting, comércio e recompensas com ledger.
- Guildas, territórios e eventos persistentes, conforme escopo aprovado.
- Anti-duplicação, antifraude e monitoramento econômico.

### Fase 5 — beta fechado e lançamento
- Teste de carga e capacidade.
- Pentest e revisão independente.
- Plano de backup/restore e resposta a incidentes.
- Telemetria de estabilidade, latência e abandono.
- Rollout gradual e rollback de versão.

## 5. Primeiro protótipo recomendado

Não tentar construir todo o MMORPG de uma vez. Fazer uma prova de conceito:
1. Uma pequena área do mapa.
2. Dois a cinco clientes conectados.
3. Um servidor dedicado.
4. Jogadores aparecem e movimentam-se.
5. Servidor valida movimento e posição.
6. Um personagem desconecta e retorna.
7. Estado mínimo de personagem persiste no banco.
8. Logs registram sessão e falhas.

Critérios de aceite: clientes não definem posição final; um cliente não consegue alterar dados do outro; reconexão não duplica personagem/itens; latência e consumo são medidos.

## 6. Decisões ainda pendentes

- Engine final do jogo e versão.
- Mundo contínuo ou zonas/instâncias.
- Jogadores simultâneos por sessão.
- Plataforma inicial e cross-play.
- Região de hospedagem e orçamento mensal.
- Backend próprio ou plataforma especializada.
- Modelo de conta e autenticação.
- Escopo de chat, guildas, comércio e PvP no primeiro MVP.

## 7. Recomendação

Começar por uma vertical slice online com dois clientes e um servidor dedicado. Só depois acrescentar persistência, combate, economia e mundo persistente. Manter segurança no desenho desde o primeiro endpoint. O Game Creator continuará sendo ferramenta de autoria; o jogo online terá runtime, backend, servidores e pipeline próprios.

**Não declarar “online pronto” até passar testes de autorização, integridade, reconexão, carga, backups e segurança.**


## Decisões de arquitetura após escolha do autor (02/11/2026)

**Escolhas confirmadas:** modelo híbrido; meta inicial de 20–50 jogadores simultâneos; plataformas Android e PC.

### Topologia recomendada para o MVP
- **Cliente multiplataforma:** Android e PC usando o mesmo protocolo e regras de gameplay; diferenças de input/UI tratadas no cliente.
- **Gateway/API:** HTTPS para autenticação, perfil, inventário, loja, catálogo e operações não realtime.
- **Servidor autoritativo de mundo:** processo dedicado/headless por região compartilhada. O cliente envia inputs/intenção; servidor valida e publica estado.
- **Instâncias:** processos/sessões isolados sob demanda para dungeons e arenas, com limites e encerramento controlados.
- **Persistência:** PostgreSQL como candidato recomendado para dados canônicos; Redis apenas quando houver necessidade demonstrada de presença, filas ou cache. Object storage/CDN para assets aprovados.
- **Admin/observabilidade:** logs estruturados, métricas, alertas, trilha de auditoria, ferramentas de suporte e moderação.

### Capacidade inicial
Meta de teste: 20–50 jogadores simultâneos no conjunto do ambiente de teste, não promessa de capacidade de produção. Começar com uma região de teste e uma instância de dungeon; medir tick rate, latência p50/p95/p99, uso CPU/RAM, tráfego, entidades por jogador, perda de pacotes e consultas ao banco. Só então definir capacidade por processo e escalar.

### Tecnologia candidata e ressalvas
- Godot Dedicated Server/headless é candidato se Godot for confirmado como engine/runtime final. A presença de scripts de integração Godot no Game Creator não prova que o jogo executável esteja finalizado nessa engine.
- Nakama deve ser avaliado como opção de backend pronto (contas, sessões, matchmaking, storage e realtime) versus backend próprio. Não adotar ambos indiscriminadamente; escolher após protótipo de integração, custo operacional, compatibilidade com engine e modelo de autoridade.
- PostgreSQL é a opção relacional inicial recomendada; Redis é opcional, não requisito do primeiro protótipo.
- HTTPS/TLS para API e downloads. Para realtime UDP, escolher transporte/protocolo seguro compatível com engine e validar autenticação, integridade e anti-replay; não presumir que HTTPS/TLS de API protege automaticamente pacotes UDP.

### Primeira vertical slice
1. Confirmar engine, versão, projeto executável e build Android/PC.
2. Criar um mapa pequeno de teste e um servidor headless.
3. Conectar 2 clientes (um Android e um PC, se possível) e validar handshake/sessão.
4. Sincronizar spawn, movimento e presença com autoridade do servidor.
5. Implementar interpolação e reconexão sem duplicar sessão/personagem.
6. Persistir somente perfil/personagem mínimo no backend; ainda sem economia negociável.
7. Testar tentativa de falsificar posição, velocidade, ID de outro jogador e replay de mensagens.
8. Subir gradualmente a 5, 10, 20 e 50 clientes simulados/reais; medir e documentar limites.
9. Adicionar uma dungeon instanciada após estabilidade da região compartilhada.

### Critérios de aceite do primeiro protótipo
- Android e PC conseguem entrar na mesma sessão.
- Servidor decide posição/estado canônico; cliente não consegue impor estado arbitrário.
- Usuário não consegue ler ou alterar perfil de outra conta.
- Reconexão/retry não duplica jogador nem recompensa.
- Falha de servidor não concede penalidade nem perde progresso confirmado.
- Métricas de latência e recursos são coletadas e registradas.
- Testes negativos e logs demonstram rejeição de entradas inválidas.

### Pendências antes de comprar hospedagem ou iniciar implementação definitiva
- Confirmar engine e versão do runtime real do jogo.
- Escolher stack de servidor compatível com a engine.
- Definir região inicial de hospedagem, orçamento mensal e política de dados.
- Definir número de jogadores por zona, taxa de atualização e densidade de NPCs/monstros.
- Decidir Nakama versus backend próprio após prova técnica.
- Definir escopo mínimo de gameplay: login, spawn, movimento, chat, reconexão; combate vem depois.

**Não iniciado:** esta seção registra a arquitetura e os critérios; não cria servidor, banco, API, contas ou conectividade real.
