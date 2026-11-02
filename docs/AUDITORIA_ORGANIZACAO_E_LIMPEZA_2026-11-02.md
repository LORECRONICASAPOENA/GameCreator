# Auditoria de organização e limpeza do Game Creator

Data: 02/11/2026  
Branch: main  
Commit inspecionado: ce08eef7896126d94c277783256e2ff3aedd8ed0  
Árvore: 134 arquivos; tamanho informado pela API: aproximadamente 49.847 KB.

## Resumo
Há acúmulo de versões, arquivos gerados, iniciadores, scripts de build e documentação. Nenhum arquivo foi apagado nesta auditoria. Ainda não foi feita comparação funcional completa dos HTMLs grandes; exclusões agora seriam arriscadas.

## Inventário e decisão preliminar

| Grupo | Estado observado | Decisão |
|---|---|---|
| APOENA_GAME_CREATOR_V4_0_BANCADA_INTEGRADA.html (~16.3 MB) | README o chama de fonte original; build PS/Python o consome | Manter |
| index.html (~16.3 MB) | README o descreve como loader compacto e também como artefato gerado; build pode sobrescrevê-lo | Manter; resolver documentação contraditória |
| APOENA_GAME_CREATOR_v3_9_2_PROJETOS_SEGUROS_COMPLETO.html (~16.3 MB) | Versão antiga na raiz | Candidato a arquivar após comparação |
| bundle-v4/ (24 partes, ~16.5 MB) | README diz que index carrega as partes; scripts e workflow validam bundle | Manter até provar que não é dependência |
| legacy/v3_9_parts/ (23 partes) e legacy/abrir-editor-v3.9.html | Fonte histórica v3.9 documentada | Preservar em histórico |
| legacy/iniciador-anterior.html | Função e referências ainda não confirmadas | Candidato a arquivar/remover após busca |
| ABRIR_GAME_CREATOR.cmd | Atalho local que chama build PowerShell e abre index; não é executado pelo Runner | Opcional local; não apagar sem confirmar uso |
| PUBLICAR_NO_GITHUB.cmd/.ps1 | Utilitários não inspecionados funcionalmente nesta revisão | Inspecionar antes de decidir |
| build_unificado.ps1 e build_unificado.py | Lógica de build semelhante em duas linguagens | Comparar paridade; escolher caminho canônico |
| pixel-art.yml e publicar-creator-unificado.yml | Dois workflows; ambos parecem compilar; segundo tem permissão de escrita e publica index | Prioridade alta para avaliar sobreposição; não apagar ainda |
| Documentos V3, V4 e históricos | Vários guias, relatórios e planos | Consolidar índice e backlog; preservar conteúdo histórico |

## Contradições identificadas
1. README descreve index.html como loader compacto de bundle, mas o tamanho (~16.3 MB) é semelhante ao HTML-fonte. O build também escreve index.html a partir da fonte.
2. README descreve a fonte V4.0 presente; integracao/README.md diz que o HTML V4.0 completo ainda não foi publicado e chama o HTML completo do repositório de V3.9.
3. Dois workflows parecem executar build/publicação de index.html. Verificar eventos, filtros, permissões, artefatos e validações exclusivas.
4. Dois scripts de build parecem duplicar a mesma função; falta comparação automatizada.
5. Documentos de pendências têm data antiga e precisam ser reconciliados com estado atual de issues/PRs.

## Plano de limpeza seguro

### Lote A — fonte de verdade
- Comparar hash e estrutura dos três HTMLs grandes.
- Extrair scripts, IDs, módulos e recursos de cada um.
- Confirmar qual arquivo o usuário abre em Android/PC.
- Executar build em checkout descartável e comparar resultado.
- Corrigir README e integracao/README.md.

### Lote B — workflows/build
- Comparar triggers, paths, permissões e passos dos dois workflows.
- Definir um único workflow canônico para validar.
- Comparar build PowerShell/Python e manter ambos apenas se houver plataformas de uso reais.
- Evitar commits automáticos redundantes do index.

### Lote C — iniciadores e versões antigas
- Buscar referências a legacy/iniciador-anterior.html, legacy/abrir-editor-v3.9.html e HTML V3.9.2.
- Confirmar que não há fluxo dependente.
- Arquivar ou remover em PR revisável com backup.
- Não remover bundle-v4 enquanto loader/build/CI depender dele.

### Lote D — documentação
- Criar índice central: versão atual, fonte de verdade, como abrir, testar, backlog e referências.
- Manter um backlog ativo único.
- Mover guias antigos para histórico, sem descartar conteúdo exclusivo.
- Distinguir planejado, em implementação, implementado e verificado.

## Candidatos a limpeza — ainda não autorizados para exclusão
- HTML V3.9.2 na raiz.
- legacy/iniciador-anterior.html.
- PUBLICAR_NO_GITHUB.cmd/.ps1.
- Um dos workflows, se a sobreposição for confirmada.
- Um dos scripts de build, se a paridade for comprovada.
- Guias V3 repetidos, após preservação do conteúdo único.

