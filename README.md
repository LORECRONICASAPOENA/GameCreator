# Apoena Game Creator — V4.1 em desenvolvimento

## Base e entrada do programa

- Repositório: `apoenalore/GameCreator`.
- Branch de desenvolvimento: `feature/estudio-unificado-pixelart-v41`.
- A fonte `APOENA_GAME_CREATOR_V4_0_BANCADA_INTEGRADA.html` e os módulos anteriores são preservados. A V4.0 nativa continua sendo a base do Creator.
- `index.html` é o carregador compacto do Creator nativo: monta as 24 partes de `bundle-v4/` e inclui a biblioteca compartilhada, a ponte V4.0/V4.1 e o módulo de Natureza. A entrada principal não usa iframe.
- `ABRIR_GAME_CREATOR.cmd` é um atalho opcional para uso local no Windows: executa `integracao/build_unificado.ps1` e abre a entrada integrada. Não é usado pelo GitHub Actions; o workflow chama o script PowerShell diretamente. Alterações isoladas nesse atalho não disparam mais o Runner. `integracao/build_unificado.py` oferece o mesmo build para ambientes com Python.
- O build adiciona a área Pixel Art à fonte V4.0 sem sobrescrever o arquivo original. O CI testa o build em um checkout descartável e entrega o resultado compilado no pacote.
- O Estúdio Pixel Art e o editor de mapas são ferramentas especializadas abertas pelo menu Pixel Art nativo. Quando abertos por esses links, sincronizam spritesheets/mapas com a sessão V4.0 pela ponte `apoena.creator.v4.bridge.v1`, além de salvar na biblioteca IndexedDB.

## Ferramentas V4.1

- **Estúdio Pixel Art:** importação PNG/WebP/JPG, recorte livre e por grade, divisórias ajustáveis, transparência, borracha, remoção de fundo por região conectada, detecção de sprites separados, prévia dos limites e desfazer da limpeza em lote.
- **Criador Modular de Personagens:** editor integrado à aba Pixel Art do Game Creator, com camadas de corpo/rosto/cabelo/roupas/equipamentos, alinhamento, espelhamento, animações por linha/quadros, malha ajustável, corte inteligente com prévia, borracha/restauração por quadro, desfazer/refazer, biblioteca, JSON, PNG e Godot. O gerador anterior permanece disponível na aba “Personagens clássico” durante a validação.
- **Spritesheets:** células padronizadas, âncora inferior, prévia animada, ações e direções configuráveis por quadro, exportação PNG/JSON e importação de projetos JSON editáveis.
- **Biblioteca central:** assets, imagens originais, metadados, categorias, etiquetas e projetos editáveis em IndexedDB, com atualização por ID para evitar duplicação.
- **Backup:** `biblioteca/index.html` exporta recursos e projetos para JSON versionado e restaura o conteúdo sem apagar registros que não estejam no backup. IDs iguais são atualizados após confirmação.
- **Mapas 2.5D e tilesets:** edição de grade, salvamento/reabertura pela biblioteca, verificação de bordas transparentes, repetição de tiles e compatibilidade das dimensões com a grade.
- **Itens, receitas e Godot:** `integracao/index.html` valida/exporta um catálogo portátil; `integracao/godot/ApoenaCatalogo.gd` implementa carga de catálogo, inventário, coleta, fabricação temporizada, efeitos e salvamento/restauração de sessão.

## Uso rápido — Criador Modular de Personagens

1. Abra **Pixel Art → Criador Modular** e escolha **Montar personagem**.
2. Importe as peças do personagem em PNG, WebP ou JPEG. Cada arquivo pode ter até 18 MB; cada camada aceita imagem de até 1024 × 1024 px. Cada peça entra como uma camada independente.
3. Selecione uma camada para ajustar posição, escala, opacidade, visibilidade, ordem e espelhamento. Use a prévia e a linha do tempo para conferir ações e quadros.
4. Em **Malha e limpeza**, defina colunas, linhas, origem, tamanho das células e espaçamentos da spritesheet. A malha precisa caber na imagem; cada camada aceita até 160 células.
5. Para corrigir um quadro, selecione-o e use a borracha, restauração ou corte inteligente. O corte inteligente mostra uma prévia antes de aplicar; **Desfazer/Refazer** preserva a possibilidade de recuperar a edição.
6. Use **Salvar projeto** para guardar a montagem editável na Biblioteca central (IndexedDB). Em **Biblioteca**, atualize a lista e reabra projetos ou importe assets salvos como novas camadas.
7. **Baixar JSON** exporta o projeto portátil com as imagens incorporadas. **Exportar PNG** gera a spritesheet: linhas representam ações e colunas representam quadros.
8. **Exportar Godot .tres** gera um recurso SpriteFrames do Godot 4 com textura incorporada. **Adicionar à biblioteca** grava a spritesheet e o projeto editável.
9. **Gravar no Creator** envia o personagem para a sessão do projeto principal que está aberta. Depois, use **Salvar projeto editável** no Creator para persistir a alteração no projeto principal.

