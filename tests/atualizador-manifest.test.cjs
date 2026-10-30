const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { spawnSync } = require("node:child_process");
const { pathToFileURL } = require("node:url");

const root = path.resolve(__dirname, "..");
const read = (relative) => fs.readFileSync(path.join(root, relative), "utf8").replace(/\r\n/g, "\n");
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

assert.match(updater, /\$runtimeRegexParts = @\(/,
  "A regex de runtime deve ser gerada a partir do manifesto positivo.");
assert.match(updater, /\[regex\]::Escape\(\$_\.TrimStart\('\//,
  "A conversão do manifesto para regex precisa escapar os caminhos antes de aplicar curingas.");
function globToRegex(pattern) {
  return pattern
    .replace(/[.+^$()|[\]\\]/g, "\\const runtimeRegexMatch = updater.match(/^\$regexRuntime = '([^']+)'$/m);
assert.ok(runtimeRegexMatch, "regexRuntime precisa existir como contrato de arquivos locais.");
const runtimeRegex = new RegExp(runtimeRegexMatch[1], "i");")
    .replace(/\*/g, "[^/]*")
    .replace(/\?/g, "[^/]");
}
const runtimeRegex = new RegExp(
  "^(?:" + runtimePatterns.map((pattern) => globToRegex(pattern.replace(/^\//, ""))).join("|") + ")$",
  "i"
);

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
assert.match(updater, /APOENA_UPDATER_TEST_MODE -eq '1'/,
  "O repositório local de teste só pode ser aceito no modo de teste explícito.");
assert.match(updater, /ls-files\)/,
  "A retomada precisa inspecionar o índice do clone antes de tratar o status como edição local.");
assert.match(updater, /Substring\(0, 2\) -ne ' D'/,
  "A retomada de checkout parcial deve distinguir arquivos ausentes de modificações locais.");
assert.match(updater, /origem\.Trim\(\) -ceq \$RepoUrl\.Trim\(\)/,
  "A exceção de teste precisa validar que o remote corresponde exatamente à URL temporária.");
assert.match(updater, /sparse-checkout check-rules --no-cone/,
  "O atualizador deve conferir o manifesto antes de aplicar um merge.");
assert.match(updater, /function VerificarConflitosLocais/,
  "O atualizador precisa proteger arquivos locais antes de materializar o sparse-checkout.");
assert.match(updater, /function VerificarArquivosLocaisForaDoRuntime/,
  "O atualizador precisa preservar arquivos ignorados fora da allowlist antes do sparse-checkout.");
const ignoredOutsideGuardPosition = updater.indexOf("\n    VerificarArquivosLocaisForaDoRuntime\n");
const sparseSetPosition = updater.indexOf("\n    & $git.Source -C $Destino sparse-checkout set --no-cone");
assert.ok(ignoredOutsideGuardPosition >= 0 && ignoredOutsideGuardPosition < sparseSetPosition,
  "Arquivos locais fora do runtime precisam ser verificados antes de alterar o sparse-checkout.");
assert.match(updater, /ls-files --others --exclude-standard/,
  "A proteção precisa detectar arquivos locais não ignorados.");
assert.match(updater, /ls-files --others --ignored --exclude-standard/,
  "A proteção precisa detectar arquivos locais ignorados.");
assert.match(updater, /core\.quotePath=false/,
  "A leitura de caminhos Git precisa preservar nomes Unicode sem escape octal.");
assert.ok(runtimeRegex.test("pixel-art/árvore.js"),
  "A allowlist precisa reconhecer arquivos com acentos em caminhos de runtime.");
for (const outsidePath of [
  "biblioteca/backup.json",
  "map-editor/backup.json",
  "map-editor/sub/terrain.js",
  "pixel-art/sub/natureza.js",
  "shared/sub/helper.js",
  "bundle-v4/sub/parte.js"
]) {
  assert.equal(runtimeRegex.test(outsidePath), false,
    "Caminho fora dos padrões exatos do sparse-checkout não pode ser classificado como runtime: " + outsidePath);
}
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

function runUpdater(install, configDir, repoUrl, allowFailure = false) {
  const result = spawnSync("powershell.exe", [
    "-NoProfile",
    "-ExecutionPolicy", "Bypass",
    "-File", path.join(root, "integracao", "atualizar-creator.ps1"),
    "-Destino", install,
    "-RepoUrl", repoUrl,
    "-ConfigDir", configDir
  ], {
    cwd: root,
    encoding: "utf8",
    windowsHide: true,
    timeout: 120000,
    maxBuffer: 5 * 1024 * 1024,
    env: { ...process.env, APOENA_UPDATER_TEST_MODE: "1" }
  });
  if (result.error) throw result.error;
  if (!allowFailure && result.status !== 0) {
    throw new Error("Atualizador PowerShell falhou (" + result.status + "): " + result.stdout + result.stderr);
  }
  return result;
}

function testSparseCheckoutAndUpdate() {
  const temp = fs.mkdtempSync(path.join(os.tmpdir(), "apoena-gc-update-"));
  try {
    const origin = path.join(temp, "origin.git");
    const source = path.join(temp, "source");
    const install = path.join(temp, "APP");
    const configDir = path.join(temp, "config");
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
    git(origin, ["symbolic-ref", "HEAD", "refs/heads/main"]);
    const repoUrl = pathToFileURL(origin).href;

    // Executa o atualizador PowerShell real contra o repositório temporário.
    const firstRun = runUpdater(install, configDir, repoUrl);
    assert.equal(firstRun.status, 0, "Primeira instalação PowerShell precisa terminar com sucesso.");
    assert.equal(fs.existsSync(path.join(configDir, "clone-pendente.txt")), false,
      "A primeira instalação concluída deve remover o marcador de retomada.");
    assert.ok(firstRun.stdout.includes("Concluido") || firstRun.stdout.includes("Concluído"),
      "O atualizador precisa registrar conclusão da primeira instalação.");

    const filter = git(install, ["config", "--get", "remote.origin.partialclonefilter"]).stdout.trim();
    assert.equal(filter, "blob:none", "Clone precisa manter filtro parcial de blobs.");
    for (const essential of essentials) {
      assert.ok(fs.existsSync(path.join(install, essential)),
        "Atualizador PowerShell não materializou arquivo essencial: " + essential);
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

    const savedPath = fs.readFileSync(path.join(configDir, "instalacao.txt"), "utf8").replace(/^\uFEFF/, "").trim();
    assert.equal(path.resolve(savedPath), path.resolve(install),
      "O atualizador precisa salvar o destino permanente escolhido.");

    // Simula interrupcao apos clone --no-checkout e antes de read-tree.
    const resumeInstall = path.join(temp, "APP-RESUME");
    const resumeConfig = path.join(temp, "config-resume");
    fs.mkdirSync(resumeConfig, { recursive: true });
    git(temp, [
      "clone", "--filter=blob:none", "--depth", "1", "--single-branch",
      "--branch", "main", "--no-checkout", repoUrl, resumeInstall
    ]);
    const incompleteIndex = git(resumeInstall, ["ls-files"])
      .stdout.split(/\r?\n/).filter(Boolean);
    const incompleteStatus = git(resumeInstall, ["status", "--porcelain", "--untracked-files=no"])
      .stdout.split(/\r?\n/).filter(Boolean);
    assert.equal(incompleteIndex.length, 0,
      "Clone --no-checkout deve manter o índice sem arquivos materializados.");
    assert.ok(incompleteStatus.length > 0, "Clone --no-checkout deve revelar arquivos ainda não materializados.");
    assert.ok(incompleteStatus.every((line) => line.slice(0, 2) === "D "),
      "Clone --no-checkout deve aparecer como remoções no índice, não como modificações de worktree.");
    fs.writeFileSync(path.join(resumeConfig, "clone-pendente.txt"), resumeInstall, "utf8");
    const resumeRun = runUpdater(resumeInstall, resumeConfig, repoUrl);
    assert.equal(resumeRun.status, 0, "O atualizador deve retomar um clone interrompido antes do checkout.");
    assert.equal(fs.existsSync(path.join(resumeConfig, "clone-pendente.txt")), false,
      "Retomada concluída deve remover o marcador.");
    for (const essential of essentials) {
      assert.ok(fs.existsSync(path.join(resumeInstall, essential)),
        "Retomada precisa materializar arquivo essencial: " + essential);
    }
    assert.equal(fs.existsSync(path.join(resumeInstall, "docs/segredo-interno.md")), false,
      "Retomada não pode materializar documentação interna.");

    const initialHead = git(install, ["rev-parse", "HEAD"]).stdout.trim();
    const noPreviousRef = git(install, ["show-ref", "--verify", "--quiet", "refs/apoena/anterior"], true);
    assert.equal(noPreviousRef.status, 1, "Primeira instalação não deve inventar uma versão anterior.");

    // Arquivos locais fora da allowlist bloqueiam o updater sem serem apagados.
    const personalDoc = "docs/personal-notes.md";
    const extraLocal = "cache/local-data.json";
    const extraLibraryJson = "biblioteca/backup.json";
    const extraMapJson = "map-editor/backup.json";
    const excludeFile = path.join(install, ".git", "info", "exclude");
    fs.appendFileSync(excludeFile, "\n" + personalDoc + "\n");
    writeFile(install, personalDoc, "anotacao pessoal");
    writeFile(install, extraLocal, "dado local nao ignorado");
    writeFile(install, extraLibraryJson, "backup local de biblioteca");
    writeFile(install, extraMapJson, "backup local de mapa");
    const outsideRun = runUpdater(install, configDir, repoUrl, true);
    assert.notEqual(outsideRun.status, 0, "Arquivos locais fora do runtime precisam bloquear o atualizador.");
    assert.equal(git(install, ["rev-parse", "HEAD"]).stdout.trim(), initialHead,
      "Bloqueio de arquivos fora do runtime não pode avançar HEAD.");
    assert.equal(fs.readFileSync(path.join(install, personalDoc), "utf8"), "anotacao pessoal",
      "Documento pessoal ignorado precisa permanecer intacto.");
    assert.equal(fs.readFileSync(path.join(install, extraLocal), "utf8"), "dado local nao ignorado",
      "Dado local não ignorado precisa permanecer intacto.");
    assert.equal(fs.readFileSync(path.join(install, extraLibraryJson), "utf8"), "backup local de biblioteca",
      "JSON local fora do manifesto da biblioteca precisa permanecer intacto e bloquear a atualização.");
    assert.equal(fs.readFileSync(path.join(install, extraMapJson), "utf8"), "backup local de mapa",
      "JSON local fora do manifesto do editor de mapas precisa permanecer intacto e bloquear a atualização.");
    fs.rmSync(path.join(install, personalDoc), { force: true });
    fs.rmSync(path.join(install, extraLocal), { force: true });
    fs.rmSync(path.join(install, extraLibraryJson), { force: true });
    fs.rmSync(path.join(install, extraMapJson), { force: true });
    fs.writeFileSync(excludeFile, fs.readFileSync(excludeFile, "utf8").replace(personalDoc + "\n", ""));

    // Atualização real: o updater deve avançar por fast-forward e guardar o SHA anterior.
    writeFile(source, "index.html", "runtime atualizado");
    commitAll(source, "fixture runtime update");
    git(source, ["push", "origin", "main"]);
    const beforeUpdate = git(install, ["rev-parse", "HEAD"]).stdout.trim();
    const updateRun = runUpdater(install, configDir, repoUrl);
    assert.equal(updateRun.status, 0, "Atualização PowerShell fast-forward precisa terminar com sucesso.");
    assert.equal(fs.readFileSync(path.join(install, "index.html"), "utf8"), "runtime atualizado",
      "Atualização precisa substituir o arquivo de runtime pela nova versão.");
    const installedAfterUpdate = git(install, ["rev-parse", "HEAD"]).stdout.trim();
    const remoteAfterUpdate = git(install, ["rev-parse", "refs/remotes/origin/main"]).stdout.trim();
    assert.equal(installedAfterUpdate, remoteAfterUpdate, "Instalação precisa ficar igual ao main remoto após fast-forward.");
    assert.equal(git(install, ["rev-parse", "refs/apoena/anterior"]).stdout.trim(), beforeUpdate,
      "Referência anterior precisa apontar para o commit anterior.");

    // No-op: a referência anterior não pode ser substituída.
    const previousRefBeforeNoOp = git(install, ["rev-parse", "refs/apoena/anterior"]).stdout.trim();
    const noOpRun = runUpdater(install, configDir, repoUrl);
    assert.equal(noOpRun.status, 0, "Atualização sem mudanças precisa terminar com sucesso.");
    assert.equal(git(install, ["rev-parse", "HEAD"]).stdout.trim(), installedAfterUpdate,
      "Execução sem mudanças não pode alterar HEAD.");
    assert.equal(git(install, ["rev-parse", "refs/apoena/anterior"]).stdout.trim(), previousRefBeforeNoOp,
      "Execução sem mudanças não pode substituir a referência da versão anterior.");

    // Colisão dentro do runtime: o updater real deve bloquear antes do merge.
    const ignoredRelative = "pixel-art/override-ignored.js";
    const untrackedRelative = "pixel-art/override-untracked.js";
    const unicodeRelative = "pixel-art/árvore.js";
    fs.appendFileSync(excludeFile, "\n" + ignoredRelative + "\n");
    writeFile(install, ignoredRelative, "conteudo pessoal ignorado");
    writeFile(install, untrackedRelative, "conteudo pessoal nao ignorado");
    writeFile(install, unicodeRelative, "conteudo pessoal unicode");
    writeFile(source, ignoredRelative, "conteudo remoto ignorado");
    writeFile(source, untrackedRelative, "conteudo remoto nao ignorado");
    writeFile(source, unicodeRelative, "conteudo remoto unicode");
    commitAll(source, "fixture introduces conflicting runtime paths");
    git(source, ["push", "origin", "main"]);
    const beforeConflict = git(install, ["rev-parse", "HEAD"]).stdout.trim();
    const previousRefBeforeConflict = git(install, ["rev-parse", "refs/apoena/anterior"]).stdout.trim();
    const conflictRun = runUpdater(install, configDir, repoUrl, true);
    assert.notEqual(conflictRun.status, 0, "Colisão local/remota dentro do runtime precisa bloquear o atualizador real.");
    assert.match(conflictRun.stdout + conflictRun.stderr, /conflitam com arquivos do Creator/i,
      "O atualizador precisa informar a colisão de arquivos locais.");
    assert.equal(git(install, ["rev-parse", "HEAD"]).stdout.trim(), beforeConflict,
      "Bloqueio de colisão não pode avançar HEAD.");
    assert.equal(git(install, ["rev-parse", "refs/apoena/anterior"]).stdout.trim(), previousRefBeforeConflict,
      "Bloqueio de colisão não pode alterar a referência anterior.");
    assert.equal(fs.readFileSync(path.join(install, ignoredRelative), "utf8"), "conteudo pessoal ignorado",
      "Arquivo ignorado pessoal precisa permanecer intacto.");
    assert.equal(fs.readFileSync(path.join(install, untrackedRelative), "utf8"), "conteudo pessoal nao ignorado",
      "Arquivo não ignorado pessoal precisa permanecer intacto.");
    assert.equal(fs.readFileSync(path.join(install, unicodeRelative), "utf8"), "conteudo pessoal unicode",
      "Arquivo com nome Unicode precisa ser reconhecido como colisão e permanecer intacto.");
  } finally {
    fs.rmSync(temp, { recursive: true, force: true });
  }
}


testSparseCheckoutAndUpdate();

console.log("PASSOU: manifesto positivo e arquivos essenciais do Creator, Godot, biblioteca e Pixel Art.");
console.log("PASSOU: o atualizador PowerShell real fez a primeira instalação enxuta e excluiu documentos/testes/CI.");
console.log("PASSOU: arquivos locais fora da allowlist bloquearam a atualização sem serem alterados.");
console.log("PASSOU: atualização fast-forward, referência anterior e execução sem mudanças.");
console.log("PASSOU: colisões locais ignoradas, não ignoradas e com acentos bloquearam o merge sem alterar dados.");