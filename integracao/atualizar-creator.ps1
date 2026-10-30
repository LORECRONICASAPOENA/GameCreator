# Atualizador conservador do Apoena GameCreator para Windows PowerShell 5.1+.
# Usa clone parcial + sparse-checkout: instala somente os arquivos de runtime.
# Nao apaga arquivos pessoais, documentos locais ou o runner.
param([string]$Destino = "")

$ErrorActionPreference = 'Stop'
$repositorio = 'https://github.com/apoenalore/GameCreator.git'
$pastaConfig = Join-Path $env:LOCALAPPDATA 'Apoena\GameCreator'
$arquivoDestino = Join-Path $pastaConfig 'instalacao.txt'
$arquivoLog = Join-Path $pastaConfig 'atualizacao.log'

# Lista positiva: tudo que nao estiver aqui fica fora da instalacao local.
# Em legacy, manter somente o editor original da fabrica e as partes JS referenciadas pela pagina de integracao.
$runtimePatterns = @(
    '/ABRIR_GAME_CREATOR.cmd',
    '/ATUALIZAR_CREATOR.cmd',
    '/APOENA_GAME_CREATOR_V4_0_BANCADA_INTEGRADA.html',
    '/index.html',
    '/bundle-v4/*.js',
    '/integracao/build_unificado.ps1',
    '/integracao/atualizar-creator.ps1',
    '/integracao/index.html',
    '/integracao/catalogo.js',
    '/integracao/godot/ApoenaCatalogo.gd',
    '/integracao/godot/project.godot',
    '/integracao/godot/dados/apoena_catalogo.json',
    '/legacy/abrir-editor-v3.9.html',
    '/legacy/v3_9_parts/*.js',
    '/shared/*.js',
    '/biblioteca/*.html',
    '/map-editor/*.js',
    '/map-editor/*.html',
    '/pixel-art/*.js',
    '/pixel-art/*.html',
    '/pixel-art/*.json'
)

$arquivosEssenciais = @(
    'ABRIR_GAME_CREATOR.cmd',
    'ATUALIZAR_CREATOR.cmd',
    'APOENA_GAME_CREATOR_V4_0_BANCADA_INTEGRADA.html',
    'index.html',
    'integracao/build_unificado.ps1',
    'integracao/atualizar-creator.ps1',
    'integracao/index.html',
    'integracao/catalogo.js',
    'integracao/godot/ApoenaCatalogo.gd',
    'integracao/godot/project.godot',
    'integracao/godot/dados/apoena_catalogo.json',
    'legacy/abrir-editor-v3.9.html',
    'shared/asset-library.js',
    'shared/creator-bridge.js',
    'shared/library-backup.js',
    'shared/tileset-check.js',
    'map-editor/terrain-system.js',
    'map-editor/world-object-system.js',
    'map-editor/modulo-integrado.js',
    'pixel-art/natureza.js',
    'pixel-art/modulo-integrado.js',
    'pixel-art/ponte-creator.js',
    'pixel-art/corte-inteligente.js',
    'pixel-art/estudio.js',
    'pixel-art/objetos.js',
    'pixel-art/catalogo_assets_agar.json',
    'biblioteca/index.html',
    'map-editor/index.html',
    'pixel-art/index.html',
    'pixel-art/estudio.html'
)
$arquivosEssenciais += @(0..23 | ForEach-Object { 'bundle-v4/parte_{0:D3}.js' -f $_ })
$arquivosEssenciais += @(0..22 | ForEach-Object { 'legacy/v3_9_parts/parte_{0:D3}.js' -f $_ })

# Impede que um arquivo ignorado do usuario seja substituido por um arquivo do Creator.
$regexRuntime = '^(ABRIR_GAME_CREATOR\.cmd|ATUALIZAR_CREATOR\.cmd|APOENA_GAME_CREATOR_V4_0_BANCADA_INTEGRADA\.html|index\.html|bundle-v4/.*\.js|integracao/(index\.html|catalogo\.js|build_unificado\.ps1|atualizar-creator\.ps1|godot/(ApoenaCatalogo\.gd|project\.godot|dados/apoena_catalogo\.json))|legacy/(abrir-editor-v3\.9\.html|v3_9_parts/.*\.js)|shared/.*\.js|biblioteca/.*\.(html|js|json)|map-editor/.*\.(js|html|json)|pixel-art/.*\.(js|html|json))$'

function Registrar([string]$Mensagem) {
    $linha = ('{0} horario local | {1}' -f (Get-Date -Format 'yyyy-MM-dd HH:mm:ss zzz'), $Mensagem)
    Write-Host $linha
    Add-Content -LiteralPath $arquivoLog -Value $linha -Encoding UTF8
}

