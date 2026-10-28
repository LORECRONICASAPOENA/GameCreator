const assert = require("node:assert/strict");
const TilesetCheck = require("../shared/tileset-check.js");

function imageData(width, height, alpha = 255) {
  const data = new Uint8ClampedArray(width * height * 4);
  for (let i = 0; i < width * height; i++) {
    data[i * 4] = 90;
    data[i * 4 + 1] = 140;
    data[i * 4 + 2] = 70;
    data[i * 4 + 3] = alpha;
  }
  return { width, height, data };
}

const solid = imageData(4, 4);
const good = TilesetCheck.analyze(solid, 2, 2);
assert.equal(good.ok, true, "opaque, evenly divided tileset has no edge gaps");
assert.equal(good.cellWidth, 2);
assert.equal(good.cellHeight, 2);
assert.equal(good.tiles.length, 0);

const withGap = imageData(4, 2);
withGap.data[(0 * 4 + 2) * 4 + 3] = 0;
const before = new Uint8ClampedArray(withGap.data);
const bad = TilesetCheck.analyze(withGap, 2, 1);
assert.equal(bad.ok, false, "transparent tile border is flagged");
assert.equal(bad.tiles.length, 1);
assert.equal(bad.tiles[0].tile, 2);
assert.ok(bad.tiles[0].edges.includes("top"));
assert.ok(bad.tiles[0].edges.includes("left"));
assert.deepEqual(withGap.data, before, "checker does not alter source pixels");

const uneven = TilesetCheck.analyze(imageData(5, 4), 2, 2);
assert.equal(uneven.divisible, false, "non-divisible dimensions are reported");
assert.ok(uneven.warnings.some(w => w.includes("não são divisíveis")));

assert.throws(
  () => TilesetCheck.analyze(imageData(5, 4), 2, 2, { maxPixels: 10 }),
  /grande demais/
);

console.log("TILESET CHECK OK: grade, bordas transparentes, dimensões e preservação da imagem");
