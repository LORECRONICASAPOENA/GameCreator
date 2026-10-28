$ErrorActionPreference = 'Stop'
$src = Split-Path -Parent $MyInvocation.MyCommand.Path
$dest = Join-Path (Split-Path -Parent $src) 'GameCreator_GitHub'
$repo = 'https://github.com/apoenalore/GameCreator.git'
Write-Host ''
Write-Host 'APOENA GAME CREATOR - PUBLICACAO GITHUB' -ForegroundColor Cyan
Write-Host ('Origem: ' + $src)
Write-Host ('Destino: ' + $repo)
Write-Host 'ATENCAO: O repositorio e PUBLICO. Seus arquivos ficarao visiveis no GitHub.' -ForegroundColor Yellow
$git = Get-Command git -ErrorAction SilentlyContinue
if (-not $git) {
  $where = 'C:\Program Files\Git\cmd\git.exe'
  if (Test-Path $where) { $git = @{Source=$where} }
}
if (-not $git) { throw 'Git nao encontrado. Instale Git for Windows antes de executar.' }
$exe = $git.Source
if (-not (Test-Path $dest)) {
  & $exe clone $repo $dest
  if ($LASTEXITCODE -ne 0) { throw 'Falha ao clonar o repositorio. Confira internet e permissao.' }
} elseif (-not (Test-Path (Join-Path $dest '.git'))) {
  throw ('A pasta ' + $dest + ' ja existe e nao e um repositorio Git. Renomeie-a e execute novamente.')
} else {
  $rem = (& $exe -C $dest remote get-url origin 2>$null)
  if ($LASTEXITCODE -ne 0 -or $rem -notmatch 'apoenalore/GameCreator') {throw 'Repositorio local nao corresponde ao GameCreator. Nenhum arquivo foi alterado.'}
  & $exe -C $dest pull --ff-only origin main
  if ($LASTEXITCODE -ne 0) {throw 'Nao foi possivel atualizar o repositorio local. Nenhum arquivo sera copiado.'}
}
Write-Host 'Copiando somente os arquivos do Game Creator...' -ForegroundColor Cyan
# O ZIP do Creator ja tem a estrutura correta; nao apaga arquivos de outros projetos.
$excludeDirs = @('.git','__pycache__','.cache','_sincronizacao_local')
$excludeFiles = @('*.tmp')
$roboArgs = @($src,$dest,'/E','/R:2','/W:2','/NFL','/NDL','/NJH','/NJS','/XD') + $excludeDirs + @('/XF') + $excludeFiles
& robocopy @roboArgs
if ($LASTEXITCODE -ge 8) {throw 'Erro na copia dos arquivos (Robocopy).'}
& $exe -C $dest add -A
if ($LASTEXITCODE -ne 0) {throw 'Falha ao preparar arquivos no Git.'}
$changes = (& $exe -C $dest status --porcelain)
if (-not $changes) {Write-Host 'Repositorio sincronizado: nada novo para enviar.' -ForegroundColor Green; exit 0}
$authorName=(& $exe -C $dest config user.name)
$authorEmail=(& $exe -C $dest config user.email)
if (-not $authorName) { & $exe -C $dest config user.name 'apoenalore' }
if (-not $authorEmail) { & $exe -C $dest config user.email 'apoenalore@users.noreply.github.com' }
& $exe -C $dest commit -m 'Importar Apoena Game Creator v3.9, fabrica de itens e recursos oficiais'
if ($LASTEXITCODE -ne 0) {throw 'Falha ao gravar alteracoes localmente.'}
Write-Host 'Enviando para o GitHub... Pode ser solicitado login na primeira vez.' -ForegroundColor Cyan
& $exe -C $dest push origin HEAD:main
if ($LASTEXITCODE -ne 0) {throw 'Falha ao enviar. Os arquivos estao salvos em GameCreator_GitHub. Confira o login/credenciais e tente novamente.'}
Write-Host ''
Write-Host 'PUBLICACAO CONCLUIDA!' -ForegroundColor Green
Write-Host 'https://github.com/apoenalore/GameCreator' -ForegroundColor Cyan
