# Backup de etapa — correção do teste do Criador Modular

**Data:** 2026-11-04  
**Repositório:** LORECRONICASAPOENA/GameCreator  
**Branch:** feat/apoena-modular-character-creator-integration  
**PR:** #14 (aberta, draft, não mesclada)  
**Commit-base:** 47332d6f42491745a793b066b2b4793c24faffe4

## Estado preservado antes da correção

- Workflow: [41744315877](https://github.com/LORECRONICASAPOENA/GameCreator/actions/runs/41744315877)
- Job: validar / 126293754047
- Etapa que falhou: Testar Criador Modular no navegador (step 11).
- Artefato de diagnóstico: [13282128299](https://github.com/LORECRONICASAPOENA/GameCreator/actions/runs/41744315877/artifacts/13282128299)
- SHA-256 do ZIP: d760434b7b7663b1afd4fa713100aef7bf62463e4e71970effbdec50a437a1fd
- Build nativo, verificações DOM, sintaxe JS e teste de modelo passaram. Testes seguintes foram ignorados após falha do navegador.
- O log preserva HOSTTRACE com saveProject/listProjects/saveAsset/listAssets concluídos e BRIDGETRACE com pedido saveAsset recebido e armazenado (manifest,png). O indicador FRAME_RECEIVED=false é variável de diagnóstico do harness e não prova, isoladamente, que a resposta não chegou.
- Código-fonte antes da alteração: tests/personagens-browser.html blob 899a18a71c235489884dc1bbff215341bb66eef1; pixel-art/personagens.js blob 353ba3a3d95d2a214cd8ba7d73cfc4313fe87b07; shared/creator-bridge.js blob f9f067577c8f23645521e1a53512618ec87815f4.

## Regra de recuperação

Este checkpoint registra a evidência e o commit-base. A correção deve ser pequena, preservar a ponte real e manter assertions de integração. Não alterar main nem mesclar a PR. Após a correção, executar CI no novo SHA, revisar logs e registrar outro checkpoint com o resultado. O Pixel Art permanece fora de execução até concluir esta tarefa (WIP=1).

## Escopo planejado

Investigar a espera do teste de animação/estado após o envio ao Creator; separar o teste determinístico de avanço de quadro do agendamento requestAnimationFrame do navegador, sem mudar o comportamento de produção. Confirmar a linha causal pelo novo resultado antes de classificar a falha como resolvida.
