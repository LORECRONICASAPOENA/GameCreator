# Pesquisa complementar — anti-cheat, ataques a jogos, SQL e TLS

**Data:** 02/11/2026  
**Projeto:** Apoena / Game Creator  
**Status:** pesquisa técnica e recomendações; não é auditoria completa nem confirmação de vulnerabilidades no futuro jogo.

## 1. Referências comerciais

### GTA Online / BattlEye
A Rockstar documenta a integração do BattlEye ao GTA Online para PC em setembro de 2024. O suporte oficial descreve o BattlEye como anti-cheat em nível de kernel, usado durante sessões online para detectar software de trapaça que acessa os servidores, manipulação de código protegido e sabotagem da experiência de outros jogadores. Isso é evidência sobre GTA Online, não prova da arquitetura de GTA 6.

Fonte: https://support.rockstargames.com/articles/1nenwhZlVrJY6CTFeSS2Fx/grand-theft-auto-online-battleye-faq  
Notas de atualização: https://support.rockstargames.com/articles/eUgRHVRSN2V9gimBT32YX/gtav-title-update-1-69-notes-ps5-ps4-xbox-series-x-xbox-one-pc

### Free Fire / Garena
A Garena documenta equipes dedicadas de segurança/engenharia/operações, detecção e punição de clientes modificados e software de terceiros não autorizado, denúncias dentro do jogo e um programa de recompensa para relatos de vulnerabilidades qualificadas via HackerOne. A Garena também alerta que banimento por IP pode punir inocentes em redes compartilhadas; portanto, IP isolado não deve ser nossa identidade principal.

Fontes:
- https://ffsupport.garena.com/hc/en-us/articles/4412920960922-Free-Fire-Game-Security-FAQ
- https://ffsupport.garena.com/hc/en-us/articles/4412913831194-Anti-Hack-FAQ

**Lição para Apoena:** defesa em camadas, equipe/processo de resposta, sinais comportamentais, reporte no jogo e divulgação responsável. Não copiar anti-cheat kernel como primeira etapa: exige privilégio elevado, tem custos de privacidade/compatibilidade e não substitui segurança de backend.

## 2. Modelo de ameaças de jogos multiplayer

Avaliar pelo menos estas classes, sem presumir que todas já existem no Creator atual:

- Adulteração do cliente: memória, arquivos, modelos, velocidade, macros e cliente modificado.
- Abuso de protocolo: replay, mensagens fora de ordem, spoofing, sessão roubada, alteração de parâmetros e flood.
- APIs: BOLA/IDOR, autenticação fraca, mass assignment, abuso de funções, SSRF e consumo irrestrito.
- Conta: credential stuffing, phishing, roubo/reuso de tokens e recuperação de conta abusada.
- Economia: duplicação de itens, race conditions, fraude de compra, replay de recompensa, abuso de gift codes e bots.
- UGC/mods: parser de imagem/modelo, arquivos excessivos, path traversal, dependência maliciosa, código executável e acesso indevido a dados.
- Disponibilidade: DDoS, exaustão de CPU/memória/storage, abuso de filas e consultas caras.
- Cadeia de suprimentos: dependências comprometidas, workflow CI/CD excessivamente privilegiado, segredo em repositório e pacote de atualização adulterado.

## 3. Anti-cheat adequado ao Apoena

### Controles essenciais no servidor
- Servidor autoritativo para posição validada, combate, dano, cooldown, inventário, crafting, moedas, trocas, recompensas, ranking e resultado.
- Cliente envia intenção/inputs; servidor valida e calcula consequências.
- Validar limites de velocidade, aceleração, alcance, linha de visão, cadência de ações e pré-condições.
- Usar sequência/número de evento, nonce, expiração e idempotência para impedir repetição de ações.
- Detectar padrões impossíveis, mas não banir automaticamente com base em um único sinal ou latência.
- Guardar evidência, permitir revisão e recurso; usar sanções proporcionais.
- Separar modos privados/modificados de partidas competitivas.
- Assinar manifests e builds oficiais; verificar hashes e revogar versões comprometidas.

### Limites do cliente
O cliente está sob controle do jogador. Obfuscação e anti-cheat local elevam custo, mas não são raiz de confiança. Não colocar segredos, chaves privadas ou lógica de autoridade no APK/HTML. TLS não impede adulteração antes do envio nem um cliente autenticado de abusar de permissões.

## 4. SQL e proteção do banco

### SQL Injection
Ocorre quando dados não confiáveis são interpretados como sintaxe SQL. Pode expor, alterar ou excluir dados; impacto depende dos privilégios e configuração.