## Registro da sessão
O autor pediu avaliação do volume de informação, pendências e arquivos repetidos, com atenção a versões antigas, iniciadores e HTMLs. A árvore main foi inspecionada. Também foi registrada a decisão de arquitetura online híbrida para Android/PC e 20–50 jogadores no plano de jogo online.

## Regra para exclusão
Só excluir depois de confirmar que o arquivo não é fonte única, buscar referências, identificar substituto, preservar conteúdo exclusivo, executar testes e registrar motivo/impacto. Quando houver dúvida, arquivar em vez de apagar.

**Resultado desta auditoria:** somente inspeção; nenhum arquivo funcional ou histórico foi apagado.


## Verificação adicional — fluxos e iniciadores (02/11/2026)

### Workflows: não são duplicatas idênticas
- `.github/workflows/pixel-art.yml` declara-se CI canônico, tem `contents: read`, executa build/testes, valida DOM mobile, dependências e runtime. Tem triggers de push/PR com filtros amplos e workflow_dispatch.
- `.github/workflows/publicar-creator-unificado.yml` é um fluxo de publicação específico: roda em push para main com paths selecionados, chama build, valida saída e faz commit/push de `index.html` se houver mudança. Usa `contents: write` e runner self-hosted.
- **Conclusão:** ambos invocam build, mas possuem finalidades distintas (validação abrangente versus publicação do artefato). Não apagar nenhum sem desenhar um fluxo substituto. A possível duplicidade é de compilação/execução e deve ser resolvida por desenho, não por exclusão cega.
- **Risco a avaliar:** o workflow de publicação usa credenciais persistentes no checkout e permissão de escrita. Manter apenas se a publicação automática do index for requisito; preferir artifact/release ou PR automático, se o processo atual permitir.

### Builds PowerShell e Python
- PowerShell é chamado por `ABRIR_GAME_CREATOR.cmd` e pelo CI Windows.
- Python tem função equivalente documentada, mas o workflow atual apenas verifica sintaxe quando Python está disponível; não executa teste de paridade funcional.
- Os dois scripts têm caminho alternativo para fonte V4.0 vazia e bundle. Não há prova de que ambos gerem o mesmo resultado em todos os cenários.
- **Decisão provisória:** manter ambos até executar testes de paridade. Se a equipe só suporta Windows, PowerShell pode ser o build canônico e Python pode ser removido após confirmar que nenhum consumidor externo o usa.

### Iniciadores e publicação local
- `ABRIR_GAME_CREATOR.cmd` não é apenas um redirecionador HTML: executa o build PowerShell e abre `index.html`. Não é chamado pelo Runner, mas tem função local real no Windows. **Não apagar sem substituir o fluxo local.**
- `legacy/iniciador-anterior.html` não é um simples redirect: contém catálogo de poções editável/exportável e links para editor v3.9, integração, Pixel Art e Map Editor. É legado, mas possui conteúdo funcional específico. **Não apagar antes de migrar catálogo e verificar referências.**
- `PUBLICAR_NO_GITHUB.cmd` é wrapper para `PUBLICAR_NO_GITHUB.ps1`. O PowerShell clona/atualiza o repositório, copia arquivos via Robocopy e faz commit/push para main. Não é o Runner e tem função diferente do launcher. Pode publicar arquivos locais amplamente; revisar exclusões, branch e prevenção de segredos antes de recomendar uso. **Não apagar sem saber se o autor ainda usa esse fluxo.**

### Divergência da documentação V3.9/V4.0/V4.1
- README atual declara “V4.1 em desenvolvimento”, V4.0 como base, `index.html` como loader e bundle-v4 como 24 partes.
- `integracao/README.md` declara que o HTML completo do repositório é V3.9 e que V3.9.2/V4.0 não foram publicados integralmente.
- O build PowerShell exige a existência do arquivo V4.0 e, se seu conteúdo estiver vazio, valida bundle e preserva index. O build Python segue lógica parecida. Isso indica entradas alternativas de build, mas não resolve qual versão é funcionalmente canônica.
- O fetch de arquivos grandes não devolveu conteúdo textual utilizável nesta inspeção. Portanto, não foi possível comparar os HTMLs por diff/hash local. Semelhança de tamanho não comprova duplicação.
- **Ação necessária:** obter clones/artefatos em ambiente de trabalho, calcular SHA-256 real, comparar estrutura e executar testes. Até lá, manter os arquivos grandes.

## Decisão de limpeza após a verificação
Nenhum alvo atual atende aos critérios de exclusão segura. A limpeza imediata recomendada é documental/organizacional:
1. corrigir a descrição da fonte de verdade somente após comparação local;
2. manter CI e publicação como workflows distintos até redesenho validado;
3. manter launcher local e scripts de publicação enquanto houver uso;
4. migrar catálogo/conteúdo exclusivo do iniciador legado antes de arquivar;
5. manter ambos os builds até prova de paridade;
6. criar PR separado para qualquer remoção futura, com diff e testes.

**Status desta rodada:** inventário e análise estática dos scripts/workflows concluídos parcialmente. Não houve exclusão nem alteração de runtime.