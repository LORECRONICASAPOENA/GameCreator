#!/usr/bin/env python3
"""Publica o Game Creator v4.0 como única página principal, com Pixel Art nativo.
Preserva os 17 scripts e os cadastros da fonte original."""
from pathlib import Path
import hashlib
import re
root=Path(__file__).resolve().parent.parent
src=root/'APOENA_GAME_CREATOR_V4_0_BANCADA_INTEGRADA.html'
out=root/'index.html'
assert src.is_file(), 'A fonte completa v4.0 não está no GitHub'
html=src.read_text(encoding='utf-8-sig')
if not html.strip():
    loader = out.read_text(encoding='utf-8-sig')
    part_path = root/'bundle-v4'/'parte_023.js'
    assert part_path.is_file(), 'Bundle v4 ausente'
    part = part_path.read_text(encoding='utf-8-sig')
    required = (
        'map-editor/terrain-system.js',
        'map-editor/world-object-system.js',
        'map-editor/modulo-integrado.js',
        'pixel-art/natureza.js',
        'pixel-art/modulo-integrado.js',
        'pixel-art/ponte-creator.js',
    )
    for module in required:
        assert module in part, f'Módulo ausente no bundle: {module}'
        assert (root/module).is_file(), f'Arquivo de módulo não encontrado: {module}'
    assert 'full.length!==16324808' in loader, 'Integridade do loader não corresponde ao bundle atualizado'
    print('Fonte monolítica vazia; bundle-v4 validado. index.html foi preservado.')
    raise SystemExit(0)
nav_match = re.search(r'(?is)<nav\\b[^>]*>.*?data-page="controles".*?</nav>', html)
assert nav_match, 'Menu principal com a aba Controles não foi encontrado'
assert 'data-page="pixelart"' not in html, 'A fonte já contém Pixel Art'
assert html.count('</main>')>=1 and html.count('</body>')==1
html=html.replace('Game Creator v3.9.2 — Editor Visual Livre','Game Creator v4.0 — Editor Integrado',1)
html=html.replace('— Game Creator v3.9.2','— Game Creator v4.0',1)
nav_html = nav_match.group(0)
nav_new = nav_html.replace('</nav>','<button class="tab" data-page="pixelart">▧ Pixel Art • Personagens / Objetos / Mapas</button></nav>',1)
html = html[:nav_match.start()] + nav_new + html[nav_match.end():]
html=html.replace('</main>','<section class="page" id="page-pixelart"><div id="gc40PixelRoot"><div class="panel"><h2>Pixel Art</h2><p>Carregando personagens, objetos e mapas...</p></div></div></section>\n</main>',1)
imports='\n<script src="map-editor/terrain-system.js"></script>\n<script src="map-editor/world-object-system.js"></script>\n<script src="map-editor/modulo-integrado.js"></script>\n<script src="pixel-art/natureza.js"></script>\n<script src="pixel-art/modulo-integrado.js"></script>\n<script src="pixel-art/ponte-creator.js"></script>\n'
html=html.replace('</body>',imports+'</body>',1)
assert '<iframe' not in html, 'Editor integrado não utiliza iframe'
assert html.count('id="page-pixelart"')==1
for path in ('map-editor/terrain-system.js','map-editor/world-object-system.js','map-editor/modulo-integrado.js','pixel-art/natureza.js','pixel-art/modulo-integrado.js','pixel-art/ponte-creator.js'):
 assert (root/path).is_file(), f'Módulo integrado não encontrado: {path}'
out.write_text(html,encoding='utf-8')
print('Editor v4.0 integrado e pronto:',out.stat().st_size,hashlib.sha256(out.read_bytes()).hexdigest())
