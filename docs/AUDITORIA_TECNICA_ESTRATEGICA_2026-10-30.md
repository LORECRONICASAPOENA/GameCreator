# Auditoria técnica e estratégica — Game Creator

- **Registro:** 30/10/2026, 12:17 BRT (-03:00)
- **Repositório:** apoenalore/GameCreator
- **Branch de referência:** main
- **Snapshot funcional analisado:** f69a013dcc6f38267e204b50c1df90698dca54a3
- **Situação:** auditoria documental; nenhuma alteração funcional foi integrada à main por este registro.

## 1. Resumo executivo

O Game Creator possui validações automatizadas que passaram em etapas de código, biblioteca, exportação, integração e Godot nas execuções consultadas. Uma falha posterior de upload de artefatos foi causada por timeout e ENOTFOUND no serviço remoto de artefatos do GitHub; não foi uma falha dos testes do Creator.

O commit f69a013, já presente na main antes deste documento, alterou o empacotamento do workflow para excluir diretórios de documentação, testes, CI, legado e histórico, além de arquivos Markdown e TXT. O workflow verifica a ausência de parte desse conteúdo no ZIP. A execução 41079295445, disparada por esse commit, estava em andamento no momento do snapshot; seu resultado não foi presumido.

A PR #7 continua sendo a frente do atualizador Windows. Ela permanece draft e não integrada à main.

## 2. Problemas e evidências

### GC-COMM-002 — Upload de artefatos intermitente

- Run: https://github.com/apoenalore/GameCreator/actions/runs/41066904787
- Job: 124100579029.
- Ocorrência: 30/10/2026, 10:55:01 -03:00 e 10:55:09 -03:00.
- Steps 1 a 20 concluídos com sucesso; falharam somente os steps 21 e 22, de upload do pacote e dos diagnósticos.
- Erro literal: Request timeout no endpoint ArtifactService/CreateArtifact, seguido de Failed to CreateArtifact: Unable to make request: ENOTFOUND.
- Causa imediata comprovada: falha de resolução/conectividade ao serviço remoto de artefatos.
- Causa de rede subjacente: não identificada; DNS, proxy, rota ou rede permanecem hipóteses.
- Solução aplicada: nenhuma correção técnica. A execução 41075044875, no mesmo commit, terminou com sucesso posteriormente; isso demonstra recuperação/intermitência, não causa raiz resolvida.
- Registro detalhado: docs/BASE_CONHECIMENTO_ERROS_RUNNER_CI.md e docs/RELATORIO_ERROS_COMUNICACAO_RUNNER_GITHUB.md.

### GC-UPDATE-009 — Distribuição e atualização sem documentos internos

O atualizador anterior fazia clone completo do repositório e, portanto, materializava documentos, testes e arquivos de desenvolvimento na pasta de instalação. Isso não atendia ao objetivo de distribuir somente o runtime.

A revisão CodeRabbit da PR #7 registrou seis comentários acionáveis, incluindo um Major sobre a possibilidade de o merge sobrescrever arquivos ignorados do usuário. Também apontou destino relativo, preservação da referência anterior, atualização explícita de origin/main e contradição documental sobre o escopo autorizado.

## 3. Alteração de empacotamento já presente na main

O commit f69a013dcc6f38267e204b50c1df90698dca54a3 alterou o workflow de entrega para:

- excluir .github, docs, historico, legacy, tests e testes;
- excluir arquivos de configuração e publicação que não pertencem ao runtime;
- excluir extensões Markdown e TXT;
- verificar se caminhos e documentos proibidos entraram no pacote;
- colocar o manifesto fora do ZIP de runtime.

Essa mudança afeta o ZIP produzido pelo workflow. Ela não torna, por si só, um clone Git comum enxuto: o checkout do runner continua obtendo o repositório para validar e empacotar.

## 4. Atualizador enxuto preparado na PR #7

Na branch feat/atualizador-local-incremental, PR #7, foi preparada uma alteração do atualizador com:

