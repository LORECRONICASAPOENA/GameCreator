# Apoena Game Creator — V4.1 em desenvolvimento

## Base e entrada do programa

- Repositório: `apoenalore/GameCreator`.
- Branch de desenvolvimento: `feature/estudio-unificado-pixelart-v41`.
- A fonte `APOENA_GAME_CREATOR_V4_0_BANCADA_INTEGRADA.html` e os módulos anteriores são preservados. A V4.0 nativa continua sendo a base do Creator.
- `index.html` é o carregador compacto do Creator nativo: monta as 24 partes de `bundle-v4/` e inclui a biblioteca compartilhada, a ponte V4.0/V4.1 e o módulo de Natureza. A entrada principal não usa iframe.
- `ABRIR_GAME_CREATOR.cmd` executa `integracao/build_unificado.ps1` no Windows e abre a entrada integrada. `integracao/build_unificado.py` oferece o mesmo build para ambientes com Python.
- O build adiciona a área Pixel Art à fonte V4.0 sem sobrescrever o arquivo original. O CI testa o build em um checkout descartável e entrega o resultado compilado no pacote.
- O Estúdio Pixel Art e o editor de mapas são ferramentas especializadas abertas pelo menu Pixel Art nativo. Quando abertos por esses links, sincronizam spritesheets/mapas com a sessão V4.0 pela ponte `apoena.creator.v4.bridge.v1`, além de salvar na biblioteca IndexedDB.

## Ferramentas V4.1

- **Estúdio Pixel Art:** importação PNG/WebP/JPG, recorte livre e por grade, divisórias ajustáveis, transparência, borracha, remoção de fundo por região conectada, detecção de sprites separados, prévia dos limites e desfazer da limpeza em lote.
- **Spritesheets:** células padronizadas, âncora inferior, prévia animada, ações e direções configuráveis por quadro, exportação PNG/JSON e importação de projetos JSON editáveis.
- **Biblioteca central:** assets, imagens originais, metadados, categorias, etiquetas e projetos editáveis em IndexedDB, com atualização por ID para evitar duplicação.
- **Backup:** `biblioteca/index.html` exporta recursos e projetos para JSON versionado e restaura o conteúdo sem apagar registros que não estejam no backup. IDs iguais são atualizados após confirmação.
- **Mapas 2.5D e tilesets:** edição de grade, salvamento/reabertura pela biblioteca, verificação de bordas transparentes, repetição de tiles e compatibilidade das dimensões com a grade.
- **Itens, receitas e Godot:** `integracao/index.html` valida/exporta um catálogo portátil; `integracao/godot/ApoenaCatalogo.gd` implementa carga de catálogo, inventário, coleta, fabricação temporizada, efeitos e salvamento/restauração de sessão.

## Validação automatizada

- `tests/corte-inteligente.test.cjs`: limpeza/transparência, fragmentos, malha e contratos de integração.
- `tests/asset-library.test.cjs`: operações da biblioteca com IndexedDB simulado por `fake-indexeddb`.
- `tests/library-backup.test.cjs`: exportação/restauração, originais, metadados, projetos e rejeição de backups incompatíveis.
- `tests/tileset-check.test.cjs`: bordas transparentes, repetição, grade e limites de imagens.
- `tests/catalogo.test.cjs`: exportação portátil, vínculos de itens/receitas e contrato de integração Godot.
- `tests/creator-bridge.test.cjs`: protocolo request/response, rejeição de origem externa e contratos de sincronização V4.0/V4.1.
- `.github/workflows/pixel-art.yml`: build nativo pelo PowerShell do Windows, verificações JavaScript, testes Node, verificação DOM responsiva em Edge/Chrome e teste headless do Godot 4.7.2 com SHA-256 verificado.
- A validação agendada de V4.1 usa `.github/workflows/auto-validar-v41.yml` e roda a cada hora UTC quando ativa na branch padrão; a validação de alterações usa `.github/workflows/pixel-art.yml`.

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

