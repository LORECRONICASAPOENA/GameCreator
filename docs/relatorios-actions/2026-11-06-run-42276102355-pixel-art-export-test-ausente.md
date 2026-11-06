# Incidente — PR #19: teste de exportação pixel-perfect ausente na sincronização

## 1. Identificação
- Data/hora da ocorrência (BRT): 2026-11-06 16:02:30–16:03:39 (UTC: 19:02:30–19:03:39).
- Data/hora da investigação (BRT): 2026-11-06; hora exata não preservada.
- Repositório: `LORECRONICASAPOENA/GameCreator`.
- Workflow: `.github/workflows/pixel-art.yml`.
- Run ID e URL: [42276102355](https://github.com/LORECRONICASAPOENA/GameCreator/actions/runs/42276102355).
- Job / step: `validar`, job ID `128092695456`, step 11 — `Testar exportação pixel-perfect do Estúdio`.
- Evento: `push`.
- Branch: `sync/main-into-gc-anim-006-20261106-v2`.
- Commit SHA: `301eadd3aadb3d59aafaf9dae9fa92197e6ca191`.
- Estado final: `completed / failure`.
- Responsável pela análise: ALBERTO ENGINE — investigação técnica do Apoena.

## 2. Erro observado
- Mensagem literal recuperada: `node:internal/modules/cjs/loader:1210`; PowerShell classificou a saída como `NativeCommandError`; processo terminou com exit code 1.
- Primeiro erro causal nos logs: comando do step 11 `node tests/pixel-art-export.test.cjs`; a mensagem completa do Node não foi preservada na saída capturada.
- Logs consultados: [log do run](https://github.com/LORECRONICASAPOENA/GameCreator/actions/runs/42276102355); artefato `v41-ci-diagnostics` (ID `13532798783`); job `128092695456`.
- Evidência adicional: a leitura do caminho `tests/pixel-art-export.test.cjs` no SHA `301eadd3aadb3d59aafaf9dae9fa92197e6ca191` retornou HTTP 404. O workflow, entretanto, já executava esse arquivo.
- Dados indisponíveis: o texto integral da exceção Node não apareceu no log nem no artefato; não foi possível recuperar `Cannot find module` ou `MODULE_NOT_FOUND` como mensagem literal. Não inventar essa mensagem.

## 3. Diagnóstico
- **Causa-raiz comprovada:** a branch de sincronização continha a chamada do workflow para `tests/pixel-art-export.test.cjs`, mas não continha o arquivo de teste no commit que iniciou o run.
- Evidência: comando explícito no step 11 + resposta 404 para o arquivo no mesmo SHA + arquivo presente na branch-base da PR #11.
- Hipóteses ainda não confirmadas: nenhuma necessária para explicar a falha observada.
- Classificação: integração de branch / arquivo de teste ausente.

## 4. Impacto e alcance
- O step de exportação pixel-perfect falhou antes de executar o teste; os steps 12–23 foram ignorados.
- Steps 1–10 executaram com sucesso, incluindo build, DOM, sintaxe e Corte Inteligente.
- A falha não demonstra defeito no algoritmo de exportação; demonstra que o teste não estava disponível no checkout.
- Antes da correção, exportação pixel-perfect, validação subsequente da biblioteca, runtime Godot e preservação do Creator não estavam validados nesse run.

## 5. Alternativas consideradas
| Alternativa | Benefícios | Riscos / desvantagens | Decisão |
|---|---|---|---|
| Remover o step do workflow | CI deixaria de falhar | Apagaria cobertura e mascararia a ausência do arquivo | Descartada |
| Tornar o teste opcional ou ignorar exit code | Evitaria a falha imediata | Enfraqueceria a validação e esconderia a regressão | Descartada |
| Sincronizar apenas o arquivo de teste | Menor alteração pontual | Poderia deixar faltando o Estúdio e assets necessários ao teste | Descartada |
| Preservar os arquivos da PR #11 na árvore sincronizada e manter o teste | Corrige a causa e preserva a intenção da cobertura | Exige revisão do merge da árvore completa | Escolhida |

## 6. Solução escolhida e justificativa
- Solução escolhida: completar a reconciliação da árvore da PR #19 com os arquivos efetivos da PR #11, preservando o workflow atual e o teste pixel-perfect.
- Por que: a branch #11 é a origem do Estúdio e do teste; remover a etapa seria regressão de qualidade. A sincronização integral preserva código, teste, imagens de referência e histórico.
- Critérios: menor risco, sem afrouxar assertions, sem criar workflow paralelo, sem force-push e respeitando WIP=1.
- Backup: `backup/gc-pr19-pre-resolution-20261106` preserva o head anterior `bdbd6cb9cbb5901561135f70c70ce2e83147e4a8`.

## 7. Execução da solução
- Estado: aplicada.
- Arquivos preservados na sincronização: `pixel-art/estudio.html`, `pixel-art/estudio.js`, `pixel-art/references/apoena/apoena-ataque-lateral-direita.png`, `pixel-art/references/apoena/apoena-ataque-lateral-esquerda.png`, `pixel-art/references/apoena/apoena-corrida-multidirecional.png`, `tests/pixel-art-export.test.cjs`, além dos documentos e relatórios históricos da PR #11.
- O workflow manteve o step de teste; nenhuma assertion foi removida e nenhum exit code foi ignorado.
- Commit de reconciliação: `e16fe832adde4ab7606594b45a8395a4df6d2438`.
- A branch de sincronização agora contém um merge commit com a branch-base #11 como ancestral e a resolução preservada; PR #19 informa `mergeable=true` e `mergeable_state=clean`.

## 8. Plano e resultado da validação
- Execução canônica: [run 42281994131](https://github.com/LORECRONICASAPOENA/GameCreator/actions/runs/42281994131).
- Commit validado: `e16fe832adde4ab7606594b45a8395a4df6d2438`.
- Resultado: `completed / success`, job `validar`.
- Evidência: step 11 — exportação pixel-perfect — passou; steps 12–21 também passaram, incluindo biblioteca/IndexedDB, backup/restauração, integração, manifesto do atualizador, hidrologia/erosão, runtime Godot 4 e preservação do Creator.
- Steps 22–24 foram `skipped` por condições do workflow; não são falhas.
- Estado final do incidente: **resolvido e validado no SHA e16fe832**.
- A PR #19 ainda precisa passar pela revisão/integração no branch-base #11; este relatório não declara a PR #19 integrada.

## 9. Prevenção e aprendizado
- Ao sincronizar branches, validar que cada caminho chamado por um workflow existe no mesmo tree/commit que contém a chamada.
- Revisar conjuntamente workflow, testes, arquivos de implementação e assets de referência.
- Manter o step de exportação pixel-perfect ativo e exigir que seu teste execute no CI canônico.
- Próxima pendência: revisão e integração da PR #19 na branch-base #11; depois revalidar a PR #11 e atualizar a base da #14.

## 10. Resumo executivo para o autor
- Erro: CI chamou um teste ausente na branch sincronizada.
- Causa comprovada: arquivo `tests/pixel-art-export.test.cjs` não existia no SHA `301eadd`.
- Solução: preservar o teste, o Estúdio e os assets da PR #11 na árvore sincronizada; não remover a etapa.
- Resultado: run [42281994131](https://github.com/LORECRONICASAPOENA/GameCreator) passou integralmente no SHA `e16fe832adde4ab7606594b45a8395a4df6d2438`.
- Próxima ação: integrar a sincronização validada à branch-base #11 após a revisão correspondente.
