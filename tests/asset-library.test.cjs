const assert = require("node:assert/strict");
require("fake-indexeddb/auto");
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
  assert.equal(second.sourceWidth, 512, "a dimensão original da imagem é preservada em edições sem dimensões de origem");
  assert.equal(second.sourceHeight, 256, "a altura original é preservada em edições sem dimensões de origem");

  const project = await ApoenaLibrary.saveProject({
    id: "mapa-teste",
    name: "Mapa de teste",
    schema: "apoena.map2d.v1",
    type: "map",
    data: { width: 16, height: 16, tiles: [0, 1, 2] }
  });
  // Recarrega o módulo para provar que os registros não dependem do cache em memória da API.
  const modulePath = require.resolve("../shared/asset-library.js");
  delete require.cache[modulePath];
  const ReopenedLibrary = require(modulePath);
  const reopened = await ReopenedLibrary.getProject("mapa-teste");
  assert.deepEqual(reopened.data, { width: 16, height: 16, tiles: [0, 1, 2] });
  assert.equal((await ReopenedLibrary.listProjects({ search: "mapa" })).length, 1);
  const persistedAsset = await ReopenedLibrary.getAsset(first.id);
  assert.equal(persistedAsset.blob.size, edited.size, "imagem salva sobrevive à reabertura da API");
  assert.equal(persistedAsset.originalBlob.size, source.size, "imagem original também sobrevive à reabertura");

  const deleted = await ReopenedLibrary.deleteAsset(first.id);
  assert.equal(deleted.deleted, true);
  assert.equal((await ReopenedLibrary.listAssets()).length, 0);
  await ReopenedLibrary.deleteProject("mapa-teste");
  assert.equal((await ReopenedLibrary.listProjects({ search: "mapa" })).length, 0);
  console.log("BIBLIOTECA CENTRAL OK: IndexedDB, CRUD, filtros, deduplicação, originais e reabertura de projetos");
}
main().catch(function(error) { console.error(error); process.exitCode = 1; });