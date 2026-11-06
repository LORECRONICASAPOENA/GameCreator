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
