const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { spawnSync } = require("node:child_process");
const { pathToFileURL } = require("node:url");

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
essentials.push(...Array.from({ length: 24 }, (_, i) => "bundle-v4/parte_" + String(i).padStart(3, "0") + ".js"));
essentials.push(...Array.from({ length: 23 }, (_, i) => "legacy/v3_9_parts/parte_" + String(i).padStart(3, "0") + ".js"));

const runtimeRegexMatch = updater.match(/^\$regexRuntime = '([^']+)'$/m);
assert.ok(runtimeRegexMatch, "regexRuntime precisa existir como contrato de arquivos locais.");
const runtimeRegex = new RegExp(runtimeRegexMatch[1], "i");

const requiredRuntime = [
  "integracao/index.html",
  "integracao/catalogo.js",
  "integracao/godot/ApoenaCatalogo.gd",
  "integracao/godot/project.godot",
  "integracao/godot/dados/apoena_catalogo.json",
  "legacy/abrir-editor-v3.9.html",
  "shared/asset-library.js",
  "shared/creator-bridge.js",
  "shared/library-backup.js",
  "shared/tileset-check.js",
  "biblioteca/index.html",
  "map-editor/index.html",
  "map-editor/terrain-system.js",
  "map-editor/world-object-system.js",
  "map-editor/modulo-integrado.js",
  "pixel-art/index.html",
  "pixel-art/estudio.html",
  "pixel-art/estudio.js",
  "pixel-art/corte-inteligente.js",
  "pixel-art/natureza.js",
  "pixel-art/objetos.js",
  "pixel-art/modulo-integrado.js",
  "pixel-art/ponte-creator.js",
  "pixel-art/catalogo_assets_agar.json"
];

for (const required of requiredRuntime) {
  assert.ok(essentials.includes(required), "Validação pós-atualização precisa exigir " + required + ".");
  assert.ok(runtimeRegex.test(required), "regexRuntime precisa reconhecer " + required + ".");
}

for (const required of [
  "/integracao/index.html",
  "/integracao/catalogo.js",
  "/integracao/godot/ApoenaCatalogo.gd",
  "/integracao/godot/project.godot",
  "/integracao/godot/dados/apoena_catalogo.json",
  "/legacy/abrir-editor-v3.9.html",
  "/legacy/v3_9_parts/*.js",
  "/shared/*.js",
  "/biblioteca/*.html",
  "/map-editor/*.js",
  "/pixel-art/*.js",
  "/pixel-art/*.html",
  "/pixel-art/*.json"
]) {
  assert.ok(runtimePatterns.includes(required), "Sparse-checkout precisa incluir " + required + ".");
}

for (const file of essentials) {
  assert.ok(fs.existsSync(path.join(root, file)), "Arquivo essencial ausente no repositório: " + file);
  assert.ok(runtimeRegex.test(file), "Arquivo essencial não está protegido pela regex de runtime: " + file);
}

assert.ok(runtimeRegex.test("legacy/v3_9_parts/extra-future.js"),
  "A proteção precisa cobrir qualquer JS incluído pelo padrão legacy/v3_9_parts/*.js.");

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
  "README.md"
]) {
  assert.equal(runtimeRegex.test(forbidden), false, "Arquivo interno/antigo não pode entrar no runtime: " + forbidden);
}
assert.equal(runtimePatterns.includes("/legacy/"), false, "Não copiar a pasta legacy inteira.");
assert.equal(runtimePatterns.some((value) => value.includes("/docs/") || value.includes("/tests/") || value.includes(".github")), false,
  "Documentos, testes e CI não podem entrar no sparse-checkout.");

assert.match(updater, /\$versaoGit = \[version\]\$versaoMatch\.Groups\[0\]\.Value/,
  "A comparação de versão deve usar a correspondência completa.");
assert.match(updater, /\[version\]'2\.41\.0'/,
  "O atualizador usa check-rules e precisa exigir Git 2.41 ou superior.");
assert.match(updater, /sparse-checkout check-rules --no-cone/,
  "O atualizador deve conferir o manifesto antes de aplicar um merge.");
assert.match(updater, /function VerificarConflitosLocais/,
  "O atualizador precisa proteger arquivos locais antes de materializar o sparse-checkout.");
assert.match(updater, /ls-files --others --exclude-standard/,
  "A proteção precisa detectar arquivos locais não ignorados.");
assert.match(updater, /ls-files --others --ignored --exclude-standard/,
  "A proteção precisa detectar arquivos locais ignorados.");
