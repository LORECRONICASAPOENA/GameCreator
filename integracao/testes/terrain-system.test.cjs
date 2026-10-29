'use strict';
const assert = require('node:assert/strict');
const Terrain = require('../../map-editor/terrain-system.js');

const catalog = Terrain.createDefaultCatalog();
assert.equal(catalog.schema, 'apoena.terrain.catalog.v1');
assert.equal(Terrain.keyForCell(0), 'builtin:0');
assert.equal(Terrain.keyForCell(1005), 'atlas:5');
assert.equal(Terrain.keyForCell(-1), null);

const cells = [
  0, 1, 1,
  1, 0, 1,
  1, 1, 1
];
const mask = Terrain.connectivityMask(cells, 3, 3, 1, 1, value => Terrain.definitionForCell(value, catalog));
// A diagonal-only neighbor cannot connect when either cardinal side is missing.
assert.equal(mask & 2, 0);
assert.equal(mask & 8, 0);
assert.equal(mask & 32, 0);
assert.equal(mask & 128, 0);

catalog.tiles['atlas:0'] = Terrain.normalizeDefinition({
  name: 'Montanha base reta',
  role: 'slope',
  connectGroup: 'mountain',
  collision: 'blocked',
  height: 3,
  tags: ['montanha', 'base-reta'],
  autotile: true,
  variants: { '0': 0, '1': 2, '5': 4 }
});
assert.equal(Terrain.resolveVariant(5, catalog.tiles['atlas:0'].variants, 0), 4);
assert.equal(Terrain.resolveVariant(7, catalog.tiles['atlas:0'].variants, 0), 0);

const good = Terrain.prepareMap({
  schema: 'apoena.map2d.v1',
  width: 16,
  height: 16,
  tiles: Array(256).fill(0),
  heights: Array(256).fill(0),
  objects: [],
  markers: [],
  mapType: 'exploration',
  terrainCatalog: catalog
});
assert.equal(good.formatVersion, 2);
assert.equal(Terrain.validateMap(good).valid, true);

const legacy = Terrain.validateMap({
  schema: 'apoena.map2d.v1',
  width: 16,
  height: 16,
  tiles: Array(256).fill(0),
  heights: Array(256).fill(0),
  objects: [],
  markers: []
});
assert.equal(legacy.valid, true);
assert.ok(legacy.warnings.some(w => w.includes('catálogo')));

const invalid = Terrain.validateMap({
  schema: 'apoena.map2d.v1',
  width: 16,
  height: 16,
  tiles: Array(255).fill(0),
  heights: Array(256).fill(0),
  objects: [],
  markers: [],
  mapType: 'exploration',
  terrainCatalog: catalog
});
assert.equal(invalid.valid, false);
assert.ok(invalid.errors.some(e => e.includes('quantidade de tiles')));

const badCatalog = Terrain.validateCatalog({
  schema: 'apoena.terrain.catalog.v1',
  tiles: { 'atlas:0': { role: 'unknown', collision: 'ghost', height: 99, autotile: true, connectGroup: '' } }
});
assert.equal(badCatalog.valid, false);
console.log('PASSOU: catálogo, identificadores, máscara de vizinhança, variantes e validação de mapas.');
