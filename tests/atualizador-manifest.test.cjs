const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const read = (relative) => fs.readFileSync(path.join(root, relative), "utf8");

const updater = read("integracao/atualizar-creator.ps1");
const integrationPage = read("integracao/index.html");
const integrationCatalog = read("integracao/catalogo.js");
const pixelBridge = read("pixel-art/modulo-integrado.js");
const legacyPage = read("legacy/abrir-editor-v3.9.html");
const packageWorkflow = read(".github/workflows/pixel-art.yml");

function quotedValues(block) {
  return [...block.matchAll(/'([^']+)'/g)].map((match) => match[1]);
}

const patternsStart = updater.indexOf("$runtimePatterns = @(");
assert.notEqual(patternsStart, -1, "Lista positiva runtimePatterns precisa existir.");
const patternsEnd = updater.indexOf("\n)", patternsStart);
assert.notEqual(patternsEnd, -1, "runtimePatterns precisa fechar corretamente.");
const runtimePatterns = quotedValues(updater.slice(patternsStart, patternsEnd));

const essentialsStart = updater.indexOf("$arquivosEssenciais = @(");
assert.notEqual(essentialsStart, -1, "Lista arquivosEssenciais precisa existir.");
const essentialsEnd = updater.indexOf("\n)", essentialsStart);
assert.notEqual(essentialsEnd, -1, "arquivosEssenciais precisa fechar corretamente.");
const essentials = quotedValues(updater.slice(essentialsStart, essentialsEnd));

const runtimeRegexMatch = updater.match(/^\$regexRuntime = '([^']+)'$/m);
assert.ok(runtimeRegexMatch, "regexRuntime precisa existir como contrato de arquivos locais.");
const runtimeRegex = new RegExp(runtimeRegexMatch[1]);

for (const required of [
  "/integracao/index.html",
  "/integracao/catalogo.js",
  "/legacy/abrir-editor-v3.9.html",
  "/legacy/v3_9_parts/*.js",
]) {
  assert.ok(runtimePatterns.includes(required), "Sparse-checkout precisa incluir " + required + ".");
}

for (const required of [
  "integracao/index.html",
  "integracao/catalogo.js",
  "legacy/abrir-editor-v3.9.html",
]) {
  assert.ok(essentials.includes(required), "Validação pós-atualização precisa exigir " + required + ".");
  assert.ok(runtimeRegex.test(required), "regexRuntime precisa reconhecer " + required + ".");
}

for (let i = 0; i <= 22; i += 1) {
  const file = "legacy/v3_9_parts/parte_" + String(i).padStart(3, "0") + ".js";
  assert.ok(runtimeRegex.test(file), "Arquivo legado necessário fora do contrato: " + file);
  assert.ok(
    updater.includes("'legacy/v3_9_parts/parte_{0:D3}.js'"),
    "A lista essencial deve gerar as 23 partes do editor v3.9."
  );
  assert.ok(fs.existsSync(path.join(root, file)), "Parte referenciada ausente no repositório: " + file);
}

const legacyScripts = [...legacyPage.matchAll(/src=["'](v3_9_parts\/parte_\d{3}\.js)["']/g)]
  .map((match) => "legacy/" + match[1]);
assert.equal(legacyScripts.length, 23, "A fábrica v3.9 deve carregar exatamente 23 partes.");
for (const file of legacyScripts) {
  assert.ok(runtimeRegex.test(file), "A fábrica usa arquivo não coberto pelo manifesto: " + file);
}

assert.match(integrationPage, /catalogo\.js/, "A página integrada precisa carregar o catálogo.");
assert.match(integrationPage, /legacy\/abrir-editor-v3\.9\.html/, "A página integrada precisa preservar o link da fábrica original.");
assert.match(pixelBridge, /integracao\/index\.html/, "A interface do Creator precisa manter o link para a página integrada.");
assert.ok(integrationCatalog.length > 0, "O módulo de catálogo integrado precisa existir.");

for (const forbidden of [
  "docs/BASE_CONHECIMENTO_ERROS_RUNNER_CI.md",
  "tests/atualizador-manifest.test.cjs",
  ".github/workflows/pixel-art.yml",
  "legacy/iniciador-anterior.html",
]) {
  assert.equal(runtimeRegex.test(forbidden), false, "Arquivo interno/antigo não pode entrar no runtime: " + forbidden);
}
assert.equal(runtimePatterns.includes("/legacy/"), false, "Não copiar a pasta legacy inteira.");
assert.equal(runtimePatterns.some((value) => value.includes("/docs/") || value.includes("/tests/") || value.includes(".github")), false,
  "Documentos, testes e CI não podem entrar no sparse-checkout.");

assert.match(updater, /\$versaoGit = \[version\]\$versaoMatch\.Groups\[0\]\.Value/,
  "A comparação de versão deve usar a correspondência completa, não apenas o primeiro grupo.");
const sampleGitVersion = "git version 2.56.0.windows.4".match(/(\d+)\.(\d+)\.(\d+)/);
assert.equal(sampleGitVersion[0], "2.56.0", "O parser deve obter a versão sem sufixo de plataforma.");

assert.match(updater, /merge --no-overwrite-ignore --ff-only/,
  "Atualização deve ser fast-forward e proteger arquivos ignorados.");
assert.match(updater, /status --porcelain --untracked-files=no/,
  "Alterações rastreadas locais precisam bloquear a atualização.");
assert.match(updater, /RUNNER/i, "O destino precisa proteger a pasta do Runner.");
assert.doesNotMatch(updater, /reset\s+--hard|git\s+clean\s+-f|Remove-Item[^\r\n]*-Recurse/i,
  "O atualizador não pode apagar alterações/histórico com comandos destrutivos.");

assert.match(packageWorkflow, /\$entry\.Name -eq "legacy"/,
  "O empacotador deve tratar legacy por allowlist, não copiar a pasta inteira.");
assert.match(packageWorkflow, /abrir-editor-v3\.9\.html/,
  "O pacote precisa preservar a página original da fábrica.");
assert.match(packageWorkflow, /expectedLegacyParts/,
  "O pacote precisa validar as 23 partes JS da fábrica.");
assert.match(packageWorkflow, /integracao\/index\.html/);
assert.match(packageWorkflow, /integracao\/catalogo\.js/);
const forbiddenBlock = packageWorkflow.match(/\$forbiddenPaths = @\(([^)]*)\)/);
assert.ok(forbiddenBlock, "O empacotador precisa manter verificação de caminhos proibidos.");
assert.equal(forbiddenBlock[1].includes('"legacy"'), false,
  "A pasta legacy não pode ser proibida por completo, pois contém a fábrica necessária.");
assert.match(forbiddenBlock[1], /legacy\/iniciador-anterior\.html/,
  "O launcher legado antigo deve continuar excluído.");

console.log("PASSOU: manifesto do atualizador preserva integracao/index, catalogo e fábrica original mínima.");
console.log("PASSOU: 23 partes da fábrica v3.9 estão cobertas e presentes.");
console.log("PASSOU: documentação, testes, CI e arquivos antigos continuam fora do runtime.");
console.log("PASSOU: parser Git, fast-forward e proteções contra sobrescrita local.");
