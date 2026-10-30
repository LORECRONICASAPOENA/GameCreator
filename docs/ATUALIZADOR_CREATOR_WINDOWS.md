# Atualizador incremental do GameCreator (Windows)

Estado: implementacao em branch de trabalho; NAO VALIDADO em Windows do autor.

## Instalacao inicial (uma vez)

1. Na instalacao antiga, abra Biblioteca e exporte o backup antes de migrar. Ela utiliza IndexedDB do navegador; esses dados nao ficam automaticamente no GitHub e podem depender da origem/caminho do arquivo.
2. Baixe e extraia o ZIP do repositorio privado apenas na primeira vez. Execute ATUALIZAR_CREATOR.cmd na pasta extraida.
3. Escolha a pasta definitiva quando solicitado. Sugestao: C:\ApoenaHub\GAME CREATOR\APP. Nao escolha C:\ApoenaHub\GAME CREATOR\RUNNER nem a pasta que contem o runner.
4. E necessario ter Git for Windows e fazer login com a conta que possui acesso ao repositorio privado. Nao inserir credenciais nos scripts.
5. Depois de instalar, abra o editor com ABRIR_GAME_CREATOR.cmd na pasta definitiva. Verifique sua biblioteca/backup antes de apagar a instalacao antiga. Apague a pasta temporaria ZIP manualmente depois de verificar.

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

A instalacao permanente usa clone parcial do Git (--filter=blob:none) e sparse-checkout com uma lista positiva de arquivos de runtime. O manifesto mantem o launcher, a pagina integrada, os modulos JS/HTML/JSON necessarios, a biblioteca e os arquivos de integracao Godot utilizados pelo Creator.

**Ficam fora da pasta APP:** docs/, tests/, .github/, legacy/, historico/, AGENTS.md, README, auditorias, relatorios, bases de erros, planos, documentos de requisitos e arquivos exclusivos de desenvolvimento.

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
