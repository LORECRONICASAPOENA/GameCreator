# Checkpoint incremental — PR #11, exportação pixel-perfect e recuperação de conversas

**Data:** 02/11/2026 (BRT; horário exato não certificado nesta consulta).  
**Origem:** consulta autenticada aos repositórios `apoenalore/GameCreator` e `apoenalore/apoenaskil`, associada ao pedido recorrente do autor para preservar novidades e informações detalhadas.  
**Tipo:** backup documental incremental; **não** é backup binário integral, auditoria funcional do editor, execução do Godot, sincronização de arquivos locais ou transcrição integral das conversas.

## 1. Estado do GameCreator na consulta

- Repositório: https://github.com/apoenalore/GameCreator
- Último commit encontrado na branch padrão antes deste registro: `9e32e098334f2068bed573ff63b45bd23262b719` — atualização documental do histórico.
- O relatório anterior registrou a aprovação do CI da PR #11 no SHA `0dd0b9ee90409654958f010eef9303f0dca8c7c7`, run [41451250043](https://github.com/apoenalore/GameCreator/actions/runs/41451250043), com `completed/success`. Esse sucesso continua sendo evidência **somente daquele SHA**.
- A [PR #11 — GC-ANIM-006](https://github.com/apoenalore/GameCreator/pull/11) continua `open`, `draft=true`, `merged=false`, `mergeable=true`. A branch de trabalho é `feat/apoena-personagem-estudio-main`.
- **Novo head observado:** `0447ea9dc9d9310e985247325e3af1d1c726519a`.
- **Novo commit relevante:** [`0447ea9`](https://github.com/apoenalore/GameCreator/commit/0447ea9dc9d9310e985247325e3af1d1c726519a), título `ci(pixel-art): run spritesheet export regression test`.
- **Mudança conferida no diff:** `.github/workflows/pixel-art.yml` passa a executar `node tests/pixel-art-export.test.cjs` como etapa de teste da exportação pixel-perfect do Estúdio, imediatamente após o teste de corte inteligente.
- **Teste conferido na branch:** `tests/pixel-art-export.test.cjs` existe; extrai a função `sheet()` de `pixel-art/estudio.js` para um sandbox `vm` com canvas simulado e verifica: duas imagens desenhadas, atlas de 512×128 para célula 128/4 colunas, `imageSmoothingEnabled=false` em cada desenho e dimensões dos quadros de origem preservadas. Isso é **teste unitário com mocks**, não prova visual de exportação no navegador nem de funcionamento no Godot.
- **CI do novo SHA:** consulta a runs associados ao head `0447ea9...` encontrou [run 41461801598](https://github.com/apoenalore/GameCreator/actions/runs/41461801598) em `in_progress`, sem conclusão disponível no momento. **Não declarar aprovado ou reprovado**; verificar novamente na próxima consulta.
- Nenhum merge, rerun, alteração de workflow ou código foi efetuado por esta rotina.

## 2. Atualizações de apoenaskil

Repositório: https://github.com/apoenalore/apoenaskil

### Commit `82d978989b025858d53abe92044cfeca2b09caeb`

[Ver commit](https://github.com/apoenalore/apoenaskil/commit/82d978989b025858d53abe92044cfeca2b09caeb) — `docs: preserve current Apoena conversation backup request`.

Novo arquivo: `apoena/docs/conversation-recovery-2026-11-02-current-chat-backup-request.md`.

- Recupera de forma **parcial** o contexto da conversa do projeto `historiaegeografia`, pedidos de backup, animações de caminhada e ataque e identificação de Apoena como protagonista.
- Declara que havia 32 conversas listadas no índice do projeto, mas **não** afirma que as 32 foram lidas integralmente.
- Informa que anexos, imagens e trechos inacessíveis não foram incorporados como arquivos binários; a descrição das folhas de sprites não substitui os PNGs originais.
- Registra pedidos do autor e limites de proveniência sem inventar conteúdo ausente.

### Commit `9ff515d11a13ab489b22b01c34234b5b93f3c213`

[Ver commit](https://github.com/apoenalore/apoenaskil/commit/9ff515d11a13ab489b22b01c34234b5b93f3c213) — `docs: index current Apoena conversation backup`.

- Atualiza `apoena/skills/INDEX.txt` com referência ao novo documento de recuperação parcial.
- Essa indexação melhora a descoberta do documento, mas não equivale à recuperação integral das conversas.

## 3. Decisões e princípios preservados

- **Pedido permanente do autor:** registrar novidades e informações detalhadas no GitHub a cada conversa relevante.
- Preservar originais, histórico de versões e documentação; não apagar arquivos ou reconstruir funcionalidades sem auditoria.
- Manter **WIP = 1**; a PR #11 continua frente ativa e `GC-UPDATE-009` permanece pausado conforme decisão anteriormente registrada.
- Não confundir recursos editáveis/preview de animações com gameplay implementado.
- Não alterar cânone narrativo a partir de descrições técnicas, hipóteses ou resumos.
- Não expor credenciais, tokens, códigos de autenticação nem copiar material sensível para o repositório.

## 4. Pendências objetivas

1. Verificar conclusão e logs do run **41461801598** no SHA `0447ea9...`; se houver falha, registrar incidente com evidência antes de propor correção.
2. Revisar visualmente a exportação de spritesheets no navegador, as imagens originais de Apoena, a grade e as animações; confirmar caminhada fiel e ataques. Teste unitário não substitui essa revisão.
3. Validar animações e importação no gameplay Godot, e depois em Android físico, com evidências por SHA.
4. Manter a PR #11 em draft até revisão/aceite; nenhum merge foi autorizado por este registro.
5. Recuperar originais de imagens e documentos, biblioteca IndexedDB, transcrições integrais e dados locais; testar restauração de um Backup Mestre.
6. Construir índice de proveniência e matriz de funcionalidades/problemas com status de implementação e testes verificáveis.

## 5. Escopo da operação

Esta operação cria **somente um relatório documental** e atualiza o histórico central. Não cria ZIP mestre, não copia arquivos do computador, não altera código, testes, CI, runner, branches de produto, assets ou dados IndexedDB. O GitHub já mantém o histórico dos arquivos rastreados; este checkpoint registra a evolução observada, com referências e limites explícitos.
