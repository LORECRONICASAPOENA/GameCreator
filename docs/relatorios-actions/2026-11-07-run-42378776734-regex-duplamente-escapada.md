# Relatório de falha — run 42378776734: regex duplamente escapada no teste de concorrência

## 1. Identificação
- Data/hora da ocorrência (BRT): 07/11/2026, 10:52:42–10:52:45 (UTC nos logs: 13:52:42.566–13:52:44.968).
- Data/hora da investigação (BRT): 07/11/2026, aproximadamente 10:54.
- Repositório: `LORECRONICASAPOENA/GameCreator`.
- Workflow: `.github/workflows/pixel-art.yml` (workflow ID `399505548`).
- Run ID e URL: [42378776734, tentativa 1](https://github.com/LORECRONICASAPOENA/GameCreator/actions/runs/42378776734).
- Job / step: `validar`, job ID `128421776860`; step 11, **Testar concorrência dos presets Apoena**.
- Evento: `pull_request`.
- Branch: `feat/apoena-modular-character-creator-integration`.
- Commit SHA: `74614a6c97e86f6e0be7519ddb30b7e4138cc8df`.
- Estado final: `completed/failure`.
- Responsável pela análise: Amigo Apoena / Alberto.

## 2. Erro observado
- Mensagem literal:
  ```
  SyntaxError: Invalid regular expression: /if\\s*\\(presetRequestGuard\\.isCurrent\\(requestId\\)\\)\\s*msg\\(/: Unterminated group
  ```
- Primeiro erro causal: `tests/preset-request-guard.test.cjs:26`. A linha continha barras invertidas duplicadas em um literal de RegExp, por exemplo `/if\\s*/`, fazendo o parser receber uma expressão inválida.
- Logs consultados: logs completos do job `128421776860`, especialmente 13:52:41–13:52:45Z; run [42378776734](https://github.com/LORECRONICASAPOENA/GameCreator/actions/runs/42378776734).
- Evidência adicional: a própria fonte em `tests/preset-request-guard.test.cjs` linhas 23–26 contém `\\s` e `\\(` no literal regex; os padrões corretos em um literal JavaScript precisam de uma única barra invertida no arquivo (`\s`, `\(`).
- Ambiente: runner auto-hospedado Windows; Node.js `v20.20.2`. O workflow executa em `[self-hosted, Windows, X64]`.
- Dados indisponíveis: nome/PID do runner não foi retornado pelo resumo do job; isso não afeta a causa, comprovada no arquivo de teste e no stack trace.

## 3. Diagnóstico
- **Causa-raiz comprovada:** erro de escape introduzido ao compor quatro assertions adicionais em uma template string para o teste. A geração colocou duas barras invertidas no código-fonte do RegExp, em vez de uma; a expressão resultante ficou sintaticamente inválida.
- Evidência: stack trace aponta diretamente para `tests/preset-request-guard.test.cjs:26` e `SyntaxError: Invalid regular expression ... Unterminated group`. A inspeção da linha confirma o escape duplicado.
- **Hipóteses ainda não confirmadas:** nenhuma necessária para explicar esta falha.
- Classificação: **teste / sintaxe JavaScript do teste**, não runner nem código de produção.

## 4. Impacto e alcance
- Executaram com sucesso: setup, checkout, setup Node, diagnóstico do runner, build nativo, smoke test DOM, sintaxe do build Python, instalação de dependências, sintaxe JavaScript e teste do modelo do Criador Modular.
- Falhou: step 11, antes de executar as assertions de concorrência, porque o Node não conseguiu analisar o arquivo de teste.
- Foram skipped pela condição de falha: steps 12–26, incluindo teste de navegador do Criador Modular, Corte Inteligente, exportação pixel-perfect, IndexedDB/backup, integração Godot e empacotamento. O step 27 de anexação de logs terminou success; artefato `v41-ci-diagnostics` ID `13576454021` foi publicado.
- O produto foi parcialmente testado; a suíte específica de concorrência não executou e os testes posteriores não foram executados nesta tentativa.
- A falha **não indica defeito no produto**: o erro ocorreu ao interpretar o arquivo de teste, antes de testar o comportamento do Estúdio.

## 5. Alternativas consideradas
| Alternativa | Benefícios | Riscos / desvantagens | Decisão |
|---|---|---|---|
| Corrigir o escape das quatro assertions e manter a suíte abrangente | Corrige a sintaxe e preserva cobertura | Exige nova CI | **Escolhida** |
| Remover as quatro assertions novas | Poderia evitar o erro | Reduz cobertura e esconderia a falha introduzida | Descartada |
| Alterar o código de produção do Estúdio | Nenhum benefício para a causa observada | Mudança sem relação com o erro e risco de regressão | Descartada |

## 6. Solução escolhida e justificativa
- Solução escolhida: corrigir os literais RegExp no teste para usar escapes válidos com uma única barra invertida no arquivo.
- Motivo: o stack trace e a linha 26 provam que a falha está no código do teste; não há evidência contra o Estúdio ou o guard de produção.
- Critérios: menor mudança possível, preservação das quatro assertions, manutenção da cobertura e validação pela CI canônica.
- Respeito a WIP=1: a correção permanece na única branch ativa da PR #14; nenhum workflow paralelo será criado.

## 7. Execução da solução
- Estado no momento deste registro: **diagnóstico confirmado; correção ainda não aplicada**. Este relatório foi registrado antes da nova tentativa.
- Alteração planejada: somente `tests/preset-request-guard.test.cjs`, linhas 23–26.
- Não alterar: `pixel-art/estudio.js`, `pixel-art/preset-request-guard.js` ou as assertions funcionais da suíte.
- Backup pré-correção: `backup/gc-pr14-pre-regex-test-fix-20261107` → `74614a6c97e86f6e0be7519ddb30b7e4138cc8df`.
- A correção será aplicada em commit posterior e registrada neste relatório após releitura do SHA.

## 8. Plano e resultado da validação
- Teste focado: `node tests/preset-request-guard.test.cjs`.
- Execução canônica: workflow existente `.github/workflows/pixel-art.yml`, acionado automaticamente pelo próximo commit de teste.
- Resultado esperado: o teste deve compilar, verificar a criação/uso do guard e passar nas assertions abrangentes de concorrência, importação, limpeza em lote, snapshot de salvamento e assets de referência.
- Run de correção e SHA: pendentes neste registro inicial.
- Estado final: **aguardando correção e nova validação**.

## 9. Prevenção e aprendizado
- Ao gerar código JavaScript dentro de template strings, revisar o nível de escape: a representação na template string e o texto final do arquivo têm níveis diferentes. Inspecionar as linhas gravadas e executar o teste focado antes de publicar quando o ambiente permitir.
- Não remover assertions nem mudar o código de produção para contornar erro de sintaxe no teste.
- Atualizar a base GC-CI-022 e o checkpoint de pendências com o resultado real da nova CI.

## 10. Resumo executivo para o autor
- Erro: RegExp inválida no teste de concorrência dos presets.
- Causa comprovada: escapes duplicados nas quatro assertions adicionadas ao arquivo de teste.
- Solução escolhida: corrigir somente os literais RegExp, mantendo a cobertura.
- Resultado da validação: run 42378776734 falhou no step 11; steps 1–10 passaram, steps 12–26 foram skipped e o upload de diagnóstico passou. Nova validação pendente.
- Próxima ação: corrigir o teste e aguardar o Actions automático no novo SHA.


## Adendo — correção aplicada e CI canônica verde (07/11/2026)

- **Correção aplicada:** commit `3285d888cb5c203b8a6ff94e4694818e1e085a5c`, alteração restrita a `tests/preset-request-guard.test.cjs`. Os quatro literais RegExp agora usam escapes corretos (uma barra invertida no arquivo); as assertions foram mantidas.
- **Validação canônica:** [run #42379244625](https://github.com/LORECRONICASAPOENA/GameCreator/actions/runs/42379244625), tentativa 1, `completed/success` no SHA exato `3285d888cb5c203b8a6ff94e4694818e1e085a5c`.
- **Resultado:** steps funcionais 1–24 passaram, incluindo teste de concorrência, navegador do Criador Modular, Corte Inteligente, exportação pixel-perfect, biblioteca/IndexedDB, backup/restauração, contratos de integração e runtime Godot 4. Steps 25–27 foram `skipped` pelas condições normais do evento `pull_request`; o job terminou `success`.
- **Evidência de resolução:** o step 11 que falhou no run #42378776734 passou no novo run. A falha anterior era exclusivamente sintaxe do teste, sem alteração no código de produção para contorná-la.
- **Estado da PR:** PR #14 foi retargetada para `main`; base SHA `e9335b9527fc20c1ee6bf95c7729f8a82e68339c`, HEAD validado `3285d888`, `mergeable=true`, `mergeable_state=clean`, comparação `114` commits à frente / `0` atrás, `44` arquivos no diff. A PR permanece Draft e não foi mesclada.
- **Backup do código validado:** `backup/gc-pr14-post-ci-20261107` → `3285d888cb5c203b8a6ff94e4694818e1e085a5c`.
- **Pendências fora do CI:** revisão independente CodeRabbit e aceite manual offline `file://` com IndexedDB real, além da inspeção visual das spritesheets/grades. O sucesso automatizado não substitui esses aceites.
- **Estado final do incidente:** **RESOLVIDO E VALIDADO**.