function VerificarConflitosLocais([string]$Referencia) {
    $rastreados = @(& $git.Source -C $Destino ls-tree -r --name-only $Referencia)
    if ($LASTEXITCODE -ne 0) { throw "Nao foi possivel inspecionar os arquivos de $Referencia." }

    $runtime = @($rastreados | Where-Object { $_ -match $regexRuntime })
    $runtimeSet = @{}
    foreach ($caminho in $runtime) { $runtimeSet[$caminho] = $true }

    # Untracked nao ignorados e ignorados podem ser sobrescritos por read-tree/merge.
    $naoRastreados = @(& $git.Source -C $Destino ls-files --others --exclude-standard)
    if ($LASTEXITCODE -ne 0) { throw 'Nao foi possivel verificar arquivos locais nao rastreados.' }

    $ignorados = @(& $git.Source -C $Destino ls-files --others --ignored --exclude-standard)
    if ($LASTEXITCODE -ne 0) { throw 'Nao foi possivel verificar arquivos locais ignorados.' }

    $arquivosLocais = @($naoRastreados + $ignorados | Sort-Object -Unique)
    $conflitos = @()
    foreach ($caminho in $arquivosLocais) {
        if ($runtimeSet.ContainsKey($caminho)) { $conflitos += $caminho }
    }
    if ($conflitos.Count -gt 0) {
        throw ('Atualizacao bloqueada: arquivo(s) local(is) conflitam com arquivos do Creator: ' + ($conflitos -join ', '))
    }
}

