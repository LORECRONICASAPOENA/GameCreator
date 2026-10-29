'use strict';
const assert = require('node:assert/strict');
const World = require('../../map-editor/world-object-system.js');

const tree = World.normalizeBehavior({
  category: 'plant',
  interaction: 'chop',
  movement: 'static',
  collision: 'blocked',
  ecological: true,
  resource: { itemId: 'madeira', amount: 3, respawnDays: 0 },
  ecology: { enabled: true, waterMin: 0.6, nutrientMin: 0.3, lightMin: 0.4, tempMin: 10, tempMax: 35, growthDays: 20, lifespanDays: 200, shadeRadius: 12, reproduction: 'seed' }
});
assert.equal(tree.schema, 'apoena.world-object.v1');
assert.equal(tree.resource.itemId, 'madeira');
assert.equal(tree.resource.amount, 3);
assert.equal(World.validateBehavior(tree, 'árvore').valid, true);

const mount = World.normalizeBehavior({
  category: 'mount',
  interaction: 'ride',
  movement: 'air',
  collision: 'conditional',
  rideable: true
});
assert.equal(World.validateBehavior(mount).valid, true);

const missingResource = World.validateBehavior({
  category: 'resource',
  interaction: 'collect',
  movement: 'static',
  resource: { itemId: '' }
});
assert.equal(missingResource.valid, true);
assert.ok(missingResource.warnings.some(w => w.includes('sem ID')));

const invalidTemperature = World.validateBehavior({
  category: 'plant',
  ecological: true,
  ecology: { enabled: true, tempMin: 30, tempMax: 10 }
});
assert.equal(invalidTemperature.valid, false);
assert.ok(invalidTemperature.errors.some(e => e.includes('temperatura mínima')));

const assets = World.validateAssets([
  { id: 'tree-1', name: 'Árvore', src: 'data:image/png;base64,AA==', worldBehavior: tree },
  { id: 'tree-1', name: 'Duplicada', src: 'data:image/png;base64,AA==', worldBehavior: tree }
]);
assert.equal(assets.valid, false);
assert.ok(assets.errors.some(e => e.includes('duplicado')));

const legacyAsset = World.normalizeAsset({ id: 'old-tree', name: 'Árvore antiga', src: 'data:image/png;base64,AA==' });
assert.equal(legacyAsset.worldBehavior.schema, 'apoena.world-object.v1');
assert.equal(legacyAsset.worldBehavior.category, 'decoration');
console.log('PASSOU: perfis de objetos, recursos, montarias, ecologia e validação de assets.');
