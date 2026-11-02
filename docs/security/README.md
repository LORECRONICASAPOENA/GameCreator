# Segurança do Apoena Game Creator

Esta pasta contém a documentação técnica operacional de segurança do editor. Não é a memória geral do ecossistema Apoena e não substitui o código, os testes ou os registros centrais de conhecimento.

## Documentos

- AUDIT-V4.1.md — escopo, versão de referência e limites da auditoria estática.
- FINDINGS.md — achados SEC-001 a SEC-007 e estado de validação.
- REMEDIATION-PLAN.md — plano de correção e critérios de encerramento.
- EVIDENCE-REGISTER.md — inventário de evidências, fontes e lacunas.
- BACKUP-AND-RECOVERY.md — requisitos de backup, restauração e resiliência.
- GITHUB-SECURITY.md — controles de repositório, Actions e distribuição.
- CHANGELOG-SECURITY.md — histórico de alterações de segurança comprovadas.

## Estado

**AUDITORIA PRELIMINAR / RECUPERADA — VALIDAR.** A referência histórica V4.1 e os achados foram recuperados de um dossiê textual. O SHA citado não foi confirmado como HEAD atual nesta documentação. Não declarar vulnerabilidade explorável, correção aplicada ou certificação de segurança sem revalidação no código e testes.

## Separação de repositórios

- Apoena Skill mantém histórico amplo, decisões, proveniência e conhecimento transversal.
- GameCreator mantém evidências técnicas operacionais, achados, remediação, testes e changelog do editor.
- Não copiar lore, história narrativa ou memória geral para esta pasta. Referenciar o arquivo central quando necessário.
- Esta documentação não contém cópia do código-fonte nem backup de projetos locais/IndexedDB.

## Regras

1. Vincular todo achado a SHA, arquivo, linha, evidência e teste.
2. Separar causa comprovada, hipótese e informação ausente.
3. Preservar achados históricos mesmo quando forem corrigidos; acrescentar o estado atual.
4. Só marcar como corrigido após teste de regressão, CI no SHA correto e validação manual pertinente.
5. Não enfraquecer testes nem remover funcionalidades para silenciar falhas.
