# Atualizador conservador do Apoena GameCreator para Windows PowerShell 5.1+.
# Usa Git, nao apaga arquivos e nunca toca no runner.
param([string]$Destino = "")

$ErrorActionPreference = 'Stop'
$repositorio = 'https://github.com/apoenalore/GameCreator.git'
$pastaConfig = Join-Path $env:LOCALAPPDATA 'Apoena\GameCreator'
$arquivoDestino = Join-Path $pastaConfig 'instalacao.txt'
$arquivoLog = Join-Path $pastaConfig 'atualizacao.log'

function Registrar([string]$Mensagem) {
    $linha = ('{0} BRT/horario local | {1}' -f (Get-Date -Format 'yyyy-MM-dd HH:mm:ss'), $Mensagem)
    Write-Host $linha
    Add-Content -LiteralPath $arquivoLog -Value $linha -Encoding UTF8
}

try {
    New-Item -ItemType Directory -Force -Path $pastaConfig | Out-Null
    $git = Get-Command git.exe -ErrorAction SilentlyContinue
    if (-not $git) {
        throw 'Git para Windows nao encontrado. Instale o Git e abra este CMD novamente. Nao e necessario instalar Node.js.'
    }

    if ([string]::IsNullOrWhiteSpace($Destino)) {
        if (Test-Path -LiteralPath $arquivoDestino) {
            $Destino = (Get-Content -LiteralPath $arquivoDestino -Raw).Trim()
        } else {
            $sugerido = Join-Path $env:SystemDrive 'ApoenaHub\GAME CREATOR\APP'
            Write-Host "Pasta permanente sugerida: $sugerido"
            $resposta = Read-Host 'Primeira instalacao: Enter para aceitar ou digite outra pasta'
            if ([string]::IsNullOrWhiteSpace($resposta)) {
                $Destino = $sugerido
            } else {
                $Destino = $resposta
            }
        }
    }

    $Destino = [IO.Path]::GetFullPath($Destino.Trim().Trim([char]34))
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

    Registrar "Inicio; instalacao: $Destino"
    if (-not (Test-Path -LiteralPath $Destino)) {
        $pai = Split-Path -Parent $Destino
        New-Item -ItemType Directory -Force -Path $pai | Out-Null
        Registrar 'Primeira instalacao: clone leve, apenas branch main.'
        & $git.Source clone --depth 1 --single-branch --branch main $repositorio $Destino
        if ($LASTEXITCODE -ne 0) {
            throw 'Clone falhou. Confirme a conexao e o login GitHub (repositorio privado). Nenhuma instalacao existente foi sobrescrita.'
        }
    } elseif (-not (Test-Path -LiteralPath (Join-Path $Destino '.git'))) {
        throw 'O destino ja existe, mas nao e um clone Git. Nao vou copiar por cima de arquivos pessoais. Escolha outra pasta vazia ou converta a instalacao separadamente.'
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
    $branch = (& $git.Source -C $Destino symbolic-ref --quiet --short HEAD)
    if ($LASTEXITCODE -ne 0 -or $branch.Trim() -cne 'main') {
        throw 'Instalacao fora da branch main. Atualizacao bloqueada para nao substituir trabalho de desenvolvimento.'
    }
    $modificados = @(& $git.Source -C $Destino status --porcelain --untracked-files=no)
    if ($LASTEXITCODE -ne 0) { throw 'Nao foi possivel verificar alteracoes locais.' }
    if (-not [string]::IsNullOrWhiteSpace(($modificados -join ''))) {
        throw 'Existem arquivos de programa modificados localmente. Salve o trabalho antes de atualizar; nao farei reset nem sobrescrita.'
    }

    $anterior = (& $git.Source -C $Destino rev-parse HEAD).Trim()
    if ($LASTEXITCODE -ne 0) { throw 'Nao foi possivel identificar a versao instalada.' }
    Registrar "Versao instalada antes: $anterior"

    # Um ponteiro Git leve permite recuperar a versao anterior sem duplicar o aplicativo.
    & $git.Source -C $Destino update-ref refs/apoena/anterior $anterior
    if ($LASTEXITCODE -ne 0) { throw 'Nao foi possivel preservar a referencia da versao anterior.' }

    Registrar 'Buscando apenas alteracoes do GitHub...'
    & $git.Source -C $Destino fetch --no-tags origin main
    if ($LASTEXITCODE -ne 0) { throw 'Falha ao buscar alteracoes. Versao local mantida.' }

    foreach ($item in @('ABRIR_GAME_CREATOR.cmd','index.html','bundle-v4/parte_023.js','shared/asset-library.js')) {
        & $git.Source -C $Destino cat-file -e ("origin/main:{0}" -f $item)
        if ($LASTEXITCODE -ne 0) { throw "Versao recebida sem arquivo essencial: $item. Nenhuma alteracao foi aplicada." }
    }

    & $git.Source -C $Destino merge --ff-only origin/main
    if ($LASTEXITCODE -ne 0) {
        throw 'Nao foi possivel aplicar atualizacao fast-forward. Verifique conflitos ou branch divergente; nenhum reset foi executado.'
    }

    foreach ($item in @('ABRIR_GAME_CREATOR.cmd','index.html','bundle-v4/parte_023.js','shared/asset-library.js')) {
        if (-not (Test-Path -LiteralPath (Join-Path $Destino $item))) {
            throw "Arquivo essencial ausente apos atualizar: $item. Versao anterior salva em refs/apoena/anterior."
        }
    }

    $atual = (& $git.Source -C $Destino rev-parse HEAD).Trim()
    if ($LASTEXITCODE -ne 0) { throw 'Falha ao ler commit instalado.' }
    Set-Content -LiteralPath $arquivoDestino -Value $Destino -Encoding UTF8
    if ($atual -eq $anterior) {
        Registrar "SEM MUDANCAS: ja esta na versao $atual"
    } else {
        Registrar "ATUALIZADO: $anterior -> $atual"
    }
    Registrar "Concluido. Para testar: $Destino\ABRIR_GAME_CREATOR.cmd"
    Write-Host ''
    Write-Host 'A biblioteca do navegador/IndexedDB e independente do Git. Faça backup pela tela Biblioteca antes de trocar de navegador/perfil.'
    exit 0
} catch {
    Registrar ("ERRO: " + $_.Exception.Message)
    Write-Host 'Log:' $arquivoLog
    Write-Host 'O atualizador nao excluiu arquivos, pastas pessoais ou runners.'
    exit 1
}