- clone inicial parcial usando blob:none e sem checkout completo;
- sparse-checkout com lista positiva de arquivos necessários ao runtime;
- inclusão do launcher, atualizador, página integrada, módulos JS/HTML/JSON, biblioteca, bundle e arquivos selecionados da integração Godot;
- exclusão da pasta docs, testes, workflows, legado, histórico, README, AGENTS e documentos de desenvolvimento;
- fetch com refspec explícito para atualizar origin/main;
- proteção contra sobrescrita de arquivos ignorados;
- preservação de refs/apoena/anterior somente quando existe atualização real;
- bloqueio de destino relativo e de instalações fora da main.

O manifesto está no próprio script. A pasta APP não deve receber documentação interna.

### Primeira instalação

O bootstrap deve conter somente:
1. ATUALIZAR_CREATOR.cmd
2. integracao/atualizar-creator.ps1

O CMD executa o clone parcial para a pasta permanente. Não é necessário baixar o ZIP completo do repositório para iniciar a instalação.

### Instalações existentes

O sparse-checkout retira da pasta APP os arquivos rastreados que não pertencem ao manifesto. Objetos que já foram baixados anteriormente podem continuar dentro de .git; não será executada limpeza destrutiva com git clean ou git gc.

## 5. Estado de validação

- PR #7: aberta, draft, não integrada.
- Head da branch de trabalho no registro: a27b1b48a587f0e578b80c21598f6e896a566b2c.
- Commits de preparação do atualizador/documentação foram marcados com skip ci deliberadamente para não iniciar outra execução enquanto a validação Windows não estiver disponível.
- **Não houve teste Windows real desta alteração.**
- Git 2.25 ou superior é exigido pelo script preparado.
- Não considerar o atualizador concluído antes de validar clone novo, atualização repetida, ausência de mudanças, atualização real, conflito de arquivo ignorado, caminho relativo, falha de rede e preservação da biblioteca IndexedDB.

## 6. Separação entre documentos internos e produto

Os documentos permanecem no repositório privado para consulta das IAs e dos colaboradores autorizados. O pacote instalado deve conter apenas o runtime.

A exclusão do pacote não apaga os documentos do GitHub. Para uma distribuição pública futura, deverá ser publicado um artefato construído pelo manifesto de runtime, sem conceder acesso ao repositório privado.

## 7. Próximas decisões

1. Aguardar disponibilidade do computador/runner Windows.
2. Executar uma única validação controlada da PR #7, depois de revisar o código e os comentários do CodeRabbit.
3. Conferir o manifesto real do ZIP e confirmar que nenhum documento interno foi incluído.
4. Somente após essas evidências, decidir sobre integração da PR.

**Estado final deste registro:** documentação atualizada; filtragem de ZIP presente na main; sparse-checkout preparado na PR #7; validação Windows pendente.


## Atualizacao de evidencia — validacao do pacote sem documentos

Depois do snapshot inicial, a execucao [41079295445](https://github.com/apoenalore/GameCreator/actions/runs/41079295445), disparada pelo commit f69a013dcc6f38267e204b50c1df90698dca54a3, terminou com SUCCESS.

- Job: 124143797200.
- Todos os steps do job terminaram com sucesso, incluindo a preparacao da entrega e o upload dos artefatos.
- O log confirmou a mensagem de exclusao de documentacao interna, historico, testes e CI.
- O ZIP foi montado com 52 arquivos de runtime.
- O artefato principal enviado pelo Actions foi finalizado com 71.896.589 bytes.
- O manifesto de runtime foi colocado fora do ZIP, junto dos arquivos de entrega.
- A verificacao de caminhos proibidos e de arquivos Markdown/TXT no pacote nao encontrou conteudo proibido; caso encontrasse, o step teria falhado.

**Conclusao atualizada:** a filtragem do ZIP de distribuicao esta VALIDADA PELO WORKFLOW no commit f69a013. Isso ainda nao valida o sparse-checkout do atualizador da PR #7 nem uma instalacao/atualizacao real no computador do autor. A PR #7 continua draft e nao integrada.
