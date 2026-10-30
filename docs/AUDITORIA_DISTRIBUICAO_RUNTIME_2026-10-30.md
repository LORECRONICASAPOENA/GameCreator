# Auditoria — distribuição enxuta do Game Creator

- **Data da auditoria:** 30/10/2026, 15:08 BRT (-03:00)
- **Repositório:** `apoenalore/GameCreator`
- **Branch auditada:** `feat/atualizador-local-incremental`
- **PR:** [#7 — GC-UPDATE-009](https://github.com/apoenalore/GameCreator/pull/7)
- **Commit auditado:** `3233e739474b993bb33a4f5c685753591c714ba3`
- **Estado:** implementação em branch; não integrada à `main`; teste Windows real pendente.

## Objetivo aprovado

Manter a documentação, auditorias, requisitos, histórico e dados de desenvolvimento no repositório privado, sem baixar esses documentos como parte da instalação local do Creator. A pasta de instalação (`APP`) deve receber somente os arquivos necessários para executar o produto.

A auditoria fica registrada aqui e referenciada no documento de atualizações pendentes. **A documentação não deve ser apagada do repositório interno para tornar o pacote enxuto.**

## Implementação observada

O atualizador `integracao/atualizar-creator.ps1` na branch da PR:

- usa clone Git parcial com `--filter=blob:none` e `--no-checkout` na primeira instalação;
- aplica sparse-checkout a partir de uma lista positiva de padrões de runtime;
- inclui os launchers, páginas, módulos e arquivos de integração necessários ao produto, incluindo a fábrica original v3.9 que a página integrada referencia;
- exclui da pasta `APP` `docs/`, `tests/`, `.github/`, `historico/`, documentação interna e arquivos de desenvolvimento;
- verifica arquivos essenciais antes e depois da atualização;
- registra versão anterior/atual e resultado em log local;
- não usa `git clean`, `reset --hard` nem apaga a pasta do runner;
- exige autenticação Git para o repositório privado.

O bootstrap documentado requer somente:

1. `ATUALIZAR_CREATOR.cmd`
2. `integracao/atualizar-creator.ps1`

O usuário não precisa baixar nem extrair o ZIP completo do repositório para iniciar o processo.

## Validação e evidência

- Run [41082083233](https://github.com/apoenalore/GameCreator/actions/runs/41082083233), commit `3233e739474b993bb33a4f5c685753591c714ba3`.
- Os steps de build, testes do Creator e **“Validar manifesto do atualizador Windows quando presente” (step 17)** concluíram com sucesso.
- O run completo terminou com falha nas etapas 22 e 23, relacionadas à disponibilização do pacote e logs de diagnóstico. Os logs específicos não foram recuperados nesta auditoria; portanto, a causa exata dessa falha de artefato permanece **não confirmada**.
- Esta evidência valida os testes automatizados executados no runner para o manifesto; **não comprova instalação ou atualização no computador do autor**.

## Limites que permanecem

- A PR #7 está aberta em draft e não foi integrada à `main`.
- No snapshot consultado, a branch estava 13 commits à frente e 22 atrás de `main`, com estado de merge não limpo. É necessário sincronizar e revisar a divergência antes de considerar a integração.
- Não há teste humano confirmado de primeira instalação, atualização fast-forward, repetição sem mudanças, modo offline, conflito de arquivos locais, preservação do runner ou backup/restauração da biblioteca IndexedDB.
- Em instalações antigas, o sparse-checkout remove da pasta de trabalho os arquivos rastreados fora do manifesto, mas blobs já armazenados em `.git` podem permanecer. Não executar limpeza destrutiva automática.
- O repositório é privado. Para uma versão pública, publicar um artefato de runtime produzido pelo manifesto; não expor o repositório interno nem copiar os documentos internos para o pacote.

## Critérios para encerrar GC-UPDATE-009

1. Sincronizar e revisar a PR #7 sem perder mudanças.
2. CodeRabbit revisar o diff; classificar e corrigir achados acionáveis.
3. Obter CI canônica bem-sucedida no commit atualizado. Não repetir a suíte enquanto houver execução equivalente ativa.
4. Executar no Windows real os cenários de instalação/atualização listados em `docs/ATUALIZADOR_CREATOR_WINDOWS.md`.
5. Conferir o manifesto do pacote e provar que documentos internos não entram na pasta `APP` nem no artefato público.
6. Atualizar os registros com commit, data/hora BRT, testes e links de execução.

**Conclusão:** o desenho de distribuição enxuta está implementado na branch da PR #7 e o contrato automatizado do manifesto passou no run citado. A tarefa continua em validação; não marcar como concluída nem publicar o atualizador antes dos critérios acima.


## Atualização de auditoria — sincronização e manifesto completo (30/10/2026)

A branch anterior da PR #7 estava divergente da main (16 commits à frente e 33 atrás no snapshot de 30/10/2026). Para evitar integrar uma cópia antiga do workflow e dos documentos de governança:

- foi criada a referência de preservação backup/gc-update-009-before-main-sync-20261030 no head anterior;
- a implementação foi reaplicada em uma branch baseada no commit atual da main, preservando o workflow canônico e os documentos mais recentes;
- o manifesto foi ampliado para exigir os três arquivos da integração Godot, shared/library-backup.js, shared/tileset-check.js, os módulos corte-inteligente.js, estudio.js, objetos.js e o catálogo JSON do Pixel Art;
- a regex de proteção agora cobre qualquer JS sob legacy/v3_9_parts/, alinhada ao padrão de sparse-checkout;
- o atualizador confere a cobertura de cada arquivo essencial por git sparse-checkout check-rules --no-cone antes de prosseguir;
- o teste de contrato foi ampliado para criar um repositório Git temporário e testar clone parcial, exclusão de documentos, atualização fast-forward, referência anterior e proteção contra sobrescrita de arquivo ignorado.

Os commits intermediários foram marcados com [skip ci] para evitar várias execuções enquanto os arquivos eram preparados. A CI canônica será executada uma única vez após a atualização final da branch da PR. O teste local automatizado não substitui a validação no computador do autor.

**Estado:** sincronização preparada; validação CI do novo head e teste Windows real ainda pendentes.


## Achado crítico adicional — clone sem checkout e proteção de arquivos locais

A simulação de Git local reproduziu um defeito importante no fluxo inicial:

- git clone --no-checkout deixa o worktree vazio;
- git sparse-checkout set --no-cone configura o manifesto, mas não materializa os arquivos no clone sem checkout;
- git read-tree -mu HEAD materializa os caminhos selecionados e mantém documentos fora do worktree;
- antes de executar read-tree, é obrigatório verificar colisões de arquivos locais, porque o comando pode substituir conteúdo no caminho.

Também foi testado o merge em sparse-checkout com --no-overwrite-ignore: no Git 2.47.3 usado na simulação, o merge ainda avançou sobre arquivos locais ignorados e não rastreados que conflitavam com novos arquivos remotos. Portanto, o atualizador não depende dessa flag como proteção principal. A função VerificarConflitosLocais compara a árvore remota com a lista combinada de arquivos não rastreados e ignorados e interrompe antes do merge.

- **Correção aplicada:** validação de cobertura por sparse-checkout check-rules, chamada de read-tree -mu HEAD após checagem preventiva e detecção explícita de arquivos ignorados/não ignorados.
- **Teste local de comandos:** PASSOU em Linux, Git 2.47.3, repositório temporário sem conexão ao GitHub.
- **Validação Windows:** pendente da CI no novo head.
- **Validação no computador do autor:** pendente; nenhuma pasta local foi modificada.

Esse achado reforça que o atualizador não pode ser declarado concluído apenas com parser PowerShell e teste estático; a simulação Git e o teste Windows real são critérios obrigatórios.


## Compatibilidade mínima corrigida

A revisão de compatibilidade identificou que sparse-checkout check-rules foi incorporado após o Git 2.25. O requisito do atualizador foi corrigido para Git 2.41.0 ou superior, versão que inclui o comando usado para validar a cobertura do manifesto. A suíte estática agora verifica esse requisito. Fonte de referência: documentação e notas de versão do Git 2.41.


## Proteção adicional de dados ignorados fora da allowlist

Antes de executar sparse-checkout set, o atualizador agora identifica todos os arquivos ignorados não rastreados. Se algum estiver fora da allowlist de runtime, interrompe a atualização e solicita backup/movimentação manual. A regra é conservadora: não tenta limpar, mover nem apagar dados pessoais automaticamente. O teste de contrato cria um arquivo ignorado em docs/ e confirma que a condição é detectável antes de alterar o checkout.


## Bloqueio de arquivos locais fora do runtime

Antes de aplicar o sparse-checkout, o atualizador verifica arquivos locais ignorados e não ignorados. Se encontrar qualquer arquivo fora da allowlist de runtime, interrompe e solicita backup ou movimentação manual. Não tenta apagar, mover ou incorporar esses arquivos. Dados locais dentro de caminhos de runtime também bloqueiam a atualização se colidirem com um arquivo que venha do repositório.


## Caminhos Unicode

A leitura de árvores e arquivos locais usa core.quotePath=false para que nomes com acentos, como árvore.js, sejam comparados como caminhos reais e não como sequências octais escapadas. O teste PowerShell cria uma colisão com nome Unicode e exige que o atualizador bloqueie sem sobrescrever o arquivo local.


## Execução do atualizador PowerShell real na CI

O teste tests/atualizador-manifest.test.cjs não fica apenas na simulação de comandos Git. Ele executa integracao/atualizar-creator.ps1 com Windows PowerShell 5.1, usando um repositório bare local temporário e diretório de configuração isolado. O modo de teste permite a URL local somente quando APOENA_UPDATER_TEST_MODE=1 e a URL do remote corresponde exatamente ao parâmetro RepoUrl; a instalação normal continua limitada ao GameCreator oficial.

O teste executa primeira instalação, verifica arquivos presentes/ausentes, bloqueio de arquivos locais fora da allowlist, atualização fast-forward, preservação de refs/apoena/anterior, execução sem mudanças e bloqueio de conflitos ignorados/não ignorados, inclusive um caminho com acento. Nenhuma pasta permanente do autor é usada.
