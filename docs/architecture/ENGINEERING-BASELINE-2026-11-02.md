# Baseline de engenharia e estabilização — 2026-11-02

**Projeto:** Apoena Game Creator V4.0 / Pixel Art  
**Estado:** diagnóstico documental inicial; A1 auditado; A2 pendente.  
**Escopo:** arquitetura, fonte/build/distribuição, organização, mapa, integração e validação de plataformas.

## 1. Objetivo

Evoluir o Creator como plataforma sustentável e modular, preservando funcionalidades, projetos, bibliotecas, formatos e compatibilidade. A estratégia é engenharia reversa e modularização progressiva, não reescrita.

## 2. Arquitetura observada

Subsistemas:
- aplicação principal V4.0;
- Pixel Art Studio;
- Map Editor;
- Asset Library;
- Creator Bridge;
- biblioteca e backup;
- integração Godot;
- build/publicação;
- testes.

Arquitetura-alvo proposta:
1. Entrada e composição.
2. Domínio (mapas, terreno, objetos, sprites, itens, receitas).
3. Casos de uso/aplicação.
4. Adaptadores (IndexedDB, arquivos, mensagens, Godot).
5. Interface.
6. Compatibilidade com APIs e formatos anteriores.

Essa arquitetura é proposta; não representa modularização concluída.

## 3. A1 — auditoria do pacote recebido

Arquivos analisados:
- GameCreator-main-original-backup.zip — 60.120.095 bytes; SHA-256 bb40c8419056dfecdf75f9db99ee2deecfe6963a7fbe5b3d5b804b8b7346dfd9.
- GameCreator-arquitetura-v1.zip — 60.134.000 bytes; SHA-256 cbfdec9c63c5b0e3e778fa04153eb2959cddcdda0e34e23b395bdc5cb83231c0.

Ambos passaram no teste de integridade ZIP. Comparação SHA-256 dos arquivos originais: **135/135 idênticos** no pacote A1. Nenhum arquivo original foi alterado, removido ou renomeado.

Novos arquivos A1:
- architecture/ARCHITECTURE.md;
- architecture/module-manifest.json;
- architecture/IMPLEMENTATION_LOG.md;
- tools/architecture_audit.py;
- tests/architecture_audit.test.py;
- um arquivo .pyc transitório em tools/__pycache__ (não necessário; não incluir em novas distribuições).

Resultados verificados:
- manifesto: 139 arquivos, verificação --check aprovada;
- testes arquiteturais: 3/3 aprovados, executando python tests/architecture_audit.test.py -v;
- divergência documental: IMPLEMENTATION_LOG.md declara 138 arquivos, mas o manifesto tem 139. Corrigir o número no próximo registro;
- os 135 arquivos originais foram comparados byte a byte via SHA-256.

## 4. Fonte, build e artefato de distribuição

A inspeção dos scripts e HTMLs identificou:

| Papel | Arquivo | Evidência observada |
|---|---|---|
| Fonte de entrada do build | APOENA_GAME_CREATOR_V4_0_BANCADA_INTEGRADA.html | Ambos os scripts de build leem esse arquivo como origem |
| Build operacional predominante | integracao/build_unificado.ps1 | Chamado pelos workflows Windows e pelo atalho local descrito no README |
| Build alternativo | integracao/build_unificado.py | Gera saída integrada em ambiente Python |
| Artefato integrado | index.html | Contém aplicação principal, aba Pixel Art e referências a módulos externos |

A fonte de entrada preservada ainda contém o título interno “v3.9.2”, embora seu nome seja V4.0. O build substitui o título para “Apoena Game Creator v4.0 - Editor Integrado”.

O index.html real do pacote tem aproximadamente 16,3 MB, contém a aplicação principal completa, não usa iframe e referencia oito scripts externos em shared/, map-editor/ e pixel-art/. Portanto, não é um “carregador compacto” nem um HTML isolado autossuficiente. A distribuição integrada precisa incluir as pastas e arquivos referenciados.

Existe também um fluxo standalone descrito em LEIA_PRIMEIRO_V4_0.md, que recomenda abrir o HTML original diretamente. A documentação deve diferenciar:
- fluxo standalone: HTML original;
- fluxo integrado: index.html gerado + módulos relativos necessários.

### Reprodutibilidade dos builds

O build Python foi executado em cópia temporária. A saída diferiu do index.html fornecido em dois bytes: o script Python insere uma quebra de linha antes de </main>; o artefato recebido não contém essa quebra. A diferença é pequena e localizada, mas os geradores ainda não são byte a byte equivalentes.

Os workflows examinados chamam o build PowerShell em Windows. Por isso, o PowerShell é o caminho operacional predominante atual; ainda não se declara equivalência multiplataforma nem build canônico definitivamente estabilizado. Comparar e alinhar os geradores antes de mudar o pipeline.

## 5. CI e limites de teste

