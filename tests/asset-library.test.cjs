const assert = require("node:assert/strict");
const ApoenaLibrary = require("../shared/asset-library.js");

async function main() {
  const source = new Blob(["original-source"], { type: "image/png" });
  const edited = new Blob(["spritesheet-v1"], { type: "image/png" });
  const first = await ApoenaLibrary.saveAsset({
    name: "Javali caminhada",
    category: "animal",
    type: "spritesheet",
    blob: edited,
    originalBlob: source,
    width: 256,
    height: 128,
    sourceWidth: 512,
    sourceHeight: 256,
    metadata: { schema: "apoena.pixelart.v1", columns: 4, rows: 2 },
    tags: ["pixel-art", "javali"],
    replaceExisting: true
  });
  assert.ok(first.id, "recurso recebe identificador");
  assert.equal(first.width, 256);
  assert.equal(first.originalSize, source.size);

  const found = await ApoenaLibrary.listAssets({ category: "animal", search: "javali" });
  assert.equal(found.length, 1, "consulta filtra por categoria e nome");
  assert.equal(found[0].metadata.columns, 4);

  const second = await ApoenaLibrary.saveAsset({
    name: "Javali caminhada",
    category: "animal",
    type: "spritesheet",
    blob: new Blob(["spritesheet-v2"], { type: "image/png" }),
    width: 512,
    height: 256,
    metadata: { schema: "apoena.pixelart.v1", columns: 8, rows: 4 },
    replaceExisting: true
  });
  assert.equal(second.id, first.id, "salvar o mesmo nome/categoria atualiza sem duplicar");
  assert.equal((await ApoenaLibrary.listAssets()).length, 1);
  assert.equal(second.metadata.columns, 8);
  assert.ok(second.originalBlob, "a versão original é preservada quando uma edição não a substitui");

  const project = await ApoenaLibrary.saveProject({
    id: "mapa-teste",
    name: "Mapa de teste",
    schema: "apoena.map2d.v1",
    type: "map",
    data: { width: 16, height: 16, tiles: [0, 1, 2] }
  });
  const reopened = await ApoenaLibrary.getProject("mapa-teste");
  assert.deepEqual(reopened.data, { width: 16, height: 16, tiles: [0, 1, 2] });
  assert.equal((await ApoenaLibrary.listProjects({ search: "mapa" })).length, 1);

  const deleted = await ApoenaLibrary.deleteAsset(first.id);
  assert.equal(deleted.deleted, true);
  assert.equal((await ApoenaLibrary.listAssets()).length, 0);
  console.log("BIBLIOTECA CENTRAL OK: CRUD, filtros, deduplicação, original e persistência de projeto");
}
main().catch(function(error) { console.error(error); process.exitCode = 1; });