# Atualizador incremental do GameCreator (Windows)

Estado: implementacao em branch de trabalho; NAO VALIDADO em Windows do autor.

## Instalacao inicial (uma vez)

1. Na instalacao antiga, abra Biblioteca e exporte o backup antes de migrar. Ela utiliza IndexedDB do navegador; esses dados nao ficam automaticamente no GitHub e podem depender da origem/caminho do arquivo.
2. Baixe somente ATUALIZAR_CREATOR.cmd e integracao/atualizar-creator.ps1 para uma pasta temporaria, mantendo a estrutura. Execute o CMD; nao baixe nem extraia o ZIP completo.
3. Escolha a pasta definitiva quando solicitado. Sugestao: C:\ApoenaHub\GAME CREATOR\APP. Nao escolha C:\ApoenaHub\GAME CREATOR\RUNNER nem a pasta que contem o runner.
4. E necessario ter Git for Windows e fazer login com a conta que possui acesso ao repositorio privado. Nao inserir credenciais nos scripts.
5. Depois de instalar, abra o editor com ABRIR_GAME_CREATOR.cmd na pasta definitiva. Verifique sua biblioteca/backup antes de apagar a instalacao antiga. Depois da verificacao, a pasta temporaria de bootstrap pode ser descartada.

O atualizador nao sobrescreve uma instalacao ZIP antiga: se o destino ja existir mas nao for um clone Git, ele interrompe. A migracao de dados pessoais exige conferencia separada.

## Atualizacoes seguintes

- Execute ATUALIZAR_CREATOR.cmd na propria pasta permanente. Nao baixe outro ZIP.
- O script verifica o repositorio de origem, branch main, alteracoes locais e arquivos essenciais.
- Faz git fetch seguido de git merge --ff-only; nunca usa reset --hard, git clean ou exclusao de pastas.
- Exibe a revisao anterior e a atual e grava um log em %LOCALAPPDATA%\Apoena\GameCreator\atualizacao.log.
- Preserva referencia Git pequena refs/apoena/anterior para apoiar eventual recuperacao, sem criar copia integral.
- Depois da atualizacao, abra ABRIR_GAME_CREATOR.cmd e teste as mudancas validadas no GitHub Actions.

## Seguranca e limitacoes

- O runner e os dados pessoais ficam fora da pasta APP. O atualizador nao modifica a pasta RUNNER.
- A biblioteca do navegador/IndexedDB nao e transportada pelo git clone. Exporte e confira restauracao antes de abandonar a instalacao antiga.
- Mudancas locais rastreadas ou conflitos com arquivos pessoais interrompem o Git em vez de descartar dados.
- Feche o Creator antes de atualizar. Uma interrupcao por falha de disco ou tela azul pode exigir recuperacao; mantenha backup confiavel dos projetos.
- O Git pode solicitar login GitHub. Nenhuma API paga, Node.js ou novo runner e instalado.
- A referencia Git da revisao anterior nao equivale a backup dos projetos nem garante rollback automatico.

## Criterios para declarar VALIDADO

Testar no Windows: primeira instalacao; atualizacao de versao na mesma pasta; repeticao sem novidades; perda de Internet; Git ausente; mudanca local rastreada; pasta existente nao Git; branch incorreta; remoto diferente; integridade do runner e da biblioteca apos migracao; log e revisoes. Confirmar execucao automatica de CI no commit correto. Ate la, estado: IMPLEMENTADO EM BRANCH / TESTE PENDENTE.


## Distribuicao enxuta: somente arquivos de runtime

A instalacao permanente usa clone parcial do Git (--filter=blob:none) e sparse-checkout com uma lista positiva de arquivos de runtime. O manifesto mantem o launcher, a pagina integrada, catalogo, modulos JS/HTML/JSON necessarios, biblioteca, arquivos de integracao Godot e a fabrica original v3.9 (pagina e 23 partes JS) referenciada pela pagina de integracao.

**Ficam fora da pasta APP:** docs/, tests/, .github/, historico/, AGENTS.md, README, auditorias, relatorios, bases de erros, planos, documentos de requisitos e arquivos exclusivos de desenvolvimento. De legacy/, entram somente `abrir-editor-v3.9.html` e `v3_9_parts/parte_000.js` a `parte_022.js`, pois a pagina integrada oferece acesso a essa fabrica original; `iniciador-anterior.html` e os demais arquivos antigos continuam fora.