O pacote contém pixel-art.yml e publicar-creator-unificado.yml. Ambos executam o build PowerShell em runner Windows, com escopos de gatilho que precisam ser documentados e comparados antes de qualquer consolidação.

O workflow de validação executa smoke tests do navegador com --disable-javascript. Isso verifica estrutura/DOM estático, não interações JavaScript reais.

A documentação anterior relata testes de biblioteca bloqueados por ausência de fake-indexeddb/auto. A1 não comprova restauração real no IndexedDB do navegador.

## 6. Registro de riscos

| ID | Problema | Próxima ação |
|---|---|---|
| ARQ-001 | HTML principal extenso e núcleo concentrado | Mapear responsabilidades e dependências antes de extrair |
| ARQ-002 | Scripts integrados ao núcleo | Criar contratos e testes de caracterização |
| ARQ-003 | Dependências pouco documentadas | A2: mapa de APIs, eventos e chamadas |
| ARQ-004 | Duplicações potenciais | Provar uso e dependências antes de excluir |
| ARQ-005 | Fonte/artefato descritos de forma contraditória | Corrigir README e documentação de distribuição |
| BLD-001 | Python e PowerShell diferem em dois bytes | Alinhar saída e criar teste de reprodutibilidade |
| BLD-002 | Workflows com gatilhos potencialmente sobrepostos | Mapear escopo e dependências antes de consolidar |
| BLD-003 | Verificação por tamanho fixo do bundle | Migrar para manifesto/hash com teste |
| TST-001 | Dependência fake-indexeddb ausente em execução anterior | Recuperar testes IndexedDB |
| TST-002 | Smoke test desativa JavaScript | Criar E2E real com interação |
| TST-003 | Regressão visual incompleta | Validar navegador em viewports relevantes |
| TST-004 | Godot não comprovado em runtime real | Testar exportação/importação e execução |

Os itens são problemas/riscos de engenharia; não são automaticamente vulnerabilidades confirmadas.

## 7. Decisões e contratos a preservar

- Não reconstruir o núcleo nem remover a V4.0 antes de substituição compatível.
- Modularizar progressivamente, um componente por vez.
- Preservar APIs globais, eventos, JSON, IDs, banco IndexedDB, stores assets/projects, mensagens Creator Bridge e formatos de exportação.
- Manter adaptadores/fachadas para chamadas antigas durante a transição.
- Criar testes de caracterização antes de extrair código.
- Não excluir arquivos antigos, versões, HTMLs ou caminhos até mapear referências e produzir backup.
- WIP = 1 para GameCreator e Apoena Pixel Art HTML combinados.

## 8. Roteiro aprovado

### P0 — Estabilizar versão principal
- confirmar fonte, artefato, build e distribuição;
- alinhar documentação e comportamento real;
- tornar build reproduzível e rastreável.

### P1 — Corrigir organização
- mapear duplicações, obsolescência, documentação contraditória e caminhos antigos;
- preservar backups;
- excluir somente após prova de não utilização.

### P2 — Consertar editor de mapas
- autotiling;
- tilesets;
- interface;
- persistência e reabertura;
- compatibilidade com projetos existentes.

### P3 — Validar integração
- biblioteca;
- itens/receitas;
- personagens;
- mapas;
- importação/exportação Godot.

### P4 — Testar Android e PC
- salvamento e recuperação;
- desempenho;
- interação e navegação;
- funcionamento em dispositivos reais.

### P5 — Expandir
Somente depois dos critérios P0–P4.

## 9. Próxima tarefa: A2

Produzir mapa de dependências e contratos:
- globais e funções públicas;
- imports/exports;
- eventos e listeners;
- chamadas entre módulos;
- formatos JSON;
- banco e stores IndexedDB;
- mensagens, ações e timeouts da Creator Bridge;
- pontos de entrada e navegação;
- referências a arquivos antigos e duplicados.

A2 é diagnóstico e caracterização. Não iniciar modularização do núcleo antes de fechar o mapa e os testes de contrato.

## 10. Limites e evidências

- Verificação ZIP: aprovada nos dois pacotes.
- Preservação: 135/135 arquivos originais idênticos.
- Testes da ferramenta A1: 3/3 aprovados.
- Manifesto: --check aprovado, 139 arquivos.
- Build Python: executado em cópia temporária; diferença de dois bytes em relação ao index fornecido.
- Não executado nesta auditoria: PowerShell/runner Windows, navegador real com JavaScript, IndexedDB real, Android físico ou Godot.
- Nenhuma refatoração, exclusão de arquivos ou alteração funcional foi feita por este diagnóstico.

## 11. Critérios para concluir cada etapa

Uma etapa só será concluída com:
- arquivos e SHA identificados;
- alterações listadas;
- testes relevantes executados;
- CI no commit/PR correto;
- compatibilidade de projetos antigos verificada;
- evidência de salvamento/restauração quando aplicável;
- limitações e riscos residuais registrados.

Não apresentar proposta como implementação, nem teste estático como validação de runtime.
