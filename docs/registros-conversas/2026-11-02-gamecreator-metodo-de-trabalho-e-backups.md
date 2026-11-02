# Registro de continuidade — método de trabalho, auditorias e backups do GameCreator

**Data:** 02/11/2026  
**Horário da conversa:** aproximadamente 09:36 BRT (12:36 UTC; horário informado na mensagem do usuário).  
**Repositório:** `apoenalore/GameCreator`  
**Branch deste registro:** `maintenance/audit-cleanup-20261102`  
**Classificação:** decisão de processo e continuidade; não representa implementação de funcionalidade.

## 1. Pedido expresso do autor

O autor decidiu que o trabalho de evolução do GameCreator deve avançar por partes. Para cada parte concluída, a IA deve produzir um relatório completo, registrar o que foi efetivamente realizado, informar se a mudança já está no GitHub e explicar as razões técnicas das decisões e dos caminhos adotados.

O autor também determinou que as conversas e decisões desta frente sejam preservadas no GitHub por meio de backups/checkpoints recorrentes, para evitar perda de material, requisitos, justificativas ou histórico.

## 2. Procedimento de trabalho acordado

1. **Trabalhar em fatias pequenas e identificáveis.** Antes de iniciar uma frente, consultar a documentação, o código existente, as pendências e as dependências; não recriar módulos que já existam.
2. **Preservar o estado anterior.** Antes de mudanças de código, verificar branch, commit-base, arquivos afetados e backups disponíveis. Não apagar, sobrescrever ou reorganizar material sem análise de impacto e possibilidade de reversão.
3. **Investigar antes de decidir.** Distinguir fatos observados no código, comportamento validado em teste, hipótese, limitação do ambiente e requisito ainda não implementado.
4. **Justificar decisões.** Registrar alternativas consideradas, solução escolhida, motivo técnico, riscos, compatibilidade, impactos e alternativas descartadas.
5. **Implementar com escopo controlado.** Respeitar o protocolo do repositório, inclusive WIP = 1 combinado com Apoena Pixel Art HTML; não criar workflows redundantes nem executar validações equivalentes em paralelo.
6. **Validar com evidência.** Registrar testes executados, resultado, commit SHA e URL do GitHub Actions quando houver execução. Diferenciar código escrito, teste local, CI aprovado, integração na branch principal e validação manual em navegador/dispositivo/Godot.
7. **Relatar cada entrega.** Cada relatório deve conter objetivo, estado anterior, diagnóstico, arquivos alterados, decisões e justificativas, testes/evidências, limitações, riscos residuais, backup, branch/commit e estado de integração no GitHub.
8. **Preservar a conversa.** Criar checkpoints em `docs/registros-conversas/` com pedidos, decisões, hipóteses, respostas relevantes, pendências e limites de completude. Não chamar um resumo de transcrição integral. Não incluir credenciais, tokens ou outros segredos.
9. **Atualizar os documentos centrais.** Quando uma decisão alterar o plano ou estado de uma pendência, atualizar também o documento de pendências/atualizações correspondente, sem apagar o histórico nem converter proposta em implementação.
10. **Fechar uma parte antes de abrir outra.** Só considerar concluída após critérios de aceite e evidência; depois atualizar a fila e iniciar a próxima frente autorizada.

## 3. Estrutura obrigatória do relatório de conclusão

Cada entrega técnica deverá informar:

- Identificador e nome da frente.
- Objetivo e critério de aceite.
- O que já existia antes do trabalho.
- Diagnóstico e causa comprovada (ou hipóteses ainda abertas).
- O que foi alterado, com caminhos de arquivos e descrição objetiva.
- Decisões técnicas tomadas e justificativas.
- Alternativas avaliadas e motivos para não escolhê-las.
- Testes realizados e resultados exatos.
- Evidência do CI: workflow, run, branch, commit e estado, quando aplicável.
- O que está integrado na branch de trabalho e o que está ou não integrado em `main`.
- O que permanece pendente, limitações e riscos residuais.
- Backup/checkpoint criado e referência correspondente.
- Próxima etapa recomendada, sem iniciar trabalho fora do escopo.

## 4. Regras de classificação de estado

Usar estados separados, sem confundi-los:

- **IDENTIFICADO:** localizado em documentação ou código.
- **IMPLEMENTADO:** código da funcionalidade existe.
- **TESTADO:** teste específico foi executado e passou.
- **VALIDADO NO CI:** workflow canônico passou no commit correspondente.
- **VALIDADO MANUALMENTE:** fluxo real foi exercitado no ambiente indicado.
- **INTEGRADO NA MAIN:** alteração chegou à branch principal.
- **PARCIAL / PENDENTE / BLOQUEADO:** há lacunas ou dependências ainda não resolvidas.

A existência de código ou de um teste de contrato não prova, isoladamente, que a funcionalidade está pronta no jogo/runtime.

## 5. Decisões e limites desta conversa

- O trabalho deve evoluir o GameCreator existente, reaproveitando sistemas já presentes e corrigindo integrações/lacunas, em vez de começar módulos equivalentes do zero.
- Cada etapa concluída exige relatório completo e justificativa técnica.
- Conversas e decisões devem ser registradas recorrentemente no GitHub.
- Este arquivo é um **checkpoint documental da conversa acessível nesta sessão**, não uma transcrição literal de todas as conversas do projeto.
- Nenhuma funcionalidade do Creator foi modificada nesta etapa. Nenhum teste de produto foi executado por causa deste registro.
- Este registro foi gravado na branch `maintenance/audit-cleanup-20261102`; sua presença no GitHub não deve ser descrita como integração na `main`.

## 6. Relação com os protocolos existentes

Este procedimento complementa e não substitui:
- `AGENTS.md`;
- `docs/PROTOCOLO_TRABALHO_SEQUENCIAL.md`;
- `docs/ATUALIZACOES_PENDENTES_LEIA_ANTES_DE_COMECAR.md`;
- `docs/PENDENCIAS_ABERTAS_E_LIMPEZA_GITHUB.md`;
- `docs/BASE_CONHECIMENTO_ERROS_RUNNER_CI.md`.

Em caso de conflito, preservar as regras de segurança, WIP = 1, validação canônica e registro de evidências já estabelecidas nesses documentos.
