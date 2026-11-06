# Sistemas de integridade, economia e experiência do jogador — referências atuais e proposta Apoena

**Data:** 02/11/2026  
**Escopo:** medidas públicas documentadas de jogos online, com foco em integridade competitiva, abandono/AFK, ranque, comportamento, economia e proteção da experiência.  
**Status:** pesquisa e proposta de design; não representa implementação no jogo.

## 1. Distinção essencial: ausência, abandono e comportamento

Não tratar todos os casos como “inatividade”. São problemas diferentes:
- **Ausência da conta:** jogador não entrou no jogo por dias/semanas. Normalmente não deve ser punida em modos casuais.
- **AFK durante partida:** jogador entra em uma partida e deixa o time em desvantagem; pode receber penalidade escalonada.
- **Abandono de fila/lobby:** jogador confirma intenção de jogar e sai em etapa crítica; penalidade própria.
- **Decaimento competitivo:** perda de pontos/posição em ranques de topo após período de inatividade, para manter a competição atualizada.
- **Comportamento abusivo/cheating:** exige evidência e sistema disciplinar próprio; não deve ser confundido com baixo desempenho.

## 2. Referência: League of Legends / Riot (documentação oficial consultada em 02/11/2026)

### AFK e abandono durante partidas
A FAQ oficial da Riot, atualizada em 02/06/2026, descreve níveis de penalidade:
- Tier 0: atraso de 1 minuto em 1 partida.
- Tier 1: atraso de 5 minutos em 5 partidas.
- Tier 2: atraso de 10 minutos em 5 partidas.
- Tier 3: atraso de 15 minutos em 5 partidas.
- Tier 4: bloqueio de fila por 24 horas, seguido de Tier 3 em 1 partida.
- Tier 5: bloqueio por 3 dias, seguido de Tier 3 em 1 partida.
- Tier 6: bloqueio por 7 dias, seguido de Tier 3 em 1 partida.
- Tier 7: bloqueio por 14 dias, seguido de Tier 3 em 1 partida.
A Riot indica aviso antes da punição e notificação ao entrar em novo tier. Partidas customizadas e treinamento não geram essas penalidades. Uma partida precisa cumprir critérios mínimos para reduzir o atraso; abandono/AFK nela pode impedir a redução.

Fonte: https://support.riotgames.com/ms-my/league-of-legends/penalties/away-from-keyboard-afk-faq

### Abandono de fila
A Riot aplica penalidades próprias para sair de champion select ou não confirmar prontidão. Em ranqueadas, o sistema pode aumentar o tier após reincidência, com efeitos mais severos. Isso não é igual a abandonar uma partida já iniciada.

Fonte: https://support-leagueoflegends.riotgames.com/hc/pt-br/articles/201751844-Abandono-de-fila

### Decaimento de ranque
A Riot informa que decaimento se aplica a Diamond e acima, não a todos os jogadores. Em Master/Grandmaster/Challenger há sistema de dias acumulados (“banked days”): partidas ranqueadas geram dias de proteção até um limite; depois, inatividade provoca perda de LP. Isso é manutenção da posição competitiva, não punição por não fazer login diariamente.

Fontes:
- https://support.riotgames.com/ms-my/league-of-legends/gameplay/placements-promotions-series-demotions-and-decay
- https://support.riotgames.com/en-us/league-of-legends/gameplay/master-grandmaster-and-challenger-the-apex-tiers

### Comportamento e reparação da experiência
A Riot descreve sistema de feedback e punição para condutas comprovadas, com possibilidade de restrições e suspensões. Também documenta compensações a jogadores afetados por partidas com abandono ou comportamento prejudicial confirmado, como proteção contra autofill, LP de consolação ou rerolls, conforme modo e regras.

Fontes:
- https://support-leagueoflegends.riotgames.com/hc/en-us/articles/207489286-Instant-Feedback-System-FAQ
- https://support.riotgames.com/en-us/league-of-legends/security/disruptive-behavior-repair
- https://support.riotgames.com/en-us/league-of-legends/security/player-reporting-guide-and-faq

## 3. Princípios de design que Apoena pode adotar

1. Penalidade deve corresponder ao comportamento e ao dano causado, não à simples ausência.
2. Aplicar avisos e escalonamento transparente.
3. Diferenciar desconexão involuntária de abandono deliberado quando houver evidência técnica.
4. Oferecer recurso/contestação e revisão de sanções relevantes.
5. Não punir jogadores por jogar mal, escolher estratégias incomuns ou ficar offline.
6. Criar compensação para participantes prejudicados por abandono confirmado.
7. Preservar acessibilidade e tolerância a instabilidade de rede.
8. Evitar punições automáticas irreversíveis baseadas em um único sinal.
9. Aplicar regras mais estritas somente a modos competitivos com compromisso explícito.
10. Exibir ao jogador o motivo, duração, critério de recuperação e status da penalidade.

