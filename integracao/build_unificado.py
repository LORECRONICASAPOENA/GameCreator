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
html = re.sub(r'<title>[^<]*</title>', '<title>Apoena Game Creator v4.0 - Editor Integrado</title>', html, count=1)
html = html.replace('v3.9.2', 'v4.0')
menu_pattern = r'<button\b[^>]*data-page="controles"[^>]*>.*?</button>\s*</nav>'
menu_matches = list(re.finditer(menu_pattern, html, re.S))
assert len(menu_matches)==1, 'Nao foi possivel identificar de forma inequivoca o fim do menu original'
menu_match = menu_matches[0]
assert 'data-page="pixelart"' not in html, 'A fonte já contém Pixel Art'
assert html.count('</main>')>=1 and html.count('</body>')==1
menu_original = menu_match.group(0)
pixel_label = f"{chr(0x25A7)} Pixel Art {chr(0x2022)} Personagens / Objetos / Mapas"
pixel_button = f'<button class="tab" data-page="pixelart">{pixel_label}</button>'
menu_new = menu_original.replace('</nav>', pixel_button+'</nav>', 1)
html = html[:menu_match.start()] + menu_new + html[menu_match.end():]
final_menu_pattern = r'<button\b[^>]*data-page="controles"[^>]*>.*?</button>\s*<button\b[^>]*data-page="pixelart"[^>]*>.*?</button>\s*</nav>'
assert len(re.findall(final_menu_pattern, html, re.S)) == 1, 'Navegação de Controles/Pixel Art inválida após build'
assert html.count('data-page="pixelart"') == 1, 'A aba Pixel Art deve aparecer exatamente uma vez no menu'
menu_start = html.rfind('<nav', 0, menu_match.start())
menu_end = html.find('</nav>', menu_match.start()) + 6
assert menu_start >= 0 and menu_end >= 6, 'Menu principal ausente após build'
menu_text = html[menu_start:menu_end]
assert '<title>Apoena Game Creator v4.0 - Editor Integrado</title>' in html, 'Título integrado incorreto'
assert f"{chr(0x25A7)} Pixel Art {chr(0x2022)} Personagens / Objetos / Mapas" in menu_text, 'Rótulo Pixel Art incorreto'
assert 'â–§' not in menu_text and 'â€¢' not in menu_text, 'Texto Pixel Art com mojibake'
html=html.replace('</main>','<section class="page" id="page-pixelart"><div id="gc40PixelRoot"><div class="panel"><h2>Pixel Art</h2><p>Carregando personagens, objetos e mapas...</p></div></div></section>\n</main>',1)
imports='\n<script src="shared/asset-library.js"></script>\n<script src="shared/creator-bridge.js"></script>\n<script src="map-editor/terrain-system.js"></script>\n<script src="map-editor/world-object-system.js"></script>\n<script src="map-editor/modulo-integrado.js"></script>\n<script src="pixel-art/natureza.js"></script>\n<script src="pixel-art/modulo-integrado.js"></script>\n<script src="pixel-art/ponte-creator.js"></script>\n'
html=html.replace('</body>',imports+'</body>',1)
assert '<iframe' not in html, 'Editor integrado não utiliza iframe'
assert 'shared/asset-library.js' in html and 'shared/creator-bridge.js' in html, 'Biblioteca e ponte compartilhadas não foram incluídas'
assert html.count('id="page-pixelart"')==1
for path in ('shared/asset-library.js','shared/creator-bridge.js','map-editor/terrain-system.js','map-editor/world-object-system.js','map-editor/modulo-integrado.js','pixel-art/natureza.js','pixel-art/modulo-integrado.js','pixel-art/ponte-creator.js'):
 assert (root/path).is_file(), f'Módulo integrado não encontrado: {path}'
out.write_text(html,encoding='utf-8')
print('Editor v4.0 integrado e pronto:',out.stat().st_size,hashlib.sha256(out.read_bytes()).hexdigest())