try {
    New-Item -ItemType Directory -Force -Path $pastaConfig | Out-Null
    $git = Get-Command git.exe -ErrorAction SilentlyContinue
    if (-not $git) {
        throw 'Git para Windows nao encontrado. Instale o Git e abra este CMD novamente. Nao e necessario instalar Node.js.'
    }

    $versaoTexto = (& $git.Source --version 2>&1 | Out-String).Trim()
    $versaoMatch = [regex]::Match($versaoTexto, '(\d+)\.(\d+)\.(\d+)')
    if (-not $versaoMatch.Success) { throw "Nao foi possivel identificar a versao do Git: $versaoTexto" }
    $versaoGit = [version]$versaoMatch.Groups[0].Value
    if ($versaoGit -lt [version]'2.25.0') {
        throw "Git 2.25 ou superior e necessario para o checkout enxuto. Versao encontrada: $versaoTexto"
    }

    if ([string]::IsNullOrWhiteSpace($Destino)) {
        if (Test-Path -LiteralPath $arquivoDestino) {
            $Destino = (Get-Content -LiteralPath $arquivoDestino -Raw).Trim()
        } else {
            $sugerido = Join-Path ($env:SystemDrive + '\') 'ApoenaHub\GAME CREATOR\APP'
            Write-Host "Pasta permanente sugerida: $sugerido"
            $resposta = Read-Host 'Primeira instalacao: Enter para aceitar ou digite o caminho absoluto completo'
            if ([string]::IsNullOrWhiteSpace($resposta)) {
                $Destino = $sugerido
            } else {
                $Destino = $resposta
            }
        }
    }

    $Destino = $Destino.Trim().Trim([char]34)
    if (-not [IO.Path]::IsPathRooted($Destino)) {
        throw 'O destino precisa ser um caminho absoluto, por exemplo C:\ApoenaHub\GAME CREATOR\APP. Caminhos relativos podem ficar dentro da pasta ZIP temporaria.'
    }
    $Destino = [IO.Path]::GetFullPath($Destino)

    $raiz = [IO.Path]::GetPathRoot($Destino)
    if ($Destino.TrimEnd('\') -eq $raiz.TrimEnd('\')) {
        throw 'Escolha uma subpasta especifica para o aplicativo, nunca a raiz do disco.'
    }
    if ($Destino -match '(?i)(^|\\)RUNNER(\\|$)') {
        throw 'A pasta RUNNER e reservada ao GitHub Actions. Escolha outra pasta.'
    }
    if (Test-Path -LiteralPath (Join-Path $Destino 'RUNNER')) {
        throw 'A pasta escolhida contem o RUNNER. Use uma subpasta APP separada.'
    }

    $novoClone = $false
    if (-not (Test-Path -LiteralPath $Destino)) {
        $pai = Split-Path -Parent $Destino
        New-Item -ItemType Directory -Force -Path $pai | Out-Null
        $novoClone = $true
    } elseif (-not (Test-Path -LiteralPath (Join-Path $Destino '.git'))) {
        $conteudoExistente = @(Get-ChildItem -LiteralPath $Destino -Force -ErrorAction SilentlyContinue)
        if ($conteudoExistente.Count -gt 0) {
            throw 'O destino ja existe, contem arquivos e nao e um clone Git. Nao vou copiar por cima de arquivos pessoais.'
        }
        $novoClone = $true
    }

    Registrar "Inicio; instalacao: $Destino"
    if ($novoClone) {
        Registrar 'Primeira instalacao: clone parcial sem checkout inicial; documentos e blobs fora do runtime nao serao baixados.'
        & $git.Source clone --filter=blob:none --depth 1 --single-branch --branch main --no-checkout $repositorio $Destino
        if ($LASTEXITCODE -ne 0) {
            throw 'Clone parcial falhou. Confirme a conexao e o login GitHub. Nenhuma instalacao existente foi sobrescrita.'
        }
    }

    $raizGit = (& $git.Source -C $Destino rev-parse --show-toplevel)
    if ($LASTEXITCODE -ne 0 -or [string]::IsNullOrWhiteSpace($raizGit)) {
        throw 'Pasta nao reconhecida como repositorio Git.'
    }
    if ([IO.Path]::GetFullPath($raizGit.Trim()).TrimEnd('\') -ine $Destino.TrimEnd('\')) {
        throw 'O destino nao e a raiz do repositorio. Abortado para proteger outras pastas.'
    }

    $origem = (& $git.Source -C $Destino remote get-url origin)
    if ($LASTEXITCODE -ne 0 -or ($origem.Trim() -notmatch '^(https://github\.com/apoenalore/GameCreator(\.git)?/?|git@github\.com:apoenalore/GameCreator(\.git)?)$')) {
        throw 'O remote origin nao e o GameCreator oficial. Atualizacao bloqueada.'
    }

    $branch = (& $git.Source -C $Destino symbolic-ref --quiet --short HEAD 2>$null)
    if ($LASTEXITCODE -ne 0 -or $branch.Trim() -cne 'main') {
        throw 'Instalacao fora da branch main. Atualizacao bloqueada para nao substituir trabalho de desenvolvimento.'
    }

    if (-not $novoClone) {
        $modificados = @(& $git.Source -C $Destino status --porcelain --untracked-files=no)
        if ($LASTEXITCODE -ne 0) { throw 'Nao foi possivel verificar alteracoes locais.' }
        if (-not [string]::IsNullOrWhiteSpace(($modificados -join ''))) {
            throw 'Existem arquivos rastreados modificados localmente. Salve o trabalho antes de atualizar; nao farei reset nem sobrescrita.'
        }
        VerificarConflitosLocais 'HEAD'
    }

    # Mantem apenas os arquivos necessarios para abrir e usar o Creator.
    # Em uma instalacao antiga, documentos rastreados saem da pasta APP, mas nao sao apagados do historico Git.
    & $git.Source -C $Destino config remote.origin.promisor true
    if ($LASTEXITCODE -ne 0) { throw 'Nao foi possivel configurar o clone parcial.' }
    & $git.Source -C $Destino config remote.origin.partialclonefilter blob:none
    if ($LASTEXITCODE -ne 0) { throw 'Nao foi possivel configurar o filtro de blobs.' }
    & $git.Source -C $Destino sparse-checkout set --no-cone $runtimePatterns
    if ($LASTEXITCODE -ne 0) { throw 'Nao foi possivel aplicar o manifesto de arquivos de runtime. Atualizacao interrompida.' }

    # Confere antes de qualquer merge se todos os arquivos essenciais estao cobertos pelo sparse-checkout.
    $incluidos = @($arquivosEssenciais | & $git.Source -C $Destino sparse-checkout check-rules --no-cone)
    if ($LASTEXITCODE -ne 0) { throw 'Nao foi possivel validar as regras do sparse-checkout.' }
    $incluidosSet = @{}
    foreach ($caminho in $incluidos) { $incluidosSet[$caminho.Trim()] = $true }
    $foraDoManifesto = @($arquivosEssenciais | Where-Object { -not $incluidosSet.ContainsKey($_) })
    if ($foraDoManifesto.Count -gt 0) {
        throw ('Sparse-checkout nao inclui todos os arquivos essenciais: ' + ($foraDoManifesto -join ', '))
    }

    # Clone com --no-checkout deixa o worktree vazio; materializa apenas os caminhos permitidos.
    # A checagem de conflitos vem antes porque read-tree pode substituir arquivos locais no caminho.
    VerificarConflitosLocais 'HEAD'
    & $git.Source -C $Destino read-tree -mu HEAD
    if ($LASTEXITCODE -ne 0) { throw 'Nao foi possivel materializar os arquivos de runtime com seguranca.' }

    $anterior = (& $git.Source -C $Destino rev-parse HEAD).Trim()
    if ($LASTEXITCODE -ne 0) { throw 'Nao foi possivel identificar a versao instalada.' }
    Registrar "Versao instalada antes: $anterior"
    Registrar 'Checkout enxuto ativo: docs, testes, workflows, legado e documentos de desenvolvimento ficam fora da pasta APP.'

    Registrar 'Buscando somente blobs necessarios ao runtime...'
    & $git.Source -C $Destino fetch --no-tags --filter=blob:none origin '+refs/heads/main:refs/remotes/origin/main'
    if ($LASTEXITCODE -ne 0) { throw 'Falha ao buscar alteracoes. Versao local mantida.' }

    $arquivosRemotos = @(& $git.Source -C $Destino ls-tree -r --name-only refs/remotes/origin/main)
    if ($LASTEXITCODE -ne 0) { throw 'Nao foi possivel verificar o manifesto remoto.' }
    $faltantes = @($arquivosEssenciais | Where-Object { $arquivosRemotos -notcontains $_ })
    if ($faltantes.Count -gt 0) {
        throw ('Versao remota sem arquivo(s) essencial(is): ' + ($faltantes -join ', ') + '. Nenhuma atualizacao foi aplicada.')
    }

    VerificarConflitosLocais 'refs/remotes/origin/main'

    $remoto = (& $git.Source -C $Destino rev-parse refs/remotes/origin/main).Trim()
    if ($LASTEXITCODE -ne 0) { throw 'Nao foi possivel identificar a versao remota.' }

    if ($remoto -eq $anterior) {
        Registrar "SEM MUDANCAS: ja esta na versao $anterior. Referencia anterior preservada."
    } else {
        & $git.Source -C $Destino merge-base --is-ancestor HEAD refs/remotes/origin/main
        if ($LASTEXITCODE -ne 0) {
            throw 'A instalacao divergiu da main. Atualizacao bloqueada; nenhum reset, rebase ou descarte foi executado.'
        }

        # Preserva a revisao anterior somente quando existe uma atualizacao real.
        & $git.Source -C $Destino update-ref refs/apoena/anterior $anterior
        if ($LASTEXITCODE -ne 0) { throw 'Nao foi possivel preservar a referencia da versao anterior.' }

        & $git.Source -C $Destino merge --no-overwrite-ignore --ff-only refs/remotes/origin/main
        if ($LASTEXITCODE -ne 0) {
            throw 'Nao foi possivel aplicar atualizacao fast-forward. Verifique conflitos; arquivos ignorados nao serao sobrescritos.'
        }
        Registrar "ATUALIZADO: $anterior -> $remoto"
    }

    foreach ($item in $arquivosEssenciais) {
        if (-not (Test-Path -LiteralPath (Join-Path $Destino $item))) {
            throw "Arquivo essencial ausente apos atualizar: $item. A referencia anterior permanece em refs/apoena/anterior."
        }
    }

    $atual = (& $git.Source -C $Destino rev-parse HEAD).Trim()
    if ($LASTEXITCODE -ne 0) { throw 'Falha ao ler commit instalado.' }
    Set-Content -LiteralPath $arquivoDestino -Value $Destino -Encoding UTF8
    Registrar "Concluido; commit instalado: $atual"
    Registrar "Para abrir: $Destino\ABRIR_GAME_CREATOR.cmd"
    Write-Host ''
    Write-Host 'Somente arquivos de runtime foram mantidos na pasta APP.'
    Write-Host 'Documentos internos continuam no repositorio privado e nao foram incluidos na instalacao.'
    Write-Host 'A biblioteca do navegador/IndexedDB e independente do Git. Faca backup pela tela Biblioteca antes de trocar de navegador/perfil.'
    exit 0
} catch {
    if (Test-Path -LiteralPath $pastaConfig) {
        Registrar ("ERRO: " + $_.Exception.Message)
    }
    Write-Host ("ERRO: " + $_.Exception.Message)
    Write-Host 'O atualizador nao executou reset, clean nem apagou a pasta RUNNER.'
    Write-Host 'Em clones existentes, objetos antigos de documentos podem continuar no historico local; nao sera feita limpeza destrutiva automatica.'
    exit 1
}