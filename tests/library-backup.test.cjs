const assert = require("node:assert/strict");
require("fake-indexeddb/auto");
const ApoenaLibrary = require("../shared/asset-library.js");
globalThis.ApoenaLibrary = ApoenaLibrary;
require("../shared/library-backup.js");
const Backup = globalThis.ApoenaLibraryBackup;
const fs = require("node:fs");
const path = require("node:path");
const libraryPage = fs.readFileSync(path.join(__dirname, "../biblioteca/index.html"), "utf8");
assert.ok(libraryPage.includes('id="exportBackup"'), "biblioteca oferece exportação de backup");
assert.ok(libraryPage.includes('id="importBackup"'), "biblioteca oferece restauração de backup");
assert.ok(libraryPage.includes('../shared/library-backup.js'), "página carrega o módulo de backup");

async function main() {
  const image = new Blob([Buffer.from([0, 1, 2, 255, 10])], { type: "image/png" });
  await ApoenaLibrary.saveAsset({
    id: "backup-character",
    name: "Apoena teste",
    category: "personagem",
    type: "spritesheet",
    blob: image,
    originalBlob: new Blob(["original"], { type: "image/png" }),
    width: 128,
    height: 192,
    sourceWidth: 256,
    sourceHeight: 384,
    tags: ["apoena", "teste"],
    metadata: { columns: 4, rows: 4 }
  });
  await ApoenaLibrary.saveProject({
    id: "backup-map",
    name: "Mapa teste",
    schema: "apoena.map2d.v1",
    type: "map",
    data: { width: 2, height: 2, tiles: [0, 1, 2, 3] },
    metadata: { tileSize: 32 }
  });

  const snapshot = await Backup.exportSnapshot();
  assert.equal(snapshot.schema, "apoena.gamecreator.library-backup.v1");
  assert.equal(snapshot.assets.length, 1);
  assert.equal(snapshot.projects.length, 1);
  assert.match(snapshot.assets[0].blob, /^data:image\/png;base64,/);
  await ApoenaLibrary.deleteAsset("backup-character");
  await ApoenaLibrary.deleteProject("backup-map");
  assert.equal((await ApoenaLibrary.listAssets()).length, 0);
  assert.equal((await ApoenaLibrary.listProjects()).length, 0);

  const restored = await Backup.importSnapshot(snapshot);
  assert.deepEqual(restored, { assets: 1, projects: 1 });
  const asset = await ApoenaLibrary.getAsset("backup-character");
  assert.equal(asset.blob.size, image.size);
  assert.equal(asset.originalBlob.size, 8);
  assert.equal(asset.metadata.columns, 4);
  const project = await ApoenaLibrary.getProject("backup-map");
  assert.deepEqual(project.data, { width: 2, height: 2, tiles: [0, 1, 2, 3] });

  await assert.rejects(() => Backup.importSnapshot({ schema: "wrong", version: 1, assets: [], projects: [] }), /Backup incompatível/);
  await assert.rejects(() => Backup.importSnapshot({ schema: Backup.schema, version: 1, assets: [{ id: "x", name: "x", blob: "data:text/plain;base64,WA==" }], projects: [] }), /recurso de imagem inválido/);
  console.log("LIBRARY BACKUP OK: exportação, restauração de imagens/originais/metadados/projetos e validação");
}
main().catch(error => { console.error(error); process.exitCode = 1; });
