# Backup e recuperação — Game Creator

## Escopo dos dados

Separar explicitamente:
1. Código-fonte e histórico Git.
2. ZIPs/release e manifestos.
3. Projetos, assets e biblioteca local em IndexedDB.
4. Configurações e dados do usuário no Windows.
5. Secrets e credenciais, que não devem ser copiados para repositórios.

GitHub e ZIP de distribuição não são backup automático dos dados locais da IndexedDB. A Biblioteca Central foi descrita como usando object stores assets e projects; migração de navegador, perfil ou origem exige exportação e restauração verificadas.

## Controles recomendados

- Cópia independente do endpoint principal; considerar cópia offline ou imutável.
- Backups versionados e com schema identificado.
- Manifesto SHA-256 para detectar corrupção; hash não autentica sozinho o publicador.
- Assinatura digital separada quando houver necessidade de autenticidade.
- Limites de tamanho, quantidade, dimensões e profundidade na importação.
- Validação integral antes de gravar.
- Staging/transação e rollback.
- Preservar backups antigos até validar a nova cópia.

## Testes de recuperação

Executar em ambiente isolado e com fixtures:
1. Exportar biblioteca e projetos.
2. Conferir manifesto e integridade.
3. Restaurar em perfil limpo.
4. Comparar quantidade, IDs, metadados, blobs e referências.
5. Simular arquivo inválido, interrupção e falha durante gravação.
6. Confirmar rollback e estado final consistente.
7. Registrar tempo, erros, logs e limitações.

**Estado:** plano recomendado. Nenhum teste de restauração ou recuperação de ransomware foi comprovado pela auditoria histórica.
