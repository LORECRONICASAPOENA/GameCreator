# Pesquisa externa — falha do teste de navegador/IndexedDB (Apoena GameCreator)

**Data:** 2026-11-02  
**Execuções relacionadas:** #336, #337 e #339  
**Branch:** `feat/apoena-modular-character-creator-integration`

## Resumo executivo

Foi feita pesquisa externa sobre falhas de IndexedDB, origens `file://`, automação Chrome Headless e testes de navegador no Windows.

A pesquisa encontrou orientação oficial e relatos de problemas correlatos que sustentam a decisão de executar o teste funcional por HTTP em localhost, em vez de abrir a página diretamente por `file://`.

**Importante:** os relatos encontrados não reproduzem integralmente a falha do Apoena. São evidências de problemas conhecidos no mesmo domínio técnico, não prova isolada da causa raiz deste incidente. A confirmação depende do resultado da execução #339.

## Fontes consultadas e relevância

### 1. MDN — CORS: requisições que não usam HTTP

URL: https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CORS/Errors/CORSRequestNotHttp

A documentação explica que requisições CORS exigem HTTP/HTTPS e que arquivos locais `file://` podem ter origens opacas. Recomenda servir os arquivos por servidor local, fazendo os recursos compartilharem a mesma origem localhost.

**Relação com Apoena:** o teste #337 abria `tests/personagens-browser.html` diretamente como URL `file://`. A mudança do #339 passa a servir o teste por HTTP local.

### 2. MDN — IndexedDB: terminologia e características

URL: https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API/Basic_Terminology

A documentação explica que IndexedDB respeita same-origin policy. A origem é formada por protocolo, domínio e porta; cada origem possui seu conjunto de bancos.

**Relação com Apoena:** o contexto de origem do teste importa para o banco. A execução em localhost cria um contexto web previsível e permite validar persistência sob uma origem HTTP explícita.

### 3. Playwright — Issue #30421

URL: https://github.com/microsoft/playwright/issues/30421

Relato de 18 de abril de 2024 sobre dificuldade de consultar object stores do IndexedDB ao testar uma extensão em contexto `chrome-extension://`. O autor observou comportamento diferente ao usar `file://`.

**Relação com Apoena:** não é o mesmo protocolo nem o mesmo bug. Serve como evidência de que IndexedDB pode se comportar de maneira distinta em contextos de origem especiais durante testes automatizados.

### 4. Chrome Developers — Headless CLI

URL: https://developer.chrome.com/docs/automation-and-testing/headless-cli

A documentação explica `--dump-dom`, `--timeout` e `--virtual-time-budget`. O Chrome executa scripts antes de serializar o DOM, mas a captura é controlada por limites de tempo.

**Relação com Apoena:** o teste usa `--dump-dom` e orçamento de tempo virtual. A captura do DOM não deve ser tratada como substituta de sincronização explícita com a operação assíncrona que o teste espera.

### 5. Chrome Developers — Headless e automação

URL: https://github.com/GoogleChrome/developer.chrome.com/blob/main/site/en/articles/new-headless/index.md

A documentação também descreve o modo headless e sua utilização com ferramentas de automação como Selenium.

**Relação com Apoena:** fonte complementar para o comportamento do navegador headless; não aponta diretamente a causa do timeout de salvamento.

## Confronto com os logs do Apoena

No Actions #337, o runner:
- compilou o Creator nativo com sucesso;
- passou nas verificações de sintaxe JavaScript;
- passou nos testes do modelo do Criador Modular;
- abriu o teste de navegador;
- falhou aguardando o texto de confirmação de salvamento;
- registrou `Timeout: Prévia pronta. Revise antes de aplicar.`.

O timeout aconteceu na espera do teste após clicar em Salvar projeto. O status permaneceu na mensagem anterior da prévia de corte inteligente.

O workflow anterior usava URL `file://` para o teste de navegador. A persistência da biblioteca usa IndexedDB e comunicação com o contexto pai, então o contexto de origem e a forma de servir os arquivos são variáveis relevantes.

## Medida já aplicada no #339

- Criado `tests/static-server.cjs`, servidor HTTP local usando módulos nativos do Node.
- Workflow inicia o servidor em `127.0.0.1:4173`.
- Teste abre a página por HTTP, em vez de `file://`.
- O workflow aguarda o servidor responder antes de abrir o navegador.
- Captura a mensagem interna do teste quando a confirmação esperada não aparece.
- Encerra o servidor em bloco `finally`.
- O teste funcional não foi removido nem convertido em teste estático.

## Próximos passos orientados pela pesquisa

1. Aguardar a execução #339 e verificar se o salvamento e as etapas seguintes passam.
2. Se falhar, ler a mensagem de erro extraída do elemento `#result`, o DOM capturado, o stderr do navegador e os logs do servidor.
3. Se a falha continuar, substituir a sincronização baseada em `--dump-dom` por automação com Playwright ou Selenium, aguardando explicitamente o estado final do teste e coletando console/page errors.
4. Instrumentar a biblioteca para registrar início, sucesso, erro, nome do banco, versão, stores e transação, sem registrar dados privados dos projetos.
5. Adicionar teste isolado de IndexedDB em localhost, com criação, gravação, leitura e reabertura do banco.
6. Manter os testes de ponta a ponta do editor e a validação dos demais módulos.
7. Não desativar a etapa e não mesclar a PR enquanto o workflow completo não terminar em sucesso.

## Estado

**Pesquisa externa concluída. Correção HTTP implementada e aguardando validação do Actions #339.**

A pesquisa fortalece a hipótese de incompatibilidade de contexto `file://`/IndexedDB e confirma a adequação de localhost como ambiente de teste. Ainda não é possível declarar a causa raiz definitivamente confirmada.
