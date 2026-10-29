const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const ApoenaCatalogo = require("../integracao/catalogo.js");
const root = path.join(__dirname, "..");

const project = {
  schema: "apoena.central.v1",
  name: "Projeto de integração",
  items: [
    { id: "madeira", name: "Madeira", iconId: "asset-madeira", data: "data:image/png;base64,QUJD" },
    { id: "tabua", name: "Tábua", data: "data:image/png;base64,REVG" },
    { id: "pocao", name: "Poção", consumable: true, effect: { type: "restaurar_hp_fixo", value: 15, duration: 0 } }
  ],
  recipes: [
    { id: "fazer-tabua", resultId: "tabua", quantity: 2, ingredients: [{ id: "madeira", qty: 2 }], gold: 1, seconds: 0 }
  ],
  assets: [{ id: "asset-madeira", name: "Madeira PNG", file: "madeira.png", category: "objeto", data: "data:image/png;base64,QUJD" }]
};

const detected = ApoenaCatalogo.detect(project);
assert.equal(detected.kind, "projeto completo");
assert.equal(detected.items.length, 3);
assert.deepEqual(ApoenaCatalogo.examine(detected.items, detected.recipes, detected.assets).errors, []);

const portable = ApoenaCatalogo.portable(project, "apoena-game-test");
assert.equal(portable.schema, ApoenaCatalogo.SCHEMA);
assert.equal(portable.game_id, "apoena-game-test");
assert.equal(portable.items[0].data, undefined, "o catálogo de runtime não duplica base64 de imagens");
assert.equal(portable.assets[0].has_embedded_image, true);
assert.match(project.items[0].data, /^data:image\//, "a exportação não altera o projeto original");

const session = ApoenaCatalogo.createSession(portable);
session.gold = 1;
assert.equal(ApoenaCatalogo.collect(portable, session, "madeira", 2), 2);
assert.deepEqual(ApoenaCatalogo.craft(portable, session, "fazer-tabua"), { item_id: "tabua", quantity: 2 });
assert.equal(session.inventory.madeira, 0);
assert.equal(session.inventory.tabua, 2);
assert.equal(session.gold, 0);

const insufficient = ApoenaCatalogo.createSession(portable);
insufficient.gold = 9;
ApoenaCatalogo.collect(portable, insufficient, "madeira", 1);
assert.throws(() => ApoenaCatalogo.craft(portable, insufficient, "fazer-tabua"), /Falta ingrediente/);
assert.equal(insufficient.inventory.madeira, 1, "falha de fabricação não consome ingredientes parcialmente");
assert.equal(insufficient.gold, 9, "falha de fabricação não consome ouro");

const invalidProject = {
  ...project,
  recipes: [{ id: "bad", resultId: "item-inexistente", quantity: 1, ingredients: [{ id: "madeira", qty: 1 }] }]
};
assert.ok(ApoenaCatalogo.examine(invalidProject.items, invalidProject.recipes, invalidProject.assets).errors.length > 0);
assert.throws(() => ApoenaCatalogo.portable(invalidProject, "teste"), /Corrija os vínculos/);
assert.throws(() => ApoenaCatalogo.detect({ schema: "wrong" }), /Formato não reconhecido/);
assert.throws(() => ApoenaCatalogo.portable({ schema: "apoena.items.v1", items: [] }, "teste"), /projeto completo/);

const html = fs.readFileSync(path.join(root, "integracao/index.html"), "utf8");
const inlineScripts = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(match => match[1]);
assert.ok(inlineScripts.length > 0, "interface de integração tem script inline");
for (const script of inlineScripts) assert.doesNotThrow(() => new Function(script), "script da interface de integração é sintaticamente válido");
assert.ok(html.includes("catalogo.js") && html.includes("A=window.ApoenaCatalogo") && html.includes("A.portable(source"), "interface exporta o catálogo validado para jogos");

const gd = fs.readFileSync(path.join(root, "integracao/godot/ApoenaCatalogo.gd"), "utf8");
assert.ok(gd.includes('const SCHEMA: String = "apoena.gamecreator.catalogo.v1"'), "Godot consome o mesmo schema exportado");
for (const fn of ["carregar_catalogo", "obter_item", "coletar", "remover", "iniciar_receita", "_process", "usar_item", "salvar_sessao", "carregar_sessao"]) {
  assert.ok(gd.includes("func " + fn + "("), "método Godot ausente: " + fn);
}
assert.ok(gd.includes("const SESSAO_SCHEMA: String = \"apoena.gamecreator.sessao.v1\""), "sessão Godot possui schema versionado");
const powershellBuild = fs.readFileSync(path.join(root, "integracao/build_unificado.ps1"), "utf8");
const pythonBuild = fs.readFileSync(path.join(root, "integracao/build_unificado.py"), "utf8");
assert.ok(powershellBuild.includes("$menuPattern") && powershellBuild.includes("shared\\creator-bridge.js"), "build PowerShell localiza menu e inclui ponte");
assert.ok(pythonBuild.includes("menu_pattern") && pythonBuild.includes("shared/creator-bridge.js"), "build Python localiza menu e inclui ponte");

console.log("CATALOGO OK: validação, exportação portátil, crafting, integridade e contrato Godot 4");