## 4. Proposta de política Apoena

### Casual / exploração / história
- Não há punição por dias sem login.
- Não há perda de personagem, equipamento ou progresso por ausência.
- Desconexão não deve apagar recompensas já conquistadas.
- Retorno ao jogo deve ser simples, com atualização do estado do mundo.

### Partidas em equipe e modos competitivos
- Antes de entrar, exibir duração estimada e compromisso da partida.
- Se sair do lobby antes do início, aplicar penalidade leve e progressiva apenas em reincidência.
- Se abandonar uma partida iniciada, registrar o incidente e aplicar penalidade escalonada conforme modo, tempo e impacto.
- Desconexão com reconexão rápida e evidência de falha de rede deve receber tratamento distinto de abandono deliberado.
- Partidas interrompidas por falha do servidor não devem gerar penalidade ao jogador.
- Compensar jogadores prejudicados quando o abandono for confirmado e as regras do modo permitirem.
- Não punir quem continua jogando com baixo desempenho ou estratégia não convencional.

### Ranque e reputação competitiva
- Considerar decaimento apenas em faixas de topo, se a classificação competitiva exigir atividade contínua.
- Usar dias de proteção acumuláveis, avisos e período de tolerância.
- Decaimento afeta pontos/posição competitiva, não inventário, moeda ou personagem.
- Não aplicar decaimento em modos casuais ou progresso de história.
- Definir regras transparentes por temporada.

### Economia e integridade do mundo
- Não apagar riqueza/progresso legítimo por inatividade.
- Eventos temporários podem expirar, mas devem ter prazos e regras visíveis.
- Proteger itens raros, crafting, trocas e moedas com servidor autoritativo, transações e auditoria.
- Separar punição competitiva de sanção econômica; confisco só após fraude/exploit comprovado e processo auditável.
- Impedir que itens comunitários alterem atributos competitivos fora dos templates oficiais.
- Usar ledger para operações econômicas e reversões controladas.

## 5. Integridade do mundo persistente

Se o mundo Apoena tiver territórios, dungeons, recursos ou estruturas controladas por jogadores:
- O servidor mantém estado canônico e relógio oficial.
- Ações de construção, captura, saque e crafting são transações autorizadas.
- Definir regras de decay de estruturas/territórios como mecânica de jogo, com aviso, período de graça e proteção para ausências justificadas.
- Evitar que guildas percam todo o progresso por uma ausência curta.
- Impedir duplicação de recursos por corrida, retry ou reconexão.
- Manter histórico de eventos críticos e possibilidade de rollback administrativo.
- Separar eventos narrativos do mundo de alterações causadas por exploits.

## 6. Proposta de modelo de penalidade gradual (a validar por telemetria)

- Primeira ocorrência leve: aviso e explicação.
- Reincidência: pequeno atraso para reentrar em fila competitiva.
- Reincidência continuada: bloqueio temporário do modo competitivo.
- Abandono grave/repetido ou fraude comprovada: suspensão maior, com revisão e recurso.
- Comportamento abusivo e cheating: trilhas disciplinares distintas, com evidências específicas.

Os tempos concretos não devem ser copiados cegamente do LoL. Precisam ser calibrados com duração das partidas, taxa de desconexão legítima, latência regional, reconexão, impacto no time e testes de experiência.

## 7. Dados e métricas que Apoena deve medir

- Taxa de AFK por modo e região.
- Tempo médio para reconectar.
- Desconexões por falha do servidor versus cliente/rede.
- Abandono por fase da partida.
- Reincidência por conta, com proteção contra falsos positivos.
- Percentual de recursos de punição aceitos.
- Taxa de compensação e abuso de compensação.
- Inflação/deflação de moeda e itens.
- Duplicações e reversões de transações.
- Retenção e retorno de jogadores, sem punir ausência casual.
- Satisfação dos jogadores afetados por abandono.

## 8. Referência de segurança de jogos

OWASP Game Security Framework cobre integridade, anti-cheat, sistemas do jogo, contas, economia virtual e experiência. O projeto recomenda nível 2 para a maioria dos jogos online/multiplayer e nível 3 para ecossistemas com economia de alto valor e exigências competitivas elevadas.

Fonte: https://owasp.org/projects/gamesec-framework

## 9. Decisão a preservar

Apoena não deve punir a ausência diária em jogo casual. O modelo a estudar é:
- penalizar abandono/AFK durante compromissos competitivos;
- aplicar decaimento apenas a ranques de topo, se necessário;
- preservar personagens e economia legítimos durante ausência;
- compensar os jogadores prejudicados;
- manter avisos, transparência, recurso e proteção contra falsos positivos.

**Estado:** proposta documental. Nenhuma regra de jogo, sistema de conta, banco ou penalidade foi implementado.