**Obrigatório:**
- Prepared statements / consultas parametrizadas para todo valor.
- Nunca concatenar entrada do usuário em SQL.
- Para nomes de tabelas/colunas/ordenação dinâmicos, usar mapeamento allowlist fixo no código; parâmetros SQL normalmente não substituem identificadores.
- Validar tipo, tamanho e formato, sem confundir validação com autorização.
- Contas SQL separadas por serviço e privilégio mínimo; nunca usar DBA/admin pela aplicação.
- Separar permissões de leitura, escrita e migração.
- Segredos fora do repositório e fora do cliente.
- Transações ACID e constraints para operações econômicas.
- Idempotency key e ledger/auditoria para compra, craft, troca e recompensa.
- Backup criptografado, cópia isolada e teste de restauração.
- Acesso ao banco somente por rede privada/serviços autorizados, sem porta pública desnecessária.
- Logs sem senhas, tokens, dados de pagamento ou consultas sensíveis completas.

Exemplo conceitual (sintaxe depende do driver):
```javascript
// Evitar: concatenar nome recebido do usuário na string SQL.
const sql = "SELECT id FROM players WHERE username = ?";
db.execute(sql, [username]);
```

Prepared statements não resolvem BOLA/IDOR. Mesmo uma consulta parametrizada deve incluir o escopo do usuário autenticado e autorização no servidor; conhecer um ID não concede propriedade.

Fonte: https://cheatsheetseries.owasp.org/cheatsheets/SQL_Injection_Prevention_Cheat_Sheet.html

## 5. SSL/TLS e comunicação

- SSLv2/SSLv3 são obsoletos e devem estar desativados.
- TLS 1.0/1.1 desativados.
- TLS 1.3 como padrão; TLS 1.2 apenas quando necessário por compatibilidade, com suites fortes.
- Certificados válidos, cadeia confiável, hostname verificado, renovação e monitoramento de expiração.
- HTTPS para login, APIs, loja, pagamentos, downloads, telemetria e atualizações.
- HSTS em serviços web HTTPS.
- Nunca desabilitar validação de certificado em produção.
- Não criar criptografia própria nem protocolo de handshake próprio.
- mTLS pode ser considerado entre serviços internos; não é automaticamente necessário para cada jogador.
- Para tráfego multiplayer UDP/tempo real, HTTPS/TLS não se aplica diretamente a todo pacote: selecionar protocolo seguro maduro (ex. DTLS ou solução de transporte autenticado apropriada), autenticação de sessão, anti-replay e integridade. Não improvisar criptografia.
- TLS protege confidencialidade/integridade do transporte e autentica o servidor; não garante que o cliente seja honesto nem substitui autorização.

Fontes:
- https://cheatsheetseries.owasp.org/cheatsheets/Transport_Layer_Security_Cheat_Sheet.html
- https://csrc.nist.gov/pubs/sp/800/52/r2/final

## 6. APIs e contas

Priorizar OWASP API Security Top 10:
- BOLA: autorização por objeto em toda leitura/alteração com ID.
- Broken Authentication: proteger sessões, tokens, recuperação e MFA.
- Broken Object Property Level Authorization: allowlist de campos editáveis; impedir mass assignment.
- Unrestricted Resource Consumption: quotas, rate limits, timeouts e limites de payload.
- Broken Function Level Authorization: funções administrativas separadas.
- SSRF: egress restrito e destinos allowlist para integrações.

Fonte: https://api-security.owasp.org/editions/2023/en/0x11-t10/

## 7. Padrão de segurança de jogos recomendado

Adotar o OWASP Game Security Framework como referência específica para jogos. Ele organiza arquitetura, identidade, cliente, servidor/rede, sistemas do jogo, anti-cheat e dados. O nível 2 é direcionado à maioria dos jogos online/multiplayer; nível 3 para economias virtuais de alto valor e integridade competitiva elevada. O framework está em incubação/revisão pública, portanto usar como guia e não como certificação.

Fontes:
- https://owasp.org/projects/gamesec-framework
- https://owasp.github.io/www-project-gamesec-framework/info.html

## 8. Sequência de implementação sugerida

**Antes de upload comunitário:** validar arquivos binariamente, limitar dimensões/tamanho, isolar parsers, quarentena, moderação, sem scripts executáveis.

**Antes de contas online:** identidade/MFA da equipe, autorização por objeto, sessões revogáveis, rate limits, TLS e logs protegidos.

**Antes de economia e multiplayer:** backend autoritativo, SQL parametrizado, ledger, transações, idempotência, anti-replay e testes de abuso.

**Antes de anti-cheat invasivo ou mods executáveis:** avaliar privacidade/plataformas, sandbox real, pentest e resposta a incidentes. Evitar driver de kernel no início.

## 9. Limites desta pesquisa
Pesquisa baseada em documentação pública e referências de segurança. Não é prova de que GTA 6 usa determinada tecnologia, nem auditoria de Free Fire, nem pentest do Apoena. O repositório Game Creator inspecionado anteriormente é majoritariamente uma aplicação local; banco SQL, backend multiplayer e serviços de conta devem ser avaliados quando sua implementação existir.
