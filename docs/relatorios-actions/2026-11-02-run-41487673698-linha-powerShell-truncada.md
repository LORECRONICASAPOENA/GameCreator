# Relatório de falha do GitHub Actions — linha PowerShell truncada

## 1. Identificação
- Data/hora da ocorrência: 2026-11-02 (run automático da alteração).
- Data/hora da investigação: 2026-11-02.
- Repositório: apoenalore/GameCreator.
- Workflow: .github/workflows/pixel-art.yml.
- Run: [41487673698](https://github.com/apoenalore/GameCreator/actions/runs/41487673698).
- Job/step: 125422177253, `validar` / `Validar manifesto do atualizador Windows quando presente`.
- Evento: pull_request.
- Branch/SHA: `feat/atualizador-local-incremental` / `b29adee6023f225f88275eb2be397c40cdb5f1af`.
- Estado final: completed/failure.
- Responsável pela análise: Codex.

## 2. Erro observado
- Mensagem literal: `Token '{' inesperado na expressão ou instrução.`
- Primeiro erro causal: parser do PowerShell no script temporário gerado a partir de `integracao/atualizar-creator.ps1`; o step encerrou com exit code 1.
- Logs: [job 125422177253](https://github.com/apoenalore/GameCreator/actions/runs/41487673698/job/125422177253).
- O build e as verificações anteriores passaram; o erro ocorreu ao validar o manifesto.
- Dados indisponíveis: nenhum dado essencial para o diagnóstico.

## 3. Diagnóstico
- **Causa-raiz comprovada:** o commit deixou a atribuição de `$regexRuntime` sem a aspa simples de fechamento e sem a âncora final. O diff do commit mostra a linha terminando em `...json))`, e o conteúdo atual confirma o mesmo; a próxima construção PowerShell com bloco `{` causa o erro de parsing.
- Correção pretendida e verificada antes de enviar: a linha deve terminar em `...json))$'`, ancorando a expressão ao caminho inteiro e fechando a string.
- Hipóteses descartadas: problema do runner e falha do próprio teste de regex.
- Classificação: regressão de edição no script PowerShell do atualizador.

## 4. Impacto e alcance
- A validação do contrato do atualizador parou antes das assertions de caminhos e das etapas posteriores.
- A execução não instalou nem atualizou o Creator; não há evidência de perda de dados.
- A falha anterior do run 41486755080 revelou corretamente a necessidade da âncora; esta execução introduziu uma linha truncada durante a aplicação da correção.

## 5. Ação corretiva e validação
- Correção aplicada no commit `b483bff226e5488175b6c776f4cfd24da5f30fae`: o arquivo foi restaurado da versão-base de 666 linhas e apenas a âncora `# Relatório de falha do GitHub Actions — linha PowerShell truncada

## 1. Identificação
- Data/hora da ocorrência: 2026-11-02 (run automático da alteração).
- Data/hora da investigação: 2026-11-02.
- Repositório: apoenalore/GameCreator.
- Workflow: .github/workflows/pixel-art.yml.
- Run: [41487673698](https://github.com/apoenalore/GameCreator/actions/runs/41487673698).
- Job/step: 125422177253, `validar` / `Validar manifesto do atualizador Windows quando presente`.
- Evento: pull_request.
- Branch/SHA: `feat/atualizador-local-incremental` / `b29adee6023f225f88275eb2be397c40cdb5f1af`.
- Estado final: completed/failure.
- Responsável pela análise: Codex.

## 2. Erro observado
- Mensagem literal: `Token '{' inesperado na expressão ou instrução.`
- Primeiro erro causal: parser do PowerShell no script temporário gerado a partir de `integracao/atualizar-creator.ps1`; o step encerrou com exit code 1.
- Logs: [job 125422177253](https://github.com/apoenalore/GameCreator/actions/runs/41487673698/job/125422177253).
- O build e as verificações anteriores passaram; o erro ocorreu ao validar o manifesto.
- Dados indisponíveis: nenhum dado essencial para o diagnóstico.

## 3. Diagnóstico
- **Causa-raiz comprovada:** o commit deixou a atribuição de `$regexRuntime` sem a aspa simples de fechamento e sem a âncora final. O diff do commit mostra a linha terminando em `...json))`, e o conteúdo atual confirma o mesmo; a próxima construção PowerShell com bloco `{` causa o erro de parsing.
- Correção pretendida e verificada antes de enviar: a linha deve terminar em `...json))$'`, ancorando a expressão ao caminho inteiro e fechando a string.
- Hipóteses descartadas: problema do runner e falha do próprio teste de regex.
- Classificação: regressão de edição no script PowerShell do atualizador.

## 4. Impacto e alcance
- A validação do contrato do atualizador parou antes das assertions de caminhos e das etapas posteriores.
- A execução não instalou nem atualizou o Creator; não há evidência de perda de dados.
- A falha anterior do run 41486755080 revelou corretamente a necessidade da âncora; esta execução introduziu uma linha truncada durante a aplicação da correção.

## 5. Ação corretiva e validação
 foi acrescentada antes da aspa final. Conferência do arquivo: linha termina em `))

## 6. Referências
- Commit: [b29adee6023f225f88275eb2be397c40cdb5f1af](https://github.com/apoenalore/GameCreator/commit/b29adee6023f225f88275eb2be397c40cdb5f1af).
- Relatório relacionado: [regex-runtime-prefixo](2026-11-02-run-41486755080-regex-runtime-prefixo.md).
`; nenhuma duplicação foi mantida.
- Validação: run automático [41488368286](https://github.com/apoenalore/GameCreator/actions/runs/41488368286), job `125425257046`, workflow e step do manifesto concluíram com success.
- Resultado da validação corretiva: APROVADO no SHA `b483bff226e5488175b6c776f4cfd24da5f30fae`.

## 6. Referências
- Commit: [b29adee6023f225f88275eb2be397c40cdb5f1af](https://github.com/apoenalore/GameCreator/commit/b29adee6023f225f88275eb2be397c40cdb5f1af).
- Relatório relacionado: [regex-runtime-prefixo](2026-11-02-run-41486755080-regex-runtime-prefixo.md).
