# Registro de continuidade — lacunas de backup e auditoria estática do GameCreator

**Data de referência:** 02/11/2026 (BRT).  
**Origem:** conversa do criador sobre o que falta no backup; relatório de auditoria de ZIPs compartilhado no contexto da conversa; consulta autenticada ao GitHub.  
**Natureza:** backup **documental** de descobertas, preocupações e pendências. **Não** é um backup binário integral, nem prova de correção de bugs, nem execução do jogo.  
**Política:** preservar originais e versões, não apagar arquivos, não expor credenciais, não modificar código, CI ou cânone por causa deste registro.

## 1. Pedido e intenção do criador

O criador solicitou: **“Veja aí o que falta no backup”** e reafirmou a exigência de **backup no GitHub a cada conversa, com novidades e informações detalhadas**. Também planeja uma conversa/chamada em tempo real para esclarecer dúvidas de mitologia e arquitetura; a chamada ainda não foi realizada nem agendada por este registro.

O objetivo deste checkpoint é não perder as conclusões da auditoria e distingui-las de cópias reais de arquivos. A existência de documentação no GitHub não equivale a ter o conteúdo de todos os ZIPs, imagens, PDFs, dados IndexedDB e conversas originais preservado.

## 2. Materiais e verificações mencionados

O relatório de auditoria fornecido descreve **dois ZIPs com SHA-256 idêntico**:

- SHA-256: `bb40c8419056dfecdf75f9db99ee2deecfe6963a7fbe5b3d5b804b8b7346dfd9`.
- Tamanho de cada ZIP: **60.120.095 bytes**.
- **155 entradas** por arquivo; aproximadamente **82,3 MB** descompactados.
- Conteúdo analisado: 71 arquivos JS/CJS, 11 HTML, 3 JSON, 2 workflows, 2 projetos/scripts Godot, 1 script Python e documentação.
- Os ZIPs não incluem metadados Git suficientes para identificar branch/commit; portanto, **não certificam o head atual da main**.

O relatório anterior na conversa também mencionou **quatro ZIPs e quatro documentos individuais**, pacotes com diferentes relatórios e uma extração forense com 184 entradas e cópia textual de 135 arquivos. **Esses números adicionais não foram revalidados nesta execução**; não devem ser somados nem confundidos com a inspeção dos dois ZIPs idênticos acima.

## 3. Testes relatados no snapshot recebido — não extrapolar para a main

**Aprovados no ambiente da auditoria:**
- `node --check` em 71 arquivos JS/CJS.
- Sintaxe de 57 blocos JavaScript inline extraídos de HTML.
- `tests/catalogo.test.cjs`.
- `tests/corte-inteligente.test.cjs`.
- `tests/creator-bridge.test.cjs`.
- `tests/tileset-check.test.cjs`.
- `integracao/testes/catalogo.test.js` (10 casos internos).
- `integracao/testes/natureza.test.cjs`.
- `integracao/testes/terrain-system.test.cjs`.
- `integracao/testes/world-object-system.test.cjs`.
- Referências locais de scripts/links das entradas principais sem caminhos ausentes.

**Bloqueados antes de executar assertions:** `tests/asset-library.test.cjs` e `tests/library-backup.test.cjs`, pela ausência de `fake-indexeddb/auto` no ambiente; a dependência é declarada em `package.json`. Isso **não comprova defeito de produto**.

**Não executados ou não comprovados:** Godot 4 nativo/headless no ambiente da auditoria, PowerShell, Android físico, regressão visual/interativa de navegador, GitHub Actions no SHA do ZIP. Um smoke test com JavaScript desabilitado não comprova funcionamento de botões, IndexedDB ou interface.

## 4. Achados técnicos do relatório recebido (situação: ainda não verificados como corrigidos)

| ID | Prioridade relatada | Achado | Evidência apontada | Próximo passo |
| --- | --- | --- | --- | --- |
| GC-SEC-001 | Alta | `shared/creator-bridge.js`: `listen()` aceita `event.origin === "null"` sem vincular remetente a janela autorizada; canal público não autentica. | Revisão estática, sem exploração demonstrada. | Modelar confiança, handshake/identidade da janela, token de sessão, validação de payload e testes negativos. |
| GC-MAP-001 | Alta | `map-editor/index.html`: `loadTileset` força `sheetProfile='manual'` em vez de restaurar `item.metadata.profile`. | Contraste entre gravação de metadados e carregamento. | Restaurar perfil válido com fallback; testar ida/volta e projetos legados. |
| GC-MAP-002 | Alta | `smartWaterTile(x,y)` não trata corretamente todos os pares opostos/triplas de bordas. | Análise da lógica de vizinhança; cobertura limitada documentada. | Tabela explícita de variantes, fallback e testes 0–4 vizinhos, bordas e desfazer/refazer. |
| GC-CI-001 | Média/alta | `pixel-art.yml` e `publicar-creator-unificado.yml` podem disparar builds sobrepostos; publicação com `contents: write`. | Sobreposição de gatilhos/objetivos; risco operacional, não corrida demonstrada. | Mapear grafo de CI, validar SHA e sequência; não remover workflows sem prova. |
| GC-BUILD-001 | Média | Paridade Python/PowerShell não comprovada; build Python difere do `index.html` recebido em quebra de linha (2 bytes). | Execução Python em cópia temporária; PowerShell não executado. | Comparar builds normalizados em ambientes descartáveis. |
| GC-DOC-001 | Média | README e guias descrevem fontes, loaders, versões e agendamento de workflow de modo contraditório aos artefatos inspecionados. | `index.html` ~16,3 MB versus descrição de loader compacto; título interno V3.9.2 em fonte nomeada V4.0; workflow sem `schedule` no ZIP. | Estabelecer fonte de verdade por build reproduzível e atualizar documentação depois. |
| GC-TEST-001 | Média | Smoke de navegador usa `--disable-javascript` e `--dump-dom`, validando estrutura, não interação. | Workflow analisado. | Manter teste estrutural e acrescentar teste funcional real. |
| GC-TEST-002 | Média | Duas suítes IndexedDB bloqueadas por dependência ausente. | Falha de resolução de `fake-indexeddb/auto`. | Reexecutar após instalação controlada; avaliar lockfile. |

