# APOENA v4.0 - Gerar unico index.html nativo no Windows 10/11.
# Mantem o original intacto; nao usa iframes.
$ErrorActionPreference = 'Stop'
$repo = (Resolve-Path (Join-Path $PSScriptRoot '..')).Path
$orig = Join-Path $repo 'APOENA_GAME_CREATOR_V4_0_BANCADA_INTEGRADA.html'
$index = Join-Path $repo 'index.html'
if (-not (Test-Path $orig)) { throw "Falta a v4.0 original: $orig" }
foreach($mod in @('shared\asset-library.js','shared\creator-bridge.js','pixel-art\natureza.js','pixel-art\modulo-integrado.js','pixel-art\ponte-creator.js','map-editor\terrain-system.js','map-editor\world-object-system.js','map-editor\modulo-integrado.js')) {
  if(-not (Test-Path (Join-Path $repo $mod))) {throw "Modulo Pixel Art ausente: $mod"}
}
$s=[System.IO.File]::ReadAllText($orig,[System.Text.Encoding]::UTF8)
if ([string]::IsNullOrWhiteSpace($s)) {
  $loader=[System.IO.File]::ReadAllText($index,[System.Text.Encoding]::UTF8)
  $partPath=Join-Path $repo 'bundle-v4\parte_023.js'
  if (-not (Test-Path $partPath)) { throw "Bundle v4 ausente: $partPath" }
  $part=[System.IO.File]::ReadAllText($partPath,[System.Text.Encoding]::UTF8)
  foreach($required in @('map-editor/terrain-system.js','map-editor/world-object-system.js','map-editor/modulo-integrado.js','pixel-art/natureza.js','pixel-art/modulo-integrado.js','pixel-art/ponte-creator.js')) {
    if (-not $part.Contains($required)) { throw "Módulo não está incluído no bundle: $required" }
    if (-not (Test-Path (Join-Path $repo $required))) { throw "Arquivo de módulo ausente: $required" }
  }
  if (-not $loader.Contains('full.length!==16324808')) { throw "Integridade do loader não corresponde ao bundle atualizado." }
  Write-Host "Fonte monolítica vazia; bundle-v4 validado. O index.html não foi sobrescrito."
  return
}
$s=[regex]::Replace($s,'<title>[^<]*</title>','<title>Apoena Game Creator v4.0 - Editor Integrado</title>',1)
$s=$s.Replace('v3.9.2','v4.0')
if(-not $s.Contains('</main>') -or ([regex]::Matches($s,'</body>')).Count -ne 1) {throw "Fonte V4.0 incompleta: tags de fechamento inesperadas"}
$menuPattern='(?s)<button\b[^>]*data-page="controles"[^>]*>.*?</button>\s*</nav>'
$menuMatches=[regex]::Matches($s,$menuPattern)
if($menuMatches.Count -ne 1) {throw "Nao foi possivel identificar de forma inequivoca o fim do menu original"}
$menuMatch=$menuMatches[0]
if($s.Contains('data-page="pixelart"')) {throw "A fonte ja contem Pixel Art"}
$menuOriginal=$menuMatch.Value
$pixelArtLabel=([char]0x25A7).ToString()+' Pixel Art '+([char]0x2022).ToString()+' Personagens / Objetos / Mapas'
$pixelArtButton='<button class="tab" data-page="pixelart">'+$pixelArtLabel+'</button>'
$menuNovo=$menuOriginal.Replace('</nav>',$pixelArtButton+'</nav>')
$s=$s.Substring(0,$menuMatch.Index)+$menuNovo+$s.Substring($menuMatch.Index+$menuMatch.Length)
$finalMenuPattern='(?s)<button\b[^>]*data-page="controles"[^>]*>.*?</button>\s*<button\b[^>]*data-page="pixelart"[^>]*>.*?</button>\s*</nav>'
if([regex]::Matches($s,$finalMenuPattern).Count -ne 1 -or ([regex]::Matches($s,'data-page="pixelart"')).Count -ne 1) {throw "Navegacao de Controles/Pixel Art invalida apos build"}
$navStart=$s.LastIndexOf('<nav',$menuMatch.Index)
$navEnd=$s.IndexOf('</nav>',$menuMatch.Index)+6
if($navStart -lt 0 -or $navEnd -lt 6) {throw "Menu principal ausente apos build"}
$menuText=$s.Substring($navStart,$navEnd-$navStart)
$expectedPixelLabel=([char]0x25A7).ToString()+' Pixel Art '+([char]0x2022).ToString()+' Personagens / Objetos / Mapas'
if(-not $s.Contains('<title>Apoena Game Creator v4.0 - Editor Integrado</title>') -or -not $menuText.Contains($expectedPixelLabel)) {throw "Titulo ou rotulo Pixel Art invalido por codificacao."}
$pg='<section class="page" id="page-pixelart"><div id="gc40PixelRoot"><div class="panel"><h2>Pixel Art</h2><p>Carregando personagens, objetos e mapas...</p></div></div></section>'
$s=[regex]::new('</main>').Replace($s,$pg+"</main>",1)
$tags='<script src="shared/asset-library.js"></script>' + [Environment]::NewLine + '<script src="shared/creator-bridge.js"></script>' + [Environment]::NewLine + '<script src="map-editor/terrain-system.js"></script>' + [Environment]::NewLine + '<script src="map-editor/world-object-system.js"></script>' + [Environment]::NewLine + '<script src="map-editor/modulo-integrado.js"></script>' + [Environment]::NewLine + '<script src="pixel-art/natureza.js"></script>' + [Environment]::NewLine + '<script src="pixel-art/modulo-integrado.js"></script>' + [Environment]::NewLine + '<script src="pixel-art/ponte-creator.js"></script>' + [Environment]::NewLine
$s=[regex]::new('</body>').Replace($s,$tags+'</body>',1)
if(-not $s.Contains('id="page-pixelart"') -or $s.Contains('<iframe')) {throw "Falha na integracao"}
[System.IO.File]::WriteAllText($index,$s,(New-Object System.Text.UTF8Encoding($false)))
Write-Host "Game Creator v4.0 unificado em: $index"
