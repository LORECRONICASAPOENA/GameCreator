# Registro de achados — SEC-001 a SEC-007

**Proveniência:** dossiê textual da auditoria de 2026-11-02.  
**Estado global:** RECUPERADO — VALIDAR NO SHA ATUAL.  
**Importante:** nenhum dos itens abaixo foi demonstrado por exploração. Não classificar como vulnerabilidade confirmada sem reprodução e evidência.

| ID | Área | Achado recuperado | Estado |
|---|---|---|---|
| SEC-001 | shared/creator-bridge.js | Listener aceitava origin null e não restringia suficientemente a janela remetente | Recuperado — validar |
| SEC-002 | shared/asset-library.js | postMessage com destino *; resposta verificava source, mas origem não era validada explicitamente | Recuperado — validar |
| SEC-003 | shared/library-backup.js | Importação sequencial sem atomicidade/rollback global | Recuperado — validar |
| SEC-004 | shared/library-backup.js | Assinatura/autenticidade do backup não identificada | Recuperado — validar |
| SEC-005 | shared/asset-library.js | MIME image/* usado como validação de imagem | Recuperado — validar |
| SEC-006 | Distribuição ZIP | Verificação de integridade/autenticidade do pacote não demonstrada | Pendente de auditoria |
| SEC-007 | Backup de projetos | Validação estrutural descrita como incompleta | Recuperado — validar |

## Detalhes e critérios

### SEC-001 — validação de origem e remetente
Reexaminar listener, janela-alvo, origem esperada, canal, tipo, ID, ação, schema e autorização. Tratar origin null como origem opaca, não como autorização. Não bloquear contextos legítimos sem identificar a origem efetiva de cada janela.

### SEC-002 — protocolo da biblioteca
Reexaminar emissor e receptor. Preferir targetOrigin exato quando conhecido; validar event.origin, event.source, canal, tipo, ação, payload, correlação e autorização. Preservar compatibilidade documentada entre módulos.

### SEC-003 — importação transacional
Verificar comportamento em falha parcial, limites de registros e rollback. Preferir staging/transação com validação prévia e commit atômico quando suportado.

### SEC-004 — autenticidade de backup
Hash sozinho detecta alteração apenas quando o valor esperado é confiável. Avaliar assinatura digital e gestão de chave separadamente. Não confundir integridade com autenticidade.

### SEC-005 — conteúdo de imagem
Não confiar somente em MIME informado. Validar assinatura real, decodificação, dimensões e limites de memória; tratar SVG separadamente por poder conter conteúdo ativo.

### SEC-006 — artefato distribuído
Vincular ZIP a tag/commit, gerar manifesto SHA-256 e avaliar assinatura digital com chave privada protegida fora de jobs não confiáveis.

### SEC-007 — schema de projeto
Validar schema versionado, tipos, limites, referências, tamanho, profundidade e compatibilidade antes de gravar dados.

## Encerramento

Para cada ID, registrar SHA avaliado, caminho/linhas atuais, reprodução, impacto, severidade justificada, patch, teste de regressão, CI e risco residual. Se não se reproduzir no HEAD, registrar “não reproduzido no SHA X”, preservando o achado histórico.
