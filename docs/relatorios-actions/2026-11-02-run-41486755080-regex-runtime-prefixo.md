# Relatório de falha do GitHub Actions — regex aceita extensão por prefixo

## 1. Identificação
- Data/hora da ocorrência: 2026-11-02 13:59:15 BRT (início do run; job iniciou às 14:00:22 e terminou às 14:03:15 BRT).
- Data/hora da investigação: 2026-11-02 14:04 BRT.
- Repositório: apoenalore/GameCreator.
- Workflow: .github/workflows/pixel-art.yml.
- Run: [41486755080](https://github.com/apoenalore/GameCreator/actions/runs/41486755080).
- Job/step: 125419616782, `validar` / `Validar manifesto do atualizador Windows quando presente`.
- Evento: pull_request.
- Branch/SHA: `feat/atualizador-local-incremental` / `1eb2119e3fa0f285e6278d51d0d5eec5ab48399c`.
- Estado final: completed/failure.
- Responsável pela análise: Codex.

## 2. Erro observado
- Mensagem literal: `AssertionError: A proteção local não pode aceitar caminho fora dos padrões efetivos do sparse-checkout: map-editor/cache.json`; `actual: true`, `expected: false`.
- Primeiro erro causal: a assertion existente em `tests/atualizador-manifest.test.cjs:163` rejeitou a classificação indevida de `map-editor/cache.json`.
- Logs: [job 125419616782](https://github.com/apoenalore/GameCreator/actions/runs/41486755080/job/125419616782).
- O job foi atribuído ao runner ID 2, `APOENA-GAMECREATOR-RUNNER`. Build, navegador e verificações anteriores passaram.
- Dados indisponíveis: nenhum dado essencial para o diagnóstico.

## 3. Diagnóstico
- **Causa-raiz comprovada:** `$regexRuntime` não tinha âncora de fim (`$`). O padrão `map-editor/[^/]*\.(js|html)` aceitava o prefixo `.js` de um nome com extensão `.json`, pois a expressão não exigia que a correspondência consumisse o caminho inteiro.
- Evidência: a regex atual termina sem âncora de fim; a assertion existente apresenta `map-editor/cache.json` como fora do manifesto e observou `true`.
- Hipóteses descartadas: erro de Runner, falha de parsing PowerShell, problema de fluxo do manifesto.
- Classificação: teste/contrato de proteção do atualizador.

## 4. Impacto e alcance
- A verificação de proteção contra colisões locais reconheceria indevidamente certos caminhos fora do runtime como cobertos pela allowlist.
- O teste do contrato do atualizador foi executado e falhou; os steps posteriores de hidrologia, Godot, preservação e empacotamento não foram executados.
- A falha não demonstra perda de dados; o atualizador interrompeu antes da instalação/atualização real.
- A aspa de fechamento corrigida no commit anterior agora permite que o script seja analisado e o teste alcance esta assertion.

## 5. Alternativas consideradas
| Alternativa | Avaliação |
|---|---|
| Acrescentar âncora de fim `$` à regex | Correção mínima alinhada ao requisito de correspondência de caminho completo; escolhida. |
| Alterar ou remover a assertion | Descartada: ocultaria uma falha de proteção de dados. |
| Trocar Runner, shell ou workflow | Descartada: o job foi executado e a causa está na regex de runtime. |

## 6. Solução escolhida e justificativa
Adicionar `$` ao fim de `$regexRuntime`, preservando o teste existente. A mudança limita a correspondência ao caminho inteiro e impede que extensões maiores sejam aceitas por prefixo.

## 7. Execução da solução
- Estado deste relatório: diagnóstico concluído; solução escolhida; correção ainda não aplicada no momento do registro.
- Arquivo previsto: `integracao/atualizar-creator.ps1`, somente na regex de proteção.
- Nenhum teste, workflow, shell, gatilho, Runner, dado local ou asset será alterado.
- Commit da correção e ações posteriores: pendentes.

## 8. Plano de validação
- A alteração deve disparar automaticamente a CI canônica da PR #7.
- Resultado esperado: assertion para `map-editor/cache.json` e demais caminhos fora do manifesto passa; o step do atualizador e a validação completa concluem com success no SHA corrigido.
- Estado final: aguardando aplicação e validação automática.

## 9. Prevenção
Manter a assertion que compara a regex de proteção com os padrões de sparse-checkout e exigir correspondência do caminho inteiro. Não enfraquecer a assertion para obter CI verde.

## 10. Resumo
- Erro: `map-editor/cache.json` foi classificado como caminho de runtime.
- Causa: falta de âncora de fim na regex.
- Solução: ancorar a expressão no fim da string.
- Evidência: saída da assertion Node e padrão presente em `integracao/atualizar-creator.ps1`.
- Próxima ação: aplicar a mudança mínima e aguardar a CI automática da PR #7.
