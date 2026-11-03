# Relatório de incidente — Actions #41728611799 (timeout no bridge do Criador Modular)

## 1. Identificação
- Data/hora da ocorrência (BRT): 2026-11-03 19:22:10 BRT (log: 2026-11-03T22:22:10Z).
- Data/hora da investigação (BRT): 2026-11-03; horário exato do registro não preservado.
- Repositório: LORECRONICASAPOENA/GameCreator.
- Workflow: .github/workflows/pixel-art.yml.
- Run e URL: [#41728611799](https://github.com/LORECRONICASAPOENA/GameCreator/actions/runs/41728611799).
- Job / step: validar, job 126240154897, step 11, “Testar Criador Modular no navegador”.
- Evento: pull_request.
- Branch: feat/apoena-modular-character-creator-integration (PR #14).
- HEAD SHA: 37e7395013e6423c61fe4beb487265b97d0031b0.
- Commit de merge testado pelo workflow: 1a3a07fca60e6a1f789dc7736c356362c4b54494.
- Estado final: failure.

## 2. Erro observado
- Mensagem literal: FAIL: Error: Timeout: Personagem gravado no projeto atual do Creator. Salve o projeto principal para guardar essa alteração.
- O stack aponta para until em tests/personagens-browser.html:23, chamada pelo teste em tests/personagens-browser.html:44.
- O teste aguardava o texto de sucesso por polling, com 180 tentativas separadas por 50 ms.
- Logs completos do job foram consultados. O artefato v41-ci-diagnostics, ID 13275799468, digest sha256:b415a168a44c35ada398bbbbeea7cf047db7ee478500a6ffd638445388fab8e5, foi baixado e o HTML do navegador foi inspecionado.
- O trace confirma: a requisição bridge saveAsset veio do iframe, o listener do host foi chamado e o host guardou um payload com as chaves manifest,png. O estado FRAME_RECEIVED=false se refere à variável de observação definida no host; não comprova por si só que a resposta foi perdida pelo iframe.
- Build nativo, smoke test do navegador, sintaxe e teste de modelo passaram antes da etapa funcional. Etapas posteriores foram puladas após a falha.

## 3. Diagnóstico
- Falha comprovada: o teste funcional expirou enquanto aguardava o estado de sucesso do editor.
- Causa-raiz do atraso ainda não confirmada: o log prova que o host recebeu e guardou o payload, mas não registra se e quando a Promise do botão terminou em relação ao limite do polling.
- Hipótese principal: o teste sincroniza com a captura do pedido no host e depois usa polling curto do texto de UI, em vez de aguardar a fila assíncrona do editor. Isso pode produzir uma falha de sincronização do harness sem provar defeito no bridge ou no armazenamento.
- Informações ausentes: não há timestamp de conclusão da operação sendCreator nem trace de retorno da Promise no DOM salvo.

## 4. Impacto
- O caminho ponta a ponta “Gravar no Creator” permanece sem validação no SHA testado.
- A captura de manifest e png no host foi comprovada; o sucesso da resposta no iframe e do fluxo completo não foi estabelecido pelo run.
- A falha não comprova perda do recurso nem defeito na gravação da biblioteca central.

## 5. Alternativas e decisão
| Alternativa | Decisão |
|---|---|
| Remover a verificação do texto de sucesso ou a assertion do payload | Descartada; enfraqueceria a validação |
| Aumentar novamente o polling por tempo fixo | Descartada; não sincroniza com a conclusão real da operação |
| Aguardar a Promise de inatividade da fila do editor e manter a assertion de sucesso e as assertions do payload | Escolhida; usa o hook de teste já existente e verifica a conclusão real |

## 6. Alteração planejada
- Alterar somente tests/personagens-browser.html: após capturar o payload, aguardar w.__apoenaTestHooks.whenIdle() por meio do helper idle já usado nos demais fluxos; em seguida verificar o texto de sucesso e manter as assertions de 12 quadros e PNG.
- Não alterar o protocolo ou a implementação de produção do bridge sem evidência de defeito no runtime.
- A alteração ainda não está validada; não declarar resolvida antes de novo workflow canônico aprovado.

## 7. Validação
- Critério: o run automático deve passar no step 11, capturar manifesto e PNG, aguardar a fila real e confirmar a mensagem de sucesso; os demais steps obrigatórios devem concluir.
- Execução deste incidente: [#41728611799](https://github.com/LORECRONICASAPOENA/GameCreator/actions/runs/41728611799), falha no step 11.
- Próxima validação: workflow existente .github/workflows/pixel-art.yml, acionado pelo próximo commit da PR #14.
- Estado: ABERTO — AJUSTE DO HARNESS E NOVA VALIDAÇÃO PENDENTES.