### Primeira instalacao sem baixar a documentacao

Nao e necessario baixar o ZIP completo do repositorio para iniciar a instalacao. Baixe somente estes dois arquivos, mantendo a estrutura:

- ATUALIZAR_CREATOR.cmd
- integracao/atualizar-creator.ps1

Execute o CMD nessa pasta de bootstrap. Ele cria a instalacao definitiva por clone parcial e materializa somente os arquivos listados no manifesto. Depois de conferir que o Creator abre, a pasta de bootstrap pode ser descartada.

### Atualizacoes seguintes

Execute ATUALIZAR_CREATOR.cmd dentro da pasta APP. O Git busca os commits e blobs necessarios ao runtime; os documentos excluidos nao sao materializados nem baixados como blobs nas novas atualizacoes.

Em uma instalacao antiga que ja tenha recebido o repositorio completo, o sparse-checkout retira os arquivos rastreados fora do manifesto da pasta APP. Os blobs que ja estavam no banco local .git nao serao apagados automaticamente; nao usamos git gc, clean ou remocao de historico para economizar espaco sem uma decisao separada.

**Limite importante:** o repositorio apoenalore/GameCreator e privado. Este atualizador e para instalacoes autorizadas com Git autenticado. Uma distribuicao publica para terceiros devera ser gerada como pacote de release usando o mesmo manifesto, sem dar acesso ao repositorio interno.

O checkout enxuto ainda precisa de validacao em Windows real. Ate essa validacao, o estado permanece **IMPLEMENTADO EM BRANCH / NAO VALIDADO / NAO INTEGRADO NA MAIN**.


## Teste automatizado de Git em ambiente isolado

O teste \`tests/atualizador-manifest.test.cjs\` agora cria um repositório Git local temporário, sem acessar o GitHub e sem tocar na instalação do usuário. Ele verifica:

- clone parcial e sparse-checkout com os padrões reais do atualizador;
- presença de todos os arquivos essenciais;
- ausência de documentação, testes, workflows e arquivos legados não autorizados;
- atualização fast-forward e preservação da referência anterior;
- bloqueio de merge quando um arquivo ignorado do usuário conflita com um novo arquivo de runtime.

Esse teste é executado pela CI canônica do Game Creator. Ele reduz o risco do Git/sparse-checkout, mas não substitui o teste de primeira instalação e atualização no Windows do autor, nem a conferência de IndexedDB.


## Descobertas adicionais da simulação Git local

A simulação de clone parcial revelou dois comportamentos que passaram a ser tratados explicitamente:

1. Um clone feito com --no-checkout permanece sem arquivos materializados depois de sparse-checkout set --no-cone. O atualizador agora verifica as regras e executa git read-tree -mu HEAD para materializar somente os caminhos permitidos.
2. Em sparse-checkout, não é seguro confiar apenas em git merge --no-overwrite-ignore. Em uma simulação local com Git 2.47.3, o merge ainda avançou sobre caminhos ignorados/não rastreados. Por isso, o atualizador calcula previamente a interseção entre arquivos locais (ignorados e não ignorados) e arquivos de runtime da árvore remota; havendo conflito, aborta antes do read-tree/merge.

O teste automatizado reproduz o clone, a materialização, o fast-forward e a identificação dos conflitos em repositório Git temporário. A simulação foi feita em Linux com Git 2.47.3; o comportamento no runner Windows será verificado pela CI e a instalação real ainda exige teste no computador do autor.


## Requisito mínimo de Git

O atualizador exige Git for Windows 2.41.0 ou superior. Embora clone parcial e sparse-checkout básico existam desde versões anteriores, este fluxo usa o subcomando sparse-checkout check-rules para validar o manifesto antes de materializar arquivos. Esse subcomando foi incorporado posteriormente; por isso, a versão mínima do instalador foi elevada para 2.41.0. O runner atual usa uma versão mais recente.


## Proteção de arquivos ignorados fora do runtime

Antes de alterar o sparse-checkout, o atualizador verifica arquivos locais ignorados em toda a instalação. Se encontrar arquivos ignorados fora da lista positiva de runtime, interrompe a operação e pede backup ou movimentação manual. Essa interrupção preventiva evita que o Git remova dados locais ao reduzir o worktree. Arquivos não rastreados e ignorados que coincidam com caminhos de runtime também bloqueiam a atualização antes da materialização/merge.
