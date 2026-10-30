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
