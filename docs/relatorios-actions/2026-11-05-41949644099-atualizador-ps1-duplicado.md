# Relatório de incidente — atualizador PowerShell com bloco duplicado

## 1. Identificação
- Data/hora da ocorrência: 05/11/2026 01:38:24 UTC (04/11/2026 22:38:24 BRT), conforme log do Actions.
- Data/hora da investigação: 04/11/2026, aproximadamente 22:39 BRT; horário exato não preservado.
- Repositório: LORECRONICASAPOENA/GameCreator.
- Workflow: .github/workflows/pixel-art.yml.
- Run ID e URL: [41949644099](https://github.com/LORECRONICASAPOENA/GameCreator/actions/runs/41949644099).
- Job / step: validar / Validar manifesto do atualizador Windows quando presente (step 17; job 126990286320).
- Evento: pull_request.
- Branch: feat/atualizador-local-incremental.
- Commit SHA: 58d3e93513403e691bbbd53333922f6642ef5211.
- Estado final: failure.
- Responsável pela análise: Amigo Apoena / Alberto.

## 2. Erro observado
- Mensagem literal: `Token '}' inesperado na expressão ou instrução.`
- Primeiro erro causal nos logs: o parser do Windows PowerShell rejeitou `integracao/atualizar-creator.ps1` ao executar `[System.Management.Automation.Language.Parser]::ParseFile(...)`.
- Logs consultados: log do job [41949644099](https://github.com/LORECRONICASAPOENA/GameCreator/actions/runs/41949644099).
- Artefato de diagnóstico: `v41-ci-diagnostics`, ID `13380701078`, SHA-256 `89c584d172ebecd60ebc69c7cbf4a76e3cd72ff6ca3a3a97e418d8ad4fc77a33`.
- Limite: a etapa imprimiu somente a mensagem do parser, sem `ParseError.Extent`/número da linha; a localização foi confirmada por comparação dos arquivos no Git.

## 3. Diagnóstico
- **Causa-raiz comprovada:** a atualização textual anterior duplicou o restante do script PowerShell depois da linha de validação do remote. O arquivo passou de 388 para 537 linhas, acrescentando um segundo bloco de execução/catch e chaves excedentes.
- Evidência: comparação do script no backup anterior `547f1ec5f9256c0b16f514179537fdbf789df11c` com o arquivo no SHA que falhou `58d3e93513403e691bbbd53333922f6642ef5211`. A única mudança pretendida era a allowlist do remote; a duplicação começou após a linha 239.
- Mecanismo contribuinte: a substituição JavaScript usou uma string de replacement contendo `$'`, token especial de `String.replace` que expande o sufixo do texto original. A operação não preservou o literal pretendido.
- Hipóteses ainda não confirmadas: nenhuma para esta falha de sintaxe.
- Classificação: código / sintaxe PowerShell; falha introduzida durante a edição desta correção, não falha do runner.

## 4. Impacto e alcance
- Falhou a validação do manifesto do atualizador.
- As 16 etapas anteriores concluíram com success, incluindo build nativo, smoke test DOM, sintaxe JavaScript, IndexedDB, backup/restauração, catálogo, Godot e contratos de integração.
- As etapas posteriores de hidrologia, runtime Godot, preservação e empacotamento foram skipped após a falha.
- O artefato de diagnóstico foi enviado com sucesso.
- Não houve merge na main, deploy ou alteração na instalação local do usuário.
- A falha não invalida os resultados anteriores das etapas que passaram, mas o commit completo não pode ser considerado aprovado.

## 5. Alternativas consideradas
| Alternativa | Benefícios | Riscos / desvantagens | Decisão |
|---|---|---|---|
| Restaurar o script do backup e reaplicar somente a linha necessária | Mudança mínima; preserva o fluxo já testado | Exige novo commit e CI | Escolhida |
| Remover o bloco duplicado manualmente no arquivo atual | Poderia resolver | Maior risco de deixar diferenças ocultas ou chaves inconsistentes | Descartada |
| Ignorar a análise sintática ou tornar o teste opcional | Nenhum benefício técnico legítimo | Ocultaria erro real e enfraqueceria proteção | Proibida |

## 6. Solução escolhida e justificativa
- Restaurar integralmente `integracao/atualizar-creator.ps1` do backup anterior validado e alterar a linha da allowlist por edição linha a linha, sem substituição de texto que interprete tokens `$'`.
- Manter a validação restrita a `apoenalore/GameCreator` e `LORECRONICASAPOENA/GameCreator`, nos formatos HTTPS/SSH, com correspondência ancorada.
- Preservar os testes positivos para os endereços oficiais e negativos para outros owners/repositórios.
- Não remover assertions, não desativar o parser, não alterar workflow e não mexer na main.
- WIP=1 mantido; utilizar somente o workflow canônico existente.

## 7. Execução da solução
- Estado no momento deste relatório: correção planejada; script corrigido ainda não enviado.
- Arquivos a corrigir: `integracao/atualizar-creator.ps1`; manter `tests/atualizador-manifest.test.cjs`.
- Backup criado antes da próxima correção: [backup/gc-origin-guard-ci-failure-20261105](https://github.com/LORECRONICASAPOENA/GameCreator/tree/backup/gc-origin-guard-ci-failure-20261105), SHA `58d3e93513403e691bbbd53333922f6642ef5211`.
- Backup original do script funcional: [backup/gc-origin-guard-before-fix-20261105](https://github.com/LORECRONICASAPOENA/GameCreator/tree/backup/gc-origin-guard-before-fix-20261105), SHA `547f1ec5f9256c0b16f514179537fdbf789df11c`.

## 8. Plano e resultado da validação
- Teste focado: parser PowerShell 5.1, `node --check tests/atualizador-manifest.test.cjs`, teste de URLs oficiais permitidas e de remotes indevidos rejeitados.
- Execução canônica: workflow existente `.github/workflows/pixel-art.yml`.
- Resultado esperado: parser sem erros; testes de manifesto aprovados; demais etapas concluídas.
- Novo run/commit: pendente da correção.
- Estado final: aguardando evidência; não resolvido.

## 9. Prevenção e aprendizado
- Para editar arquivos por API/JavaScript, preferir transformação por linhas ou callback de replacement quando o conteúdo inclui tokens `$&`, `$'` ou `$`.
- Antes de criar blob, verificar número de linhas, diff exato e igualdade de todos os trechos não intencionais.
- Manter ParseFile no CI e nunca afrouxar o teste para esconder erro de sintaxe.
- Depois da correção, atualizar a base de conhecimento com o SHA e run efetivamente aprovados.

## 10. Resumo executivo
- Erro: parser PowerShell encontrou chave de fechamento inesperada.
- Causa comprovada: duplicação do sufixo do script durante substituição textual.
- Solução escolhida: restaurar o arquivo do backup e editar somente a linha necessária.
- Main e dados locais permaneceram intactos.
- Resultado da validação: run 41949644099 falhou no step de manifesto; nova validação pendente.
