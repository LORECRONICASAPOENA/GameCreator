# Checkpoint documental — recuperação Agar, runners e transferência para Pixel Art

**Data:** 02/11/2026, verificação aproximadamente 16:02 BRT (19:02 UTC).  
**Projeto:** apoenalore/GameCreator.  
**Natureza:** backup documental incremental de novidades confirmadas por consulta autenticada ao GitHub. Não é backup binário integral, teste de código nem confirmação de correção de CI.

## 1. Estado remoto observado

- Último commit encontrado na `main` do GameCreator antes deste registro: `fcc1079a3517a1d3b4798604f0ef51ffd871e2dd`, em 02/11/2026 15:59:13 UTC, com atualização do histórico sobre PR #11 e constelações.
- O histórico central `docs/REGISTRO_CONVERSAS_E_BACKUPS.md` continha o checkpoint de PR #11 com CI aprovada no run [41461801598](https://github.com/apoenalore/GameCreator/actions/runs/41461801598), associado ao SHA `0447ea9dc9d9310e985247325e3af1d1c726519a`. Essa é a última evidência registrada, não uma nova execução verificada neste checkpoint.
- O repositório `apoenalore/apoenaskil` recebeu novos commits documentais após o checkpoint anterior. Último commit consultado: [`6c6df4fe918c0ffc8d8f2f888fa5c8d65160428d`](https://github.com/apoenalore/apoenaskil/commit/6c6df4fe918c0ffc8d8f2f888fa5c8d65160428d), de 02/11/2026 18:38:51 UTC. O conteúdo substantivo do adendo foi introduzido no commit [`5b802a4453a1627d1852ac1d51c17864871278b7`](https://github.com/apoenalore/apoenaskil/commit/5b802a4453a1627d1852ac1d51c17864871278b7), de 18:38:46 UTC.
- Outros commits documentais do Apoena Skill imediatamente anteriores indexaram a conversa sobre Agar/Imagina RPG e preservaram referência exata do projeto: `8f2f620`, `45350d4`, `bf4aecd` e `bdeb6f4`.

## 2. Novidades recuperadas no Apoena Skill

O arquivo [`apoena/docs/conversation-recovery-2026-11-02-current-chat-backup-request.md`](https://github.com/apoenalore/apoenaskil/blob/main/apoena/docs/conversation-recovery-2026-11-02-current-chat-backup-request.md) recebeu o adendo **11 — runners GameCreator, auditoria de Apoena Agar e transferência ao Pixel Art**. O índice `apoena/skills/INDEX.txt` foi atualizado para localizá-lo.

### 2.1 Runners e GitHub Actions

- O autor relatou dois runners self-hosted distintos, um para GameCreator e outro para Pixel Art HTML.
- Uma captura registrou erro `A session for this runner already exists`; outra mostrou reconexão, `Listening for Jobs` e execução de um job `validar` com sucesso.
- O QuickEdit do CMD foi desativado pelo autor e a configuração foi salva.
- Uma falha de parsing PowerShell na etapa do atualizador Windows indicou `Token '{' inesperado`. Um teste local inicialmente usou caminho relativo errado; depois, o parser do arquivo no checkout retornou `Sintaxe PowerShell OK`, mas a captura de CI seguinte ainda mostrou a mesma falha.
- **Conclusão documentada:** não foi comprovada a correção dessa falha específica de Actions, nem a estabilidade permanente dos runners. O comando `Remove-Service` falhou e não há evidência de desinstalação de serviço.
- Os resultados de CI da PR #11 em outro SHA não devem ser confundidos com a correção do parser do atualizador Windows.

### 2.2 Auditoria do jogo Agar — achados reportados, não reexecutados

Repositório indicado: [JOGO-APOENA-AGAR-](https://github.com/apoenalore/JOGO-APOENA-AGAR-).

- O run `41358679034` foi registrado como falha no controle mobile da Floresta Viva; os testes sequenciais posteriores de Hub, menu de poderes e arena foram ignorados.
- O run `41358679333` foi registrado como aprovação de `regressao_godot_472`, sem comprovar fluxos QWERF específicos.
- O menu de poderes foi descrito como direcionado à cena de treino `arena_moba_3d.tscn`, enquanto o README apontava `partida_moba_mapa01.tscn` como rota principal.
- Divergência de interface: seleção mostra tecla S para especial, enquanto manual/HUD indicam F; segundo o adendo, gameplay aceita S/F.
- **Divergência de contrato QWERF não resolvida:** versão recente de `dados_herois.gd`/README e versão histórica em `docs/APOENA_INICIAL_QWERF.md` e `tests/arena_3d_smoke.gd` descrevem efeitos e valores diferentes. Não decidir o cânone automaticamente.
- A auditoria do menu teria coberto abertura de cena, não semântica completa dos botões. Layout em telas estreitas permanece risco estático, não falha reproduzida em aparelho.

### 2.3 Transferência de ideias para Apoena Pixel Art HTML

Repositório: [Apoena-pixel-art-html](https://github.com/apoenalore/Apoena-pixel-art-html).

- Preservar a lógica de clima/ecossistema já existente no Pixel Art; não substituí-la por sistemas mais simples de Agar.
- Ideias para adaptação 2D: ondas de minions, IA simples, torres, vitória/derrota, missões curtas, inventário, receitas, menu e pausa.
- Spritesheet esperado do protagonista segundo o registro: 128×192, com quadros 32×48 e quatro direções; asset final não estava presente no repositório consultado anteriormente.
- Não copiar diretamente cenas 3D, GLB/FBX, saves ou nomes/lore provisórios. Implementações HTML e Godot precisam ser validadas independentemente.

## 3. Evidência, status e limitações

| Tema | Evidência desta verificação | Estado |
|---|---|---|
| Novos documentos no Apoena Skill | Commits `5b802a4` e `6c6df4f` lidos com diff | Confirmado |
| Conteúdo da conversa recuperada | Adendo registra 29 mensagens/solicitações visíveis e síntese dos achados | Parcial |
| Transcrição integral e capturas originais | Não incluídas no adendo | Pendente |
| Runner estável e erro PowerShell corrigido | Não comprovado pelo material consultado | Pendente |
| Auditoria Agar e testes no commit atual | Nenhum teste novo executado nesta verificação | Não validado |
| Implementação de ideias no Pixel Art | Nenhuma alteração feita neste checkpoint | Proposta |
| Backup Mestre binário, IndexedDB e restauração | Não executado nesta verificação | Pendente |

## 4. Ações e próximos passos

1. Preservar as referências exatas dos commits do Apoena Skill e o adendo, sem duplicar ou reescrever a transcrição parcial.
2. Quando a tarefa ativa permitir, verificar o script do atualizador **exatamente no SHA executado pelo workflow** e confrontar script temporário, parser local e logs CI; não atribuir causa antes de evidência.
3. Verificar os contratos QWERF no repositório Agar e solicitar decisão canônica antes de modificar gameplay.
4. Auditar ideias reutilizáveis para Pixel Art preservando ecossistema existente e compatibilidade com runtime.
5. Completar Backup Mestre com arquivos locais, assets originais, IndexedDB e teste de restauração.
6. Respeitar `WIP=1`; nenhuma implementação funcional, limpeza destrutiva ou merge está autorizada por este registro.

**Preservação nesta execução:** somente documentação adicionada/atualizada no GameCreator. Nenhum código, asset, workflow, runner, PR, banco IndexedDB ou repositório do jogo foi modificado.
