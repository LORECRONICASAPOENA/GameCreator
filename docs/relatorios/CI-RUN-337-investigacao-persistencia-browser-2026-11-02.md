# Investigação e correção — GitHub Actions #337

**Projeto:** Apoena GameCreator  
**Workflow:** `.github/workflows/pixel-art.yml`  
**Execução:** [#337](https://github.com/apoenalore/GameCreator/actions/runs/41546080697)  
**Branch:** `feat/apoena-modular-character-creator-integration`  
**Commit testado:** `e097fd5a58ff29ce081d31e2dbfa33934c017c75`

## 1. Resultado observado

A execução #337 repetiu a falha da #336 na etapa **Testar Criador Modular no navegador**. As verificações de build, sintaxe JavaScript e modelo do Criador Modular passaram. O artefato `v41-ci-diagnostics` foi baixado e inspecionado.

O arquivo `characters-browser.html` registrou:

```
FAIL: Error: Timeout: Prévia pronta. Revise antes de aplicar.
at async document.getElementById.onload (...personagens-browser.html:21:96)
```

A linha 21 do teste aguarda o status de confirmação depois de clicar em **Salvar projeto**. A mensagem anterior continuou visível até o timeout. O log do navegador não registrou erro de renderização que explicasse a falha.

## 2. O que foi descartado

- O build nativo não é a causa: passou.
- A sintaxe dos módulos não é a causa: passou.
- O modelo e os contratos básicos do personagem não são a causa: passaram.
- O aviso de Node.js 20 e os avisos internos do Edge não são a causa: aparecem fora da etapa funcional que falha.
- A primeira alteração de fila assíncrona (`e097fd5`) não resolveu a falha observada; ela permanece no código, mas não deve ser considerada a correção raiz.

## 3. Hipótese técnica principal

O teste funcional abria `tests/personagens-browser.html` diretamente por URL `file://`. O fluxo de salvamento usa `ApoenaLibrary.saveProject`, que encaminha a operação ao contexto pai e depende de IndexedDB.

IndexedDB e armazenamento sob `file://` não são um ambiente de teste portátil e consistente entre navegadores/versões. O timeout exatamente no salvamento, sem confirmação nem erro útil na interface, é compatível com uma operação de armazenamento que não conclui nesse contexto. O teste deve reproduzir um contexto web real, não depender de permissões especiais de arquivos locais.

**Status da hipótese:** tecnicamente fundamentada pelos sintomas e pelo desenho do teste; confirmação definitiva depende da nova execução em HTTP local.

## 4. Alterações aplicadas

### 4.1 Servidor HTTP local para testes

Novo arquivo: `tests/static-server.cjs`

- Usa apenas módulos nativos do Node.js (`http`, `fs`, `path`).
- Serve o repositório em `http://127.0.0.1:4173`.
- Define tipos MIME para HTML, JavaScript, CSS, JSON e imagens.
- Bloqueia caminhos que escapem da raiz do repositório.
- Não exige dependência adicional nem altera o servidor de produção.

### 4.2 Workflow atualizado

Arquivo: `.github/workflows/pixel-art.yml`

A etapa de navegador agora:
1. inicia o servidor local;
2. aguarda a URL do teste responder;
3. abre a página por HTTP em vez de `file://`;
4. mantém o teste funcional real no Edge/Chrome;
5. amplia o orçamento de tempo virtual para 30 segundos;
6. inclui a mensagem de falha retornada pelo teste no erro do Actions;
7. encerra o servidor em bloco `finally`, inclusive em caso de falha.

O teste não foi removido nem enfraquecido. O salvamento, a biblioteca, a persistência e a ponte com o Creator continuam sendo exercitados.

## 5. Commits desta rodada

- Servidor de teste: `85837fbe9fb46d10b2e424d29e55ebbba96146a6`
- Workflow HTTP: `52ebfd6c84c6781ece7f79f5293359bc55d5789c`

## 6. Critérios para encerrar o incidente

Não marcar como resolvido até que uma execução nova comprove:
- importação da imagem e montagem da camada;
- aplicação da malha;
- borracha, desfazer e refazer;
- prévia e cancelamento do corte inteligente;
- salvamento do projeto editável;
- gravação de spritesheet na biblioteca;
- envio ao Creator pela ponte;
- navegação de quadros e reprodução;
- abertura do projeto salvo e restauração da edição;
- limpeza dos dados temporários do teste;
- job completo com conclusão `success`.

Se o teste ainda falhar, usar a mensagem detalhada incluída no erro e o artefato `.ci-results/characters-browser.html` para localizar a próxima causa. Não desativar a etapa, não substituir o teste funcional por uma checagem estática e não mesclar a PR enquanto o job estiver vermelho.

## 7. Estado ao publicar este relatório

As alterações foram enviadas à branch de integração e devem disparar uma nova execução do workflow. A causa raiz ainda está **em validação**. Este relatório registra a hipótese e a intervenção, não declara sucesso antes da evidência do runner.
