# Relatório de incidente CI — Criador Modular de Personagens

**Data:** 2026-11-02/03 (UTC)  
**Workflow:** .github/workflows/pixel-art.yml  
**Run de origem:** [41547503382](https://github.com/apoenalore/GameCreator/actions/runs/41547503382)  
**Commit com falha:** 11ca300ddf32d979f7742b9278c1c6e281e11d92  
**Job:** validar — ID 125626572975  
**Etapa:** Testar Criador Modular no navegador  
**Estado:** correção do harness enviada; aguardando resultado do run 41551596668.

## 1. Sintoma confirmado

O workflow concluiu com falha na etapa de navegador. As etapas anteriores de build, DOM responsivo, sintaxe JavaScript e teste do modelo passaram. A falha foi:

```
Timeout aguardando fila de operações.
Status: Prévia pronta. Revise antes de aplicar.
```

O servidor HTTP iniciou corretamente, o Edge/Chrome foi localizado e o navegador executou o documento. O teste de modelo também passou:
`CHARACTER MODEL OK: grid, frames, persistence, validation, manifest, Godot resource`.

O artefato `v41-ci-diagnostics` foi baixado e inspecionado. `character-server-error.log` estava vazio; `character-server.log` confirmou servidor pronto; o log do Chrome mostrou apenas mensagens internas de task manager, sem crash do navegador.

## 2. Causa imediata confirmada

O próprio teste de navegador criou um timeout interno de 5 segundos:

```js
async function idle(){
  const timeout = new Promise((_, reject) =>
    setTimeout(() => reject(Error('Timeout aguardando fila de operações. Status: '+$('status').textContent)), 5000)
  );
  await Promise.race([w.__apoenaTestHooks.whenIdle(), timeout]);
}
```

O Chrome é iniciado com `--virtual-time-budget=30000`. O timeout do teste e o orçamento de tempo virtual do navegador concorrem com operações assíncronas de imagem/canvas e a fila interna do editor. Assim, o teste podia rejeitar a espera antes de a Promise da fila resolver. A mensagem de timeout é lançada pelo próprio harness; não é uma exceção originada do PowerShell nem prova de falha do servidor HTTP.

## 3. Causa raiz provável — ainda em validação

O status persistido “Prévia pronta” mostra que o fluxo de corte inteligente chegou a produzir a prévia. O timeout, porém, não identifica com precisão qual operação enfileirada permaneceu pendente. Uma operação anterior de edição de quadro também pode manter a fila ocupada enquanto a interface já exibe o status anterior.

Hipótese principal: falso timeout do harness por concorrência entre timer virtual e operação assíncrona de canvas/imagem. Ainda não está comprovado que o módulo de runtime esteja livre de deadlock. O novo run deve confirmar se a fila conclui quando o limite interno concorrente é removido.

## 4. Correção aplicada

Arquivo: `tests/personagens-browser.html`

Antes:
`idle()` usava `Promise.race([whenIdle(), timeout de 5000 ms])`.

Depois:
`async function idle(){await w.__apoenaTestHooks.whenIdle();}`

Commit:
`9ab514b4edf72dd363d46fd69ed67c7cdc42f552`

Motivo: aguardar a Promise real da fila do editor sem competir com o relógio virtual do Chrome. Se houver deadlock verdadeiro, o limite global do navegador/runner encerra o processo e o passo permanece falho; o teste não deve transformar lentidão/tempo virtual em falso diagnóstico de operação travada.

## 5. Resultado de validação

- Run de origem: falhou na etapa do navegador.
- Build, verificações DOM, sintaxe e teste de modelo: aprovados no run de origem.
- Correção do harness: commit enviada.
- Novo run: [41551596668](https://github.com/apoenalore/GameCreator/actions/runs/41551596668), aguardando conclusão no momento deste registro.
- Não declarar resolvido até o novo run aprovar a etapa de navegador e as etapas seguintes.

## 6. Por que esta solução foi escolhida

A evidência aponta para um timeout criado pelo próprio teste, não para indisponibilidade do runner. A correção remove somente a corrida artificial no harness, sem alterar o editor, sua fila de operações, dados, assets ou comportamento de usuário. A solução preserva o teste funcional e não desativa a verificação.

## 7. Próximas ações se o novo run ainda falhar

1. Inspecionar novamente `.ci-results/characters-browser.html` e `.log`.
2. Adicionar instrumentação explícita de início/fim por operação na fila (sem mudar semântica).
3. Identificar se a Promise pendente é `commitFrame`/carregamento da imagem ou outro handler.
4. Criar teste isolado de persistência da edição e de conclusão da fila.
5. Corrigir o runtime somente após reproduzir a operação pendente.
6. Executar novamente CI no commit corrigido.

## 8. Escopo e impacto

A correção atual altera somente o teste de integração. Não altera código de produção, formato de projeto, IndexedDB, biblioteca, bridge, build ou distribuição. Nenhum arquivo funcional foi removido e nenhum teste foi desativado.

**Classificação:** falha de teste/harness, com hipótese de interação com operações assíncronas do editor ainda em validação. Não classificar como vulnerabilidade ou defeito de produção sem evidência adicional.
