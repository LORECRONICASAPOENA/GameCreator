# Relatório de investigação — execução #339 e sincronização determinística do teste

**Data:** 2026-11-02  
**Execução:** [#339](https://github.com/apoenalore/GameCreator/actions/runs/41547074475)  
**Branch:** `feat/apoena-modular-character-creator-integration`

## 1. Inspeção do artefato solicitada

O artefato `v41-ci-diagnostics` foi baixado e extraído. Arquivos examinados:

- `characters-browser.html`
- `characters-browser.log`
- `character-server.log`
- `character-server-error.log`
- `browser-loader.log`
- `runner.log`

### Resultado observado

`characters-browser.html` registrou:

```
FAIL: Error: Timeout: Prévia pronta. Revise antes de aplicar.
at until (http://127.0.0.1:4173/tests/personagens-browser.html:7:85)
at async document.getElementById.onload (http://127.0.0.1:4173/tests/personagens-browser.html:21:96)
```

O timeout ocorre na espera após o teste clicar em **Salvar projeto**. O status ainda contém a mensagem deixada pela prévia do corte inteligente. A stack aponta para a linha do teste que aguarda `Projeto editável salvo`.

O servidor HTTP iniciou corretamente: `APOENA_TEST_SERVER_READY http://127.0.0.1:4173`. O log de erro do servidor está vazio.

O log do Edge contém avisos internos de `fallback_task_provider` sobre renderers. Esses avisos não demonstram a causa do timeout e não devem ser tratados como causa raiz.

O HTML de diagnóstico não contém screenshots; é o DOM serializado com o resultado e a stack trace. Portanto, a orientação de procurar capturas de tela nesse arquivo não se aplica a este artefato específico.

## 2. Hipóteses reavaliadas

- A hipótese de incompatibilidade exclusiva com `file://` foi testada no #339 e não resolveu o problema: o teste já rodou por HTTP localhost e falhou da mesma forma.
- Não há evidência nos logs de que o servidor HTTP falhou.
- Os logs disponíveis não contêm uma exceção JavaScript conclusiva de IndexedDB.
- A mensagem antiga permanecer no status significa que o teste não observou a conclusão do handler de salvar; não prova, sozinha, que o IndexedDB é a causa.
- O teste usava pausas fixas de 50 ms após disparar cliques e eventos de mudança, enquanto o editor executa operações assíncronas em uma fila. Essa sincronização temporal é frágil e pode avançar antes da conclusão real de uma operação.

## 3. Correção de diagnóstico aplicada

Para eliminar a corrida entre o teste e as operações assíncronas do editor:

### `pixel-art/personagens.js`

Foi adicionado um hook de teste `window.__apoenaTestHooks.whenIdle()`, exposto **somente quando a URL contém `?test=1`**. Em uso normal do Creator, a API não é publicada.

O hook permite ao teste aguardar a Promise da fila de operações, sem alterar o comportamento de produção nem remover validações.

### `tests/personagens-browser.html`

- Iframe agora abre `personagens.html?test=1`.
- Helper de clique aguarda a fila real, em vez de presumir que 50 ms bastam.
- Helper de alteração de campos aguarda o processamento do evento.
- Teste aguarda o fim da operação de borracha após `pointerup`.
- Timeout específico de 5 segundos identifica se a fila não esvaziar e informa o status atual.

Commits:
- Hook de teste: `4e503a4710b0251dbdc4abe680918bada36b1f7b`
- Sincronização do teste: `11ca300ddf32d979f7742b9278c1c6e281e11d92`

## 4. Novas execuções

As alterações dispararam:
- [Execução #340](https://github.com/apoenalore/GameCreator/actions/runs/41547497936) — commit do hook.
- [Execução #341](https://github.com/apoenalore/GameCreator/actions/runs/41547503382) — sincronização determinística do teste.

Ambas estavam na fila na última consulta. A execução #341 contém o conjunto completo das duas alterações; seu resultado é o critério principal para avaliar esta rodada.

## 5. Próximos passos

Se #341 passar:
1. Verificar as etapas seguintes de corte inteligente, exportação, biblioteca, backup, Godot e contratos do Creator.
2. Confirmar o job completo em `success`.
3. Reexecutar uma vez para avaliar estabilidade e ausência de flakiness.
4. Só então considerar a falha do teste de navegador resolvida.

Se #341 falhar:
1. Baixar o novo artefato.
2. Usar o timeout de fila, a mensagem de erro de salvamento ou a nova stack para localizar o ponto.
3. Adicionar logs explícitos ao host bridge e ao ciclo IndexedDB (request, transaction complete/error/abort), sem registrar conteúdo dos projetos.
4. Se necessário, migrar a automação para Playwright/Selenium, com espera por estado e captura de console/page errors.
5. Não desativar o teste e não mesclar a PR enquanto o workflow estiver vermelho.

## 6. Estado

**Investigação em andamento.** A causa não está confirmada. O #339 demonstrou que HTTP localhost, isoladamente, não resolve. A correção atual melhora a sincronização do teste e torna a próxima falha mais diagnóstica. A resolução definitiva depende do #341 e dos testes completos posteriores.