assert.match(updater, /read-tree -mu HEAD/,
  "Clone iniciado com --no-checkout precisa materializar o runtime após validar conflitos.");
const initialGuardPosition = updater.indexOf("VerificarConflitosLocais 'HEAD'");
const materializePosition = updater.indexOf("read-tree -mu HEAD");
const remoteGuardPosition = updater.indexOf("VerificarConflitosLocais 'refs/remotes/origin/main'");
const mergePosition = updater.indexOf("merge --no-overwrite-ignore --ff-only");
assert.ok(initialGuardPosition >= 0 && initialGuardPosition < materializePosition,
  "Conflitos locais precisam ser verificados antes de materializar o checkout inicial.");
assert.ok(remoteGuardPosition >= 0 && remoteGuardPosition < mergePosition,
  "Conflitos locais precisam ser verificados contra a árvore remota antes do merge.");
const noOpBranch = updater.match(/if \(\$remoto -eq \$anterior\) \{([\s\S]*?)\} else \{/);
assert.ok(noOpBranch, "O fluxo de atualização sem mudanças precisa existir.");
assert.doesNotMatch(noOpBranch[1], /update-ref/,
  "Execução sem mudanças não pode substituir a referência da versão anterior.");
assert.match(updater, /merge --no-overwrite-ignore --ff-only/,
  "Atualização deve ser fast-forward e proteger arquivos ignorados.");
assert.match(updater, /status --porcelain --untracked-files=no/,
  "Alterações rastreadas locais precisam bloquear a atualização.");
assert.match(updater, /refs\/apoena\/anterior/,
  "A referência da versão anterior precisa ser preservada.");
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
  "A pasta legacy não pode ser proibida por completo.");
assert.match(forbiddenBlock[1], /legacy\/iniciador-anterior\.html/,
  "O launcher legado antigo deve continuar excluído.");

function git(cwd, args, allowFailure = false) {
  const result = spawnSync("git", args, { cwd, encoding: "utf8", windowsHide: true });
  if (result.error) throw result.error;
  if (!allowFailure && result.status !== 0) {
    throw new Error("git " + args.join(" ") + " falhou (" + result.status + "): " + result.stderr + result.stdout);
  }
  return result;
}

function writeFile(base, relative, content) {
  const target = path.join(base, relative);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, content);
}

function commitAll(repoPath, message) {
  git(repoPath, ["add", "-A"]);
  git(repoPath, ["commit", "-m", message]);
}

