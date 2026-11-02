# Relatório de correção — GitHub Actions #336

**Projeto:** Apoena GameCreator  
**Workflow:** `.github/workflows/pixel-art.yml`  
**Execução com falha:** [#336](https://github.com/apoenalore/GameCreator/actions/runs/41534893117)  
**Branch:** `feat/apoena-modular-character-creator-integration`  
**Commit analisado:** `ef9cb3c803a53ad3c9ae2a53948b24eb9f494786`

## Diagnóstico baseado nos logs

A execução não falhou no build, nem na sintaxe JavaScript, nem no teste de modelo do Criador Modular. As etapas 5 a 10 passaram.

A etapa que falhou foi **“Testar Criador Modular no navegador”**. O artefato `v41-ci-diagnostics` continha `characters-browser.html`, que registrou:

```
FAIL: Error: Timeout: Prévia pronta. Revise antes de aplicar.
```

A stack aponta para a espera pelo estado “Projeto editável salvo” em `tests/personagens-browser.html`. O status permaneceu no texto anterior da prévia de corte inteligente.

O código de interface usava `guarded(fn)` com a regra `if (busy) return`. Assim, qualquer clique recebido durante uma operação assíncrona era descartado silenciosamente. Isso permitia que uma ação de salvar/desfazer/refazer fosse ignorada se uma operação anterior ainda estivesse em andamento.

O aviso de Node.js 20 obsoleto apareceu no encerramento do job e **não foi a causa da falha**.

## Correção aplicada

Arquivo: `pixel-art/personagens.js`

- Substituída a rejeição silenciosa de comandos durante `busy`.
- Introduzida uma fila `operationQueue` baseada em Promises.
- As operações acionadas pelos botões passam a executar em sequência, preservando a ordem dos cliques.
- O tratamento de erro e a atualização dos botões permanecem no `finally` de cada operação.
- Não foram removidas validações nem testes.

**Commit da correção:** [e097fd5a58ff29ce081d31e2dbfa33934c017c75](https://github.com/apoenalore/GameCreator/commit/e097fd5a58ff29ce081d31e2dbfa33934c017c75)

## Validação pendente

A correção foi enviada à branch de integração e disparou nova execução do workflow. A correção só deve ser considerada confirmada após a etapa “Testar Criador Modular no navegador” passar e o job completo terminar com sucesso.

## Ações seguintes

1. Acompanhar a nova execução do Actions.
2. Se o navegador ainda falhar, abrir o novo artefato de diagnóstico e corrigir o próximo erro real.
3. Não mesclar a PR nem declarar integração concluída apenas com base no commit.
4. Tratar a atualização das versões das Actions para runtimes Node atuais como manutenção separada; o aviso não causou esta falha.