**Importante:** o relatório descreve um snapshot recebido; nenhuma correção foi aplicada por esta atualização. É preciso conferir cada item na branch e SHA que serão efetivamente alterados. O risco GC-SEC-001 não deve ser descrito como vulnerabilidade explorada sem demonstração.

## 5. Versões e artefatos concorrentes

O relatório informa os seguintes tamanhos:
- `index.html`: **16.333.266 bytes**.
- `APOENA_GAME_CREATOR_V4_0_BANCADA_INTEGRADA.html`: **16.332.595 bytes**.
- `APOENA_GAME_CREATOR_v3_9_2_PROJETOS_SEGUROS_COMPLETO.html`: **16.299.833 bytes**.

`index.html` contém integração Pixel Art e oito referências locais; a fonte V4.0 não contém a mesma aba e tem título interno V3.9.2. **Não excluir, renomear ou declarar redundância funcional sem comparar os três e seus fluxos de build.**

## 6. Lacunas de backup e documentação

1. **Conversas completas:** não há transcrição literal verificável de todas as mensagens; extrações anteriores reconhecem mensagens omitidas. Registros consolidados não substituem o histórico bruto.
2. **Documentos originais da obra:** PDFs/DOCX, artes, sprites, mapas e anexos históricos não estão comprovadamente todos no repositório; o cânone narrativo deve permanecer separado do código.
3. **Backup de dados locais:** Git não salva IndexedDB do navegador, instalação Windows, arquivos não rastreados, configurações locais nem estado do runner.
4. **Inventário central:** relatórios de auditoria, dossiê estratégico, registros de decisões, evidências de testes e manifestos estão distribuídos; criar índice com origem, versão, hash, status e caminho.
5. **Matriz de problemas:** unificar ID, versão afetada, prova, status (aberto/mitigado/corrigido/validado), responsável, commit de correção, teste e reversão. Não marcar resolvido sem evidência.
6. **Evidências de testes:** centralizar comando, ambiente, SHA, log, data e resultado, especialmente Godot, Android e CI.
7. **Sprites/artefatos ausentes:** relato anterior menciona dez sprites referenciados e ausentes; localizar e comprovar antes de afirmar quantidade definitiva ou inventar substitutos.
8. **Dossiê estratégico:** o arquivo `docs/relatorios-conversas/2026-11-02-dossie-analise-evolucao-gamecreator-recebido.md` foi confirmado na branch `backup/gamecreator-conversa-20261102-0904-brt`, **não na main nesta verificação**. A proposta de Apoena AI Studio não é funcionalidade implementada.
9. **Recuperação testada:** ainda não há prova de que um pacote mestre restaure conjuntamente código, dados do navegador, assets e documentos em ambiente limpo.
10. **Proveniência e segurança:** calcular SHA-256 por arquivo, testar ZIPs, preservar originais e não incluir credenciais ou tokens. Um PDF identificado anteriormente como `Untitled document.pdf` foi sinalizado por conter códigos/credenciais; não republicar.

## 7. Plano proposto — sem execução nesta atualização

**APOENA_BACKUP_MESTRE_2026-11-02**, com pastas lógicas:
- 01 projeto original e identificação de branch/SHA;
- 02 histórico de conversas disponível e lacunas;
- 03 auditorias técnicas;
- 04 decisões e arquitetura;
- 05 erros, soluções e testes;
- 06 Universo Apoena;
- 07 relatórios de execução CI/Godot/Android;
- 08 integridade, manifestos SHA-256 e restauração.

Preservar snapshots anteriores, nunca sobrescrever originais e seguir regra 3-2-1 quando os arquivos completos estiverem disponíveis. A estrutura acima é **plano**, não um ZIP mestre gerado nesta execução.

## 8. Estado do GitHub consultado nesta atualização

- Repositório: https://github.com/apoenalore/GameCreator
- Branch documental existente: `backup/gamecreator-conversa-20261102-0904-brt`.
- Arquivo estratégico da conversa confirmado nessa branch, blob SHA `1483fc84d9a2c866550d71ed9fb0f08359c335b4`.
- Registro central: `docs/REGISTRO_CONVERSAS_E_BACKUPS.md`, presente na `main`.
- A presença de arquivos rastreados no GitHub não equivale a um backup externo independente.
- Não foram executados testes, merges, correções, builds, limpezas, uploads binários ou restaurações nesta atualização.

## 9. Critérios para encerrar esta pendência

Só declarar **backup mestre completo** quando:
- Todos os originais necessários estiverem identificados e copiados com hash.
- ZIPs e manifestos passarem na verificação de integridade.
- Houver cópia independente fora do GitHub.
- A restauração em ambiente limpo tiver sido testada.
- Conversas ausentes forem claramente identificadas como irrecuperáveis ou pendentes, sem reconstrução fictícia.
- Dados sensíveis forem excluídos ou protegidos.

**Resultado desta etapa:** registro detalhado das lacunas e da auditoria; código e originais preservados sem alteração.
