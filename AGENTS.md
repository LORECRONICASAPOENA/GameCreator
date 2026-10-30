# Instruções obrigatórias para agentes de código

Antes de criar, editar, mover ou excluir qualquer código neste repositório:

1. Leia este arquivo e `docs/PADRAO_DE_INTEGRACAO_E_PREVENCAO_DE_REGRESSOES.md`.
2. Leia o `README.md` da raiz e o README do módulo afetado.
3. Inspecione a implementação existente, a fonte de verdade e todos os consumidores do trecho que pretende alterar.
4. Reutilize e estenda a implementação existente sempre que possível. Não crie uma segunda função, catálogo, armazenamento, ponte ou regra concorrente sem justificar a necessidade.
5. Preserve contratos, schemas, IDs, formatos antigos, telas e comportamentos já existentes. Mudanças incompatíveis exigem migração/adaptador e testes.
6. Verifique escopo e inicialização de variáveis, duplicidade de declarações, ciclo de vida de estado e tratamento de dados nulos/inválidos.
7. Faça alterações pequenas, localizadas e rastreáveis. Não reescreva arquivos inteiros nem remova funcionalidades fora do escopo.
8. Crie/atualize testes que reproduzam o erro e validem a integração entre os módulos. Confirme que o workflow executa esses testes.
9. Considere aprovado somente o workflow relevante com conclusão `success` no SHA exato da última alteração. `cancelled`, `queued`, `pending` e `in_progress` não significam aprovação.
10. Ao concluir, informe causa raiz, arquivos alterados, dependências verificadas, testes e resultados, SHA, link do workflow e limitações restantes.

Não declare uma tarefa concluída apenas porque o código foi escrito ou porque um teste isolado passou.

**Preservação do projeto:** não substitua a fonte original do Game Creator nem apague módulos/funcionalidades existentes sem autorização e plano explícito de migração.

11. **Registre toda tarefa:** antes de encerrar uma implementação, investigação, correção, alteração de CI ou auditoria, atualize `docs/DIARIO_TECNICO_E_HISTORICO_DE_ERROS.md` com relatório de progresso. Para cada erro relevante, crie/atualize um ID e registre data/hora com fuso, sintomas, evidências, arquivos/funções, hipóteses testadas, caminho de identificação, causa raiz (ou incerteza), solução, justificativa técnica, testes, SHA e Run/PR.
12. **Não encerre sem passagem de contexto:** se a tarefa ficar bloqueada ou incompleta, registre o que foi feito, o que foi descoberto, o bloqueio e o próximo passo. Se não puder gravar no GitHub, informe claramente e entregue o relatório pronto; nunca alegue que o diário foi atualizado.
13. Registre justificativa técnica verificável — evidências, hipóteses, experimentos e decisões — e não pensamentos privados internos. Diferencie fato de hipótese, não invente causa raiz e não inclua segredos.
14. Uma correção só pode ser marcada como VALIDADA quando o teste relevante passar no SHA exato da correção. Preserve o histórico: corrija entradas antigas com nova atualização datada, nunca apagando o diagnóstico anterior.
