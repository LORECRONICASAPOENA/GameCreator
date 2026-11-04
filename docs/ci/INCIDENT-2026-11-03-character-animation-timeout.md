# Incidente CI — run 41743357325: timeout ao avançar animação

- **Repositório/PR:** LORECRONICASAPOENA/GameCreator, PR #14, branch `feat/apoena-modular-character-creator-integration`.
- **Run/job/step:** [41743357325](https://github.com/LORECRONICASAPOENA/GameCreator/actions/runs/41743357325), job `validar` (126290129740), step 11 “Testar Criador Modular no navegador”.
- **Commit:** `2c656cfea31f8782299e2e0372d196ddaf3bf31b`.
- **Ocorrência:** 2026-11-03 21:00:37 BRT (log UTC: 2026-11-04 00:00:37Z).
- **Cadastro:** 2026-11-04; hora exata não preservada.

## Mensagem literal

`Timeout: Personagem gravado no projeto atual do Creator. Salve o projeto principal para guardar essa alteração.`

## Evidência e causa

O step 11 expirou ao aguardar mudança em `frameInfo` depois do clique em `play`. O status final da página continha a confirmação do Creator, o trace mostra o listener do host recebendo `saveAsset`, e o payload armazenado tem as chaves `manifest,png`. Portanto, essa ocorrência não indica falha do bridge: a falha observada é na espera de avanço da animação.

No runtime, o loop avança quadros somente quando `playing && !document.hidden`. O teste abre Chrome headless com `--dump-dom`, mas o artefato não registrou `document.hidden` no momento do timeout. Assim, aba oculta no headless é uma **hipótese plausível, ainda não comprovada** como causa raiz.

## Próxima ação escolhida

Antes de modificar o teste, registrar esta ocorrência. Em seguida, tornar o documento do iframe visível apenas durante o teste funcional e manter as assertions de avanço e retorno de quadros, além das verificações do payload. A alteração proposta no harness ainda não foi aplicada nem validada.

## Coleta e resultado

- Log do job inspecionado; artifact `v41-ci-diagnostics`, ID `13281458845`, digest `sha256:a24a7789dd7248559ea1e60f0f811c5f37ee99abdcff4cf5a0ca67b7a96132b`.
- Steps 1–10 passaram; step 11 falhou; steps 12–25 foram pulados; step 26 anexou os diagnósticos.
- **Resultado da correção:** pendente. Não declarar resolvido até validação automática bem-sucedida.