**Limites atuais:** até 32 camadas e 32 ações; até 24 quadros por ação; 160 células por camada; projeto editável até 48 MB; spritesheet PNG até 16 milhões de pixels; exportação Godot .tres até 4 milhões de pixels. O criador monta peças importadas; não gera automaticamente partes de personagem a partir de uma única imagem. O gerador clássico continua disponível em **Personagens clássico**.

## Validação automatizada

- `tests/personagens.test.cjs` e `tests/personagens-browser.html`: modelo, malha, quadros, persistência, exportação Godot, borracha, histórico, biblioteca e sincronização com o Creator.
- `tests/corte-inteligente.test.cjs`: limpeza/transparência, fragmentos, malha e contratos de integração.
- `tests/asset-library.test.cjs`: operações da biblioteca com IndexedDB simulado por `fake-indexeddb`.
- `tests/library-backup.test.cjs`: exportação/restauração, originais, metadados, projetos e rejeição de backups incompatíveis.
- `tests/tileset-check.test.cjs`: bordas transparentes, repetição, grade e limites de imagens.
- `tests/catalogo.test.cjs`: exportação portátil, vínculos de itens/receitas e contrato de integração Godot.
- `tests/creator-bridge.test.cjs`: handshake com nonce criptográfico por janela autorizada, canal privado `MessageChannel`, rejeição de origens/fontes não autorizadas e contratos de sincronização V4.0/V4.1.
- `.github/workflows/pixel-art.yml` é o CI canônico: executa automaticamente em pushes de arquivos relevantes em qualquer branch, em atualizações de Pull Request para `main` e a cada hora UTC na branch padrão.
- O pipeline usa um único job sequencial no Runner Windows: compila o Creator antes dos testes, valida JavaScript, DOM responsivo, biblioteca/backup, contratos de integração, hidrologia quando os arquivos existem e runtime headless do Godot 4.7.2 com SHA-256 verificado.
- `workflow_dispatch` permanece apenas como alternativa de emergência; não é necessário apertar Validar no fluxo normal. A concorrência por branch cancela execuções antigas equivalentes para evitar fila acumulada.

## Limites que impedem declarar o projeto concluído

- A sincronização da ponte altera a sessão V4.0 em memória. Depois de sincronizar personagens/mapas, use **Salvar projeto editável** na aplicação principal para persistir a sessão em JSON.
- O salvamento IndexedDB e a sessão V4.0 são duas persistências distintas; a ponte atualiza ambas para spritesheets/mapas quando a ferramenta é aberta pelo Creator, mas não instala automaticamente assets no runtime do jogo.
- O PNG e o manifesto não garantem, sozinhos, animações funcionais no gameplay. As transições, estados e importação no Godot precisam de validação específica.
- O CI instala o Godot 4.7.2 oficial quando necessário, verifica o SHA-256 do pacote e executa testes headless de catálogo. A validação em dispositivo Android físico continua sendo uma verificação manual separada.
- Android físico, regressão visual manual da bancada 3D e validação completa de importação/exportação no Godot não devem ser declarados aprovados sem evidência.

## Arquivos principais

- `index.html`: entrada principal gerada pelo build nativo; o carregador compacto de desenvolvimento é compilado para a página integrada pelo workflow de publicação.
- `bundle-v4/`: partes preservadas do Creator integrado.
- `pixel-art/estudio.html` e `pixel-art/estudio.js`: edição de spritesheets.
- `pixel-art/corte-inteligente.js`: análise conservadora do fundo e de sobras.
- `pixel-art/modulo-integrado.js` e `pixel-art/ponte-creator.js`: UI nativa e integração com a sessão V4.0.
- `shared/asset-library.js` e `shared/creator-bridge.js`: biblioteca IndexedDB e comunicação entre ferramentas.
- `biblioteca/index.html`: consulta, exportação e restauração de recursos/projetos.
- `map-editor/index.html`: mapas e tilesets.
- `integracao/build_unificado.ps1` e `integracao/build_unificado.py`: build nativo.
- `integracao/godot/`: catálogo e testes headless de runtime.
- `APOENA_GAME_CREATOR_V4_0_BANCADA_INTEGRADA.html`: fonte original preservada.

## Plano geral e fundação de mapas

O plano consolidado de História, Exploração Livre, MOBA, ecossistema, NPCs, economia, desempenho mobile e integração com Godot está em [PLANO_GERAL_APOENA.md](PLANO_GERAL_APOENA.md).

A primeira fatia foi integrada à main pela PR #2. Ela adiciona catálogo de terreno, propriedades ambientais e autotile, metadados de interação para objetos, perfis de plantas/animais/montarias, profissão e rotina de NPCs, papel econômico, perfis de mapa e validação. O editor inicia com a Cidade Capital de Agar no perfil História e mantém o preset de MOBA. Esses dados são a fundação de autoria/exportação; a simulação ecológica, as transações, as rotinas autônomas e o comportamento no jogo ainda exigem implementação e testes no runtime.



## Diagnóstico CI

- [Incidente 2026-11-02 — timeout do Criador Modular no navegador](docs/ci/INCIDENT-2026-11-02-character-browser-timeout.md): logs e artefato examinados, causa imediata do timeout do harness, correção do teste e estado da revalidação.
