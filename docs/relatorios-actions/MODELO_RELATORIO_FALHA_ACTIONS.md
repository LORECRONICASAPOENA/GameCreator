# Modelo — relatório de falha do GitHub Actions

> Preencher um relatório por incidente. Não apagar campos sem evidência: usar “não disponível”, “não investigado” ou “causa não confirmada”.

## 1. Identificação
- Data/hora da ocorrência (BRT; indicar se o horário é aproximado):
- Data/hora da investigação (BRT):
- Repositório:
- Workflow:
- Run ID e URL:
- Job / step:
- Evento:
- Branch:
- Commit SHA:
- Estado final:
- Responsável pela análise:

## 2. Erro observado
- Mensagem literal / annotation:
- Primeiro erro causal nos logs:
- Logs consultados e respectivos links:
- Evidências adicionais (runner, sistema operacional, rede, artefatos, comentários):
- Dados indisponíveis e tentativas de obtenção:

## 3. Diagnóstico
- **Causa-raiz comprovada:**
- Evidência que comprova a causa:
- **Hipóteses ainda não confirmadas:**
- Informações que faltam para confirmar:
- Classificação: código / teste / build / publicação / runner / rede / GitHub / permissão / configuração / cancelamento / timeout / outra.

## 4. Impacto e alcance
- O que falhou:
- Etapas que executaram:
- Etapas que não executaram:
- O código foi efetivamente testado? Quais partes?
- O que continua sem validação:
- A falha indica defeito no produto? Justificar com evidências.

## 5. Alternativas consideradas
| Alternativa | Benefícios | Riscos / desvantagens | Motivo para aceitar ou descartar |
|---|---|---|---|
| A | | | |
| B | | | |
| C | | | |

## 6. Solução escolhida e justificativa
- Solução escolhida:
- **Por que esta solução foi escolhida:**
- Critérios técnicos e evidências usados:
- Riscos controlados:
- Por que as outras opções foram descartadas:
- Respeito a WIP = 1 e à validação canônica:

## 7. Execução da solução
- Estado: proposta / autorizada / aplicada / parcialmente aplicada / bloqueada.
- Alterações realizadas (arquivos e resumo):
- Alterações não realizadas:
- Commit SHA:
- Ações que dependem do autor:
- Como foram preservados código, dados e assets:

## 8. Plano e resultado da validação
- Teste focado:
- Execução canônica:
- Resultado esperado:
- Run ID / URL do novo Actions:
- Commit validado:
- Resultado observado:
- Evidência de que a correção resolveu a causa:
- Regressões verificadas:
- Estado final: resolvido / parcialmente resolvido / não resolvido / aguardando evidência.

## 9. Prevenção e aprendizado
- Como evitar recorrência:
- Monitoramento ou alerta necessário:
- Conhecimento reutilizável a adicionar à base:
- Pendências relacionadas:

## 10. Resumo executivo para o autor
- Erro:
- Causa comprovada ou limite atual:
- Solução escolhida:
- Justificativa:
- O que foi efetivamente alterado:
- Resultado da validação:
- Próxima ação / participação necessária:
