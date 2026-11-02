# Plano de remediação — Security Hardening

**Estado:** PLANEJADO. Nenhuma correção é declarada aplicada por este plano.

## P0 — confirmar superfície e governança
1. Identificar SHA/branch atuais e comparar os arquivos da V4.1.
2. Revisar bridge e protocolo da biblioteca.
3. Inspecionar branch protection/Rulesets.
4. Auditar workflows, permissões, secrets, dependências e publicação de ZIP.
5. Reproduzir ou refutar SEC-001 a SEC-007.

## P1 — integridade e recuperação
1. Validação estrita de mensagens entre janelas.
2. Schema completo e validação prévia de backup/projetos.
3. Importação em staging/transação com rollback testado.
4. Validação real de imagens e limites de consumo.
5. Manifesto SHA-256 vinculado a commit/tag.
6. Avaliar assinatura assimétrica e gestão segura de chaves.
7. Backup independente/offline ou imutável e teste de restauração.

## P2 — cobertura ampliada
- CMD, PowerShell, Python, bundle e módulos legacy.
- Godot, Map Editor e Pixel Art.
- Dependências, permissões, testes de regressão e testes de segurança.
- Instalação e atualização em Windows; validação manual em ambiente representativo.

## Critério de encerramento por achado

- Revalidar no SHA atual.
- Aplicar patch mínimo e revisável.
- Adicionar teste que falhe antes e passe depois.
- Executar testes relevantes e CI no SHA/PR corretos.
- Executar validação manual quando necessária.
- Registrar commit, logs, resultado e risco residual.
- Manter pendente quando o ambiente de validação não estiver disponível.

## Restrições

Não usar reset/clean destrutivo, não apagar dados do usuário, não enfraquecer testes e não declarar correção por recomendação. Manter WIP = 1 para GameCreator e Apoena Pixel Art HTML combinados.
