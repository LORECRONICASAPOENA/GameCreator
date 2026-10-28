# APOENA v4.0 - Gerar unico index.html nativo no Windows 10/11.
# Mantem o original intacto; nao usa iframes.
$ErrorActionPreference = 'Stop'
$repo = (Resolve-Path (Join-Path $PSScriptRoot '..')).Path
$orig = Join-Path $repo 'APOENA_GAME_CREATOR_V4_0_BANCADA_INTEGRADA.html'
$index = Join-Path $repo 'index.html'
if (-not (Test-Path $orig)) { throw "Falta a v4.0 original: $orig" }
foreach($mod in @('pixel-art\modulo-integrado.js','pixel-art\ponte-creator.js','map-editor\modulo-integrado.js')) {
  if(-not (Test-Path (Join-Path $repo $mod))) {throw "Modulo Pixel Art ausente: $mod"}
}
$s=[System.IO.File]::ReadAllText($orig,[System.Text.Encoding]::UTF8)
$old='<button class="tab" data-page="controles">🎮 Controles PC / Android</button></nav>'
if(-not $s.Contains($old)) {throw "Menu original mudou; nao sera substituido"}
if($s.Contains('data-page="pixelart"')) {throw "A fonte ja contem Pixel Art"}
$s=$s.Replace('Game Creator v3.9.2 — Editor Visual Livre','Game Creator v4.0 — Editor Integrado')
$s=$s.Replace('— Game Creator v3.9.2','— Game Creator v4.0')
$s=$s.Replace($old,$old.Replace('</nav>','<button class="tab" data-page="pixelart">▧ Pixel Art • Personagens / Objetos / Mapas</button></nav>'))
$pg='<section class="page" id="page-pixelart"><div id="gc40PixelRoot"><div class="panel"><h2>Pixel Art</h2><p>Carregando personagens, objetos e mapas...</p></div></div></section>'
$s=[regex]::new('</main>').Replace($s,$pg+"</main>",1)
$tags='<script src="map-editor/modulo-integrado.js"></script>' + [Environment]::NewLine + '<script src="pixel-art/modulo-integrado.js"></script>' + [Environment]::NewLine + '<script src="pixel-art/ponte-creator.js"></script>' + [Environment]::NewLine
$s=[regex]::new('</body>').Replace($s,$tags+'</body>',1)
if(-not $s.Contains('id="page-pixelart"') -or $s.Contains('<iframe')) {throw "Falha na integracao"}
[System.IO.File]::WriteAllText($index,$s,(New-Object System.Text.UTF8Encoding($false)))
Write-Host "Game Creator v4.0 unificado em: $index"