function testSparseCheckoutAndUpdate() {
  const temp = fs.mkdtempSync(path.join(os.tmpdir(), "apoena-gc-update-"));
  try {
    const origin = path.join(temp, "origin.git");
    const source = path.join(temp, "source");
    const install = path.join(temp, "APP");
    fs.mkdirSync(origin, { recursive: true });
    fs.mkdirSync(source, { recursive: true });
    git(origin, ["init", "--bare"]);
    git(origin, ["config", "uploadpack.allowFilter", "true"]);
    git(source, ["init"]);
    git(source, ["config", "user.name", "Apoena updater test"]);
    git(source, ["config", "user.email", "apoena-updater-test@example.invalid"]);
    git(source, ["branch", "-M", "main"]);

    const fixtureFiles = [
      "ABRIR_GAME_CREATOR.cmd",
      "ATUALIZAR_CREATOR.cmd",
      "APOENA_GAME_CREATOR_V4_0_BANCADA_INTEGRADA.html",
      "index.html",
      "integracao/build_unificado.ps1",
      "integracao/atualizar-creator.ps1",
      "integracao/index.html",
      "integracao/catalogo.js",
      "integracao/godot/ApoenaCatalogo.gd",
      "integracao/godot/project.godot",
      "integracao/godot/dados/apoena_catalogo.json",
      "legacy/abrir-editor-v3.9.html",
      "shared/asset-library.js",
      "shared/creator-bridge.js",
      "shared/library-backup.js",
      "shared/tileset-check.js",
      "biblioteca/index.html",
      "map-editor/index.html",
      "map-editor/terrain-system.js",
      "map-editor/world-object-system.js",
      "map-editor/modulo-integrado.js",
      "pixel-art/index.html",
      "pixel-art/estudio.html",
      "pixel-art/estudio.js",
      "pixel-art/corte-inteligente.js",
      "pixel-art/natureza.js",
      "pixel-art/objetos.js",
      "pixel-art/modulo-integrado.js",
      "pixel-art/ponte-creator.js",
      "pixel-art/catalogo_assets_agar.json",
      "docs/segredo-interno.md",
      "tests/teste-interno.cjs",
      ".github/workflows/validar.yml",
      "legacy/iniciador-anterior.html",
      "integracao/README.md",
      "integracao/testes/catalogo.test.js",
      "map-editor/README.md",
      "pixel-art/README.md",
      "pixel-art/NATUREZA_CONTRATO.md",
      "README.md"
    ];
    for (const relative of fixtureFiles) writeFile(source, relative, "fixture:" + relative);
    for (let i = 0; i < 24; i += 1) {
      writeFile(source, "bundle-v4/parte_" + String(i).padStart(3, "0") + ".js", "bundle:" + i);
    }
    for (let i = 0; i < 23; i += 1) {
      writeFile(source, "legacy/v3_9_parts/parte_" + String(i).padStart(3, "0") + ".js", "legacy:" + i);
    }
    writeFile(source, "legacy/v3_9_parts/extra-future.js", "future extra included by wildcard");

    git(source, ["remote", "add", "origin", pathToFileURL(origin).href]);
    commitAll(source, "fixture initial");
    git(source, ["push", "-u", "origin", "main"]);

    git(temp, [
      "clone", "--filter=blob:none", "--depth", "1", "--single-branch",
      "--branch", "main", "--no-checkout", pathToFileURL(origin).href, install
    ]);
    git(install, ["sparse-checkout", "set", "--no-cone", ...runtimePatterns]);

    const checkRules = spawnSync("git", ["sparse-checkout", "check-rules", "--no-cone"], {
      cwd: install, input: essentials.join("\n") + "\n", encoding: "utf8", windowsHide: true
    });
    assert.equal(checkRules.status, 0, "Git precisa validar as regras do sparse-checkout.");
    const includedEssentials = new Set(checkRules.stdout.split(/\r?\n/).filter(Boolean));
    for (const essential of essentials) {
      assert.ok(includedEssentials.has(essential), "Sparse-checkout não cobre arquivo essencial: " + essential);
    }

    // --no-checkout exige uma materialização explícita depois da lista positiva.
    git(install, ["read-tree", "-mu", "HEAD"]);

    const filter = git(install, ["config", "--get", "remote.origin.partialclonefilter"]).stdout.trim();
    assert.equal(filter, "blob:none", "Clone precisa manter filtro parcial de blobs.");

    for (const essential of essentials) {
      assert.ok(fs.existsSync(path.join(install, essential)),
        "Sparse-checkout não materializou arquivo essencial: " + essential);
    }
    assert.ok(fs.existsSync(path.join(install, "legacy/v3_9_parts/extra-future.js")),
      "Wildcard da fábrica precisa incluir JS adicionais do diretório legado.");
    for (const excluded of [
      "docs/segredo-interno.md",
      "tests/teste-interno.cjs",
      ".github/workflows/validar.yml",
      "legacy/iniciador-anterior.html",
      "integracao/README.md",
      "integracao/testes/catalogo.test.js",
      "map-editor/README.md",
      "pixel-art/README.md",
      "pixel-art/NATUREZA_CONTRATO.md",
      "README.md"
    ]) {
      assert.equal(fs.existsSync(path.join(install, excluded)), false,
        "Arquivo interno/documental não pode ser materializado: " + excluded);
    }

    const beforeUpdate = git(install, ["rev-parse", "HEAD"]).stdout.trim();
    writeFile(source, "index.html", "runtime atualizado");
    commitAll(source, "fixture runtime update");
    git(source, ["push", "origin", "main"]);
    git(install, [
      "fetch", "--no-tags", "--filter=blob:none", "origin",
      "+refs/heads/main:refs/remotes/origin/main"
    ]);
    git(install, ["merge-base", "--is-ancestor", "HEAD", "refs/remotes/origin/main"]);
    git(install, ["update-ref", "refs/apoena/anterior", beforeUpdate]);
    git(install, ["merge", "--no-overwrite-ignore", "--ff-only", "refs/remotes/origin/main"]);
    assert.equal(fs.readFileSync(path.join(install, "index.html"), "utf8"), "runtime atualizado",
      "Fast-forward precisa atualizar arquivo de runtime.");
    const savedPrevious = git(install, ["rev-parse", "refs/apoena/anterior"]).stdout.trim();
    assert.equal(savedPrevious, beforeUpdate, "Referência anterior precisa apontar para o commit anterior.");

    const installedAfterUpdate = git(install, ["rev-parse", "HEAD"]).stdout.trim();
    const remoteAfterUpdate = git(install, ["rev-parse", "refs/remotes/origin/main"]).stdout.trim();
    assert.equal(installedAfterUpdate, remoteAfterUpdate, "Instalação precisa ficar igual ao main remoto após fast-forward.");
    const noOpReferenceBefore = git(install, ["rev-parse", "refs/apoena/anterior"]).stdout.trim();
    if (installedAfterUpdate === remoteAfterUpdate) {
      assert.equal(git(install, ["rev-parse", "refs/apoena/anterior"]).stdout.trim(), noOpReferenceBefore,
        "Execução sem mudanças não pode substituir a referência da versão anterior.");
    }

    const ignoredRelative = "pixel-art/override-ignored.js";
    const untrackedRelative = "pixel-art/override-untracked.js";
    const exclude = path.join(install, ".git", "info", "exclude");
    fs.appendFileSync(exclude, "\n" + ignoredRelative + "\n");
    writeFile(install, ignoredRelative, "conteudo pessoal ignorado");
    writeFile(install, untrackedRelative, "conteudo pessoal nao ignorado");
    writeFile(source, ignoredRelative, "conteudo remoto ignorado");
    writeFile(source, untrackedRelative, "conteudo remoto nao ignorado");
    commitAll(source, "fixture introduces conflicting runtime paths");
    git(source, ["push", "origin", "main"]);
    git(install, [
      "fetch", "--no-tags", "--filter=blob:none", "origin",
      "+refs/heads/main:refs/remotes/origin/main"
    ]);

    const ignored = git(install, ["ls-files", "--others", "--ignored", "--exclude-standard"])
      .stdout.split(/\r?\n/).filter(Boolean);
    const untracked = git(install, ["ls-files", "--others", "--exclude-standard"])
      .stdout.split(/\r?\n/).filter(Boolean);
    const localFiles = new Set([...ignored, ...untracked]);
    const remoteFiles = git(install, ["ls-tree", "-r", "--name-only", "refs/remotes/origin/main"])
      .stdout.split(/\r?\n/).filter(Boolean);
    const remoteRuntime = new Set(remoteFiles.filter((file) => runtimeRegex.test(file)));
    const conflicts = [...localFiles].filter((file) => remoteRuntime.has(file));
    assert.ok(conflicts.includes(ignoredRelative),
      "Verificação precisa identificar arquivo ignorado do usuário que conflita com runtime novo.");
    assert.ok(conflicts.includes(untrackedRelative),
      "Verificação precisa identificar arquivo não ignorado do usuário que conflita com runtime novo.");

    // O guard do atualizador deve abortar ANTES do merge. Em sparse-checkout,
    // não confiar apenas em --no-overwrite-ignore: a proteção comprovada é a
    // interseção entre arquivos locais (ignored + untracked) e o runtime remoto.
    assert.match(updater, /VerificarConflitosLocais 'refs\/remotes\/origin\/main'/,
      "O atualizador precisa executar a checagem local contra a árvore remota antes do merge.");
    assert.equal(fs.readFileSync(path.join(install, ignoredRelative), "utf8"), "conteudo pessoal ignorado",
      "Conteúdo pessoal ignorado precisa permanecer intacto após o bloqueio.");
    assert.equal(fs.readFileSync(path.join(install, untrackedRelative), "utf8"), "conteudo pessoal nao ignorado",
      "Conteúdo pessoal não ignorado precisa permanecer intacto após o bloqueio.");
    assert.equal(git(install, ["rev-parse", "HEAD"]).stdout.trim(), installedAfterUpdate,
      "A checagem de conflito precisa bloquear a atualização sem avançar a versão instalada.");
  } finally {
    fs.rmSync(temp, { recursive: true, force: true });
  }
}

testSparseCheckoutAndUpdate();

console.log("PASSOU: manifesto inclui todos os módulos essenciais, Godot, biblioteca e fábrica original.");
console.log("PASSOU: sparse-checkout real mantém somente runtime e exclui docs, testes, CI e legado antigo.");
console.log("PASSOU: clone parcial, fetch explícito, fast-forward e referência anterior foram simulados em repositório local.");
console.log("PASSOU: arquivo ignorado conflitante bloqueia merge sem sobrescrever dados pessoais.");